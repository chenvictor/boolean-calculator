const Display = new function() {
  var predicateCount = 2;
  this.addPredicate = function() {
    var prev = document.getElementById('fading');
    prev.classList.remove('fading');
    prev.removeAttribute('id');
    var prevInput = prev.getElementsByTagName('input')[0];
    prevInput.removeAttribute('tabindex');
    prevInput.removeAttribute('onclick');
    prevInput.setAttribute('oninput', "validate(this, " + predicateCount + ")");
    document.getElementById('predicates').appendChild(newPredicateFade());
  };
  var newPredicateFade = function() {
    var newPred = document.createElement('div');
    newPred.setAttribute('class', "input-group mb-3 fading");
    newPred.setAttribute('id', "fading");
    newPred.appendChild(newPrepend(++predicateCount));
    newPred.appendChild(newPredicateInput());
    return newPred;
  };
  var newPrepend = function(text) {
    var newPrep = document.createElement('div');
    newPrep.setAttribute('class', "input-group-prepend");
    var span = document.createElement('span');
    span.setAttribute('class', "input-group-text");
    span.innerHTML = text.toString();
    newPrep.appendChild(span);
    return newPrep;
  };
  var newPredicateInput = function() {
    var newInput = document.createElement('input');
    newInput.setAttribute('type', "text");
    newInput.setAttribute('class', "form-control");
    newInput.setAttribute('placeholder', "predicate");
    newInput.setAttribute('aria-label', "Predicate");
    newInput.setAttribute('tabindex', "-1");
    newInput.setAttribute('onclick', "Display.addPredicate()");
    return newInput;
  }
}