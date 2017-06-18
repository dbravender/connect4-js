const _ = require('lodash');
import {getBitboards, findRowForColumn, emptyBoard, ConnectFourGame} from '../connectfour';
import {MCTS} from 'mcts';
import {expect, assert} from 'chai';

describe('emptyBoard', function () {
  it('should return an empty board', function () {
    const x = null;
    assert.deepEqual(emptyBoard(),
                     [[x, x, x, x, x, x, x],
                      [x, x, x, x, x, x, x],
                      [x, x, x, x, x, x, x],
                      [x, x, x, x, x, x, x],
                      [x, x, x, x, x, x, x],
                      [x, x, x, x, x, x, x]]);
  });
});

describe('findRowForColumn', function() {
  it('should find correct spots where plays are possible', function () {
    const x = null;
    let board = [[0, 0, x, x, x, 1, 1],
                 [1, 0, x, x, x, 0, 0],
                 [0, 1, 0, x, x, 1, 1],
                 [1, 0, 1, x, x, 0, 0],
                 [0, 1, 0, x, x, 1, 1],
                 [1, 0, 1, x, 1, 0, 0]];
    assert.equal(findRowForColumn(board, 2), 1);
    expect(findRowForColumn.bind(board, 0)).to.throw('');
    assert.equal(findRowForColumn(board, 3), 5);
    assert.equal(findRowForColumn(board, 4), 4);
    expect(findRowForColumn.bind(board, 5)).to.throw('');

  })
});

describe('ConnectFourGame', function() {
  it('it properly detects a winner', function () {
    const x = null;
    let board = [[x, x, x, x, x, x, x],
                 [x, x, x, x, x, x, x],
                 [x, x, x, x, x, x, x],
                 [x, x, x, x, x, x, x],
                 [x, x, x, x, x, x, x],
                 [x, x, x, x, 0, 0, 0]];
    let game = new ConnectFourGame();

    game.board = _.cloneDeep(board);
    game.bitboards = getBitboards(board);

    game.performMove(6);
    assert.equal(game.getWinner(), null)
    assert.deepEqual(game.board,
                     [[x, x, x, x, x, x, x],
                      [x, x, x, x, x, x, x],
                      [x, x, x, x, x, x, x],
                      [x, x, x, x, x, x, x],
                      [x, x, x, x, x, x, 0],
                      [x, x, x, x, 0, 0, 0]]);

    // reset state
    game.board = _.cloneDeep(board);
    game.bitboards = getBitboards(board);
    game._currentPlayer = 0;

    game.performMove(3);
    assert.deepEqual(game.board,
                     [[x, x, x, x, x, x, x],
                      [x, x, x, x, x, x, x],
                      [x, x, x, x, x, x, x],
                      [x, x, x, x, x, x, x],
                      [x, x, x, x, x, x, x],
                      [x, x, x, 0, 0, 0, 0]]);
    assert.equal(game.getWinner(), 0)


    board = [[x, x, x, x, x, x, x],
             [x, x, x, x, x, x, x],
             [x, x, x, x, x, x, x],
             [x, x, x, x, x, 1, 0],
             [x, x, x, x, 1, 0, 1],
             [x, x, x, 1, 0, 0, 0]];

    game.board = _.cloneDeep(board);
    game.bitboards = getBitboards(board);
    game._currentPlayer = 1;

    game.performMove(6);
    assert.deepEqual(game.board,
                     [[x, x, x, x, x, x, x],
                      [x, x, x, x, x, x, x],
                      [x, x, x, x, x, x, 1],
                      [x, x, x, x, x, 1, 0],
                      [x, x, x, x, 1, 0, 1],
                      [x, x, x, 1, 0, 0, 0]]);
    assert.equal(game.getWinner(), 1)
  });
});

describe('ConnectFourGame', function() {
  it('it can play a winning move with MCTS', function () {
    const x = null;
    let board = [[x, x, x, x, x, x, x],
             [x, x, x, x, x, x, x],
             [x, x, x, x, x, x, x],
             [x, x, x, x, x, x, x],
             [x, x, 1, 1, 1, x, x],
             [x, x, 0, 0, 0, x, x]]
    let game = new ConnectFourGame();
    game.board = board;
    game.bitboards = getBitboards(board);
    game._currentPlayer = 0;

    let mcts = new MCTS(game, 500);
    let move = mcts.selectMove();
    console.log(move);
    console.log(mcts.rootNode.getChildren());
    console.log('currentPlayer', mcts.rootNode.game.getCurrentPlayer());
    assert.isTrue(move == 1 || move == 5);
   });
});
