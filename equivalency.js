function applyLaw(expression, lawFunction) {
  //traverses the expression, applying the law wherever possible.
  //if applied, return the new expressions
  //otherwise, return false
  var applied = lawFunction(expression);
  if (applied != false) {
    console.log("applied");
    var applyAgain = applyLaw(applied, lawFunction);
    if (applyAgain == false) {
      return applied;
    }
    return applyAgain;
    //try again
  } else {
    var subs = expression.subs;
    if (subs == null) {
      return false;
      //not more to try
    } else {
      //try on the subs
      var newSubs = [];
      var didApply = false;
      for (var i = 0; i < subs.length; i++) {
        console.log("trying to apply to " + subs[i]);
        var subApplied = applyLaw(subs[i], lawFunction);
        if (subApplied != false) {
          newSubs.push(subApplied);
          didApply = true;
        } else {
          newSubs.push(subs[i]);
        }
      }
      if (didApply) {
        return new expression.constructor(newSubs);
      } else {
        console.log("couldn't apply to subs");
        return false;
      }
    }
  }
}

//These functions should not alter the original expressions, but copy data over.

function commutative(expression) {
  //sort or or and expression
  if (expression instanceof OrExpression) {
    //sort the subs alphabetically
    return new OrExpression(expression.subs.sort(customSort));
  }
  if (expression instanceof AndExpression) {
    //sort the subs alphabetically
    return new AndExpression(expression.subs.sort(customSort));
  }
  //doesn't apply
  return false;
}

function associative(expression) {
  //merged nested or/and expressions
  if (expression instanceof AndExpression) {
    //check for nested And
    var newSubs = associate(expression.subs, AndExpression);
    if (newSubs.length == expression.subs.length) {
      //same
      return false;
    }
    return new AndExpression(newSubs);
  } else if (expression instanceof OrExpression) {
    //check for nested Or
    var newSubs = associate(expression.subs, OrExpression);
    if (newSubs.length == expression.subs.length) {
      //same
      return false;
    }
    return new OrExpression(newSubs);
  }
  //doesn't apply
  return false;
}

//Helper function for associative
function associate(subs, type) {
  //subs to check, types to merge, return array
  var array = [];
  for (var i = 0; i < subs.length; i++) {
    var sub = subs[i];
    if (sub instanceof type) {
      array = array.concat(associate(sub.subs, type));
    } else {
      //diff type
      array.push(sub);
    }
  }
  return array;
}

function doubleNegation(expression) {
  if (expression instanceof NotExpression) {
    if (expression.subs[0] instanceof NotExpression) {
      return expression.subs[0].subs[0];
    }
  }
  //couldn't double negate
  return false;
}

function identity(expression) {
  if (expression instanceof OrExpression) {
    //remove any falses
    if (expression.subs.includes(False)) {
      var newSubs = expression.subs.filter(item => item != False);
      if (newSubs.length == 0) {
        //all falses
        return False;
      } else if (newSubs.length == 1) {
        //one left
        return newSubs[0];
      } else {
        //two+ left
        return new OrExpression(newSubs);
      }
    }
  } else if (expression instanceof AndExpression) {
    //remove any trues
    if (expression.subs.includes(True)) {
      var newSubs = expression.subs.filter(item => item != True);
      if (newSubs.length == 0) {
        //all trues
        return True;
      } else if (newSubs.length == 1) {
        //one left
        return newSubs[0];
      } else {
        //two+ left
        return new AndExpression(newSubs);
      }
    }
  }
  //does not apply
  return false;
}

//Helper functions

function customSort(expA, expB) {
  //if both variables, alphabetical
  if (expA instanceof Variable) {
    if (expB instanceof Variable) {
      return expA.variableName < expB.variableName;
    } else {
      return -1; //only A is variable, A first
    }
  } else {
    if (expB instanceof Variable) {
      return 1; //only B is variable, B first
    } else {
      //neither are variable, temp don't care
      return 0;
    }
  }
}