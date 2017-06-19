"use strict";
exports.__esModule = true;
var _ = require('lodash');
var Long = require('long');
var connectfour_1 = require("../connectfour");
var mcts_1 = require("mcts");
var chai_1 = require("chai");
describe('emptyBoard', function () {
    it('should return an empty board', function () {
        var x = null;
        chai_1.assert.deepEqual(connectfour_1.emptyBoard(), [[x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x]]);
    });
});
describe('findRowForColumn', function () {
    it('should find correct spots where plays are possible', function () {
        var x = null;
        var board = [[0, 0, x, x, x, 1, 1],
            [1, 0, x, x, x, 0, 0],
            [0, 1, 0, x, x, 1, 1],
            [1, 0, 1, x, x, 0, 0],
            [0, 1, 0, x, x, 1, 1],
            [1, 0, 1, x, 1, 0, 0]];
        chai_1.assert.equal(connectfour_1.findRowForColumn(board, 2), 1);
        chai_1.expect(connectfour_1.findRowForColumn.bind(board, 0)).to["throw"]('');
        chai_1.assert.equal(connectfour_1.findRowForColumn(board, 3), 5);
        chai_1.assert.equal(connectfour_1.findRowForColumn(board, 4), 4);
        chai_1.expect(connectfour_1.findRowForColumn.bind(board, 5)).to["throw"]('');
    });
});
describe('ConnectFourGame', function () {
    it('it properly detects a winner', function () {
        var x = null;
        var board = [[x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, 0, 0, 0]];
        var game = new connectfour_1.ConnectFourGame();
        game.board = _.cloneDeep(board);
        game.bitboards = connectfour_1.getBitboards(board);
        game.performMove(6);
        chai_1.assert.equal(game.getWinner(), null);
        chai_1.assert.deepEqual(game.board, [[x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, 0],
            [x, x, x, x, 0, 0, 0]]);
        // reset state
        game.board = _.cloneDeep(board);
        game.bitboards = connectfour_1.getBitboards(board);
        game.currentPlayer = 0;
        game.performMove(3);
        chai_1.assert.deepEqual(game.board, [[x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, 0, 0, 0, 0]]);
        chai_1.assert.equal(game.getWinner(), 0);
        board = [[x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, 1, 0],
            [x, x, x, x, 1, 0, 1],
            [x, x, x, 1, 0, 0, 0]];
        game.board = _.cloneDeep(board);
        game.bitboards = connectfour_1.getBitboards(board);
        game.currentPlayer = 1;
        game.performMove(6);
        chai_1.assert.deepEqual(game.board, [[x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, 1],
            [x, x, x, x, x, 1, 0],
            [x, x, x, x, 1, 0, 1],
            [x, x, x, 1, 0, 0, 0]]);
        chai_1.assert.equal(game.getWinner(), 1);
    });
});
describe('ConnectFourGame', function () {
    it('it can play a winning move with MCTS', function () {
        var x = null;
        var board = [[x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, 1, 1, 1, x, x],
            [x, x, 0, 0, 0, x, x]];
        var game = new connectfour_1.ConnectFourGame();
        game.board = board;
        game.bitboards = connectfour_1.getBitboards(board);
        game.performMove(5);
        chai_1.assert.deepEqual(game.board, [[x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, 1, 1, 1, x, x],
            [x, x, 0, 0, 0, 0, x]]);
        chai_1.assert.equal(game.getWinner(), 0);
        board = [[x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, x, x, x, x, x],
            [x, x, 1, 1, 1, x, x],
            [x, x, 0, 0, 0, x, x]];
        game = new connectfour_1.ConnectFourGame();
        game.board = board;
        game.bitboards = connectfour_1.getBitboards(board);
        game.currentPlayer = 0;
        var mcts = new mcts_1.MCTS(game, 500);
        var move = mcts.selectMove();
        chai_1.assert.isTrue(move == 1 || move == 5);
    });
});
