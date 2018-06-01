function applyLaw(lawFunction) {
  //traverses the expression, applying the law wherever possible.
  //if applied, return the new expressions
  //otherwise, return false

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

  //doesn't apply
  return false;
}

function doubleNegation(expression) {
  if (expression instanceof NotExpression) {
    if (expression.sub instanceof NotExpression) {
      return expression.sub.sub;
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