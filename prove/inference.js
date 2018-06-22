const Inference = new function() {
  this.prove = function(exps) {
    //exps[0] is conclusion
    //return a list of steps, or return
    var toProve = exps.shift(); //Initial statement to prove
    var prems = exps.concat(); //Initial predicates
    console.log(toProve);
    console.log(prems);
    var inters = []; //Intermediary steps used
    var loopCounter = 0;
    while (true) {
      var idx = search(toProve, prems, inters);
      if (idx != -1) {
        //toProve is in premises, we are done
        break;
      }
      for (var i = 0; i < InferenceLaws.length; i++) {
        var law = InferenceLaws[i];
        var result = applyAll(toProve, prems, inters, law);
        if (result != false) {
          inters.push(toProve);
          toProve = result;
        }
      }
      if (++loopCounter >= 200) {
        console.log("Loop Counter exceeded.");
        break;
      }
    }
    console.log("Proven");
    console.log("Intermediate Steps: " + inters);
  };

  var applyAll = function(toProve, prems, inters, law) {
    for (var i = 0; i < prems.length; i++) {
      var exp = prems[i];
      var result = law.apply(toProve, exp);
      if (result != false) {
        return result;
      }
    }
    for (var i = 0; i < inters.length; i++) {
      var exp = inters[i];
      var result = law.apply(toProve, exp);
      if (result != false) {
        return result;
      }
    }
    return false;
  }

  const InferenceLaws = [
    (new function() {
      //Modus Ponens
      this.apply = function(toProve, exp) {
        //return false if cannot be applied
        //return newToProve, if applied
        if (exp instanceof IfExpression) {
          if (exp.subs[1].equals(toProve)) {
            // p -> q
            // p
            // ------
            // q
            return exp.subs[0];
          }
        }
        //Not applicable
        return false;
      };
      this.getLawName = function() {
        return "M.PON";
      };
    })
  ];

  // Return 'index' of toFind
  // if not found, returns -1
  var search = function(toFind, prems, inters) {
    for (var i = 0; i < prems.length; i++) {
      var exp = prems[i];
      if (exp.equals(toFind)) {
        return i;
      }
    }
    for (var i = 0; i < inters.length; i++) {
      var exp = inters[i];
      if (exp.equals(toFind)) {
        return i + prems.length;
      }
    }
    return -1;
  }
  this.test = function() {
    return InferenceLaws;
  }
};