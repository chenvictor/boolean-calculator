window.addEventListener("load", function() {
  $("#cInput").keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == "13") {
      $("#buttonProve").click();
    }
  });

});


var wtos = [];
var parsedExpressions = ["No conclusion", "No predicates"];

function validate(input, wtoIdx) {
  //wtoIdx 0 = Conclusion, other = predicate #wtoIdx
  clearTimeout(wtos[wtoIdx]);
  wtos[wtoIdx] = setTimeout(function() {
    //standardize
    var value = Parser.standardize(input.value);
    input.value = value;
    wtos[wtoIdx] = setTimeout(function() {
      try {
        var parsed = Parser.parse(value);
        parsedExpressions[wtoIdx] = parsed;
      } catch (e) {
        parsedExpressions[wtoIdx] = e;
      }
    }, 500);
  }, 500);
}

function goClicked() {
  prove();
}

function prove() {
  for (var i = 0; i < parsedExpressions.length; i++) {
    var exp = parsedExpressions[i];
    if (typeof(exp) == "string") {
      if (i == 0) {
        alert("Conclusion invalid");
        $("#cInput").focus();
      } else {
        alert("Predicate #" + i + " invalid\n" + exp);
        document.getElementsByTagName('input')[i - 1].focus();
      }
      return;
    }
  }
}