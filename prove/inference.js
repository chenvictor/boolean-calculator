const Inference = new function() {
  this.prove = function(exps) {
    console.clear();
    //exps[0] is conclusion
    //return a list of steps
    var toProve = exps.shift(); //Initial statement to prove
    var prems = exps.concat(); //Initial predicates
    var inters = []; //Intermediary steps used
    var interLaws = [];
    var lineCounter = -1;
    var recurseCounter = 0;

    //Initialize helper function
    return prove(toProve, prems, inters, interLaws, lineCounter, recurseCounter);
  };
  var prove = function(toProve, prems, inters, interLaws, lineCounter, recurseCounter) {
    console.log("ToProve: " + toProve);
    console.log("Inters: " + inters);
    if (recurseCounter++ > 50) {
      throw "Recursion too deep, aborting";
    }
    //Initial search
    var idx = search(toProve, prems, inters);
    console.log("Idx: " + idx);
    if (idx != 0) {
      //toProve is in premises, we are done
      //add this line# to last result
      if (interLaws.length != 0 && interLaws[interLaws.length - 1][0] != "SPEC") {
        //Don't rename SPEC
        var len = interLaws[interLaws.length - 1][1].length;
        interLaws[interLaws.length - 1][1][len - 1] = idx;
      }
      console.log("Proof reached.");
      //Return result
      return [inters, interLaws];
    }
    console.log('Proof continues');
    //Explore branches
    var branches = [];
    for (let law of ReverseInferenceLaws) {
      console.log("Attempting: " + law.toString());
      var resultBranches = applyAll(toProve, prems, inters, law);
      if (resultBranches.length > 0) {
        for (let result of resultBranches) {
          //clone inters and interLaws
          var newInters = inters.concat();
          var newInterLaws = interLaws.concat();

          newInters.push(toProve);
          if (law.isSingular()) {
            newInterLaws.push([law, [result[1]]]);
          } else {
            newInterLaws.push([law, [result[1], lineCounter--]]);
          }
          var deeperResult = prove(result[0], prems, newInters, newInterLaws, lineCounter, recurseCounter);
          if (deeperResult != false) {
            branches.push(deeperResult);
          }
        }
      }
    }
    if (branches.length > 0) {
      return Utils.shortestArray(branches);
    }
    //GEN, adv-CONJ, and SPEC go here, since they need to access more variables
    if (toProve instanceof OrExpression && toProve.fromGen != true) {
      console.log('Check generalization');
      //GEN
      // p
      // -----
      // p or ...
      var newInters = inters.concat();
      newInters.push(toProve);
      var newInterLaws = interLaws.concat();
      newInterLaws.push(['GEN', [lineCounter--]]);
      for (let subset of Utils.powerSetIter(toProve.subs)) {
        var sub = new OrExpression(subset);
        if (subset.length == 0 || subset.length == toProve.subs.length) {
          continue;
        } else if (subset.length == 1) {
          sub = subset[0];
        }
        sub.fromGen = true; //set this so sub won't be Generalized again.
        //try proving the sub
        var deeperResult = prove(sub, prems, newInters, newInterLaws, lineCounter, recurseCounter);
        if (deeperResult != false) {
          branches.push(deeperResult);
        }
      }
      if (branches.length > 0) {
        return Utils.shortestArray(branches);
      }
    }
    if (toProve instanceof AndExpression && toProve.fromConj != true) {
      console.log('Check advanced conjunction');
      //Advanced CONJ
      // ... p
      // ... q
      // ----
      // p and q
      var newInters = inters.concat();
      var newInterLaws = interLaws.concat();

      for (let subset of Utils.powerSetIter(toProve.subs)) {
        var sub = new AndExpression(subset);
        if (subset.length == 0 || subset.length == toProve.subs.length) {
          continue;
        } else if (subset.length == 1) {
          sub = subset[0];
        }
        sub.fromConj = true;
        //try proving the sub
        var deeperResult = prove(sub, prems, newInters, newInterLaws, lineCounter--, recurseCounter);
        if (deeperResult != false) {
          var newInters = deeperResult[0];
          var newInterLaws = deeperResult[1];
          var removeArray = [sub];
          if (sub instanceof AndExpression) {
            removeArray = sub.subs;
          }
          var newToProve = Utils.setSubtract(toProve.subs, removeArray);
          if (newToProve.length == 1) {
            newToProve = newToProve[0];
          } else {
            newToProve = new AndExpression(newToProve);
          }
          var ret = prove(newToProve, prems, newInters, newInterLaws, lineCounter - (newInterLaws.length + interLaws.length), recurseCounter);
          if (ret == false) {
            return false;
          }
          //insert CONJ
          ret[0].splice(-inters.length, 0, toProve);
          ret[1].splice(-inters.length, 0, ['CONJ', [-newInterLaws.length - 1, -newInterLaws.length]]);
          return ret;
        }
      }
    }
    //SPEC
    for (let i = 0; i < prems.length; i++) {
      let prem = prems[i];
      if (prem instanceof AndExpression) {
        var subdivisions = Utils.subdivisions(prem.subs);
        console.log(subdivisions);

        //remove And premise
        var newPrems = prems.concat();
        newPrems[i] = True;
        for (let sub of subdivisions) {
          if (sub.length == 0) {
            //don't care about the empty sub
            continue;
          }
          //add sub
          var newInters = inters.concat();
          var newInterLaws = interLaws.concat();
          for (let inner of sub) {
            newInters.push(inner);
            newInterLaws.push(['SPEC', [(i + 1)]]);
            console.log("SPEC on " + prem + " line " + (i + 1));
          }
          var attempt = prove(toProve, newPrems, newInters, newInterLaws, lineCounter, recurseCounter);
          if (attempt != false) {
            return attempt;
          }
        }
      }
    }
    // for (let i = 0; i < inters.length; i++) {
    //   let inter = inters[i];
    //   if (inter instanceof AndExpression) {
    //     var subdivisions = Utils.subdivisions(inter.subs);
    //     console.log(subdivisions);
    //
    //     //remove And premise
    //     var newInters = inters.concat();
    //     newInters[i] = True;
    //     for (let sub of subdivisions) {
    //       if (sub.length == 0) {
    //         //don't care about the empty sub
    //         continue;
    //       }
    //       //add sub
    //       var newNewInters = newInters.concat();
    //       var newInterLaws = interLaws.concat();
    //       for (let inner of sub) {
    //         newInters.push(inner);
    //         newInterLaws.push(['SPEC', [i + prems.length - 1]])
    //       }
    //       var attempt = prove(toProve, prems, newInters, newInterLaws, lineCounter, recurseCounter);
    //       if (attempt != false) {
    //         return attempt;
    //       }
    //     }
    //
    //   }
    // }
    //No result found
    console.log("Nothing to apply, ejecting branch.");
    return false;
  };

  var applyAll = function(toProve, prems, inters, law) {
    //return [newToProve, lineUsed]
    var resultBranches = [];
    if (law.isSingular()) {
      var result = law.apply(toProve);
      if (result != false) {
        resultBranches.push([result]);
      }
    } else {
      for (var i = 0; i < prems.length; i++) {
        var exp = prems[i];
        var result = law.apply(toProve, exp);
        if (result != false) {
          resultBranches.push([result, i + 1]);
        }
      }
      for (var i = 0; i < inters.length; i++) {
        var exp = inters[i];
        var result = law.apply(toProve, exp);
        if (result != false) {
          resultBranches.push([result, -1 - i]);
        }
      }
    }
    return resultBranches;
  };

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
    return ReverseInferenceLaws;
  };

  const ReverseInferenceLaws = [
    (new function() {
      //Cases
      this.apply = function(toProve, exp) {
        //return false if cannot be applied
        //return newToProve, if applied
        //
        // p -> r
        // q -> r
        // ------
        // (p v q) -> r
        if (toProve instanceof IfExpression && exp instanceof IfExpression) {
          var preProve = toProve.subs[0];
          var postProve = toProve.subs[1];
          var preExp = exp.subs[0];
          var postExp = exp.subs[1];

          if (postExp.equals(postProve) && preProve instanceof OrExpression) {
            if (preProve.contains(preExp)) {
              var remain = [];
              for (let sub of preProve.subs) {
                if (!preExp.equals(sub) && !((preExp instanceof OrExpression) && preExp.contains(sub))) {
                  remain.push(sub);
                }
              }
              var newPre;
              if (remain.length == 0) {
                throw "Empty to remain";
              } else if (remain.length == 1) {
                newPre = remain[0];
              } else {
                newPre = new OrExpression(remain);
              }
              return new IfExpression([newPre, postExp]);
            }
          }
        }
        //Not applicable
        return false;
      };
      this.toString = function() {
        return "CASE";
      };
      this.isSingular = function() {
        return false;
      }
    }),
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
            for (let sub of toProve.subs) {
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
            var remain = [];
            for (let sub of exp.subs) {
              if (!(toProve.equals(sub)) && !((toProve instanceof OrExpression) && toProve.contains(sub))) {
                remain.push(sub);
              }
            }
            if (remain.length == 0) {
              throw "To prove length = 0";
            } else if (remain.length == 1) {
              return new NotExpression(remain);
            } else {
              return new NotExpression([new OrExpression(remain)]);
            }
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
    }),
    (new function() {
      //Transitivity
      this.apply = function(toProve, exp) {
        //return false if cannot be applied
        //return newToProve, if applied
        //
        // p -> q
        // q -> r
        // ------
        // p -> r
        if (toProve instanceof IfExpression && exp instanceof IfExpression) {
          var preProve = toProve.subs[0];
          var preExp = exp.subs[0];
          var postProve = toProve.subs[1];
          var postExp = exp.subs[1];
          if (postProve.equals(postExp) && !preProve.equals(preExp)) {
            return new IfExpression([preProve, preExp]);
          }
        }
        //Not applicable
        return false;
      };
      this.toString = function() {
        return "TRANS";
      };
      this.isSingular = function() {
        return false;
      }
    })
  ];
}