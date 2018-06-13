const VariableManager = new function() {
  var variables = [];

  this.get = function(varName) {
    var filter = /^[a-zA-Z]+$/;
    if (!filter.test(varName)) {
      throw "Parsing Error: Variables should be comprised of letters only.";
    }
    //make sure variableName contains only letters
    if (varName == "T") {
      return True;
    } else if (varName == "F") {
      return False;
    }
    for (var i = 0; i < variables.length; i++) {
      if (varName == variables[i].variableName) {
        return variables[i];
      }
    }
    var newVar = new Variable(varName);
    variables.push(newVar);
    return newVar;
  }

  this.hasVariable = function(varName) {
    //return if variable with given name exists
    for (var i = 0; i < variables.length; i++) {
      if (varName == variables[i].variableName) {
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