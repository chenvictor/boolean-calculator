const Inference = new function() {
  this.prove = function(exps) {
    //exps[0] is conclusion
    //return a list of steps, or return
    var toProve = exps.shift(); //Initial statement to prove
    var prems = exps.concat(); //Initial predicates
    var inters = []; //Intermediary steps used
    var interLaws = [];
    var loopCounter = 0;
    var lineCounter = -1;
    while (true) {
      var idx = search(toProve, prems, inters);
      if (idx != 0) {
        //toProve is in premises, we are done
        //add this line# to last result
        if (interLaws.length != 0) {
          interLaws[interLaws.length - 1][1][1] = idx;
        }
        break;
      }
      for (var i = 0; i < InferenceLaws.length; i++) {
        var law = InferenceLaws[i];
        var result = applyAll(toProve, prems, inters, law);
        if (result[0] != false) {
          inters.push(toProve);
          interLaws.push([law, [result[1], lineCounter--]]);
          toProve = result[0];
        }
      }
      if (++loopCounter >= 200) {
        console.log("Loop Counter exceeded.");
        break;
      }
    }
    return [inters, interLaws];
  };

  var applyAll = function(toProve, prems, inters, law) {
    //return [newToProve, lineUsed]
    for (var i = 0; i < prems.length; i++) {
      var exp = prems[i];
      var result = law.apply(toProve, exp);
      if (result != false) {
        return [result, i + 1];
      }
    }
    for (var i = 0; i < inters.length; i++) {
      var exp = inters[i];
      var result = law.apply(toProve, exp);
      if (result != false) {
        return [result, -1 - i];
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
      this.toString = function() {
        return "M.PON";
      };
    })
  ];

  // Return 'index' of toFind, 1 based
  // if not found, returns 0
  var search = function(toFind, prems, inters) {
    for (var i = 0; i < prems.length; i++) {
      var exp = prems[i];
      if (exp.equals(toFind)) {
        return i + 1;
      }
    }
    for (var i = 0; i < inters.length; i++) {
      var exp = inters[i];
      if (exp.equals(toFind)) {
        return -1 - i;
      }
    }
    return 0;
  }
  this.test = function() {
    return InferenceLaws;
  }
};