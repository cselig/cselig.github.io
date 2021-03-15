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

const WHITE_KING   = {color: 'white', piece: 'king'},
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

function rooksRemain(board) {
  for (const piece of board) {
    if (samePiece(piece, WHITE_ROOK) || samePiece(piece, BLACK_ROOK)) {
      return true
    }
  }
  return false
}

export function hasNoLegalMoves(board, color) {
  return legalMovesForColor(board, color).length == 0
}

export function isStalemate(board, color) {
  // If the rooks are off the board, no checkmates exist.
  return hasNoLegalMoves(board, color) && !isCheck(board, color) || !rooksRemain(board)
}

export function isCheckmate(board, color) {
  return hasNoLegalMoves(board, color) && isCheck(board, color)
}
