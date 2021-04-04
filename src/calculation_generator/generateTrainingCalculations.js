import { DisciplineEnum } from "../enums/Enums";

export default class GenerateCalculations {
  constructor() {
    this.questionArray = [];
    this.solutionArray = [];
  }

  generateCalculations(discipline, level, range) {
    this.questionArray = [];
    this.solutionArray = [];

    switch (discipline) {
      case DisciplineEnum.addition:
        this.generateAdditions(level);
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
        alert("invalid discipline" + discipline);
        break;
    }
  }

  generateAdditions(level) {
    switch (level) {
      case "step":
        this.generateAdditionsStep();
        break;
      case "jump":
        this.generateAdditionsJump();
        break;
      case "big jump":
        this.generateAdditionsBigJump();
        break;
      default:
        alert("invalid level");
        break;
    }
  }

  generateMultiplications(level, range) {
    switch (level) {
      case "1":
        this.generateMultiplicationsLevel1(range);
        break;
      case "2":
        this.generateMultiplicationsLevel2(range);
        break;
      case "drill":
        this.generateMultiplicationsLevelDrill(range);
        break;
      default:
        alert("invalid level");
        break;
    }
  }

  generateDivisions(level, range) {
    switch (level) {
      case "1":
        this.generateDivisionsLevel1(range);
        break;
      case "2":
        this.generateDivisionsLevel2(range);
        break;
      case "drill":
        this.generateDivisionsLevelDrill(range);
        break;
      default:
        alert("invalid level");
        break;
    }
  }
  // ADDITIONS -----------------------------------------------------------------

  generateAdditionsStep() {
    // Generates additions that do not exceed the current tenner.
    // E.g. 5+2, 1+4, 3+6, ...
    //
    // Naming: -------> Addend1 + Addend2 = Sum
    // Base:          > (1-8)   + (1-9)   = (1-9)
    //
    // RandomTenner: 10, 20, 30,... 90

    const numberOfCalculations = 20;

    while (this.questionArray.length < numberOfCalculations) {
      const minAddend1 = 1;
      const maxAddend1 = 8;
      this.addend1 = Math.floor(
        Math.random() * (maxAddend1 - minAddend1 + 1) + minAddend1
      );

      const minAddend2 = 1;
      const maxAddend2 = 9 - this.addend1;
      this.addend2 = Math.floor(
        Math.random() * (maxAddend2 - minAddend2 + 1) + minAddend2
      );

      // Add random tenner digits:
      this.randomTenner = Math.floor(Math.random() * 10) * 10;
      this.addend1 += this.randomTenner;

      this.questionString = `${this.addend1} + ${this.addend2}`;
      this.solution = this.addend1 + this.addend2;

      if (!this.questionArray.includes(this.questionString)) {
        this.solutionArray.push(this.solution+"");
        this.questionArray.push(this.questionString);
      }
    }
  }
  generateAdditionsJump() {}
  generateAdditionsBigJump() {}

  // SUBTRACTIONS --------------------------------------------------------------
  // MULTIPLICATIONS -----------------------------------------------------------

  generateMultiplicationsLevel1(range) {
    for (var i = 1; i <= 10; i++) {
      this.questionArray.push(i + "×" + range);
      var solution = i * range;
      this.solutionArray.push(solution + "");
    }
  }
  generateMultiplicationsLevel2(range) {
    for (var i = 10; i >= 1; i--) {
      this.questionArray.push(i + "×" + range);
      var solution = i * range;
      this.solutionArray.push(solution + ""); //""to mark it as string
    }
  }

  generateMultiplicationsLevelDrill(range) {
    var pseudoRandomArray = [9, 2, 7, 4, 8, 1, 3, 10, 6, 5];

    pseudoRandomArray.forEach((randomFactor) => {
      this.questionArray.push(randomFactor + "×" + range);
      var solution = randomFactor * range;
      this.solutionArray.push(solution + ""); //""to mark it as string
    });
  }

  // DIVISIONS -----------------------------------------------------------------

  // Naming: --> Divisor : Dividend = Quotient

  generateDivisionsLevel1(range) {
    for (var i = 1; i <= 10; i++) {
      var quotient = i;
      var dividend = range;
      var divisor = quotient * dividend;
      this.solutionArray.push(quotient + "");
      this.questionArray.push(divisor + "÷" + dividend);
    }
  }

  generateDivisionsLevel2(range) {
    for (var i = 10; i >= 1; i--) {
      var quotient = i;
      var dividend = range;
      var divisor = quotient * dividend;
      this.solutionArray.push(quotient + "");
      this.questionArray.push(divisor + "÷" + dividend);
    }
  }

  generateDivisionsLevelDrill(range) {
    var pseudoRandomArray = [9, 2, 7, 4, 8, 1, 3, 10, 6, 5];

    pseudoRandomArray.forEach((quotient) => {
      var dividend = range;
      var divisor = quotient * dividend;
      this.solutionArray.push(quotient + "");
      this.questionArray.push(divisor + "÷" + dividend);
    });
  }

  // Getter:

  getQuestionArray() {
    return this.questionArray;
  }
  getSolutionArray() {
    return this.solutionArray;
  }
}
