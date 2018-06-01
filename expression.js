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
  return SYMBOL.NOT + this.subs[0];
};

//Binary Expressions

function XorExpression(sub1, sub2) {
  this.subs = [sub1, sub2];
}
XorExpression.prototype.toString = function() {
  return Utils.parenthesize(this.subs[0] + SYMBOL.XOR + this.subs[1]);
}

function IfExpression(sub1, sub2) {
  this.subs = [sub1, sub2];
}
IfExpression.prototype.toString = function() {
  return Utils.parenthesize(this.subs[0] + SYMBOL.IF + this.subs[1]);
}

function IffExpression(sub1, sub2) {
  this.subs = [sub1, sub2];
}
IffExpression.prototype.toString = function() {
  return Utils.parenthesize(this.subs[0] + SYMBOL.IFF + this.subs[1]);
}

//Arbitrary Gates
function OrExpression(subs) {
  this.subs = subs;
}

OrExpression.prototype.toString = function() {
  return Utils.parenthesize(Utils.arrayToString(this.subs, SYMBOL.OR));
}

function AndExpression(subs) {
  this.subs = subs;
}

AndExpression.prototype.toString = function() {
  return Utils.parenthesize(Utils.arrayToString(this.subs, SYMBOL.AND));
}