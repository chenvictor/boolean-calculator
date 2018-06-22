const Inference = new function() {
  this.prove = function(exps) {
    //exps[0] is conclusion
    //return a list of steps
    var toProve = exps.shift(); //Initial statement to prove
    var prems = exps.concat(); //Initial predicates
    var inters = []; //Intermediary steps used
    var interLaws = [];
    var loopCounter = 0;
    var lineCounter = -1;
    while (true) {
      var idx = search(toProve, prems, inters);
      console.log("Search idx: " + idx);
      if (idx != 0) {
        //toProve is in premises, we are done
        //add this line# to last result
        if (interLaws.length != 0) {
          var len = interLaws[interLaws.length - 1][1].length;
          interLaws[interLaws.length - 1][1][len - 1] = idx;
        }
        break;
      }
      for (var i = 0; i < InferenceLaws.length; i++) {
        var law = InferenceLaws[i];
        console.log("Attempting " + law.toString());
        var result = applyAll(toProve, prems, inters, law);
        if (result != false) {
          inters.push(toProve);
          if (law.isSingular()) {
            interLaws.push([law, [result[1]]]);
          } else {
            interLaws.push([law, [result[1], lineCounter--]]);
          }
          toProve = result[0];
        }
      }
      if (++loopCounter >= 50) {
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
        //
        // p -> q
        // p
        // ------
        // q
        if (exp instanceof IfExpression) {
          if (exp.subs[1].equals(toProve)) {
            return exp.subs[0];
          }
        }
        //Not applicable
        return false;
      };
      this.toString = function() {
        return "M.PON";
      };
      this.isSingular = function() {
        return false;
      }
    }),
    (new function() {
      //Modus Tollens
      this.apply = function(toProve, exp) {
        //return false if cannot be applied
        //return newToProve, if applied
        //
        // p -> q
        // ~q
        // ------
        // ~p
        if (exp instanceof IfExpression) {
          if (equalsNegation(exp.subs[0], toProve)) {
            if (exp.subs[1] instanceof NotExpression) {
              return exp.subs[1].subs.concat()[0];
            } else {
              return new NotExpression([exp.subs[1]]);
            }
          }
        }
        //Not applicable
        return false;
      };
      this.toString = function() {
        return "M.TOL";
      };
      this.isSingular = function() {
        return false;
      }
    }),
    (new function() {
      //Conjuction
      this.apply = function(toProve, exp) {
        //return false if cannot be applied
        //return newToProve, if applied
        //
        // p
        // q
        // ------
        // p ^ q
        if (toProve instanceof AndExpression) {
          if (toProve.contains(exp)) {
            var removes = [exp];
            if (exp instanceof AndExpression) {
              removes = exp.subs.concat();
            }
            removes = new AndExpression(removes); //instatiate to take advantage of .contains method
            var keeps = [];
            for (var i = 0; i < toProve.subs.length; i++) {
              var sub = toProve.subs[i];
              if (removes.contains(sub)) {
                continue;
              }
              keeps.push(sub);
            }
            if (keeps.length == 1) {
              return keeps[0];
            } else {
              return new AndExpression(keeps);
            }
          }
        }
        //Not applicable
        return false;
      };
      this.toString = function() {
        return "CONJ";
      };
      this.isSingular = function() {
        return false;
      }
    }),
    (new function() {
      //Elimination
      this.apply = function(toProve, exp) {
        //return false if cannot be applied
        //return newToProve, if applied
        //
        // p v q
        // ~q
        // ------
        // p
        if (exp instanceof OrExpression) {
          if (exp.contains(toProve)) {
            //TODO
          }
        }
        //Not applicable
        return false;
      };
      this.toString = function() {
        return "ELIM";
      };
      this.isSingular = function() {
        return false;
      }
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