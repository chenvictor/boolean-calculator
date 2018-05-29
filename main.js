
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
  if (isParsed) {
    alert("Will simplify the expression: " + parsedResult);
  } else {
    alert("Nothing parsed yet!!!");
  }
}

var wto;
var isParsed = false;
var parsedResult;
function beginParse() {
  var expression = document.getElementById("expression").value;
  try{
    parsedResult = parseExpression(expression);
    console.log(parsedResult);
    displayPreview(parsedResult);
    displayVariables(variables);
    isParsed = true;
  } catch (errorMsg) {
    displayPreview(errorMsg);
    displayVariables();
  }
}
function expressionChanged() {
  isParsed = false;
  displayPreview("Preview...");
  displayVariables();
  clearTimeout(wto);
  wto = setTimeout(function() {
    beginParse();
  }, 500);
}
function Variable(string){
  this.expressionType = "VARIABLE";
  this.variableName = string;
}
Variable.prototype.toString = function() {
  return this.variableName;
}
function NotExpression(expression){
  this.expressionType = "NOT";
  this.expression = expression;
}
NotExpression.prototype.toString = function() {
  return NOT_EXPRESSIONS[0] + parenthesize(this.expression.toString(), !isVariable(this.expression) && this.expression.expressionType != "NOT");
};
function AndExpression(sub1, sub2){
  this.expressionType = "AND";
  this.expression1 = sub1;
  this.expression2 = sub2;
}
AndExpression.prototype.toString = function() {
  return parenthesize(this.expression1.toString(), !isVariable(this.expression1) && this.expression1.expressionType != "AND" && this.expression1.expressionType != "NOT") +
  AND_EXPRESSIONS[0]
  + parenthesize(this.expression2.toString(), !isVariable(this.expression2) && this.expression2.expressionType != "AND" && this.expression2.expressionType != "NOT");
};
function OrExpression(sub1, sub2){
  this.expressionType = "OR";
  this.expression1 = sub1;
  this.expression2 = sub2;
}
OrExpression.prototype.toString = function() {
  return parenthesize(this.expression1.toString(), !isVariable(this.expression1) && this.expression1.expressionType != "OR" && this.expression1.expressionType != "NOT") +
  OR_EXPRESSIONS[0]
  + parenthesize(this.expression2.toString(), !isVariable(this.expression2) && this.expression2.expressionType != "OR" && this.expression2.expressionType != "NOT");
};
function XorExpression(sub1, sub2){
  this.expressionType = "XOR";
  this.expression1 = sub1;
  this.expression2 = sub2;
}
XorExpression.prototype.toString = function() {
  return parenthesize(this.expression1.toString(), !isVariable(this.expression1) && this.expression1.expressionType != "XOR" && this.expression1.expressionType != "NOT") +
  XOR_EXPRESSIONS[0]
  + parenthesize(this.expression2.toString(), !isVariable(this.expression2) && this.expression2.expressionType != "XOR" && this.expression2.expressionType != "NOT");
}
function IfExpression(sub1, sub2){
  this.expressionType = "IF";
  this.expression1 = sub1;
  this.expression2 = sub2;
}
IfExpression.prototype.toString = function() {
  return parenthesize(this.expression1.toString(), !isVariable(this.expression1) && this.expression1.expressionType != "IF" && this.expression1.expressionType != "NOT") +
  IF_EXPRESSIONS[0]
  + parenthesize(this.expression2.toString(), !isVariable(this.expression2) && this.expression2.expressionType != "IF" && this.expression2.expressionType != "NOT");
}
function IffExpression(sub1, sub2){
  this.expressionType = "IFF";
  this.expression1 = sub1;
  this.expression2 = sub2;
}
IffExpression.prototype.toString = function() {
  return parenthesize(this.expression1.toString(), !isVariable(this.expression1) && this.expression1.expressionType != "IFF" && this.expression1.expressionType != "NOT") +
  IFF_EXPRESSIONS[0]
  + parenthesize(this.expression2.toString(), !isVariable(this.expression2) && this.expression2.expressionType != "IFF" && this.expression2.expressionType != "NOT");
}
function isVariable(exp) {
  return exp.expressionType == "VARIABLE";
}
function parenthesize(string, temp = true) {
  if (OVERRIDE_PARENS) {
    temp = true;
  }
  if (temp) {
    return "(" + string + ")";
  }
  return string;
}
var OVERRIDE_PARENS = false;
