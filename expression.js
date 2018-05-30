function Variable(string) {
  this.expressionType = "VARIABLE";
  this.variableName = string;
}
Variable.prototype.toString = function() {
  return this.variableName;
}

function NotExpression(expression) {
  this.expressionType = "NOT";
  this.expression = expression;
}
NotExpression.prototype.toString = function() {
  return SYMBOL.NOT + parenthesize(this.expression.toString(), !isVariable(this.expression) && this.expression.expressionType != "NOT");
};

function AndExpression(sub1, sub2) {
  this.expressionType = "AND";
  this.expression1 = sub1;
  this.expression2 = sub2;
}
AndExpression.prototype.toString = function() {
  return parenthesize(this.expression1.toString(), !isVariable(this.expression1) && this.expression1.expressionType != "AND" && this.expression1.expressionType != "NOT") +
    SYMBOL.AND +
    parenthesize(this.expression2.toString(), !isVariable(this.expression2) && this.expression2.expressionType != "AND" && this.expression2.expressionType != "NOT");
};

function OrExpression(sub1, sub2) {
  this.expressionType = "OR";
  this.expression1 = sub1;
  this.expression2 = sub2;
}
OrExpression.prototype.toString = function() {
  return parenthesize(this.expression1.toString(), !isVariable(this.expression1) && this.expression1.expressionType != "OR" && this.expression1.expressionType != "NOT") +
    SYMBOL.OR +
    parenthesize(this.expression2.toString(), !isVariable(this.expression2) && this.expression2.expressionType != "OR" && this.expression2.expressionType != "NOT");
};

function XorExpression(sub1, sub2) {
  this.expressionType = "XOR";
  this.expression1 = sub1;
  this.expression2 = sub2;
}
XorExpression.prototype.toString = function() {
  return parenthesize(this.expression1.toString(), !isVariable(this.expression1) && this.expression1.expressionType != "XOR" && this.expression1.expressionType != "NOT") +
    SYMBOL.XOR +
    parenthesize(this.expression2.toString(), !isVariable(this.expression2) && this.expression2.expressionType != "XOR" && this.expression2.expressionType != "NOT");
}

function IfExpression(sub1, sub2) {
  this.expressionType = "IF";
  this.expression1 = sub1;
  this.expression2 = sub2;
}
IfExpression.prototype.toString = function() {
  return parenthesize(this.expression1.toString(), !isVariable(this.expression1) && this.expression1.expressionType != "IF" && this.expression1.expressionType != "NOT") +
    SYMBOL.IF +
    parenthesize(this.expression2.toString(), !isVariable(this.expression2) && this.expression2.expressionType != "IF" && this.expression2.expressionType != "NOT");
}

function IffExpression(sub1, sub2) {
  this.expressionType = "IFF";
  this.expression1 = sub1;
  this.expression2 = sub2;
}
IffExpression.prototype.toString = function() {
  return parenthesize(this.expression1.toString(), !isVariable(this.expression1) && this.expression1.expressionType != "IFF" && this.expression1.expressionType != "NOT") +
    SYMBOL.IFF +
    parenthesize(this.expression2.toString(), !isVariable(this.expression2) && this.expression2.expressionType != "IFF" && this.expression2.expressionType != "NOT");
}

function isVariable(exp) {
  return exp.expressionType == "VARIABLE";
}

function parenthesize(string, temp = true) {
  if (OVERRIDE_PARENS) {
    temp = true;
  }
  if (temp) {
    return "(" + string + ")";
  }
  return string;
}
var OVERRIDE_PARENS = false;