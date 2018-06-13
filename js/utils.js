const Utils = new function() {
  this.parenthesize = function(string, temp = true) {
    if (temp) {
      return "(" + string + ")";
    }
    return string;
  }

  this.arrayToString = function(array, separator) {
    //returns string representation of array with the given separator
    var string = "";
    for (var i = 0; i < array.length; i++) {
      var item = array[i];
      if (i == 0) {
        string += item;
      } else {
        first = true;
        string += (separator + item);
      }
    }
    return string;
  }
};