//Setup help menu
window.addEventListener("load", function() {
  var getStrings = function(expressionsArray) {
    var EXPRESSION_SPACER = "  ";
    var string = "";
    for (var i = 0; i < expressionsArray.length; i++) {
      string += expressionsArray[i].replace(/\\/g, '') + EXPRESSION_SPACER;
    }
    return string;
  }
  document.getElementById("NOT_EXPRESSIONS").innerHTML = getStrings(Parser.getEquivalentExpressions("not"));
  document.getElementById("AND_EXPRESSIONS").innerHTML = getStrings(Parser.getEquivalentExpressions("and"));
  document.getElementById("OR_EXPRESSIONS").innerHTML = getStrings(Parser.getEquivalentExpressions("or"));
  document.getElementById("XOR_EXPRESSIONS").innerHTML = getStrings(Parser.getEquivalentExpressions("xor"));
  document.getElementById("IF_EXPRESSIONS").innerHTML = getStrings(Parser.getEquivalentExpressions("->"));
  document.getElementById("IFF_EXPRESSIONS").innerHTML = getStrings(Parser.getEquivalentExpressions("<->"));
  $("#expression").keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == "13") {
      $("#buttonSimplify").click();
    }
  });
});

function goClicked() {
  if (isGoButtonEnabled()) {
    Display.clearSteps();
    var steps = Equivalency.simplify(parsedResult);
    if (steps.length == 0) {
      //nothing was done
      Display.setResult(parsedResult);
      Display.setOutputVisible();
      return;
    }
    for (var i = 0; i < steps.length - 1; i++) {
      var step = steps[i];
      Display.addStep(step.result.toString(), step.lawString);
    }
    Display.setResult(steps[steps.length - 1].result);
    Display.setOutputVisible();
  }
}

var wto;
var parsedResult;

function expressionChanged() {
  Display.setOutputVisible(false);
  Display.resetPreview();
  clearTimeout(wto);
  wto = setTimeout(function() {
    var expression = document.getElementById("expression").value;
    beginParse(expression);
  }, 500);
}

function beginParse(expression) {
  try {
    parsedResult = Parser.parse(expression);
    Display.preview("Preview: " + parsedResult);
    Display.variables(VariableManager.getVariables());
    Display.setGoButtonEnabled(); //set it to true as parsing was successful
  } catch (errorMsg) {
    Display.preview(errorMsg);
    Display.variables();
  }
}