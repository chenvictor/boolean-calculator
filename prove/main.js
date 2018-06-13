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
  //wtoIdx 0 = Conclusion, other = predicate #wtoIdx
  clearTimeout(wtos[wtoIdx]);
  wtos[wtoIdx] = setTimeout(function() {
    //standardize
    var value = Parser.standardize(input.value);
    input.value = value;
  }, 500);
}

function goClicked() {
  Display.clearAlerts();
  //parse all the expressions
  var parsedExpressions = getParsed();
  if (!isValid(parsedExpressions)) {
    return;
  }
  prove(parsedExpressions);
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
    var predDiv = document.getElementById("predicate" + i);
    var predInput = predDiv.getElementsByTagName('input')[0].value.toString();
    try {
      exps.push(Parser.parse(predInput));
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
        Display.alert("Conclusion invalid: ", exp);
        $("#cInput").focus();
      } else {
        Display.alert("Predicate #" + i + " invalid: ", exp);
        document.getElementsByTagName('input')[i - 1].focus();
      }
      return false;
    }
  }
  return true;
}

function prove(exps) {
  alert("Let's prove this!");
  console.log(exps);
}