const Settings = new function() {

  var shortChecked = true;
  var max_depth = 500;

  this.toggleCheckbox = function(checkbox) {
    if (checkbox.id == 'short') {
      shortChecked = checkbox.checked;
    }
  }

  this.getMAX_DEPTH = function() {
    return max_depth;
  }

  this.depthInput = function(input) {
    var value = input.value;
    if (value.indexOf(".") == -1) {
      var value = parseInt(value);
      if (value > 0) {
        max_depth = value;
        setInputValid(input.classList);
        return;
      }
    }
    setInputValid(input.classList, false);
  }

  var setMaxDepth = function(input) {
    //validate
    var value = input.value;
    if (value) {

    }
  }

  this.isShort = function() {
    return shortChecked;
  }

  var load = function() {
    //attemp to retrieve checkboxDict from localStorage
    var short = localStorage.getItem("shortInference");
    if (short != null) {
      shortChecked = JSON.parse(short);
    }
    var depth = localStorage.getItem("max_depth");
    if (depth != null) {
      max_depth = JSON.parse(depth);
    }
  };
  var sync = function() {
    //set checkbox to match
    document.getElementById('short').checked = shortChecked;
    document.getElementById('inputMAX_DEPTH').value = max_depth;
  }
  this.save = function() {
    //save checkboxdict to localStorage
    localStorage.setItem("shortInference", shortChecked);
    localStorage.setItem("max_depth", max_depth);
  }

  var setInputValid = function(classList, valid = true) {
    if (valid) {
      classList.remove("is-invalid");
    } else {
      classList.add("is-invalid");
    }
  }

  //load data and setup
  load();
  sync();
};