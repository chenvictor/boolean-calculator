const Utils = new function() {
  var OVERRIDE_PARENS = false;
  this.parenthesize = function(string, temp = true) {
    if (OVERRIDE_PARENS) {
      temp = true;
    }
    if (temp) {
      return "(" + string + ")";
    }
    return string;
  }
};