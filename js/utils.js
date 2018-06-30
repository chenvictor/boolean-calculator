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
  };

  //return an array of possible subdivisions of an array, with most simple first
  this.subdivisions = function(array) {
    if (!(array instanceof Array)) {
      throw "Input is not an Array!";
    }
    //most simple if 2 elementAndExp
    if (array.length == 1) {
      //base case
      return [
        [],
        [array[0]]
      ]; //either don't include it, or include it
    } else {
      var toRet = [];
      let first = array[0];
      let rest = array.slice(1);
      for (let smaller of this.subdivisions(rest)) {
        var newRet1 = smaller; //shorter
        var newRet2 = smaller.concat([first]); //longer
        //insert the two ret values in the proper spot in the array
        if (toRet.length == 0) {
          //simple push
          toRet.push(newRet1);
          toRet.push(newRet2);
        } else {
          var longerAdded = false;
          for (let idx = toRet.length - 1; idx >= 0; idx--) { //travelling backwards, so insert longer, then shorter
            let arrayAt = toRet[idx];
            if (!longerAdded) {
              if (newRet2.length >= arrayAt.length) {
                //good to insert
                toRet.splice(idx + 1, 0, newRet2);
                longerAdded = true;
              }
            } else {
              //insert newRet1
              if (newRet1.length >= arrayAt.length) {
                //good to insert
                toRet.splice(idx + 1, 0, newRet1);
                idx = -1;
              }
            }
          }
        }
      }
      return toRet;
    }
  }

};