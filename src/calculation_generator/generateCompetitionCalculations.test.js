import GenerateCalculations from "./generateCompetitionCalculations";

const generateCalculations = new GenerateCalculations();

const solveQuestion = (question) => {
  var splitQuestion = question.split(" ");
  var firstOperand = parseInt(splitQuestion[0]);
  var operator = splitQuestion[1];
  var secondOperand = parseInt(splitQuestion[2]);
  var result;

  switch (operator) {
    case "+":
      result = firstOperand + secondOperand;
      break;
    case "-":
      result = firstOperand - secondOperand;
      break;
    case "x":
      result = firstOperand * secondOperand;
      break;
    case ":":
      result = firstOperand / secondOperand;
      break;
  }

  var resultString = result.toString();
  return resultString;
};

test("competition generator returns valid addition", () => {
  generateCalculations.generateNewCalculation("addition");
  var generatedQuestion = generateCalculations.getQuestion();
  var generatedSolution = generateCalculations.getSolution();

  var solvedQuestion = solveQuestion(generatedQuestion);

  expect(solvedQuestion).toBe(generatedSolution);
});

test("competition generator returns valid subtraction", () => {
  generateCalculations.generateNewCalculation("subtraction");
  var generatedQuestion = generateCalculations.getQuestion();
  var generatedSolution = generateCalculations.getSolution();

  var solvedQuestion = solveQuestion(generatedQuestion);

  expect(solvedQuestion).toBe(generatedSolution);
});

test("competition generator returns valid multiplication", () => {
  generateCalculations.generateNewCalculation("multiplication");
  var generatedQuestion = generateCalculations.getQuestion();
  var generatedSolution = generateCalculations.getSolution();

  var solvedQuestion = solveQuestion(generatedQuestion);

  expect(solvedQuestion).toBe(generatedSolution);
});

test("competition generator returns valid subtraction", () => {
  generateCalculations.generateNewCalculation("division");
  var generatedQuestion = generateCalculations.getQuestion();
  var generatedSolution = generateCalculations.getSolution();

  var solvedQuestion = solveQuestion(generatedQuestion);

  expect(solvedQuestion).toBe(generatedSolution);
});
