export default class GenerateMultiplications {
  maxSum = 100;
  maxMinuend = 100;
  maxFactor = 10;
  maxDividendQuotient = 10;

  constructor() {
    this.questionArray=[];
    this.solutionArray=[];
    this.numberOfQuestions=0;
  }

  generateCalculations(level, range) {
    if (level === "1") {
      this.generateCalculationsLevel1(range);
    }
  }

  generateCalculationsLevel1(range) {
    var i;
    for (i = 1; i <= 10; i++) {
      this.questionArray.push(i+"x"+range);
      var solution =i*range;
      this.solutionArray.push(solution+"");
      this.numberOfQuestions++;
    }
  }

  // Getter:

  getQuestionArray()
  {
    return this.questionArray
  }
  getSolutionArray(){
    return this.solutionArray;
  }
  getNumberOfQuestions(){
    return this.numberOfQuestions;
  }

}
