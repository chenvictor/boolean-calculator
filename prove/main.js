window.addEventListener("load", function() {
  $("#cInput").keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == "13") {
      $("#buttonProve").click();
    }
  });

});


var wtos = [];

function validate(input, wtoIdx) {
  //wtoIdx 0 = Conclusion, other = premise #wtoIdx
  clearTimeout(wtos[wtoIdx]);
  wtos[wtoIdx] = setTimeout(function() {
    //standardize
    var value = Parser.standardize(input.value);
    input.value = value;
  }, 500);
}

var parsedExpressions;

function goClicked() {
  //parse all the expressions
  parsedExpressions = getParsed();
  if (!isValid(parsedExpressions)) {
    return;
  }
  Display.showBackButton();
  Display.setEditable(false);
  prove(parsedExpressions);
}

function backClicked() {
  Display.showGoButton();
  Display.setEditable(true);
  Display.setOutputVisible(false);
}

function getParsed() {
  VariableManager.clear();
  var exps = [];
  //Conclusion
  var cInput = document.getElementById('cInput').value.toString();
  try {
    exps.push(Parser.parse(cInput));
  } catch (e) {
    exps.push(e);
  }
  for (var i = 1; i <= Display.getNumPreds(); i++) {
    var premDiv = document.getElementById("premise" + i);
    var premInput = premDiv.getElementsByTagName('input')[0].value.toString();
    try {
      exps.push(Parser.parse(premInput));
    } catch (e) {
      exps.push(e);
    }
  }
  return exps;
}

function isValid(parsedExpressions) {
  for (var i = 0; i < parsedExpressions.length; i++) {
    var exp = parsedExpressions[i];
    if (typeof(exp) == "string") {
      if (i == 0) {
        Display.error("Conclusion invalid: ", exp);
        $("#cInput").focus();
      } else {
        Display.error("Predicate #" + i + " invalid: ", exp);
        document.getElementsByTagName('input')[i - 1].focus();
      }
      return false;
    }
  }
  return true;
}

function prove(exps) {
  //check for invalitating truth assignments
  var assignments = VariableManager.getTruthAssignments();
  var premsContradict = true;
  var invalidatingAssignment = null;
  for (var i = 0; i < assignments.length; i++) {
    var assign = assignments[i];
    switch (satisfies(exps, assign)) {
      case 1:
        premsContradict = false;
        break;
      case -1:
        invalidatingAssignment = assign;
        break;
    }
    if (invalidatingAssignment != null) {
      break;
    }
  }
  if (invalidatingAssignment == null) {
    console.log("Argument is valid");
    console.log("Predicates contradict: " + premsContradict);
    Display.validArgument(premsContradict);
  } else {
    //show invalidating assignment
    console.log("Invalidating Assignment: " + invalidatingAssignment);
    Display.assignment(invalidatingAssignment);
  }
}

function satisfies(exps, assignment) {
  //return true if exps[0] is true, or if premises are false
  var conc = exps[0].evaluate(assignment);
  var conj = new AndExpression(exps.slice(1));
  var prems = conj.evaluate(assignment);
  if (prems && conc) {
    return 1; //true, prems true, conc true
  } else if (!prems) {
    return 0; //still true, cos prems = false
  } else if (prems && !conc) {
    return -1; //invalid truth assignment
  }
  //should never reach here
  throw "Satisfaction Error";
}