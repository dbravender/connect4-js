"use strict";
exports.__esModule = true;
var _ = require('lodash');
var Long = require("long");
var Player;
(function (Player) {
    Player[Player["First"] = 0] = "First";
    Player[Player["Second"] = 1] = "Second";
    Player[Player["Draw"] = -1] = "Draw";
    Player[Player["Empty"] = null] = "Empty";
})(Player || (Player = {}));
var bitboardLookup = [
    [5, 12, 19, 26, 33, 40, 47],
    [4, 11, 18, 25, 32, 39, 46],
    [3, 10, 17, 24, 31, 38, 45],
    [2, 9, 16, 23, 30, 37, 44],
    [1, 8, 15, 22, 29, 36, 43],
    [0, 7, 14, 21, 28, 35, 42],
];
function emptyBoard() {
    // did this in a cleaner way but TypeScript didn't like it
    // return new Array(6).fill().map(() => new Array(7).fill(null));
    var board = [null, null, null, null, null, null];
    return board.map(function () { return [null, null, null, null, null, null, null]; });
}
exports.emptyBoard = emptyBoard;
function checkWin(bitboard) {
    // https://github.com/tonyho/ARM_BenchMark/blob/master/fhourstones/Game.c
    var HEIGHT = 6;
    var H1 = HEIGHT + 1;
    var H2 = HEIGHT + 2;
    var diag1 = bitboard.and(bitboard.shiftRight(HEIGHT));
    var hori = bitboard.and(bitboard.shiftRight(H1));
    var diag2 = bitboard.and(bitboard.shiftRight(H2));
    var vert = bitboard.and(bitboard.shiftRight(1));
    var hasWon = ((diag1.and(diag1.shiftRight(2 * HEIGHT))).or((hori.and(hori.shiftRight(2 * H1)))).or((diag2.and(diag2.shiftRight(2 * H2)))).or((vert.and(vert.shiftRight(2)))));
    return hasWon.greaterThan(0);
}
function checkTopRow(board) {
    return _.pull(board[0].map(function (row, column) { if (row == null)
        return column;
    else
        return null; }), null);
}
function getBitboards(board) {
    var bitboards = [new Long(0), new Long(0)];
    _.each(_.range(2), function (player) {
        _.each(_.range(6), function (row) {
            _.each(_.range(7), function (column) {
                if (board[row][column] === player) {
                    bitboards[player] = bitboards[player].xor(new Long(1).shiftLeft(bitboardLookup[row][column]));
                }
            });
        });
    });
    return bitboards;
}
exports.getBitboards = getBitboards;
function findRowForColumn(board, column) {
    for (var row = 5; row > -1; row--) {
        if (board[row][column] === null)
            return row;
    }
}
exports.findRowForColumn = findRowForColumn;
var ConnectFourGame = (function () {
    function ConnectFourGame() {
        this.board = emptyBoard();
        this.bitboards = [new Long(0), new Long(0)];
        this.winner = null;
        this._currentPlayer = 0;
    }
    ConnectFourGame.prototype.performMove = function (column) {
        var row = findRowForColumn(this.board, column);
        this.board[row][column] = this._currentPlayer;
        this.bitboards[0] = new Long(this.bitboards[0].low, this.bitboards[0].high);
        this.bitboards[1] = new Long(this.bitboards[1].low, this.bitboards[1].high);
        this.bitboards[this._currentPlayer] = this.bitboards[this._currentPlayer].xor(new Long(1).shiftLeft(bitboardLookup[row][column]));
        var winner = null;
        _.each(this.bitboards, function (bitboard, player) {
            if (checkWin(bitboard))
                winner = player;
        });
        if (!checkTopRow(this.board).length && winner === null)
            winner = -1;
        this.winner = winner;
        this._currentPlayer = (this._currentPlayer + 1) % 2;
    };
    ConnectFourGame.prototype.getPossibleMoves = function () {
        if (this.getWinner() !== null) {
            return [];
        }
        return checkTopRow(this.board);
    };
    ConnectFourGame.prototype.getWinner = function () {
        return this.winner;
    };
    ConnectFourGame.prototype.getCurrentPlayer = function () {
        return this._currentPlayer;
    };
    return ConnectFourGame;
}());
exports.ConnectFourGame = ConnectFourGame;
