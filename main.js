
window.addEventListener("load", function() {
  document.getElementById("NOT_EXPRESSIONS").innerHTML = getStrings(NOT_EXPRESSIONS);
  document.getElementById("AND_EXPRESSIONS").innerHTML = getStrings(AND_EXPRESSIONS);
  document.getElementById("OR_EXPRESSIONS").innerHTML = getStrings(OR_EXPRESSIONS);
  document.getElementById("XOR_EXPRESSIONS").innerHTML = getStrings(XOR_EXPRESSIONS);
  document.getElementById("IF_EXPRESSIONS").innerHTML = getStrings(IF_EXPRESSIONS);
  document.getElementById("IFF_EXPRESSIONS").innerHTML = getStrings(IFF_EXPRESSIONS);
  $("#expression").keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == "13"){
      $("#buttonSimplify").click();
    }
  });
});
var EXPRESSION_SPACER = "  ";
function getStrings(expressionsArray) {
  var string = "";
  for (var i = 0; i < expressionsArray.length; i++) {
    string += expressionsArray[i] + EXPRESSION_SPACER;
  }
  return string;
}

function goClicked() {
  var expression = document.getElementById("expression").value;
  var parsed = parseExpression(expression);
  displayPreview(parsed);
}
function NotExpression(expression){
  this.expressionType = "NOT";
  this.expression = expression;
}
NotExpression.prototype.toString = function() {
  return "(not " + this.expression.toString() + ")";
};
function AndExpression(sub1, sub2){
  this.expressionType = "AND";
  this.expression1 = sub1;
  this.expression2 = sub2;
}
AndExpression.prototype.toString = function() {
  return "(" + this.expression1.toString() + " and " + this.expression2.toString() + ")";
};
function OrExpression(sub1, sub2){
  this.expressionType = "OR";
  this.expression1 = sub1;
  this.expression2 = sub2;
}
OrExpression.prototype.toString = function() {
  return "(" + this.expression1.toString() + " or " + this.expression2.toString() + ")";
};
