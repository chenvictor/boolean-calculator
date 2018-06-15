const Display = new function() {
  var premiseCount = 1;
  this.getNumPreds = function() {
    return premiseCount;
  }
  this.addPredicate = function() {
    premiseCount++;
    var prev = document.getElementById('fading');
    prev.classList.remove('fading');
    prev.setAttribute('id', "premise" + (premiseCount));
    var prevInput = prev.getElementsByTagName('input')[0];
    prevInput.removeAttribute('tabindex');
    prevInput.removeAttribute('onclick');
    prevInput.setAttribute('oninput', "validate(this)");
    prevInput.setAttribute('onkeydown', "Display.keyPress(this);");
    prevInput.setAttribute('data-prem', premiseCount);
    document.getElementById('premises').appendChild(newPredicateFade());
  };
  var newPredicateFade = function() {
    var newPred = document.createElement('div');
    newPred.setAttribute('class', "input-group mb-3 fading");
    newPred.setAttribute('id', "fading");
    newPred.appendChild(newPrepend(premiseCount + 1));
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
    newInput.setAttribute('placeholder', "premise");
    newInput.setAttribute('aria-label', "Predicate");
    newInput.setAttribute('tabindex', "-1");
    newInput.setAttribute('onclick', "Display.addPredicate()");
    return newInput;
  };
  this.keyPress = function(div) {
    var id = parseInt(div.getAttribute('data-prem'));
    var keycode = (event.keyCode ? event.keyCode : event.which);
    switch (keycode) {
      case 13:
        //enter
        this.addPredicate();
        //focus on the next premiseElement
        document.getElementById("premise" + (id + 1)).getElementsByTagName('input')[0].focus();
        //shift all the inputs down
        for (var i = premiseCount; i > id + 1; i--) {
          var fromIdx = i - 1;
          var toIdx = i;
          var fromInput = document.getElementById("premise" + fromIdx).getElementsByTagName('input')[0];
          var toInput = document.getElementById("premise" + toIdx).getElementsByTagName('input')[0];
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
          var premises = document.getElementById("premises");
          var toRemove = document.getElementById("premise" + id);
          premises.removeChild(toRemove);

          //update premiseIds afterwards
          for (var i = id + 1; i < premiseCount + 1; i++) {
            //rename i to i-1
            var following = document.getElementById("premise" + i);
            following.getElementsByTagName('span')[0].innerHTML = (i - 1);
            following.setAttribute('id', "premise" + (i - 1));
            var input = following.getElementsByTagName('input')[0];
            input.setAttribute('data-prem', (i - 1));
          }
          //update fading
          var fading = document.getElementById('fading');
          fading.getElementsByTagName('span')[0].innerHTML = premiseCount--;
          //focus on the previous premise
          var previous = document.getElementById("premise" + (id - 1));
          previous.getElementsByTagName("input")[0].focus();
          event.preventDefault();
        }
        break;
    }
  }
  this.error = function(title, text) {
    setOutput(title, text);
    this.setOutputVisible();
  };
  this.assignment = function(assignment) {
    var assignString = "test";
    setOutput("Invalidating Variable Assignment: ", assignString);
    this.setOutputVisible();
  };
  var setOutput = function(title, text) {
    var out = document.getElementById("output");
    out.innerHTML = "";
    var bold = document.createElement("strong");
    bold.innerHTML = title;
    out.appendChild(bold);
    out.innerHTML += text;
  };

  this.setOutputVisible = function(visible = true) {
    if (visible) {
      $('#collapseOutput').collapse('show');
    } else {
      document.getElementById("collapseOutput").classList.remove('show');
    }
  };


}