const _ = require('lodash');
const Long = require("long");

type Board = Player[][];

enum Player {
  First = 0,
  Second = 1,
  Draw = -1,
  Empty = null,
}

const bitboardLookup = [
  [5, 12, 19, 26, 33, 40, 47],
  [4, 11, 18, 25, 32, 39, 46],
  [3, 10, 17, 24, 31, 38, 45],
  [2, 9, 16, 23, 30, 37, 44],
  [1, 8, 15, 22, 29, 36, 43],
  [0, 7, 14, 21, 28, 35, 42],
];


export function emptyBoard(): Board {
  // did this in a cleaner way but TypeScript didn't like it
  // return new Array(6).fill().map(() => new Array(7).fill(null));
  let board = [null, null, null, null, null, null];
  return board.map(() => { return [null, null, null, null, null, null, null] });
}


function checkWin(bitboard: Long) {
  // https://github.com/tonyho/ARM_BenchMark/blob/master/fhourstones/Game.c
  let HEIGHT = 6;
  let H1 = HEIGHT + 1;
  let H2 = HEIGHT + 2;
  let diag1 = bitboard.and(bitboard.shiftRight(HEIGHT));
  let hori = bitboard.and(bitboard.shiftRight(H1));
  let diag2 = bitboard.and(bitboard.shiftRight(H2));
  let vert = bitboard.and(bitboard.shiftRight(1));
  let hasWon = ((diag1.and(diag1.shiftRight(2 * HEIGHT))).or(
                (hori.and(hori.shiftRight(2 * H1)))).or(
                (diag2.and(diag2.shiftRight(2 * H2)))).or(
                (vert.and(vert.shiftRight(2)))));
  return hasWon.greaterThan(0);
}

function checkTopRow(board) {
  return _.pull(board[0].map((row, column) => { if (row == null) return column; else return null }), null);
}


export function getBitboards(board) {
  let bitboards = [new Long(0), new Long(0)];
  _.each(_.range(2), (player) => {
    _.each(_.range(6), (row) => {
      _.each(_.range(7), (column) => {
        if (board[row][column] === player) {
          bitboards[player] = bitboards[player].xor(new Long(1).shiftLeft(bitboardLookup[row][column]));
        }
      });
    });
  });

  return bitboards;
}

export function findRowForColumn(board: Board, column: number): number {
  for (let row = 5; row > -1; row--) {
    if (board[row][column] === null)
      return row;
  }
}

export class ConnectFourGame {
  board: Board;
  bitboards: Long[];
  winner: Player;
  currentPlayer: Player;

  constructor() {
    this.board = emptyBoard();
    this.bitboards = [new Long(0), new Long(0)];
    this.winner = null;
    this.currentPlayer = 0;
  }

  performMove(column: number) {
    let row = findRowForColumn(this.board, column);
    this.board[row][column] = this.currentPlayer;
    this.bitboards[0] = new Long(this.bitboards[0].low, this.bitboards[0].high);
    this.bitboards[1] = new Long(this.bitboards[1].low, this.bitboards[1].high);
    this.bitboards[this.currentPlayer] = this.bitboards[this.currentPlayer].xor(new Long(1).shiftLeft(bitboardLookup[row][column]));

    let winner = null;

    _.each(this.bitboards, (bitboard, player) => {
      if (checkWin(bitboard))
        winner = player;
    });

    if (!checkTopRow(this.board).length && winner === null)
      winner = -1

    this.winner = winner;
    this.currentPlayer = (this.currentPlayer + 1) % 2;
  }

  getPossibleMoves() {
    if (this.getWinner() !== null) {
      return [];
    }
    return checkTopRow(this.board);
  }

  getWinner() {
    return this.winner;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }
}