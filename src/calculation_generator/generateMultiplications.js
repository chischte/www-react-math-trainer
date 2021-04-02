export default class GenerateMultiplications {
  maxSum = 100;
  maxMinuend = 100;
  maxFactor = 10;
  maxDividendQuotient = 10;

  constructor() {}

  generateNewCalculation(level, range) {
    if (level === "1") {
      this.generateMultiplicationLevel1(range);
    }
  }

  generateMultiplication(range) {
    var questionArray=[[],[]];
    var solutionArray;
    var i;
    for (i = 1; i < 10; i++) {
      questionArray[0].push(i+" x " + range + "=");
      questionArray[1].push(i * range);
    }
    return questionArray;
  }

}
