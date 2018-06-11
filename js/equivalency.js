const EquivalencyLaws = [
  //Simplification Laws
  identity,
  negation,
  doubleNegation,
  negationsOfTF,
  universalBound,
  idempotent,
  absorption,
  associative,
  //Rewriting Laws
  commutative,
  implication,
  exclusiveOr,
  //Expansion Laws
  deMorgans,
  distributive
];

const TIMEOUT_STEPS = 100;

function Step(expression, law) {
  this.result = expression;
  this.lawString = law;
  this.extraData = null;
}

function simplify(expression) {
  var steps = [];
  var current = expression;
  var stepsCount = 0;
  distributeOutwards = true;
  for (var i = 0; i < EquivalencyLaws.length; i++) {
    var law = EquivalencyLaws[i];
    //console.log("Law: " + Utils.getLawName(law, true));
    var attempt = applyLawOnce(current, law);
    if (attempt == false) {
      if (i == EquivalencyLaws.length - 1) {
        //last steps
        if (distributeOutwards) {
          //start simplifying distribution
          distributeOutwards = false;
          i = -1;
        }
      }
      continue;
    }
    current = attempt;
    if (!Settings.skipLaw(law)) {
      if (law == distributive) {
        if (steps.length != 0 && (steps[steps.length - 1].extraData == true) && !distributeOutwards) {
          //if the previous step was outwards distribution, and this one is inner, don't store either steps
          //remove previous step
          steps.pop();
        } else {
          //store this step, with distribution direction
          var newStep = new Step(current.toString(), "by " + Utils.getLawName(law));
          newStep.extraData = distributeOutwards;
          steps.push(newStep);
        }
      } else {
        //store this step
        steps.push(new Step(current.toString(), "by " + Utils.getLawName(law)));
      }
    }
    //success, start at beginning again
    i = -1; //-1 to reset to 0 after ++
    if (++stepsCount > TIMEOUT_STEPS) {
      //after TIMEOUT_STEPS successful attempts, abort, taking too long
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
    console.log("Unexpected array: " + expression);
    throw "Unexpected Array";
  }
  var applied = lawFunction(expression);
  if (applied != false) {
    if (applied instanceof Array) {
      throw "Unexpected array";
    }
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
          if (subApplied instanceof Array) {
            throw "Unexpected array";
          }
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

var distributeOutwards = true;

function distributive(expression) {
  if (!distributeOutwards) {
    return undistribute(expression);
  }
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
  // if (expression.subs.length > 3) {
  //   //don't distribute if expression is long already
  //   return false;
  // }
  var idx = distributiveHelper(expression.subs, opposite);
  if (idx == false) {
    //all opposite expression
    return false;
  }
  if (idx == -1) {
    return false;
    //no opposite
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

function undistribute(expression) {
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
  var others = [];
  for (var i = 0; i < expression.subs.length; i++) {
    var sub = expression.subs[i];
    if (sub instanceof opposite) {
      others.push(sub);
    }
  }
  if (others.length < 2) {
    //need at least 2 expressions to check for distribution
    return false;
  }
  var commonVars = others[0].subs.slice();
  var notCommon = [];
  for (var i = 1; i < others.length; i++) {
    for (var j = 0; j < commonVars.length; j++) {
      if (!(others[i].contains(commonVars[j]))) {
        notCommon.push(commonVars[j]);
      }
    }
  }
  var tempExp = new AndExpression(notCommon);
  var commons = [];
  for (var i = 0; i < commonVars.length; i++) {
    if (!(tempExp.contains(commonVars[i]))) {
      commons.push(commonVars[i]);
    }
  }
  if (commons.length == 0) {
    return false;
  } else {
    commons = new opposite(commons);
  }
  var newOthers = [];
  for (var i = 0; i < others.length; i++) {
    var other = others[i];
    var newOther = [];
    for (var j = 0; j < other.subs.length; j++) {
      var sub = other.subs[j];
      if (commons.contains(sub)) {
        //ignore
      } else {
        newOther.push(sub);
      }
    }
    if (newOther.length == 1) {
      newOthers.push(newOther[0]);
    } else {
      newOthers.push(new opposite(newOther));
    }
  }
  newOthers = new type(newOthers);
  commons.subs.push(newOthers);
  return commons;
}

//Helper function for distributive
function distributiveHelper(subs, searchFor) {
  //return index of the first instance of searchFor
  //if none exists, return -1;
  var allSearchFors = true;
  var index = -1;
  for (var i = 0; i < subs.length; i++) {
    if (subs[i] instanceof searchFor) {
      if (index == -1) {
        index = i;
      }
    } else {
      allSearchFors = false;
    }
  }
  if (allSearchFors) {
    //don't distribute
    return false;
  }
  return index;
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
  //if an or expression contains p and not p, replace with trues
  var replacement;
  if (expression instanceof OrExpression) {
    replacement = True;
  } else if (expression instanceof AndExpression) {
    replacement = False;
  } else {
    return false;
  }
  var notNots = [];
  for (var i = 0; i < expression.subs.length; i++) {
    var sub = expression.subs[i];
    if (sub instanceof NotExpression) {
      var inner = sub.subs[0];
      if (notNots.includes(inner)) {
        return replacement;
      }
    } else {
      notNots.push(sub);
    }
  }
  //2nd pass through, since negation might occur before notnot
  for (var i = 0; i < expression.subs.length; i++) {
    var sub = expression.subs[i];
    if (sub instanceof NotExpression) {
      var inner = sub.subs[0];
      if (notNots.includes(inner)) {
        return replacement;
      }
    }
  }
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
        newSubs.push(new NotExpression([sub.subs[i]]));
      }
      return new AndExpression(newSubs);
    } else if (sub instanceof AndExpression) {
      for (var i = 0; i < sub.subs.length; i++) {
        newSubs.push(new NotExpression([sub.subs[i]]));
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
    for (var j = 0; j < expression.subs.length; j++) {
      var inner = expression.subs[j];
      if (!(other.equals(inner)) && other.contains(inner)) {
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
    } else {
      changed = true;
    }
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
    return new OrExpression([new NotExpression([expression.subs[0]]), expression.subs[1]]);
  } else if (expression instanceof IffExpression) {
    return new NotExpression([new XorExpression([expression.subs[0], expression.subs[1]])]);
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

function exclusiveOr(expression) {
  if (expression instanceof XorExpression) {
    var sub1 = expression.subs[0];
    var sub2 = expression.subs[1];
    //P xor Q == P^-Q or -P^Q
    return new OrExpression(
      [new AndExpression([sub1, new NotExpression([sub2])]),
        new AndExpression([new NotExpression([sub1]), sub2])
      ]
    );
  }
  //doesn't apply
  return false;
}

//Helper functions

function customSort(expA, expB) {
  var stringA = expA.toString();
  var stringB = expB.toString();
  //ignore negation
  if (stringA.charAt(0) == SYMBOL.NOT) {
    stringA = stringA.substr(1);
  }
  if (stringB.charAt(0) == SYMBOL.NOT) {
    stringB = stringB.substr(1);
  }
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