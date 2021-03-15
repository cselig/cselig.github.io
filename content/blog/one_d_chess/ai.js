import * as utils from './utils.js'

// searchTreeNode = {
//   board
//   colorToPlay
//   children: List[searchTreeNode]
//   minimaxScore
// }

const SEARCH_DEPTH = 10

export function buildSearchTree(board, colorToPlay) {
  let searchTreeRoot = {board: board, colorToPlay: colorToPlay, children: []}

  // populate children
  buildSearchTreeHelper(searchTreeRoot, SEARCH_DEPTH)

  // run minimax to populate scores
  populateMinimaxScore(searchTreeRoot)

  return searchTreeRoot
}

function buildSearchTreeHelper(node, levelsToBuild) {
  if (levelsToBuild === 0) return

  if (utils.isCheckmate(node.board, node.colorToPlay) ||
      utils.isStalemate(node.board, node.colorToPlay) ||
      utils.isDraw(node.board)) {
    return
  }

  const moves = utils.legalMovesForColor(node.board, node.colorToPlay)
  const boards = moves.map(move => utils.makeMove(node.board, move))
  node.children = boards.map(board => ({
    board: board,
    colorToPlay: utils.other(node.colorToPlay),
    children: [],
  }))
  node.children.forEach(child => buildSearchTreeHelper(child, levelsToBuild - 1))
}

function populateMinimaxScore(node) {
  node.children.forEach(child => populateMinimaxScore(child))

  if (node.children.length === 0) {
    node.minimaxScore = utils.scoreBoard(node.board)
  } else {
    const childrenScores = node.children.map(child => child.minimaxScore)
    if (node.colorToPlay === "white") {
      node.minimaxScore = Math.max(...childrenScores)
    } else {
      node.minimaxScore = Math.min(...childrenScores)
    }
  }
}

export function computeNextMove(board, colorToPlay) {
  const gameState = utils.serializeGameState(board, colorToPlay)
  if (hardcodedMoves.has(gameState)) {
    return hardcodedMoves.get(gameState)
  }

  if (utils.isCheckmate(board, colorToPlay) ||
      utils.isStalemate(board, colorToPlay) ||
      utils.isDraw(board)) {
    return
  }

  const searchTreeRoot = buildSearchTree(board, colorToPlay)

  if (searchTreeRoot.children.length === 0) {
    console.error("Error in `computeNextMove`")
    return null
  }

  // this could be done cleaner with array.sort
  const scores = searchTreeRoot.children.map(child => child.minimaxScore)
  const scoreToPick = colorToPlay === "white" ? Math.max(...scores) : Math.min(...scores)
  for (const { board: newBoard, minimaxScore } of searchTreeRoot.children) {
    if (minimaxScore === scoreToPick) {
      return utils.moveBetween(board, newBoard)
    }
  }
}

// Hard-code some moves that are stronger than what miniMax comes up with.
let hardcodedMoves = new Map()
{
  const moves = [
    {
      board: [
        utils.WHITE_KING,
        null,
        utils.WHITE_ROOK,
        utils.WHITE_KNIGHT,
        null,
        utils.BLACK_ROOK,
        utils.BLACK_KNIGHT,
        utils.BLACK_KING,
      ],
      colorToMove: "black",
      move: [6, 4],
    },
    {
      board: [
        null,
        utils.WHITE_KING,
        utils.BLACK_KNIGHT,
        utils.WHITE_ROOK,
        null,
        utils.WHITE_KNIGHT,
        utils.BLACK_KING,
        null
      ],
      colorToMove: "black",
      move: [2, 4],
    },
  ]

  for (const { board, colorToMove, move } of moves) {
    hardcodedMoves.set(utils.serializeGameState(board, colorToMove), move)
  }
}
