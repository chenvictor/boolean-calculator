function displayPreview(text) {
  display(text, "preview");
}
function display(text, elementId) {
  document.getElementById(elementId).innerHTML = text;
}
