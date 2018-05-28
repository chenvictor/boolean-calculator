var NOT_EXPRESSIONS = ["¬", "~", "-", "!", "not"];
var AND_EXPRESSIONS = ["∧", "and"];
var OR_EXPRESSIONS = ["∨", "or"];
var XOR_EXPRESSIONS = ["⊕", "xor"];
var IF_EXPRESSIONS = ["→", "->", "then"];
var IFF_EXPRESSIONS = ["↔", "<->"];

var TAUTOLOGY = "T";
var CONTRADICTION = "F";
var EQUIVALENT = "≡";

var OPEN_PARENS = "\(";
var CLOSE_PARENS = "\)";

function parseExpression(expression) {
  if (invalidParentheses(expression)) {
    throw "Error: Check parentheses count";
  }
  expression = expression.split(" ").join(""); //removes spaces
  if (expression.length == 0) {
    throw "Preview...";
    //nothing inputted;
  }
  //return parenthesized;
  return processParsedArray(parseStandard(standardize(expression)));
}
function invalidParentheses(expression) {
  //check if open and close paren count is same
  return expression.split(OPEN_PARENS).length != expression.split(CLOSE_PARENS).length;
}
function standardize(expression) {
  //replaces any expressions with the standard
  expression = _standard(expression, AND_EXPRESSIONS);
  expression = _standard(expression, XOR_EXPRESSIONS);
  expression = _standard(expression, OR_EXPRESSIONS);
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
function parseStandard(std) {
  var expressions = [];
  var parenthesisInitIdx = 0;
  var parenthesisStatus = 0;
  var expressionStatus = false;
  for(var idx = 0; idx < std.length; idx++) {
    //searches for parenthesized expressions, eg. (a -> b)
    var currentChar = std.charAt(idx);
    if(currentChar == OPEN_PARENS) {
      if (parenthesisStatus == 0) {
        //start of an expression
        expressionStatus = false;
        parenthesisInitIdx = idx;
      }
      parenthesisStatus++;
    } else if (currentChar == CLOSE_PARENS) {
      parenthesisStatus--;
      if (parenthesisStatus == 0) {
        //end of an expression
        expressions.push(std.substring(parenthesisInitIdx + 1, idx)); //add the new expression
      }
    } else if (parenthesisStatus != 0) {
      //inside a subexpression
      continue;
    } else {
      switch(currentChar) {
        case NOT_EXPRESSIONS[0]:
        case AND_EXPRESSIONS[0]:
        case OR_EXPRESSIONS[0]:
        case XOR_EXPRESSIONS[0]:
        case IF_EXPRESSIONS[0]:
        case IFF_EXPRESSIONS[0]:
        expressions.push(currentChar);
        expressionStatus = false;
        break;
        default:
        if(!expressionStatus) {
          expressionStatus = true;
          expressions.push("");
        }
        expressions[expressions.length - 1] += currentChar;
      }
    }
  }
  return expressions;
}
function processParsedSingle(single) {
  var parseAgain = parseStandard(single);
  if(parseAgain == single) {
    //same, it's a variableName
    return new Variable(single);
  } else {
    return processParsedArray(parseAgain);
  }
}
function processParsedArray(array) {
  if (array.length == 1) {
    //try parsing it again
    return processParsedSingle(array[0]);
  } else if (array.length == 2) {
      if (array[0] == NOT_EXPRESSIONS[0]) {
        return new NotExpression(processParsedSingle(array[1]));
      } else {
        throw "Check your expression... Couldn't parse a NOT";
      }
  } else if (array.length == 3) {
    var sub1 = array[0];
    var sub2 = array[2];
    switch (array[1]) {
      //the middle one
      case AND_EXPRESSIONS[0]:
        return new AndExpression(processParsedSingle(sub1), processParsedSingle(sub2));
      break;
      case OR_EXPRESSIONS[0]:
        return new OrExpression(processParsedSingle(sub1), processParsedSingle(sub2));
      break;
      case XOR_EXPRESSIONS[0]:
        return new XorExpression(processParsedSingle(sub1), processParsedSingle(sub2));
      break;
      case IF_EXPRESSIONS[0]:
        return new IfExpression(processParsedSingle(sub1), processParsedSingle(sub2));
      break;
      case IFF_EXPRESSIONS[0]:
        return new IffExpression(processParsedSingle(sub1), processParsedSingle(sub2));
      break;
      default:
      throw "Expression too complex... Parentheses Required";
    }
  } else {
    throw "Expression too complex... Parentheses Required";
  }
}
