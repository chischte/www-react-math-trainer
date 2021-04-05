export default class GenerateCalculations {
  constructor() {
    this.questionArray = [];
    this.solutionArray = [];
  }

  //#region EVALUATE DISCIPLINE AND LEVEL --------------------------------------
  generateCalculations(discipline, level, range) {
    this.questionArray = [];
    this.solutionArray = [];

    switch (discipline) {
      case "addition":
        this.generateAdditions(level);
        break;
      case "subtraction":
        this.generateSubtractions(level);
        break;
      case "multiplication":
        this.generateMultiplications(level, range);
        break;
      case "division":
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
      case "big_jump":
        this.generateAdditionsBigJump();
        break;
      default:
        alert("invalid level");
        break;
    }
  }
  generateSubtractions(level) {
    switch (level) {
      case "step":
        this.generateSubtractionsStep();
        break;
      case "jump":
        this.generateSubtractionsJump();
        break;
      case "big_jump":
        this.generateSubtractionsBigJump();
        break;
      default:
        alert("invalid level");
        break;
    }
  }

  generateMultiplications(level, range) {
    switch (level) {
      case "level1":
        this.generateMultiplicationsLevel1(range);
        break;
      case "level2":
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
      case "level1":
        this.generateDivisionsLevel1(range);
        break;
      case "level2":
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
  //#endregion

  //#region ADDITIONS ----------------------------------------------------------

  generateAdditionsStep() {
    /**
     * Generates additions where the oner-digits do not sum up to more than 10,
     * and the second addend is smaller than 10.
     * E.g. 5+2=7, 15+5=20, 36+3=39, ...
     *
     * Naming: -------> Addend1 + Addend2 = Sum
     * Base: ---------> (1-8)   + (1-9)   = (1-9)
     * RandomTenner: -> 10, 20, 30,... 90
     */

    const numberOfCalculations = 20;

    while (this.questionArray.length < numberOfCalculations) {
      const minAddend1 = 1;
      const maxAddend1 = 8;
      this.addend1 = Math.floor(
        Math.random() * (maxAddend1 - minAddend1 + 1) + minAddend1
      );

      const minAddend2 = 1;
      const maxAddend2 = 10 - this.addend1;
      this.addend2 = Math.floor(
        Math.random() * (maxAddend2 - minAddend2 + 1) + minAddend2
      );

      // Add random tenner digits:
      this.randomTenner = Math.floor(Math.random() * 10) * 10;
      this.addend1 += this.randomTenner;

      this.questionString = `${this.addend1} + ${this.addend2}`;
      this.solution = this.addend1 + this.addend2;

      if (!this.questionArray.includes(this.questionString)) {
        this.solutionArray.push(this.solution + "");
        this.questionArray.push(this.questionString);
      }
    }
  }
  generateAdditionsJump() {
    /**
     * Generates additions that do exceed one tenner by one but
     * the second digit is maximum 9
     * E.g. 5+6=11, 19+2=21, 63+8=72, ...
     * Naming: -------> Addend1 + Addend2 = Sum
     * Base: ---------> (2-89)  + (1-9)   = (11-98)
     * RandomTenner: -> 10, 20, 30,... 90
     */

    const numberOfCalculations = 15;

    while (this.questionArray.length < numberOfCalculations) {
      const minAddend1 = 2;
      const maxAddend1 = 9;
      this.addend1 = Math.floor(
        Math.random() * (maxAddend1 - minAddend1 + 1) + minAddend1
      );

      const minAddend2 = 11 - this.addend1;
      const maxAddend2 = 9;
      this.addend2 = Math.floor(
        Math.random() * (maxAddend2 - minAddend2 + 1) + minAddend2
      );

      // Add random tenner digits:
      this.randomTenner = Math.floor(Math.random() * 9) * 10;
      this.addend1 += this.randomTenner;

      this.questionString = `${this.addend1} + ${this.addend2}`;
      this.solution = this.addend1 + this.addend2;

      if (!this.questionArray.includes(this.questionString)) {
        this.solutionArray.push(this.solution + "");
        this.questionArray.push(this.questionString);
      }
    }
  }
  generateAdditionsBigJump() {
    /**
     * Generates additions where the oner-digits of the addends sum up to
     * at least 11, and both addends are at least 11.
     * E.g. 15+16=31, 64+18=82, ...
     * Naming: -------> Addend1 + Addend2 = Sum
     * Base: ---------> (2-89)  + (1-9)   = (11-98)
     * RandomTenner: -> 10, 20, 30,... 90
     */
    const numberOfCalculations = 10;

    while (this.questionArray.length < numberOfCalculations) {
      const minAddend1 = 2;
      const maxAddend1 = 9;
      this.addend1 = Math.floor(
        Math.random() * (maxAddend1 - minAddend1 + 1) + minAddend1
      );

      const minAddend2 = 11 - this.addend1;
      const maxAddend2 = 9;
      this.addend2 = Math.floor(
        Math.random() * (maxAddend2 - minAddend2 + 1) + minAddend2
      );

      //Add random tenner digits:
      this.randomTenner1 = Math.floor(Math.random() * 7) + 1;
      this.addend1 += this.randomTenner1 * 10;

      this.randomTenner2 =
        Math.floor(Math.random() * (7 - this.randomTenner1)) + 1;
      this.addend2 += this.randomTenner2 * 10;

      this.questionString = `${this.addend1} + ${this.addend2}`;
      this.solution = this.addend1 + this.addend2;

      if (!this.questionArray.includes(this.questionString)) {
        this.solutionArray.push(this.solution + "");
        this.questionArray.push(this.questionString);
      }
    }
  }
  //#endregion

  //#region SUBTRACTIONS -------------------------------------------------------

  generateSubtractionsStep() {
    /**
     * Generates subtractions without a tenner jump
     * E.g. 15-2=13, 79-8=71, ...
     */

    const numberOfCalculations = 20;

    while (this.questionArray.length < numberOfCalculations) {
      const minMinuend = 2;
      const maxMinuend = 10;
      this.minuend = Math.floor(
        Math.random() * (maxMinuend - minMinuend + 1) + minMinuend
      );

      const minSubtrahend = 1;
      const maxSubtrahend = this.minuend - 1;
      this.subtrahend = Math.floor(
        Math.random() * (maxSubtrahend - minSubtrahend + 1) + minSubtrahend
      );

      // Add random tenner digits:
      this.randomTenner = Math.floor(Math.random() * 10) * 10;
      this.minuend += this.randomTenner;

      this.questionString = `${this.minuend} - ${this.subtrahend}`;
      this.solution = this.minuend - this.subtrahend;

      if (!this.questionArray.includes(this.questionString)) {
        this.solutionArray.push(this.solution + "");
        this.questionArray.push(this.questionString);
      }
    }
  }
  generateSubtractionsJump() {
    /**
     * Generates subtractions that "jump" over a tenner but
     * the second digit is maximum 9
     * E.g. 15-6=9, 68-9=59, ...
     *
     * Naming: -------> Minuend - Subtrahend = Difference
     * Base: ---------> (10-18) - (1-9)      = (1-9)
     * RandomTenner:--> 10, 20, 30,... 80
     */
    const numberOfCalculations = 15;

    while (this.questionArray.length < numberOfCalculations) {
      const minMinuend = 10;
      const maxMinuend = 18;
      this.minuend = Math.floor(
        Math.random() * (maxMinuend - minMinuend + 1) + minMinuend
      );

      const minSubtrahend = this.minuend - 9;
      const maxSubtrahend = 9;
      this.subtrahend = Math.floor(
        Math.random() * (maxSubtrahend - minSubtrahend + 1) + minSubtrahend
      );

      // Add random tenner digits:
      this.randomTenner = Math.floor(Math.random() * 9) * 10;
      this.minuend += this.randomTenner;

      this.questionString = `${this.minuend} - ${this.subtrahend}`;
      this.solution = this.minuend - this.subtrahend;

      if (!this.questionArray.includes(this.questionString)) {
        this.solutionArray.push(this.solution + "");
        this.questionArray.push(this.questionString);
      }
    }
  }
  generateSubtractionsBigJump() {
    /**
     * Generates subtractions where the oner of the subtrahend
     * is at list one bigger than the oner of the minuend
     * and the subtrahend is at least 11
     * E.g. 25-16=9, 67+29=38, ...
     *
     * Naming: -------> Minuend  - Subtrahend = Difference
     * Base: ---------> (0-8)    - (2-9)      =
     * RandomTenner:--> (20..80)   (10... 80)
     */

    const numberOfCalculations = 10;

    while (this.questionArray.length < numberOfCalculations) {
      // Minuend oner:
      const minOnerMinuend = 0;
      const maxOnerMinuend = 8;
      this.minuendOner = Math.floor(
        Math.random() * (maxOnerMinuend - minOnerMinuend + 1) + minOnerMinuend
      );

      // Subtrahend oner:
      const minSubtrahendOner = this.minuendOner + 1;
      const maxSubtrahendOner = 9;
      this.subtrahendOner = Math.floor(
        Math.random() * (maxSubtrahendOner - minSubtrahendOner + 1) +
          minSubtrahendOner
      );

      // Minuend tenner:
      const minMinuendTenner = 3;
      const maxMinuendTenner = 8;
      this.minuendTenner = Math.floor(
        Math.random() * (maxMinuendTenner - minMinuendTenner + 1) +
          minMinuendTenner
      );
      this.minuend = this.minuendOner + this.minuendTenner * 10;

      // Subtrahend tenner:
      const minSubtrahendTenner = 1;
      const maxSubtrahendTenner = this.minuendTenner - 2;
      this.subtrahendTenner = Math.floor(
        Math.random() * (maxSubtrahendTenner - minSubtrahendTenner + 1) +
          minSubtrahendTenner
      );
      this.subtrahend = this.subtrahendOner + this.subtrahendTenner * 10;

      // Generate question and solution strings:
      this.questionString = `${this.minuend} - ${this.subtrahend}`;
      this.solution = `${this.minuend - this.subtrahend}`;

      // Avoid duplicates:
      if (!this.questionArray.includes(this.questionString)) {
        this.questionArray.push(this.questionString);
        this.solutionArray.push(this.solution + "");
      }
    }
  }
  //#endregion

  //#region MULTIPLICATIONS ----------------------------------------------------

  generateMultiplicationsLevel1(range) {
    for (var i = 1; i <= 3; i++) {
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
  //#endregion

  //#region DIVISIONS ----------------------------------------------------------

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
  //#endregion

  // Getter:

  getQuestionArray() {
    return this.questionArray;
  }
  getSolutionArray() {
    return this.solutionArray;
  }
}
