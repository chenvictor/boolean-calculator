const Utils = new function() {
  this.parenthesize = function(string, temp = true) {
    if (temp) {
      return "(" + string + ")";
    }
    return string;
  }
};