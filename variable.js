var variables = [];
function resetVariables() {
  variables = [];
}
function addVariable(varName) {
  if (!hasVariable(varName)) {
    variables.push(varName);
  }
}
function hasVariable(varName) {
  for (var i = 0; i < variables.length; i++) {
    if (varName.variableName == variables[i].variableName) {
      return true;
    }
  }
  return false;
}
