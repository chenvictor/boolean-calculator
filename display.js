const Display = new function() {

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
  this.output = function(output) {
    display(output, "tempOutput");
  }
  //Helper methods
  var display = function(text, elementId) {
    document.getElementById(elementId).innerHTML = text;
  }
}

function isGoButtonEnabled() {
  return !document.getElementById("buttonSimplify").hasAttribute("disabled");
}