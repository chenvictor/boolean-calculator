const Inference2 = new function() {

  /*
   *  Inference2 attempts to prove statements through a graph breadth first traversal method.
   */

  const MAX_DEPTH = 50;

  this.prove = function(exps) {
    console.clear();
    var toProve = exps.shift(); //Initial statement to prove
    var prems = exps.concat(); //Initial predicates
    var inters = []; //Intermediary steps used
    var interLaws = [];
    //check conclusion == true
    if (toProve.equals(True)) {
      throw "Conclusion is Tautology";
    }

    //check prems
    for (var i = 0; i < prems.length; i++) {
      var prem = prems[i];
      if (prem.equals(toProve)) {
        inters.push(prem);
        interLaws.push(["From Premise", [i + 1]]);
        return [inters, interLaws];
      }
    }
    return prove(toProve, prems, [inters], [interLaws]);
  };

  var prove = function(toProve, prems, allInters, allInterLaws, depth = 0) {
    if (depth > MAX_DEPTH) {
      console.log("Too deep");
      return false;
    }
    if (allInters.length == 0) {
      //empty basecase
      return false;
    }
    var newAllInters = [];
    var newAllInterLaws = [];
    //Iterate over all allInters
    for (var i = 0; i < allInters.length; i++) {
      var inters = allInters[i];
      var interLaws = allInterLaws[i];
      //Iterate over all sets of lines
      var numLines = prems.length + inters.length;
      for (var j = 0; j < numLines; j++) {
        for (var k = 0; k < numLines; k++) {
          var line1 = (j < prems.length ? prems[j] : inters[j - prems.length]);
          if (j == k) {
            //Same line
            //Use SingleLineInferenceLaws
            for (let law of SingleLineInferenceLaws) {
              var attempts = law.apply(line1);
              if (attempts != false) {
                for (let attempt of attempts) {
                  if (!inters.includes(attempt)) {
                    newInters = inters.concat();
                    newInterLaws = interLaws.concat();
                    newInters.push(attempt);
                    newInterLaws.push([law.toString(), [j + 1]]);
                    if (attempt.equals(toProve)) {
                      //first one to reach toProve is (one of) the least num steps
                      newInters[newInters.length - 1] = toProve;
                      return [newInters, newInterLaws];
                    } else {
                      if (notIn(newAllInters, newInters)) {
                        newAllInters.push(newInters);
                        newAllInterLaws.push(newInterLaws);
                      }
                    }
                  }
                }
              }
            }
          } else {
            //Diff line
            var line2 = (k < prems.length ? prems[k] : inters[k - prems.length]);
            if (line2.equals(line1)) {
              //if duplicate lines exists, ignore
              continue;
            }
            //Use DoubleLineInferenceLaws
            for (let law of DoubleLineInferenceLaws) {
              var attempt = law.apply(line1, line2);
              if (attempt != false && !inters.includes(attempt)) {
                newInters = inters.concat();
                newInterLaws = interLaws.concat();
                newInters.push(attempt);
                newInterLaws.push([law.toString(), [j + 1, k + 1]]);
                if (attempt.equals(toProve)) {
                  //first one to reach toProve is (one of) the least num steps
                  return [newInters, newInterLaws];
                } else {
                  if (notIn(newAllInters, newInters)) {
                    newAllInters.push(newInters);
                    newAllInterLaws.push(newInterLaws);
                  }
                }
              }
            }
          }
        }
      }
    }
    return prove(toProve, prems, newAllInters, newAllInterLaws, depth + 1);
  };

  var notIn = function(arrayOfInters, inter) {
    for (let int of arrayOfInters) {
      if (interEquals(int, inter)) {
        return false;
      }
    }
    return true;
  };

  var interEquals = function(inter1, inter2) {
    if (inter1.length != inter2.length) {
      return false;
    }
    for (let part of inter1) {
      if (!inter2.includes(part)) {
        return false;
      }
    }
    return true;
  }

  const DoubleLineInferenceLaws = [
    (new function() {
      this.apply = function(line1, line2) {
        //return false or result of application
        if (line1 instanceof IfExpression) {
          if (line1.subs[0].equals(line2)) {
            return line1.subs[1];
          }
        }
        return false;
      };
      this.toString = function(short = Settings.isShort()) {
        if (short) {
          return "M.PON";
        } else {
          return "Modus Ponens";
        }
      };
    }),
    (new function() {
      this.apply = function(line1, line2) {
        //return false or result of application
        if (line1 instanceof IfExpression) {
          if (equalsNegation(line1.subs[1], line2)) {
            return negation(line1.subs[0]);
          }
        }
        return false;
      };
      this.toString = function(short = Settings.isShort()) {
        if (short) {
          return "M.TOL";
        } else {
          return "Modus Tollens";
        }
      };
    }),
    (new function() {
      this.apply = function(line1, line2) {
        //return false or result of application
        if (line1 instanceof IfExpression || line2 instanceof IfExpression) {
          return false;
        }
        if (line1.equals(line2)) {
          return false;
        }
        return andCombine(line1, line2);
      };
      this.toString = function(short = Settings.isShort()) {
        if (short) {
          return "CONJ";
        } else {
          return "Conjuction";
        }
      };
    }),
    (new function() {
      this.apply = function(line1, line2) {
        if (line1 instanceof OrExpression) {
          var nline2 = negation(line2);
          if (line1.contains(nline2)) {
            var newSubs = Utils.setSubtract(line1.subs, [nline2]);
            if (newSubs.length == 1) {
              return newSubs[0];
            } else {
              return new OrExpression(newSubs);
            }
          }
        }
        return false;
      };
      this.toString = function(short = Settings.isShort()) {
        if (short) {
          return "ELIM";
        } else {
          return "Elimination";
        }
      };
    }),
    (new function() {
      this.apply = function(line1, line2) {
        if (line1.equals(line2)) {
          return false;
        }
        if (line1 instanceof IfExpression) {
          if (line2 instanceof IfExpression) {
            if (line1.subs[1].equals(line2.subs[0])) {
              return new IfExpression([line1.subs[0], line2.subs[1]]);
            }
          }
        }
        return false;
      };
      this.toString = function(short = Settings.isShort()) {
        if (short) {
          return "TRANS";
        } else {
          return "Transitivity";
        }
      };
    }),
    (new function() {
      this.apply = function(line1, line2) {
        if (line1 instanceof IfExpression) {
          if (line2 instanceof IfExpression) {
            if (line1.subs[1].equals(line2.subs[1])) {
              return new IfExpression([orCombine(line1.subs[0], line2.subs[0]), line1.subs[1]]);
            }
          }
        }
        return false;
      };
      this.toString = function(short = Settings.isShort()) {
        if (short) {
          return "CASE";
        } else {
          return "Proof by cases";
        }
      };
    }),
    (new function() {
      this.apply = function(line1, line2) {
        //Resolution with IfExpression
        if (line1 instanceof IfExpression) {
          if (line2 instanceof IfExpression) {
            if (equalsNegation(line1.subs[0], line2.subs[0])) {
              return orCombine(line1.subs[1], line2.subs[1]);
            }
          }
        }
        //Resolution with OrExpression
        if (line1 instanceof OrExpression && line1.subs.length == 2) {
          if (line2 instanceof OrExpression && line2.subs.length == 2) {
            var l1s1 = line1.subs[0];
            var l1s2 = line1.subs[1];
            var l2s1 = line2.subs[0];
            var l2s2 = line2.subs[1];
            if (equalsNegation(l1s1, l2s1)) {
              return new OrExpression([l1s2, l2s2]);
            } else if (equalsNegation(l1s1, l2s2)) {
              return new OrExpression([l1s2, l2s1]);
            } else if (equalsNegation(l1s2, l2s1)) {
              return new OrExpression([l1s1, l2s2]);
            } else if (equalsNegation(l1s2, l2s2)) {
              return new OrExpression([l1s1, l2s1]);
            }
          }
        }
        return false;
      };
      this.toString = function(short = Settings.isShort()) {
        if (short) {
          return "RES";
        } else {
          return "Resolution";
        }
      };
    })
  ];

  const SingleLineInferenceLaws = [
    (new function() {
      this.apply = function(line) {
        //Only apply to variables and OrExpression
        if (line instanceof Variable) {
          var toRet = [];
          toRet.push(new IfExpression([Generic, line])); // p -> ... -> p
          toRet.push(new IfExpression([negation(line), Generic])); // p -> ~p -> ...
          for (let variable of VariableManager.getVariables()) {
            if (!variable.equals(line) && !equalsNegation(variable, line)) {
              toRet.push(new OrExpression([line, variable])); // p -> p or ...
              toRet.push(new OrExpression([line, negation(variable)])); // p -> p or not ...
            }
          }
          return toRet;
        } else if (line instanceof OrExpression) {
          var toRet = [];
          for (let variable of VariableManager.getVariables()) {
            if (!line.contains(variable) && !line.contains(negation(variable))) {
              toRet.push(new OrExpression(Utils.setAdd(line.subs, [variable])));
              toRet.push(new OrExpression(Utils.setAdd(line.subs, [negation(variable)])));
            }
          }
          return toRet;
        }
        return false;
      };
      this.toString = function(short = Settings.isShort()) {
        if (short) {
          return "GEN";
        } else {
          return "Generalization";
        }
      };
    }),
    (new function() {
      this.apply = function(line) {
        if (line instanceof AndExpression) {
          var toRet = [];
          var specs = Utils.subdivisions(line.subs);
          for (let spec of specs) {
            if (spec.length == 1) {
              toRet.push(spec[0]);
            } else if (spec.length > 1) {
              toRet.push(new AndExpression(spec));
            }
          }
          return toRet;
        }
        return false;
      };
      this.toString = function(short = Settings.isShort()) {
        if (short) {
          return "SPEC";
        } else {
          return "Specialization";
        }
      };
    })
  ];
}