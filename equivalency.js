// const EquivalencyLaws = [
//   //Simplification Laws
//   identity,
//   negation,
//   doubleNegation,
//   negationsOfTF,
//   universalBound,
//   idempotent,
//   absorption,
//   associative,
//   //Rewriting Laws
//   implication,
//   exclusiveOr,
//   commutative,
//   //Expansion Laws
//   deMorgans,
//   distributive
// ];
const EquivalencyLaws = [identity];

const TIMEOUT_STEPS = 250;

function Step(expression, law) {
  this.result = expression;
  this.lawString = law;
}

function simplify(expression) {

  var steps = [];
  var current = expression;
  var stepsCount = 0;
  for (var i = 0; i < EquivalencyLaws.length; i++) {
    var law = EquivalencyLaws[i];
    var attempt = applyLawOnce(current, law);
    console.log("Law: " + Utils.getLawName(law, true) + current + " -> " + attempt);
    if (attempt == false) {
      continue;
    }
    current = attempt;
    if (!Settings.skipLaw(law)) {
      steps.push(new Step(current.toString(), "by " + Utils.getLawName(law)));
    }
    //success, start at beginning again
    i = -1; //-1 to reset to 0 after ++
    if (stepsCount++ > TIMEOUT_STEPS) {
      throw "Simplification timed out!";
      alert("Simplification timed out!");
    }
  }
  steps.push(new Step(current.toString(), "result"));
  //as simple as possible
  return steps;
}

function applyLawOnce(expression, lawFunction) {
  if (expression instanceof Array) {
    expression = expression[0];
  }
  var applied = lawFunction(expression);
  if (applied != false) {
    return applied;
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
  //return false;
  //sort or or and expression
  var type;
  if (expression instanceof OrExpression) {
    type = OrExpression;
  } else if (expression instanceof AndExpression) {
    type = AndExpression;
  } else {
    //doesn't apply
    return false;
  }
  var newSubs = expression.subs.concat().sort(customSort);
  if (newSubs.toString() == expression.subs.toString()) {
    return false;
  }
  var returnVal = new type(newSubs);
  if (returnVal instanceof Array) {
    throw "eror comm"
  }
  return returnVal;
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
  return false;
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
  var type;
  if (expression instanceof OrExpression) {
    type = OrExpression;
  } else if (expression instanceof AndExpression) {
    type = AndExpression;
  } else {
    return false;
  }
  //assumes the array is sorted
  var newArray = [];
  var changed = false;
  for (var i = 0; i < expression.subs.length; i++) {
    var sub = expression.subs[i];
    if (newArray.length == 0 || !newArray[newArray.length - 1].equals(sub)) {
      newArray.push(sub);
    } else {
      changed = true;
      // newArray = newArray.concat(expression.subs.splice(i + 1));
      // break;
    }
  }
  if (changed == false) {
    return false;
  }
  if (newArray.length == 1) {
    return newArray[0];
  }
  return new type(newArray);
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
      return new AndExpression(newSubs);
    } else if (sub instanceof AndExpression) {
      for (var i = 0; i < sub.subs.length; i++) {
        newSubs.push(new NotExpression(sub.subs[i]));
      }
      return new OrExpression(newSubs);
    }
  }
  return false;
}

function absorption(expression) {
  var type;
  var innerType;
  if (expression instanceof OrExpression) {
    type = OrExpression;
    innerType = AndExpression;
  } else if (expression instanceof AndExpression) {
    type = AndExpression;
    innerType = OrExpression;
  } else {
    return false;
  }
  //find other expressions
  var others = [];
  for (var i = 0; i < expression.subs.length; i++) {
    var sub = expression.subs[i];
    if (sub instanceof innerType) {
      others.push(sub);
    }
  }
  //
  if (others.length == 0) {
    //no others means nothing to simplify
    return false;
  }
  var toRemove = [];
  //for all the others, if they contain one of the original array elements, don't include them
  for (var i = 0; i < others.length; i++) {
    var other = others[i];
    for (var j = 0; j < other.subs.length; j++) {
      var inner = other.subs[j];
      if (expression.contains(inner)) {
        toRemove.push(other);
        break;
      }
    }
  }
  var newArray = [];
  var changed = false;
  for (var i = 0; i < expression.subs.length; i++) {
    var sub = expression.subs[i];
    if (!toRemove.includes(sub)) {
      newArray.push(sub);
    }
    changed = true;
  }
  if (!changed) {
    return false;
  }
  if (newArray.length == 1) {
    return newArray[0];
  }
  return new type(newArray);
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
  var stringA = expA.toString();
  var stringB = expB.toString();
  //shorter string first
  if (stringA.length < stringB.length) {
    return -1;
  } else if (stringB.length < stringA.length) {
    return 1;
  } else {
    //same length, compare alphabet
    if (stringA < stringB) {
      return -1;
    } else if (stringA > stringB) {
      return 1;
    } else {
      return 0;
    }
  }

}