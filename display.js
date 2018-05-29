function displayPreview(text) {
  display(text, "preview");
}
function displayVariables(varArray = true) {
  if (varArray == true) {
    display("", "variablePreview");
  } else {
    display("Variables: " + varArray, "variablePreview");
  }
}
function display(text, elementId) {
  document.getElementById(elementId).innerHTML = text;
}
