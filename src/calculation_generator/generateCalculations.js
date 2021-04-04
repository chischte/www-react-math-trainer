import { DisciplineEnum } from "../enums/Enums";

export default class GenerateCalculations {
  constructor() {
    this.questionArray = [];
    this.solutionArray = [];
    this.numberOfQuestions = 0;
  }

  generateCalculations(discipline, level, range) {
    this.questionArray = [];
    this.solutionArray = [];
    this.numberOfQuestions = 0;

    switch (discipline) {
      case DisciplineEnum.addition:
        break;
      case DisciplineEnum.subtraction:
        break;
      case DisciplineEnum.multiplication:
        this.generateMultiplications(level, range);
        break;
      case DisciplineEnum.division:
        this.generateDivisions(level, range);
        break;
      default:
        alert("invalid discipline");
        break;
    }
  }

  generateMultiplications(level, range) {
    switch (level) {
      case "level=1":
        this.generateMultiplicationsLevel1(range);
        break;
      case "level=2":
        this.generateMultiplicationsLevel2(range);
        break;
      case "level=drill":
        this.generateMultiplicationsLevelDrill(range);
        break;
      default:
        alert("invalid level");
        break;
    }
  }
  generateDivisions(level, range) {
    switch (level) {
      case "level=1":
        this.generateDivisionsLevel1(range);
        break;
      case "level=2":
        this.generateDivisionsLevel2(range);
        break;
      case "level=drill":
        this.generateDivisionsLevelDrill(range);
        break;
      default:
        alert("invalid level");
        break;
    }
  }

  generateMultiplicationsLevel1(range) {
    for (var i = 1; i <= 2; i++) {
      this.questionArray.push(i + "x" + range);
      var solution = i * range;
      this.solutionArray.push(solution + "");
      this.numberOfQuestions++;
    }
  }
  generateMultiplicationsLevel2(range) {
    for (var i = 10; i >= 9; i--) {
      this.questionArray.push(i + "x" + range);
      var solution = i * range;
      this.solutionArray.push(solution + "");
      this.numberOfQuestions++;
    }
  }

  generateMultiplicationsLevelDrill(range) {
    var pseudoRandomArray = [9, 2, 7, 4, 8, 1, 3, 10, 6, 5];

    pseudoRandomArray.forEach((randomFactor) => {
      this.questionArray.push(randomFactor + "x" + range);
      var solution = randomFactor * range;
      this.solutionArray.push(solution + ""); //""to store mark it as string
      this.numberOfQuestions++;
    });
  }

  generateDivisionsLevel1(range) {}

  generateDivisionsLevel2(range) {}

  generateDivisionsLevelDrill(range) {}

  // Getter:

  getQuestionArray() {
    return this.questionArray;
  }
  getSolutionArray() {
    return this.solutionArray;
  }
  getNumberOfQuestions() {
    return this.numberOfQuestions;
  }
}
