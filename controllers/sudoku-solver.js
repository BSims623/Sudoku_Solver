class SudokuSolver {
  constructor() {
    this.timeOut = false;
    this.board = [];
    this.originalBoard = [];
    this.A = [];
    this.B = [];
    this.C = [];
    this.D = [];
    this.E = [];
    this.F = [];
    this.G = [];
    this.H = [];
    this.I = [];
    this.col1 = [];
    this.col2 = [];
    this.col3 = [];
    this.col4 = [];
    this.col5 = [];
    this.col6 = [];
    this.col7 = [];
    this.col8 = [];
    this.col9 = [];
    this.region1 = null;
    this.region2 = null;
    this.region3 = null;
    this.region4 = null;
    this.region5 = null;
    this.region6 = null;
    this.region7 = null;
    this.region8 = null;
    this.region9 = null;
  }

  reset() {
    this.board = [];
    this.originalBoard = [];
    this.A = [];
    this.B = [];
    this.C = [];
    this.D = [];
    this.E = [];
    this.F = [];
    this.G = [];
    this.H = [];
    this.I = [];
    this.col1 = [];
    this.col2 = [];
    this.col3 = [];
    this.col4 = [];
    this.col5 = [];
    this.col6 = [];
    this.col7 = [];
    this.col8 = [];
    this.col9 = [];
    this.region1 = null;
    this.region2 = null;
    this.region3 = null;
    this.region4 = null;
    this.region5 = null;
    this.region6 = null;
    this.region7 = null;
    this.region8 = null;
    this.region9 = null;
  }

  validate(puzzleString) {
    if (puzzleString.length !== 81) return "Expected puzzle to be 81 characters long"
    else if (/[^1-9.]/.test(puzzleString)) return "Invalid characters in puzzle"
    return null
  }

  moreThanOne(arr, val) {
    return (arr.slice(arr.indexOf(val) + 1).includes(val))
  }

  populate(puzzleString) {
    if (this.board.length === 0) {
      for (let i = 0; i < 9; i++) {
        this.board.push(new Array(9).fill(0));
        this.originalBoard.push(new Array(9).fill(0));
      };
    };

    const rowIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

    for (let i = 0; i < puzzleString.length; i++) {
      let row = Math.floor(i / 9);
      let col = i % 9;
      if (/[1-9]/.test(puzzleString[i])) {
        this.board[row][col] = Number(puzzleString[i]);
        this.originalBoard[row][col] = Number(puzzleString[i]);
        this[rowIndex[row]].push(Number(puzzleString[i]));
        this[`col${col + 1}`].push(Number(puzzleString[i]));
      } else {
        this[rowIndex[row]].push(0);
        this[`col${col + 1}`].push(0);
      };
    };

    return 'populated'
  }

  checkRowPlacement(row, column, value) {
    if (this.moreThanOne(this[row], value)) {
      return false;
    }
    if (this[row][Number(column - 1)] === Number(value)) return true
    else if (this[row].includes(Number(value))) return false
    return true
  }

  checkColPlacement(row, column, value) {
    let colIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    if (this.moreThanOne(this[`col${column}`], value)) return false;
    if (this[`col${column}`][colIndex.indexOf(row)] === Number(value)) return true
    else if (this[`col${column}`].includes(Number(value))) return false
    return true
  }

  checkRegionPlacement(row, column, value, solver) {
    this.region1 = this.A.slice(0, 3).concat(this.B.slice(0, 3)).concat(this.C.slice(0, 3));
    this.region2 = this.A.slice(3, 6).concat(this.B.slice(3, 6)).concat(this.C.slice(3, 6));
    this.region3 = this.A.slice(6, 9).concat(this.B.slice(6, 9)).concat(this.C.slice(6, 9));
    this.region4 = this.D.slice(0, 3).concat(this.E.slice(0, 3)).concat(this.F.slice(0, 3));
    this.region5 = this.D.slice(3, 6).concat(this.E.slice(3, 6)).concat(this.F.slice(3, 6));
    this.region6 = this.D.slice(6, 9).concat(this.E.slice(6, 9)).concat(this.F.slice(6, 9));
    this.region7 = this.G.slice(0, 3).concat(this.H.slice(0, 3)).concat(this.I.slice(0, 3));
    this.region8 = this.G.slice(3, 6).concat(this.H.slice(3, 6)).concat(this.I.slice(3, 6));
    this.region9 = this.G.slice(6, 9).concat(this.H.slice(6, 9)).concat(this.I.slice(6, 9));
    let region;

    switch (true) {
      case (row === 'A' || row === 'B' || row === 'C') && (column > 0 && column <= 3):
        region = this.region1;
        break;
      case (row === 'A' || row === 'B' || row === 'C') && (column >= 4 && column <= 6):
        region = this.region2;
        break;
      case (row === 'A' || row === 'B' || row === 'C') && (column >= 7 && column < 10):
        region = this.region3;
        break;
      case (row === 'D' || row === 'E' || row === 'F') && (column > 0 && column <= 3):
        region = this.region4;
        break;
      case (row === 'D' || row === 'E' || row === 'F') && (column >= 4 && column <= 6):
        region = this.region5;
        break;
      case (row === 'D' || row === 'E' || row === 'F') && (column >= 7 && column < 10):
        region = this.region6;
        break;
      case (row === 'G' || row === 'H' || row === 'I') && (column > 0 && column <= 3):
        region = this.region7;
        break;
      case (row === 'G' || row === 'H' || row === 'I') && (column >= 4 && column <= 6):
        region = this.region8;
        break;
      case (row === 'G' || row === 'H' || row === 'I') && (column >= 7 && column < 10):
        region = this.region9;
        break;
    };
    if (this.moreThanOne(region, value)) return false;
    if (this[row][Number(column - 1)] === Number(value)) return true
    else if (this[row][Number(column - 1)] !== 0 && this[row][Number(column - 1)] !== Number(value) && solver) return false
    else if (region.includes(Number(value))) return false
    return true
  }

  solve(puzzleString, reverse) {
    this.populate(puzzleString);
    const startTime = Date.now();

    const solveSudoku = (n, time) => {
      let currentTime = Date.now()
      if (currentTime - startTime >= 3500) {
        this.reset();
        throw new Error;
      };
      if (n == 81) return true;
      let rowIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
      let row = Math.floor(n / 9);
      let col = n % 9;
      for (let i = 1; i < 10; i++) {
        if (isValidEntry(rowIndex[row], col + 1, i)) {
          n++;
          this.board[row][col] = i;
          this[rowIndex[row]][col] = i;
          this[`col${col + 1}`][row] = i;
          if (solveSudoku(n)) return true
          n--;
          if (this.originalBoard[row][col] === 0) {
            this.board[row][col] = 0;
            this[rowIndex[row]][col] = 0;
            this[`col${col + 1}`][row] = 0;
          };
        }
      };
      return false
    };

    const isValidEntry = (row, col, i) => {
      if (!this.checkRowPlacement(row, col, i)) return false
      if (!this.checkColPlacement(row, col, i)) return false
      if (!this.checkRegionPlacement(row, col, i, 1)) return false
      return true
    };


    if (solveSudoku(0, startTime)) {
      let str = '';
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          str += this.board[i][j];
        }
      }
      this.reset();
      if (reverse) str = str.split('').reverse().join('');
      return { solution: str }
    } else
      this.reset();
    return { error: "Puzzle cannot be solved" }
  }
}

module.exports = SudokuSolver;
