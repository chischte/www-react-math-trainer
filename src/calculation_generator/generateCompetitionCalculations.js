export default class GenerateCalculations {
  maxSum = 100;
  maxMinuend = 100;
  maxFactor = 10;
  maxDividendQuotient = 10;

  constructor() {
    this.randomNum = '5';
    this.questionString = 'SELECT MODE';
    this.solution = '4';
  }

  generateNewCalculation(mode) {
    if (mode === 'addition') {
      this.generateAddition();
    }
    else if (mode === 'subtraction') {
      this.generateSubstraction()
    }
    else if (mode === 'multiplication') {
      this.generateMultiplication()
    }
    else if (mode === 'division') {
      this.generateDivision()
    }
    else if (mode === 'stepDrill') {
      this.generateStepDrill()
    }
    else if (mode === 'jumpDrill') {
      this.generateJumpDrill()
    }
    else if (mode === 'eyeDrill') {
      this.generateEyeDrill()
    }else {
      alert("invalid mode calculation generator");
    }

  }

  generateAddition() {
    // Naming: --> Addend  + Addend  = Sum
    //           > (1-99)  +         =
    //           >         + (1-99) =
    //           >         +         = (2-100)
    this.add_1 = Math.floor(Math.random() * (this.maxSum - 1) + 1);
    this.add_2 = Math.floor(Math.random() * (this.maxSum - this.add_1) + 1);
    this.questionString = `${this.add_1} + ${this.add_2}`;
    this.solution = this.add_1 + this.add_2;
  }
  generateSubstraction() {
    // Naming: --> Minuend - Subtrahend = Difference
    //           > (2-100) -            =
    //           >         - (1-99)     =
    //           >         -            = (1-99)
    this.minuend = Math.floor(Math.random() * (this.maxMinuend - 1) + 2);
    this.subtrahend = Math.floor(Math.random() * (this.minuend - 1) + 1);
    this.questionString = `${this.minuend} - ${this.subtrahend}`;
    this.solution = this.minuend - this.subtrahend;
  }
  generateMultiplication() {
    // Naming: --> Factor x Factor = Product
    //           > (2-10) x        =
    //           >        x (2-10) =
    //           >        x        = (4-100)
    this.factor_1 = Math.floor(Math.random() * (this.maxFactor - 1)) + 2;
    this.factor_2 = Math.floor(Math.random() * (this.maxFactor - 1)) + 2;
    this.questionString = `${this.factor_1} x ${this.factor_2}`;
    this.solution = this.factor_1 * this.factor_2;
  }
  generateDivision() {
    // Naming: --> Divisor : Dividend = Quotient
    //           > (4-100) :          =
    //           >         :  (2-10)  =
    //           >         :          = (2-10)
    this.quotient = Math.floor(Math.random() * (this.maxDividendQuotient - 1) + 2);
    this.dividend = Math.floor(Math.random() * (this.maxDividendQuotient - 1) + 2);
    this.divisor = this.quotient * this.dividend;
    this.questionString = `${this.divisor} : ${this.dividend}`;
    this.solution = this.quotient;
  }

  generateStepDrill() {
    // Naming: --> Minuend - Subtrahend = Difference
    //           > (2-10)  -            =
    //           >         - (1-9)      =
    //           >         -            = (1-9)
    const minMinuend = 2;
    const maxMinuend = 10;
    this.minuend = Math.floor(Math.random() * (maxMinuend - minMinuend + 1) + minMinuend);

    const minSubtrahend = 1;
    const maxSubtrahend = this.minuend - 1;
    this.subtrahend = Math.floor(Math.random() * (maxSubtrahend - minSubtrahend + 1) + minSubtrahend);

    // Add random tenner digits:
    this.randomTenner = Math.floor(Math.random() * 10) * 10;
    this.minuend += this.randomTenner;

    this.questionString = `${this.minuend} - ${this.subtrahend}`;
    this.solution = this.minuend - this.subtrahend;
  }

  generateJumpDrill() {
    // Naming: --> Minuend - Subtrahend = Difference
    //           > (10-18) -            =
    //           >         - (1-9)      =
    //           >         -            = (1-9)
    const minMinuend = 10;
    const maxMinuend = 18;
    this.minuend = Math.floor(Math.random() * (maxMinuend - minMinuend + 1) + minMinuend);

    const minSubtrahend = this.minuend - 9;
    const maxSubtrahend = 9;
    this.subtrahend = Math.floor(Math.random() * (maxSubtrahend - minSubtrahend + 1) + minSubtrahend);

    // Add random tenner digits:
    this.randomTenner = Math.floor(Math.random() * 9) * 10;
    this.minuend += this.randomTenner;


    this.questionString = `${this.minuend} - ${this.subtrahend}`;
    this.solution = this.minuend - this.subtrahend;
  }


  generateEyeDrill() {
    // In the ey drill mode, only te first step of a difficult subtraction will be trained
    // example question: 77-52
    // example solution: 27- 2

    // Naming: --> Minuend - Subtrahend = Difference
    //           > (11-99) -            =
    //           >         - (10-98)    =
    //           >         -            = Minuend minus tener-digit of the subtrahend
    const minMinuend = 11;
    const maxMinuend = 99;
    this.minuend = Math.floor(Math.random() * (maxMinuend - minMinuend + 1) + minMinuend);

    const minSubtrahend = 10;
    const maxSubtrahend = this.minuend - 1;
    this.subtrahend = Math.floor(Math.random() * (maxSubtrahend - minSubtrahend + 1) + minSubtrahend);

    this.questionString = `${this.minuend} - ${this.subtrahend}`;

    const subtrahendSecondDigitValue = Math.floor(this.subtrahend / 10) * 10;
    const resultMinuend = this.minuend - subtrahendSecondDigitValue;
    const resultSubtrahend = this.subtrahend - subtrahendSecondDigitValue;

    this.solution = `${resultMinuend}-${resultSubtrahend}`;
  }

  getQuestion() {
    return this.questionString;
  }

  getSolution() {
    return this.solution.toString();
  }
}