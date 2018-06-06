function assertEquals(expected, actual) {
  var equals = expected.toString() == actual.toString();
  if (!equals) {
    var lineNum = (new Error()).stack.split("\n")[2].split(":")[3];
    throw [lineNum, expected.toString(), actual.toString()];
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
      console.log("Test Failed: Line #" + err[0]);
      console.log("    Expected Output:  " + err[1]);
      console.log("    Actual Output:    " + err[2]);
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
  }
];