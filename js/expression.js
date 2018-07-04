//Unary Expressions
const Generic = new function() {
  this.toString = function() {
    return "...";
  }
  this.equals = function(object) {
    return true;
  }
  this.clone = function() {
    return this;
  }
  this.evaluate = function(variableStates) {
    throw "Operation: evalute not supported.";
  }
}
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
  //Check for generic
  if (this.subs.includes(Generic)) {
    if (object.subs.includes(Generic)) {
      //both have ...
      return true;
    } else {
      //this has ..., object doesn't
      //check that all subs in this are in object
      for (let sub of this.subs) {
        if (!sub.equals(Generic)) {
          if (!object.subs.includes(sub)) {
            return false;
          }
        }
      }
      return true;
    }
  } else if (object.subs.includes(Generic)) {
    //object has generic, this doesn't
    //check that all subs in object are in this
    for (let sub of object.subs) {
      if (!sub.equals(Generic)) {
        if (!this.subs.includes(sub)) {
          return false;
        }
      }
    }
    return true;
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

function andCombine(exp1, exp2) {
  //Put two expressions under one AndExpression
  if (exp1 instanceof AndExpression) {
    if (exp2 instanceof AndExpression) {
      //Both AndExpression
      return new AndExpression(Utils.setAdd(exp1.subs, exp2.subs));
    } else {
      //exp1 AndExpression
      return new AndExpression(Utils.setAdd(exp1.subs, [exp2]));
    }
  } else {
    if (exp2 instanceof AndExpression) {
      //exp2 AndExpression
      return new AndExpression(Utils.setAdd(exp2.subs, [exp1]));
    } else {
      //Neither AndExpression
      return new AndExpression([exp1, exp2]);
    }
  }
}

function orCombine(exp1, exp2) {
  //Put two expressions under one OrExpression
  if (exp1 instanceof OrExpression) {
    if (exp2 instanceof OrExpression) {
      //Both OrExpression
      return new OrExpression(Utils.setAdd(exp1.subs, exp2.subs));
    } else {
      //exp1 OrExpression
      return new OrExpression(Utils.setAdd(exp1.subs, [exp2]));
    }
  } else {
    if (exp2 instanceof OrExpression) {
      //exp2 OrExpression
      return new OrExpression(Utils.setAdd(exp2.subs, [exp1]));
    } else {
      //Neither OrExpression
      return new OrExpression([exp1, exp2]);
    }
  }
}