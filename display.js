const Display = new function() {

  var numSteps = 0;

  this.resetPreview = function() {
    this.setGoButtonEnabled(false);
    this.preview("Preview...");
    this.variables();
  }

  this.preview = function(text) {
    display(text, "preview");
  }
  this.variables = function(varArray = true) {
    if (varArray == true) {
      display("", "variablePreview");
    } else {
      display("Variables: " + varArray, "variablePreview");
    }
  }
  this.setGoButtonEnabled = function(enabled = true) {
    var btn = document.getElementById("buttonSimplify");
    if (enabled) {
      btn.removeAttribute("disabled");
    } else {
      btn.setAttribute("disabled", "true");
    }
  }

  this.setOutputVisible = function(visibility = true) {
    if (visibility) {
      $('#collapseOutput').collapse('show');
    } else {
      this.hideSteps();
      $('#collapseOutput').collapse('hide');
    }
  }

  this.hideSteps = function() {
    $('#collapseSteps').collapse('hide');
  }

  this.addStep = function(stepStatement, lawUsed) {
    incrementCounter();
    var step = document.createElement('li');
    step.setAttribute('class', "list-group-item");
    step.innerHTML = stepStatement;
    var badge = document.createElement('span');
    badge.setAttribute('class', "badge");
    badge.innerHTML = lawUsed;
    step.appendChild(badge);
    document.getElementById("listSteps").appendChild(step);
  }

  this.clearSteps = function() {
    setNumSteps(0);
    display("", "listSteps");
  }

  this.setResult = function(result) {
    display(result, "result");
  }

  var incrementCounter = function() {
    setNumSteps(this.numSteps + 1);
  }

  var setNumSteps = function(numSteps = 0) {
    this.numSteps = numSteps;
    //update Display
    display(this.numSteps +
      (numSteps == 1 ? " Step" : " Steps"),
      "numSteps");
  }

  //Helper methods
  var display = function(text, elementId) {
    document.getElementById(elementId).innerHTML = text;
  }
}

function isGoButtonEnabled() {
  return !document.getElementById("buttonSimplify").hasAttribute("disabled");
}