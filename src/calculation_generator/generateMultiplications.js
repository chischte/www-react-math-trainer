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
    var calculationsArray=[[],[]];
    var i;
    for (i = 1; i <= 10; i++) {
      calculationsArray[0].push(i+" x " + range + "=");
      calculationsArray[1].push(i * range);
    }
    return calculationsArray;
  }

}
