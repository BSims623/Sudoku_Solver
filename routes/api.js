'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      console.log(req.body);
      const puzzleString = req.body.puzzle;
      const { coordinate } = req.body;
      const { value } = req.body;
      if (!puzzleString || !coordinate || !value) res.status(200).json({ error: 'Required field(s) missing' });
      const isValidCoordinate = /^[a-i][1-9]$/i.test(coordinate);
      const isValidValue = /^[1-9]$/.test(value);
      const isInvalidString = solver.validate(puzzleString);
      if (isInvalidString) return res.status(200).json({ error: isInvalidString })
      if (!isValidValue) return res.status(200).json({ error: "Invalid value" });
      if (!isValidCoordinate) return res.status(200).json({ error: "Invalid coordinate" });
      let conflicts = [];
      let row = req.body.coordinate.split('')[0].toUpperCase();
      let column = req.body.coordinate.split('')[1];
      solver.populate(puzzleString);
      if (!solver.checkRowPlacement(row, column, value)) conflicts.push("row");
      if (!solver.checkColPlacement(row, column, value)) conflicts.push("column");
      if (!solver.checkRegionPlacement(row, column, value)) conflicts.push("region");
      solver.reset();

      if (conflicts.length > 0) return res.status(200).json({ valid: false, conflict: conflicts });;
      res.status(200).json({ valid: true });
    });

  app.route('/api/solve')
    .post((req, res) => {
      const puzzleString = req.body.puzzle;
      if (!puzzleString) return res.status(200).json({ error: 'Required field missing' });
      let isNotValid = solver.validate(puzzleString);
      if (isNotValid) return res.status(200).json({ error: isNotValid })
      try {
        const solution = solver.solve(puzzleString);
        return res.status(200).json(solution)
      } catch (error) {

      }
      try {
        let reversePuzzleString = puzzleString.split('').reverse().join('');
        const solution = solver.solve(reversePuzzleString, true);
        return res.status(200).json(solution)
      } catch (error) {
        return res.status(200).json({ error: "Solver Timed out" });
      }
    });
};
