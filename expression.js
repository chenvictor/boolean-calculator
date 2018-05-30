//Unary Expressions

function Variable(string) {
  this.variableName = string;
  VariableManager.addVariable(this);
}
Variable.prototype.toString = function() {
  return this.variableName;
}

function NotExpression(sub) {
  this.sub = sub;
}
NotExpression.prototype.toString = function() {
  return SYMBOL.NOT + Utils.parenthesize(this.sub.toString(), !isVariable(this.sub));
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
  this.sub1 = sub1;
  this.sub2 = sub2;
}
XorExpression.prototype.toString = function() {
  return Utils.parenthesize(this.sub1.toString(), !isVariable(this.sub1)) +
    SYMBOL.XOR +
    Utils.parenthesize(this.sub2.toString(), !isVariable(this.sub2));
}

function IfExpression(sub1, sub2) {
  this.sub1 = sub1;
  this.sub2 = sub2;
}
IfExpression.prototype.toString = function() {
  return Utils.parenthesize(this.sub1.toString(), !isVariable(this.sub1)) +
    SYMBOL.IF +
    Utils.Utils.parenthesize(this.sub2.toString(), !isVariable(this.sub2));
}

function IffExpression(sub1, sub2) {
  this.sub1 = sub1;
  this.sub2 = sub2;
}
IffExpression.prototype.toString = function() {
  return Utils.Utils.parenthesize(this.sub1.toString(), !isVariable(this.sub1)) +
    SYMBOL.IFF +
    Utils.Utils.parenthesize(this.sub2.toString(), !isVariable(this.sub2));
}

function isVariable(exp) {
  return exp instanceof Variable;
}