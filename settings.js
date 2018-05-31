const Settings = new function() {
  var forceParens = true;
  this.getForceParens = function() {
    return forceParens;
  }
  this.setForceParens = function(newBool) {
    forceParens = newBool;
  }

  this.toggleCheckbox = function(checkbox) {
    checkBoxDict[checkbox.id] = checkbox.checked;
    if (checkbox.id == "selectAll") {
      //set all except short
      var short = checkBoxDict["short"];
      for (var key in checkBoxDict) {
        checkBoxDict[key] = checkbox.checked;
      }
      checkBoxDict["short"] = short;
      sync();
    }
  }

  this.getValue = function(key) {
    return checkBoxDict[key];
  }

  var checkBoxDict = {
    short: true,
    com: true,
    ass: true,
    dist: false,
    i: false,
    neg: false,
    dneg: false,
    id: false,
    ub: false,
    dm: false,
    abs: false,
    ntf: false,
    imp: false,
    xor: false,
    selectAll: false
  };
  var load = function() {
    //attemp to retrieve checkboxDict from localStorage
    var item = localStorage.getItem("checkBoxDict");
    if (item != null) {
      checkBoxDict = JSON.parse(item);
    }
  };
  var sync = function() {
    console.log("Syncing storage and ui");
    //set checkboxes to match dict
    for (var key in checkBoxDict) {
      document.getElementById(key).checked = checkBoxDict[key];
    }
  }
  this.save = function() {
    //save checkboxdict to localStorage
    localStorage.setItem("checkBoxDict", JSON.stringify(checkBoxDict))
  }
  //load data and setup
  load();
  sync();
};