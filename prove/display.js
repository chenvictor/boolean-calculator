const Display = new function() {
  const ID_FADE = 'fading';
  var ID_STEPS;
  var ID_PREM;
  var ID_PREMS;

  var premiseCount = 0;
  var editable = true;

  this.setStepsId = function(id) {
    ID_STEPS = id;
  };
  this.setPremiseId = function(id) {
    ID_PREM = id;
    ID_PREMS = ID_PREM + 's';
  }
  var INIT = false;
  this.init = function() {
    if (INIT) {
      throw "Init cannot be called more than once!";
    }
    if (ID_STEPS == null) {
      throw "Steps ID not yet set! Call Display.setStepsId first.";
    }
    if (ID_PREM == null) {
      throw "Premise ID not yet set! Call Display.setPremiseId first.";
    }
    INIT = true;
    document.getElementById(ID_PREMS).appendChild(newPremiseFade());
    this.addPremise();
  }

  //Premises
  this.getNumPrems = function() {
    return premiseCount;
  }
  this.addPremise = function() {
    if (!editable) {
      return; //do nothing
    }
    premiseCount++;
    var prev = document.getElementById(ID_FADE);
    prev.classList.remove(ID_FADE);
    prev.setAttribute('id', ID_PREM + (premiseCount));
    var prevInput = prev.getElementsByTagName('input')[0];
    prevInput.removeAttribute('tabindex');
    prevInput.removeAttribute('onclick');
    prevInput.setAttribute('oninput', "validate(this)");
    prevInput.setAttribute('onkeydown', "Display.keyPress(this);");
    prevInput.setAttribute('data-prem', premiseCount);
    document.getElementById(ID_PREMS).appendChild(newPremiseFade());
  };
  var newPremiseFade = function() {
    var newPred = document.createElement('div');
    newPred.setAttribute('class', "input-group mb-3 fading");
    newPred.setAttribute('id', ID_FADE);
    newPred.appendChild(newPrepend(premiseCount + 1));
    newPred.appendChild(newPremiseInput());
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
  var newPremiseInput = function() {
    var newInput = document.createElement('input');
    newInput.setAttribute('type', "text");
    newInput.setAttribute('class', "form-control");
    newInput.setAttribute('placeholder', ID_PREM);
    newInput.setAttribute('aria-label', ID_PREM);
    newInput.setAttribute('tabindex', "-1");
    newInput.setAttribute('onclick', "Display.addPremise()");
    return newInput;
  };

  //Steps
  var stepCounter = 1;
  this.clearSteps = function() {
    //reset div
    var stepsDiv = document.getElementById(ID_STEPS);
    stepsDiv.innerHTML = "";
    var title = document.createElement("h3");
    title.innerHTML = "Steps:";
    stepsDiv.appendChild(title);
    //reset Counter
    stepCounter = 1;
  };
  this.setStepsVisible = function(visible = true) {
    $('#' + ID_STEPS).collapse(
      (visible ? 'show' : 'hide')
    );
  };
  this.addStep = function(inter, interLaw) {
    var interLawString = interLaw[0].toString() + ", Line #" + interLaw[1];
    var div = createStepDiv(premiseCount + (stepCounter++), inter, interLawString);
    document.getElementById(ID_STEPS).appendChild(div);
  };

  var createStepDiv = function(lineNum, line, lawString) {
    var div = document.createElement('div');
    div.setAttribute('class', "input-group mb-3");

    var prependDiv = createPrepend(lineNum);

    var input = createDisplayInput(line);

    var appendDiv = createAppend(lawString);

    div.appendChild(prependDiv);
    div.appendChild(input);
    div.appendChild(appendDiv);

    return div;
  };

  var createPrepend = function(lineNum) {
    var prependDiv = document.createElement('div');
    prependDiv.setAttribute('class', "input-group-prepend");
    var prependSpan = document.createElement('span');
    prependSpan.setAttribute('class', "input-group-text");
    prependSpan.innerHTML = lineNum;
    prependDiv.appendChild(prependSpan);
    return prependDiv;
  };

  var createDisplayInput = function(line) {
    var input = document.createElement('input');
    input.setAttribute('type', "text");
    input.setAttribute('class', "form-control");
    input.setAttribute('placeholder', "step");
    input.setAttribute('aria-label', "step");
    input.setAttribute('disabled', true);
    input.value = line.toString();
    return input;
  };

  var createAppend = function(lawString) {
    var appendDiv = document.createElement('div');
    appendDiv.setAttribute('class', "input-group-append");
    var appendSpan = document.createElement('span');
    appendSpan.setAttribute('class', "input-group-text");
    appendSpan.innerHTML = lawString;
    appendDiv.appendChild(appendSpan);
    return appendDiv;
  }

  this.keyPress = function(div) {
    if (!editable) {
      return; //do nothing
    }
    var id = parseInt(div.getAttribute('data-prem'));
    var keycode = (event.keyCode ? event.keyCode : event.which);
    switch (keycode) {
      case 13:
        //enter
        this.addPremise();
        //focus on the next premiseElement
        document.getElementById(ID_PREM + (id + 1)).getElementsByTagName('input')[0].focus();
        //shift all the inputs down
        for (var i = premiseCount; i > id + 1; i--) {
          var fromIdx = i - 1;
          var toIdx = i;
          var fromInput = document.getElementById(ID_PREM + fromIdx).getElementsByTagName('input')[0];
          var toInput = document.getElementById(ID_PREM + toIdx).getElementsByTagName('input')[0];
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
          var premises = document.getElementById(ID_PREMS);
          var toRemove = document.getElementById(ID_PREM + id);
          premises.removeChild(toRemove);

          //update premiseIds afterwards
          for (var i = id + 1; i < premiseCount + 1; i++) {
            //rename i to i-1
            var following = document.getElementById(ID_PREM + i);
            following.getElementsByTagName('span')[0].innerHTML = (i - 1);
            following.setAttribute('id', ID_PREM + (i - 1));
            var input = following.getElementsByTagName('input')[0];
            input.setAttribute('data-prem', (i - 1));
          }
          //update fading
          var fading = document.getElementById(ID_FADE);
          fading.getElementsByTagName('span')[0].innerHTML = premiseCount--;
          //focus on the previous premise
          var previous = document.getElementById(ID_PREM + (id - 1));
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
  this.validArgument = function(premsContradict) {
    var outputString = (premsContradict ? "Premises Contradict" : "");
    setOutput("Argument is Valid", outputString);
    this.setOutputVisible();
  }
  this.assignment = function(assignment) {
    var assignString = "";
    var keys = Object.keys(assignment);
    keys.sort();
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var val = assignment[key];
      val = (val ? "T" : "F");
      assignString += key + ": " + val + " ";
    }
    setOutput("Argument is Invalid", "Invalid Assignment  -  " + assignString);
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

  this.setEditable = function(canEdit = true) {
    editable = canEdit;
    //hide fading
    var fading = document.getElementById(ID_FADE);
    if (canEdit) {
      fading.removeAttribute('hidden');
    } else {
      fading.setAttribute('hidden', '');
    }
    //disable editing Premises
    for (var i = 1; i <= premiseCount; i++) {
      var premiseDiv = document.getElementById(ID_PREM + i);
      var premiseInput = premiseDiv.getElementsByTagName('input')[0];
      if (canEdit) {
        premiseInput.removeAttribute('disabled');
      } else {
        premiseInput.setAttribute('disabled', '');
      }
    }
    //disable editing conclusion
    var concInput = document.getElementById('conclusion').getElementsByTagName('input')[0];
    if (canEdit) {
      concInput.removeAttribute('disabled');
    } else {
      concInput.setAttribute('disabled', '');
    }
  };

  this.showGoButton = function() {
    setButton(true);
  };
  this.showBackButton = function() {
    setButton(false);
  };

  var setButton = function(isGo) {
    var goButton = document.getElementById('buttonProve');
    var backButton = document.getElementById('buttonBack');
    if (isGo) {
      goButton.removeAttribute('hidden');
      backButton.setAttribute('hidden', '');
      goButton.focus();
    } else {
      goButton.setAttribute('hidden', '');
      backButton.removeAttribute('hidden');
      backButton.focus();
    }
  }
}