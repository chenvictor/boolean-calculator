//NOTE: All expressions apart from variables use subs array. array length is not enforced.

//Unary Expressions
const True = new function() {
  this.toString = function() {
    return "T";
  }
}

const False = new function() {
  this.toString = function() {
    return "F";
  }
}

function Variable(string) {
  this.variableName = string;
}
Variable.prototype.toString = function() {
  return this.variableName;
}

function isVariable(exp) {
  return exp instanceof Variable;
}

function NotExpression(sub) {
  this.subs = [sub];
}
NotExpression.prototype.toString = function() {
  return SYMBOL.NOT + Utils.parenthesize(this.subs[0].toString(), !isVariable(this.subs[0]));
};

//Binary Expressions

function BinaryAndExpression(sub1, sub2) {
  this.sub1 = sub1;
  this.sub2 = sub2;
}
BinaryAndExpression.prototype.toString = function() {
  return Utils.parenthesize(this.sub1.toString(), !isVariable(this.sub1)) +
    SYMBOL.AND +
    Utils.parenthesize(this.sub2.toString(), !isVariable(this.sub2));
};

function AndExpression(subArray) {
  this.subs = subArray;
}

function BinaryOrExpression(sub1, sub2) {
  this.sub1 = sub1;
  this.sub2 = sub2;
}
BinaryOrExpression.prototype.toString = function() {
  return Utils.parenthesize(this.sub1.toString(), !isVariable(this.sub1)) +
    SYMBOL.OR +
    Utils.parenthesize(this.sub2.toString(), !isVariable(this.sub2));
};

function XorExpression(sub1, sub2) {
  this.subs = [sub1, sub2];
}
XorExpression.prototype.toString = function() {
  return Utils.parenthesize(this.subs[0].toString(), !isVariable(this.subs[0])) +
    SYMBOL.XOR +
    Utils.parenthesize(this.subs[1].toString(), !isVariable(this.subs[1]));
}

function IfExpression(sub1, sub2) {
  this.subs = [sub1, sub2];
}
IfExpression.prototype.toString = function() {
  return Utils.parenthesize(this.sub1.toString(), !isVariable(this.sub1)) +
    SYMBOL.IF +
    Utils.parenthesize(this.sub2.toString(), !isVariable(this.sub2));
}

function IffExpression(sub1, sub2) {
  this.sub1 = sub1;
  this.sub2 = sub2;
}
IffExpression.prototype.toString = function() {
  return Utils.parenthesize(this.sub1.toString(), !isVariable(this.sub1)) +
    SYMBOL.IFF +
    Utils.parenthesize(this.sub2.toString(), !isVariable(this.sub2));
}

//Arbitrary Gates
function OrExpression(subs) {
  this.subs = subs;
}

OrExpression.prototype.toString = function() {
  return arrayToString(this.subs, SYMBOL.OR);
}

function AndExpression(subs) {
  this.subs = subs;
}

AndExpression.prototype.toString = function() {
  return arrayToString(this.subs, SYMBOL.AND);
}

//Helper functions
BinaryAndExpression.prototype.asAndExpression = function() {
  return new AndExpression(andHelper(this));
}

BinaryOrExpression.prototype.asOrExpression = function() {
  return new OrExpression(orHelper(this));
}

AndExpression.prototype.asBinaryAndExpression = function() {
  var helperConcat = function(array) {
    if (array.length == 1) {
      return array[0];
    } else {
      return new BinaryAndExpression(array[0], helperConcat(array.slice(1)))
    }
  }
  return helperConcat(this.subs);
}
OrExpression.prototype.asBinaryOrExpression = function() {
  var helperConcat = function(array) {
    if (array.length == 1) {
      return array[0];
    } else {
      return new BinaryOrExpression(array[0], helperConcat(array.slice(1)))
    }
  }
  return helperConcat(this.subs);
}

//Helpers
function andHelper(andExpression) {
  //returns array
  var sub1 = andExpression.sub1;
  var sub2 = andExpression.sub2;
  var array = [];
  if (sub1 instanceof BinaryAndExpression) {
    array = array.concat(andHelper(sub1));
  } else {
    array.push(sub1);
  }
  if (sub2 instanceof BinaryAndExpression) {
    array = array.concat(andHelper(sub2));
  } else {
    array.push(sub2);
  }
  return array;
}

function orHelper(OrExpression) {
  //returns array
  var sub1 = OrExpression.sub1;
  var sub2 = OrExpression.sub2;
  var array = [];
  if (sub1 instanceof BinaryOrExpression) {
    array = array.concat(orHelper(sub1));
  } else {
    array.push(sub1);
  }
  if (sub2 instanceof BinaryOrExpression) {
    array = array.concat(orHelper(sub2));
  } else {
    array.push(sub2);
  }
  return array;
}

function arrayToString(array, separator) {
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