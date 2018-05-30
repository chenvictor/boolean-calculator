var Settings = new function() {
  var forceParens = true;
  this.getForceParens = function() {
    return forceParens;
  }
  this.setForceParens = function(newBool) {
    forceParens = newBool;
  }
};