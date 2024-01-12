const chai = require('chai');
const assert = chai.assert;
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js')

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', () => {
        const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const result = solver.validate(input);
        assert.isNull(result);
    });
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        const input = '1.5..2.84..63.12.7.2..5..$..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const result = solver.validate(input);
        assert.deepEqual(result, 'Invalid characters in puzzle')
    });
    test('Logic handles a puzzle string that is not 81 characters in length', () => {
        const input = '1.5..2.84..63.12.7.2..5....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const result = solver.validate(input);
        assert.deepEqual(result, 'Expected puzzle to be 81 characters long')
    });
    test('Logic handles a valid row placement', () => {
        const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        solver.populate(input)
        const result = solver.checkRowPlacement('A', '1', 7);
        solver.reset();
        assert.isTrue(result);
    });
    test('Logic handles an invalid row placement', () => {
        const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        solver.populate(input)
        const result = solver.checkRowPlacement('A', '1', 9);
        solver.reset();
        assert.isFalse(result);
    });
    test('Logic handles a valid column placement', () => {
        const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        solver.populate(input)
        const result = solver.checkColPlacement('A', '1', 7);
        solver.reset();
        assert.isTrue(result);
    });
    test('Logic handles an invalid column placement', () => {
        const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        solver.populate(input)
        const result = solver.checkColPlacement('A', '1', 6);
        solver.reset();
        assert.isFalse(result);
    });
    test('Logic handles a valid region (3x3 grid) placement', () => {
        const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        solver.populate(input)
        const result = solver.checkRegionPlacement('A', '1', 7);
        solver.reset();
        assert.isTrue(result);
    });
    test('Logic handles an invalid region (3x3 grid) placement', () => {
        const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        solver.populate(input)
        const result = solver.checkRegionPlacement('A', '1', 2);
        solver.reset();
        assert.isFalse(result);
    });
    test('Valid puzzle strings pass the solver', () => {
        puzzlesAndSolutions.forEach((puzzle, index) => {
            const input = puzzle[0];
            const solution = puzzle[1];
            const result = solver.solve(input);
            assert.deepEqual(result, {
                "solution": solution
            });
        });
    });
    test('Invalid puzzle strings fail the solver', () => {
        const input = '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const inputTwo = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.6';
        const result = solver.solve(input);
        const resultTwo = solver.solve(input);
        assert.deepEqual(result, {
            "error": "Puzzle cannot be solved"
        });
        assert.deepEqual(resultTwo, {
            "error": "Puzzle cannot be solved"
        });
    });
    test('Solver returns the expected solution for an incomplete puzzle', () => {
        puzzlesAndSolutions.forEach((puzzle, index) => {
            const input = puzzle[0];
            const solution = puzzle[1];
            const result = solver.solve(input);
            assert.deepEqual(result.solution, solution);
        });
    });
});
