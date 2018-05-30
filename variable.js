VariableManager = new function() {
  var variables = [];

  this.addVariable = function(varName) {
    if (varName.variableName == "T" || varName.variableName == "F") {
      return;
    }
    if (!this.hasVariable(varName)) {
      variables.push(varName);
    }
  }

  this.hasVariable = function(varName) {
    for (var i = 0; i < variables.length; i++) {
      if (varName.variableName == variables[i].variableName) {
        return true;
      }
    }
    return false;
  }
  this.getVariables = function() {
    return variables;
  }

  this.clear = function() {
    variables = [];
  }
}