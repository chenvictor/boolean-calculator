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

  //assume input array is a set (no duplicates)
  this.powerSetIter = function*(array, offset = 0) {
    while (offset < array.length) {
      let first = array[offset++];
      for (let subset of this.powerSetIter(array, offset)) {
        subset.push(first);
        yield subset;
      }
    }
    yield [];
  };

  //array is an array of arrays
  this.shortestArray = function(array) {
    if (array.length == 0) {
      throw "Array is empty!";
    }
    array = array.concat(); //clone the array first
    array.sort(function(a, b) {
      if (a.length == b.length) {
        return 0;
      } else if (a.length > b.length) {
        return 1;
      } else {
        return -1;
      }
    });
    return array[0];
  };

  this.setSubtract = function(main, subtract) {
    var newArray = [];
    for (let a of main) {
      if (!subtract.includes(a)) {
        newArray.push(a);
      }
    }
    return newArray;
  }

};