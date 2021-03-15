import black_king from './icons/black_king.svg'
import white_king from './icons/white_king.svg'
import black_rook from './icons/black_rook.svg'
import white_rook from './icons/white_rook.svg'
import black_knight from './icons/black_knight.svg'
import white_knight from './icons/white_knight.svg'

export const PIECE_SVG_MAP = {
  black_king,
  white_king,
  black_rook,
  white_rook,
  black_knight,
  white_knight,
}

export const WHITE_KING   = {color: 'white', piece: 'king'},
             WHITE_KNIGHT = {color: 'white', piece: 'knight'},
             WHITE_ROOK   = {color: 'white', piece: 'rook'},
             BLACK_KING   = {color: 'black', piece: 'king'},
             BLACK_KNIGHT = {color: 'black', piece: 'knight'},
             BLACK_ROOK   = {color: 'black', piece: 'rook'}

const INITIAL_BOARD_STATE = [
  WHITE_KING,
  WHITE_KNIGHT,
  WHITE_ROOK,
  null,
  null,
  BLACK_ROOK,
  BLACK_KNIGHT,
  BLACK_KING
]

export function initialState() {
  return {
    timeline: [INITIAL_BOARD_STATE.slice()],
    timelineInd: 0,
    selectedPiece: null, // index in this.state.board
  }
}

export function other(color) {
  return color === "white" ? "black" : "white"
}

export function isColorsPiece(piece, color) {
  return piece != null && piece.color === color
}

function kingFor(color) {
  return color === "white" ? WHITE_KING : BLACK_KING
}

// This name is a little misleading, so use with caution
function samePiece(p1, p2) {
  return p1 != null && p2 != null && p1.color === p2.color && p1.piece === p2.piece
}

export function capitalize(str) {
  if (str === "") return ""
  return str[0].toUpperCase() + str.slice(1).toLowerCase()
}

function destinationSquaresForKing(board, pieceInd) {
  let squares = []
  if (pieceInd > 0) squares.push(pieceInd - 1)
  if (pieceInd < board.length - 1) squares.push(pieceInd + 1)
  return squares
}

function destinationSquaresForKnight(board, pieceInd) {
  let squares = []
  if (pieceInd > 1) squares.push(pieceInd - 2)
  if (pieceInd < board.length - 2) squares.push(pieceInd + 2)
  return squares
}

function destinationSquaresForRook(board, pieceInd) {
  let squares = []
  const { color } = board[pieceInd]
  // explore backwards and forwards until end of board or piece
  // TODO: clean up
  for (let i = pieceInd - 1; i >= 0; i--) {
    if (board[i] == null) {
      squares.push(i)
    } else if (isColorsPiece(board[i], other(color))) {
      squares.push(i)
      break
    } else {
      break
    }
  }
  for (let i = pieceInd + 1; i < board.length; i++) {
    if (board[i] == null) {
      squares.push(i)
    } else if (isColorsPiece(board[i], other(color))) {
      squares.push(i)
      break
    } else {
      break
    }
  }
  return squares
}

function destinationSquaresForPiece(board, pieceInd) {
  let destSquares
  const { piece, color } = board[pieceInd]
  if (piece === "king") {
    destSquares = destinationSquaresForKing(board, pieceInd)
  } else if (piece === "knight") {
    destSquares = destinationSquaresForKnight(board, pieceInd)
  } else if (piece === "rook") {
    destSquares = destinationSquaresForRook(board, pieceInd)
  } else {
    console.warn("Unknown piece")
  }

  // can't move to a square occupied by your own piece
  return destSquares.filter(dest => !isColorsPiece(board[dest], color))
}

// Returns List[Move], Move: [src, dest]
export function legalMovesForPiece(board, pieceInd) {
  if (pieceInd == null) return []

  let destSquares = destinationSquaresForPiece(board, pieceInd)
  // can't make a move that would put your king in check
  destSquares = destSquares.filter(dest => !isCheck(makeMove(board, [pieceInd, dest]), board[pieceInd].color))

  return destSquares.map(dest => [pieceInd, dest])
}

export function isLegalMove(board, move) {
  const legalMoves = legalMovesForPiece(board, move[0])
  let legalMove = false
  for (const [_, dest] of legalMoves) {
    if (dest === move[1]) legalMove = true
  }
  return legalMove
}

// Apply `fn` to each piece of a given color and return the accumulated results.
function generateForEachPieceOfColor(fn, board, color) {
  let result = []
  for (let i = 0; i < board.length; i++) {
    if (board[i] != null && board[i].color === color) {
      result = result.concat(fn(board, i))
    }
  }
  return result
}

export function legalMovesForColor(board, color) {
  return generateForEachPieceOfColor(legalMovesForPiece, board, color)
}

function destinationSquaresForColor(board, color) {
  return generateForEachPieceOfColor(destinationSquaresForPiece, board, color)
}

// Does not check that a move is legal
export function makeMove(board, move) {
  const [src, dest] = move
  board = board.slice()
  board[dest] = board[src]
  board[src] = null
  return board
}

export function isCheck(board, color) {
  const moves = destinationSquaresForColor(board, other(color))
  for (const dest of moves) {
    if (samePiece(board[dest], kingFor(color))) {
      return true
    }
  }
  return false
}

export function hasNoLegalMoves(board, color) {
  return legalMovesForColor(board, color).length == 0
}

export function isDraw(board) {
  // If the rooks are off the board, no checkmates exist.
  for (const piece of board) {
    if (samePiece(piece, WHITE_ROOK) || samePiece(piece, BLACK_ROOK)) {
      return false
    }
  }
  return true
}

export function isStalemate(board, color) {
  return hasNoLegalMoves(board, color) && !isCheck(board, color)
}

export function isCheckmate(board, color) {
  return hasNoLegalMoves(board, color) && isCheck(board, color)
}

function scorePieceValues(board) {
  let result = 0

  for (const pieceData of board) {
    if (pieceData == null) continue
    const { color, piece } = pieceData

    let score
    if (piece === "king") score = 100
    else if (piece === "rook") score = 10
    else score = 5

    score = color === "white" ? score : -score
    result += score
  }

  return result
}

// Scores the board from the perspective of the given color.
// Takes into account stalemate and checkmate
export function scoreBoard(board) {
  if (isStalemate(board, "white") || isStalemate(board, "black") || isDraw(board)) return 0
  if (isCheckmate(board, "white")) return -100
  if (isCheckmate(board, "black")) return 100

  return scorePieceValues(board)
}

function positionOf(piece, board) {
  for (let i = 0; i < board.length; i++) {
    if (samePiece(piece, board[i])) {
      return i
    }
  }
  return -1
}

// Given two boards, return the move that must have been played in between.
export function moveBetween(board1, board2) {
  // the move will be a piece on both boards in a different place
  for (const piece of board2) {
    // don't have to check if positionOf returns -1 because we're iterating through board2,
    // so we'll find capturing pieces and not captured pieces
    if (positionOf(piece, board1) != positionOf(piece, board2)) {
      return [positionOf(piece, board1), positionOf(piece, board2)]
    }
  }
  return null
}

function serializePiece(piece) {
  if (piece == null) return "null"
  return piece.color + piece.piece
}

// Not meant to be human readable.
export function serializeGameState(board, colorToMove) {
  let result = ""
  for (const piece of board) {
    result += serializePiece(piece)
  }
  result += colorToMove
  return result
}
