function assertEquals(expected, actual) {
  var equals = expected.toString() == actual.toString();
  if (!equals) {
    var lineNum = (new Error()).stack.split("\n")[2].split(":")[3];
    throw "AssertEquals failed (Line " + lineNum + "). Expected: " + expected.toString() + " Actual: " + actual.toString();
    //throw [lineNum, expected.toString(), actual.toString()];
  }
}

function runTests() {
  console.log("Running Tests");
  var passCount = 0;
  for (var i = 0; i < TestSuite.length; i++) {
    var test = TestSuite[i];
    VariableManager.clear();
    try {
      test();
      passCount++;
    } catch (err) {
      console.log(err);
      // console.log("Test Failed: Line #" + err[0]);
      // console.log("    Expected Output:  " + err[1]);
      // console.log("    Actual Output:    " + err[2]);
    }
  }
  console.log(passCount + "/" + TestSuite.length + " tests passed.");
}
const TestSuite = [
  function commutativeTest() {
    assertEquals(Parser.parse("a or b"),
      commutative(Parser.parse("b or a")));
    assertEquals(Parser.parse("a and b"),
      commutative(Parser.parse("b and a")));
    assertEquals(Parser.parse("a and (b or c)"),
      commutative(Parser.parse("(b or c) and a")));
    assertEquals(Parser.parse("a or -b"),
      commutative(Parser.parse("-b or a")));
  },
  function associativeTest() {
    assertEquals(Parser.parse("a or b or c"),
      associative(Parser.parse("a or (b or c)")));
    assertEquals(Parser.parse("a or b or c"),
      associative(Parser.parse("(a or b) or c")));
    assertEquals(Parser.parse("a and b and c"),
      associative(Parser.parse("(a and b) and c")));
    assertEquals(Parser.parse("a and b and c"),
      associative(Parser.parse("(a and b) and c")));
  },
  function distributiveTest() {
    assertEquals(Parser.parse("(p ∧ q) ∨ (p ∧ r)"),
      distributive(Parser.parse("p ∧ (q ∨ r)")));
    assertEquals(Parser.parse("(p ∨ q) ∧ (p ∨ r)"),
      distributive(Parser.parse("p ∨ (q ∧ r)")));
  },
  function identityTest() {
    assertEquals(Parser.parse("a"),
      identity(Parser.parse("a or F")));
    assertEquals(Parser.parse("a"),
      identity(Parser.parse("a and T")));
  },
  function containsTest() {
    var v1 = Parser.parse("a and b and c");
    var v2 = Parser.parse("a and b");
    var v3 = Parser.parse("a");
    var v4 = Parser.parse("a or b");
    var v5 = Parser.parse("c and d");
    assertEquals(true, v1.contains(v2));
    assertEquals(true, v1.contains(v3));
    assertEquals(false, v1.contains(v4));
    assertEquals(false, v1.contains(v5));
  },
  function absorptionTest() {
    assertEquals(Parser.parse("a and b"),
      absorption(Parser.parse("(a and b) or (a and b and c)")));
    assertEquals(Parser.parse("a or b"),
      absorption(Parser.parse("(a or b) and (a or b or c)")));
  }
];

function test() {
  //testing function

}