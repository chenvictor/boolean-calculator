function applyLawOnce(expression, lawFunction) {
  //traverses the expression, applying the law wherever possible.
  //if applied, return the new expressions
  //otherwise, return false
  var applied = lawFunction(expression);
  if (applied != false) {
    return applied;
    //try again
  } else {
    var subs = expression.subs;
    if (subs == null) {
      return false;
      //no more to try
    } else {
      //try on the subs
      var newSubs = [];
      var didApply = false;
      for (var i = 0; i < subs.length; i++) {
        var subApplied = applyLawOnce(subs[i], lawFunction);
        if (subApplied != false) {
          newSubs.push(subApplied);
          newSubs = newSubs.concat(subs.splice(i + 1));
          //found one, add the rest and done
          didApply = true;
          break;
        } else {
          newSubs.push(subs[i]);
        }
      }
      if (didApply) {
        return new expression.constructor(newSubs);
      } else {
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
    var newSubs = associativeHelper(expression.subs, AndExpression);
    if (newSubs.length == expression.subs.length) {
      //same
      return false;
    }
    return new AndExpression(newSubs);
  } else if (expression instanceof OrExpression) {
    //check for nested Or
    var newSubs = associativeHelper(expression.subs, OrExpression);
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
function associativeHelper(subs, type) {
  //subs to check, types to merge, return array
  var array = [];
  for (var i = 0; i < subs.length; i++) {
    var sub = subs[i];
    if (sub instanceof type) {
      array = array.concat(associativeHelper(sub.subs, type));
    } else {
      //diff type
      array.push(sub);
    }
  }
  return array;
}

function distributive(expression) {
  var type;
  var opposite;
  if (expression instanceof AndExpression) {
    type = AndExpression;
    opposite = OrExpression;
  } else if (expression instanceof OrExpression) {
    type = OrExpression;
    opposite = AndExpression;
  } else {
    //doesn't apply
    return false;
  }
  var idx = distributiveHelper(expression.subs, opposite);
  if (idx == -1) {
    return false;
    //no or
  }
  var orExp = expression.subs[idx];
  var others = expression.subs.slice(0, idx).concat(expression.subs.slice(idx + 1));
  var newArray = [];
  for (var i = 0; i < orExp.subs.length; i++) {
    var copy = others.slice();
    copy.push(orExp.subs[i])
    newArray.push(new type(copy));
  }
  return new opposite(newArray);
}

//Helper function for distributive
function distributiveHelper(subs, searchFor) {
  //return index of the first instance of searchFor
  //if none exists, return -1;
  for (var i = 0; i < subs.length; i++) {
    if (subs[i] instanceof searchFor) {
      return i;
    }
  }
  return -1;
}

function identity(expression) {
  var toRemove;
  var type;
  if (expression instanceof OrExpression) {
    type = OrExpression;
    toRemove = False;
    //remove any falses
  } else if (expression instanceof AndExpression) {
    type = AndExpression;
    toRemove = True;
    //remove any trues
  } else {
    //does not apply
    return false;
  }
  if (expression.subs.includes(toRemove)) {
    var newSubs = expression.subs.filter(item => item != toRemove);
    if (newSubs.length == 0) {
      //all toRemove
      return toRemove;
    } else if (newSubs.length == 1) {
      //one left
      return newSubs[0];
    } else {
      //two+ left
      return new type(newSubs);
    }
  }
}

function negation(expression) {
  //TODO
  return false;
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

function idempotent(expression) {
  //TODO
  return false;
}

function universalBound(expression) {
  var toCheck;
  if (expression instanceof OrExpression) {
    toCheck = True;
    //remove any falses
  } else if (expression instanceof AndExpression) {
    toCheck = False;
    //remove any trues
  } else {
    //does not apply
    return false;
  }
  if (expression.subs.includes(toCheck)) {
    return toCheck;
  } else {
    return false;
  }
}

function deMorgans(expression) {
  if (expression instanceof NotExpression) {
    var sub = expression.subs[0];
    var newSubs = [];
    if (sub instanceof OrExpression) {
      for (var i = 0; i < sub.subs.length; i++) {
        newSubs.push(new NotExpression(sub.subs[i]));
      }
      console.log(newSubs);
      return new AndExpression(newSubs);
    } else if (sub instanceof AndExpression) {
      for (var i = 0; i < sub.subs.length; i++) {
        newSubs.push(new NotExpression(sub.subs[i]));
      }
      console.log(newSubs);
      return new OrExpression(newSubs);
    }
  }
  return false;
}

function absorption(expression) {

}

function implication(expression) {
  if (expression instanceof IfExpression) {
    return new OrExpression([new NotExpression(expression.subs[0]), expression.subs[1]]);
  }
  return false;
}

function negationsOfTF(expression) {
  if (expression instanceof NotExpression) {
    if (expression.subs[0] == False) {
      return True;
    } else if (expression.subs[0] == True) {
      return False;
    }
  }
  //doesn't apply
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