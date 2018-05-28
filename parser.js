var NOT_EXPRESSIONS = ["¬", "~", "-", "!", "not"];
var AND_EXPRESSIONS = ["∧", "and"];
var OR_EXPRESSIONS = ["∨", "or"];
var XOR_EXPRESSIONS = ["⊕", "xor"];
var IF_EXPRESSIONS = ["→", "->", "if"];
var IFF_EXPRESSIONS = ["↔", "<->", "iff"];

var TAUTOLOGY = "T";
var CONTRADICTION = "F";
var EQUIVALENT = "≡";

function parseExpression(expression) {
  //return parenthesized;
  return standardize(expression);
}
function standardize(expression) {
  //replaces any expressions with the standard
  expression = expression.split(" ").join(" "); //removes extra spaces (leaves 1);
  expression = _standard(expression, AND_EXPRESSIONS);
  expression = _standard(expression, OR_EXPRESSIONS);
  expression = _standard(expression, XOR_EXPRESSIONS);
  expression = _standard(expression, IFF_EXPRESSIONS);
  expression = _standard(expression, IF_EXPRESSIONS);
  expression = _standard(expression, NOT_EXPRESSIONS); //not performed last to avoid clashing of - with -> or <->
  return expression;
}
function _standard(expression, expressionsArray) {
  for (var i = 0; i < expressionsArray.length; i++) {
    exp = expressionsArray[i];
    expression = expression.replace(new RegExp(exp, "g"), expressionsArray[0]);
  }
  return expression;
}
/* Examples:
 * a ^ b, a v b, not a, - a
 * (a and c) v b
 * a -> b
 */
