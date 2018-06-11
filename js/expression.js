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

function NotExpression(subs) {
  this.subs = subs;
}
NotExpression.prototype.toString = function() {
  return SYMBOL.NOT + this.subs[0];
};
NotExpression.prototype.equals = function(object) {
  if (!(object instanceof NotExpression)) {
    return false;
  }
  return this.subs[0].equals(object.subs[0]);
}

//Binary Expressions

function XorExpression(subs) {
  this.subs = subs;
}
XorExpression.prototype.toString = function() {
  return Utils.parenthesize(Utils.arrayToString(this.subs, SYMBOL.XOR));
}
XorExpression.prototype.equals = function(object) {
  if (!(object instanceof XorExpression)) {
    return false;
  }
  if (!this.subs[0].equals(object.subs[0])) {
    return false;
  }
  return this.subs[1].equals(object.subs[1]);
}

function IfExpression(subs) {
  this.subs = subs;
}
IfExpression.prototype.toString = function() {
  return Utils.parenthesize(this.subs[0] + SYMBOL.IF + this.subs[1]);
}
IfExpression.prototype.equals = function(object) {
  if (!(object instanceof IfExpression)) {
    return false;
  }
  if (!this.subs[0].equals(object.subs[0])) {
    return false;
  }
  return this.subs[1].equals(object.subs[1]);
}

function IffExpression(subs) {
  this.subs = subs;
}
IffExpression.prototype.toString = function() {
  return Utils.parenthesize(this.subs[0] + SYMBOL.IFF + this.subs[1]);
}
IffExpression.prototype.equals = function(object) {
  if (!(object instanceof IffExpression)) {
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
  if (!(object instanceof OrExpression)) {
    for (var i = 0; i < this.subs.length; i++) {
      if (this.subs[i].equals(object)) {
        return true;
      }
    }
    return false;
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
  if (!(object instanceof OrExpression)) {
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
  if (!(object instanceof AndExpression)) {
    for (var i = 0; i < this.subs.length; i++) {
      if (this.subs[i].equals(object)) {
        return true;
      }
    }
    return false;
  }
  for (var i = 0; i < object.subs.length; i++) {
    var sub = object.subs[i];
    if (!(this.contains(sub))) {
      return false;
    }
  }
  return true;
}
AndExpression.prototype.equals = function(object) {
  if (!(object instanceof AndExpression)) {
    return false;
  }
  if (this.subs.length != object.subs.length) {
    return false;
  }
  //assume elements are in order
  return this.toString() == object.toString();
  //return false;
}