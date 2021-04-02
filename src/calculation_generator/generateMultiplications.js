export default class GenerateMultiplications {
  
  constructor() {
    this.questionArray = [];
    this.solutionArray = [];
    this.numberOfQuestions = 0;
  }

  generateCalculations(level, range) {
    this.questionArray = [];
    this.solutionArray = [];
    this.numberOfQuestions = 0;
    
    if (level === "1") {
      this.generateCalculationsLevel1(range);
    }
    if (level === "2") {
      this.generateCalculationsLevel2(range);
    }
  }

  generateCalculationsLevel1(range) {
    for (var i = 1; i <= 2; i++) {
      this.questionArray.push(i + "x" + range);
      var solution = i * range;
      this.solutionArray.push(solution + "");
      this.numberOfQuestions++;
    }
  }
  generateCalculationsLevel2(range) {
    for (var i = 10; i >= 9; i--) {
      this.questionArray.push(i + "x" + range);
      var solution = i * range;
      this.solutionArray.push(solution + "");
      this.numberOfQuestions++;
    }
  }

  // Getter:

  getQuestionArray() {
    console.log(this.questionArray);
    return this.questionArray;
  }
  getSolutionArray() {
    return this.solutionArray;
  }
  getNumberOfQuestions() {
    return this.numberOfQuestions;
  }
}
