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
  this.evaluate = function(variableStates) {
    return true;
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
  this.evaluate = function(variableStates) {
    return false;
  }
}

function Variable(string) {
  this.variableName = string;
}
Variable.prototype.toString = function() {
  return this.variableName;
}
Variable.prototype.equals = function(object) {
  if (!(object instanceof Variable)) {
    return false;
  }
  return this.variableName == object.variableName;
}
Variable.prototype.evaluate = function(variableStates) {
  return variableStates[this.variableName];
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
NotExpression.prototype.evaluate = function(variableStates) {
  return !this.subs[0].evaluate(variableStates);
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
XorExpression.prototype.evaluate = function(variableStates) {
  var p1 = this.subs[0].evaluate(variableStates);
  var p2 = this.subs[1].evaluate(variableStates);
  return (p1 != p2);
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
IfExpression.prototype.evaluate = function(variableStates) {
  var p1 = this.subs[0].evaluate(variableStates);
  var p2 = this.subs[1].evaluate(variableStates);
  return (!p1) || p2;
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
IffExpression.prototype.evaluate = function(variableStates) {
  var p1 = this.subs[0].evaluate(variableStates);
  var p2 = this.subs[1].evaluate(variableStates);
  return (p1 == p2);
}

//Arbitrary Gates
function OrExpression(subs) {
  this.subs = subs;
}

OrExpression.prototype.toString = function() {
  return Utils.parenthesize(Utils.arrayToString(this.subs, " " + SYMBOL.OR + " "));
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
  if (this.toString() == object.toString()) {
    return true;
  }
  return this.subs.concat().sort().toString() == object.subs.concat().sort().toString();
}
OrExpression.prototype.evaluate = function(variableStates) {
  for (var i = 0; i < this.subs.length; i++) {
    var p = this.subs[i].evaluate(variableStates);
    if (p) {
      return true;
    }
  }
  return false;
}

function AndExpression(subs) {
  this.subs = subs;
}

AndExpression.prototype.toString = function() {
  return Utils.parenthesize(Utils.arrayToString(this.subs, " " + SYMBOL.AND + " "));
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
  if (this.toString() == object.toString()) {
    return true;
  }
  return this.subs.concat().sort().toString() == object.subs.concat().sort().toString();
}

AndExpression.prototype.evaluate = function(variableStates) {
  for (var i = 0; i < this.subs.length; i++) {
    var p = this.subs[i].evaluate(variableStates);
    if (!p) {
      return false;
    }
  }
  return true;
}

function equalsNegation(exp1, exp2) {
  var neg1 = new NotExpression([exp1]);
  var neg2 = new NotExpression([exp2]);
  if (neg1.equals(exp2)) {
    return true;
  } else {
    return neg2.equals(exp1);
  }
}

function negation(exp) {
  if (exp instanceof NotExpression) {
    return exp.subs[0];
  } else {
    return new NotExpression([exp]);
  }
}