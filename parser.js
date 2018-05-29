var NOT_EXPRESSIONS = ["¬", "~", "-", "!", "not"];
var AND_EXPRESSIONS = ["∧", "and"];
var OR_EXPRESSIONS = ["∨", "or"];
var XOR_EXPRESSIONS = ["⊕", "xor"];
var IF_EXPRESSIONS = ["→", "->", "then"];
var IFF_EXPRESSIONS = ["↔", "<->"];
var BINARY_EXPRESSIONS = [AND_EXPRESSIONS[0], OR_EXPRESSIONS[0], XOR_EXPRESSIONS[0], IF_EXPRESSIONS[0], IFF_EXPRESSIONS[0]];
function isBinaryOperator(exp) {
  for (var idx = 0; idx < BINARY_EXPRESSIONS.length; idx++) {
    if (BINARY_EXPRESSIONS[idx] == exp) {
      return true;
    }
  }
  return false;
}
function isAssociativeOperator(exp) {
  return exp == AND_EXPRESSIONS[0] || exp == OR_EXPRESSIONS[0];
}

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
  resetVariables();
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
    if (isBinaryOperator(single) || single == NOT_EXPRESSIONS[0]) {
      throw "Parsing error. Unfinished expression";
    }
    var newVar = new Variable(single);
    addVariable(newVar);
    return newVar;
  } else {
    return processParsedArray(parseAgain);
  }
}
function processParsedArray(array) {
  if (array.length == 1) {
    //try parsing it again
    return processParsedSingle(array[0]);
  } else {
    //2 or longer, valid as long as only 1 distinct binary operator is in use.
    if (isAmbiguousArray(array)) {
      throw "Expression is ambiguous, use parentheses to delimit different binary operators";
    }
    //go through the array, find first binary operator
    var index = getBinaryIndex(array);
    if(index == -1) {
      //there is no binary operator, must be a collection of nots
      if (array.shift() == NOT_EXPRESSIONS[0]) {
        return new NotExpression(processParsedArray(array));
      } else {
        throw "Parsing error. Unfinished expression";
      }
    } else {
      var preBinary = array.slice(0, index);
      var postBinary = array.slice(index+1);
      switch(array[index]) {
        case AND_EXPRESSIONS[0]:  return new AndExpression(processParsedArray(preBinary), processParsedArray(postBinary));
        case OR_EXPRESSIONS[0]:   return new OrExpression(processParsedArray(preBinary), processParsedArray(postBinary));
        case XOR_EXPRESSIONS[0]:  return new XorExpression(processParsedArray(preBinary), processParsedArray(postBinary));
        case IF_EXPRESSIONS[0]:   return new IfExpression(processParsedArray(preBinary), processParsedArray(postBinary));
        case IFF_EXPRESSIONS[0]:  return new IffExpression(processParsedArray(preBinary), processParsedArray(postBinary));
        default: throw "Parsing error. AB idx:" + index;
      }
    }
  }
}
function getBinaryIndex(array) {
  var binaryIndex = -1;
  for (var idx = 0; idx < array.length; idx++) {
    if (isBinaryOperator(array[idx])) {
      binaryIndex = idx;
      break;
    }
  }
  return binaryIndex;
}
function isNot(exp) {
  return exp == NOT_EXPRESSIONS[0];
}
function isExp(exp) {
  return !isNot(exp) && !isBinaryOperator(exp);
}
function isAmbiguousArray(array) {
  var unique = false;
  var hit = false;
  for (var i=0; i < array.length; i++) {
    var temp = array[i];
    if(isBinaryOperator(temp)) {
      if(isAssociativeOperator(temp)) {
        if (unique == false) {
          unique = temp;
        } else {
          if (unique != temp) {
            return true;
          }
        }
      } else {
        if (hit) {
          return true;
        }
      }
      hit = true;
    }
  }
  return false;
}
