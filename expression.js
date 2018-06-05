//NOTE: All expressions apart from variables use subs array. array length is not enforced.

//Unary Expressions
const True = new function() {
  this.toString = function() {
    return "T";
  }
  this.equals = function(object) {
    return object == this;
  }
  this.clone = function() {
    return this;
  }
}

const False = new function() {
  this.toString = function() {
    return "F";
  }
  this.equals = function(object) {
    return object == this;
  }
  this.clone = function() {
    return this;
  }
}

function Variable(string) {
  this.variableName = string;
}
Variable.prototype.toString = function() {
  return this.variableName;
}
Variable.prototype.equals = function(object) {
  if (object.constructor != this.constructor) {
    return false;
  }
  return this.variableName == object.variableName;
}
Variable.prototype.clone = function(object) {
  return this;
}

function isVariable(exp) {
  return exp instanceof Variable;
}

function NotExpression(sub) {
  this.subs = [sub];
}
NotExpression.prototype.toString = function() {
  return SYMBOL.NOT + this.subs[0];
};
NotExpression.prototype.equals = function(object) {
  if (object.constructor != this.constructor) {
    return false;
  }
  return this.subs[0].equals(object.subs[0]);
}

//Binary Expressions

function XorExpression(sub1, sub2) {
  this.subs = [sub1, sub2];
}
XorExpression.prototype.toString = function() {
  return Utils.parenthesize(this.subs[0] + SYMBOL.XOR + this.subs[1]);
}
XorExpression.prototype.equals = function(object) {
  if (object.constructor != this.constructor) {
    return false;
  }
  if (!this.subs[0].equals(object.subs[0])) {
    return false;
  }
  return this.subs[1].equals(object.subs[1]);
}

function IfExpression(sub1, sub2) {
  this.subs = [sub1, sub2];
}
IfExpression.prototype.toString = function() {
  return Utils.parenthesize(this.subs[0] + SYMBOL.IF + this.subs[1]);
}
IfExpression.prototype.equals = function(object) {
  if (object.constructor != this.constructor) {
    return false;
  }
  if (!this.subs[0].equals(object.subs[0])) {
    return false;
  }
  return this.subs[1].equals(object.subs[1]);
}

function IffExpression(sub1, sub2) {
  this.subs = [sub1, sub2];
}
IffExpression.prototype.toString = function() {
  return Utils.parenthesize(this.subs[0] + SYMBOL.IFF + this.subs[1]);
}
IffExpression.prototype.equals = function(object) {
  if (object.constructor != this.constructor) {
    return false;
  }
  if (!this.subs[0].equals(object.subs[0])) {
    return false;
  }
  return this.subs[1].equals(object.subs[1]);
}

//Arbitrary Gates
function OrExpression(subs) {
  this.subs = subs;
}

OrExpression.prototype.toString = function() {
  return Utils.parenthesize(Utils.arrayToString(this.subs, SYMBOL.OR));
}
OrExpression.prototype.contains = function(object) {
  if (object.constructor != this.constructor) {
    return this.subs.includes(object);
  }
  for (var i = 0; i < object.subs.length; i++) {
    var sub = object.subs[i];
    if (!this.contains(sub)) {
      return false;
    }
  }
  return true;
}
OrExpression.prototype.equals = function(object) {
  if (object.constructor != this.constructor) {
    return false;
  }
  if (this.subs.length != object.subs.length) {
    return false;
  }
  return this.toString() == object.toString();
}

function AndExpression(subs) {
  this.subs = subs;
}

AndExpression.prototype.toString = function() {
  return Utils.parenthesize(Utils.arrayToString(this.subs, SYMBOL.AND));
}
AndExpression.prototype.contains = function(object) {
  if (object.constructor != this.constructor) {
    return this.subs.includes(object);
  }
  for (var i = 0; i < object.subs.length; i++) {
    var sub = object.subs[i];
    if (!this.contains(sub)) {
      return false;
    }
  }
  return true;
}
AndExpression.prototype.equals = function(object) {
  if (object.constructor != this.constructor) {
    return false;
  }
  if (this.subs.length != object.subs.length) {
    return false;
  }
  //assume elements are in order
  return this.toString() == object.toString();
  //return false;
}