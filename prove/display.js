const Display = new function() {
  var predicateCount = 1;
  this.getNumPreds = function() {
    return predicateCount;
  }
  this.addPredicate = function() {
    predicateCount++;
    var prev = document.getElementById('fading');
    prev.classList.remove('fading');
    prev.setAttribute('id', "predicate" + (predicateCount));
    var prevInput = prev.getElementsByTagName('input')[0];
    prevInput.removeAttribute('tabindex');
    prevInput.removeAttribute('onclick');
    prevInput.setAttribute('oninput', "validate(this)");
    prevInput.setAttribute('onkeydown', "Display.keyPress(this);");
    prevInput.setAttribute('data-pred', predicateCount);
    document.getElementById('predicates').appendChild(newPredicateFade());
  };
  var newPredicateFade = function() {
    var newPred = document.createElement('div');
    newPred.setAttribute('class', "input-group mb-3 fading");
    newPred.setAttribute('id', "fading");
    newPred.appendChild(newPrepend(predicateCount + 1));
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
  };
  this.keyPress = function(div) {
    var id = parseInt(div.getAttribute('data-pred'));
    var keycode = (event.keyCode ? event.keyCode : event.which);
    switch (keycode) {
      case 13:
        //enter
        this.addPredicate();
        //focus on the next predicateElement
        document.getElementById("predicate" + (id + 1)).getElementsByTagName('input')[0].focus();
        //shift all the inputs down
        for (var i = predicateCount; i > id + 1; i--) {
          var fromIdx = i - 1;
          var toIdx = i;
          var fromInput = document.getElementById("predicate" + fromIdx).getElementsByTagName('input')[0];
          var toInput = document.getElementById("predicate" + toIdx).getElementsByTagName('input')[0];
          toInput.value = fromInput.value;
          fromInput.value = "";
        }
        event.preventDefault();
        break;
      case 8:
        if (id == 1) {
          break;
        }
        //backspace
        if (div.value.length == 0) {
          var predicates = document.getElementById("predicates");
          var toRemove = document.getElementById("predicate" + id);
          predicates.removeChild(toRemove);

          //update predicateIds afterwards
          for (var i = id + 1; i < predicateCount + 1; i++) {
            //rename i to i-1
            var following = document.getElementById("predicate" + i);
            following.getElementsByTagName('span')[0].innerHTML = (i - 1);
            following.setAttribute('id', "predicate" + (i - 1));
            var input = following.getElementsByTagName('input')[0];
            input.setAttribute('data-pred', (i - 1));
          }
          //update fading
          var fading = document.getElementById('fading');
          fading.getElementsByTagName('span')[0].innerHTML = predicateCount--;
          //focus on the previous predicate
          var previous = document.getElementById("predicate" + (id - 1));
          previous.getElementsByTagName("input")[0].focus();
          event.preventDefault();
        }
        break;
    }
  }
  this.alert = function(title, text) {
    var alertDiv = document.getElementById('alerts');
    var newDiv = document.createElement('div');
    newDiv.setAttribute('class', "alert alert-danger alert-dismissible fade show");
    newDiv.setAttribute('role', "alert");
    var bold = document.createElement('strong');
    bold.innerHTML = title;
    var button = document.createElement('button');
    button.setAttribute('type', "button");
    button.setAttribute('class', "close");
    button.setAttribute('data-dismiss', "alert");
    button.setAttribute('aria-label', "Close");
    var span = document.createElement('span');
    span.setAttribute('aria-hidden', "true");
    span.innerHTML = "&times;";

    newDiv.appendChild(bold);
    newDiv.innerHTML += text;
    button.appendChild(span);
    newDiv.appendChild(button);

    alertDiv.appendChild(newDiv);
  };
  this.clearAlerts = function() {
    document.getElementById('alerts').innerHTML = "";
  }
}