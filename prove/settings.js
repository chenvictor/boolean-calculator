const Settings = new function() {

  var shortChecked = true;

  this.toggleCheckbox = function(checkbox) {
    if (checkbox.id == 'short') {
      shortChecked = checkbox.checked;
    }
  }

  this.isShort = function() {
    return shortChecked;
  }

  var load = function() {
    //attemp to retrieve checkboxDict from localStorage
    var item = localStorage.getItem("shortInference");
    if (item != null) {
      shortChecked = JSON.parse(item);
    }
  };
  var sync = function() {
    //set checkbox to match
    document.getElementById('short').checked = shortChecked;
  }
  this.save = function() {
    //save checkboxdict to localStorage
    localStorage.setItem("shortInference", shortChecked);
  }
  //load data and setup
  load();
  sync();
};