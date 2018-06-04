const Utils = new function() {
  var longDict = {
    commutative: "Commutative",
    associative: "Associative",
    distributive: "Distributive",
    identity: "Identity",
    negation: "Negation",
    doubleNegation: "Double Negation",
    idempotent: "Idempotent",
    universalBound: "Universal Bound",
    deMorgans: "De Morgan's",
    absorption: "Absorption",
    negationsOfTF: "Negations of T and F",
    implication: "Implication"
  };
  var shortDict = {
    commutative: "COM",
    associative: "ASS",
    distributive: "DIST",
    identity: "I",
    negation: "NEG",
    doubleNegation: "DNEG",
    idempotent: "ID",
    universalBound: "UB",
    deMorgans: "DM",
    absorption: "ABS",
    negationsOfTF: "NTF",
    implication: "IMP"
  };
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
  this.getLawName = function(lawFunction) {
    var dictToUse = longDict;
    if (Settings.getValue("short")) {
      dictToUse = shortDict;
    }
    return dictToUse[lawFunction.name];
  }
};