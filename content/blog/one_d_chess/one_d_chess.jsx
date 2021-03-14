import React from 'react'

import * as utils from './utils'

import black_king from './icons/black_king.svg'
import white_king from './icons/white_king.svg'
import black_rook from './icons/black_rook.svg'
import white_rook from './icons/white_rook.svg'
import black_knight from './icons/black_knight.svg'
import white_knight from './icons/white_knight.svg'

// CONSTANTS
const PIECE_SVG_MAP = {
  black_king,
  white_king,
  black_rook,
  white_rook,
  black_knight,
  white_knight,
}

const INITIAL_BOARD_STATE = [
  {
    color: 'white',
    piece: 'king'
  },
  {
    color: 'white',
    piece: 'knight'
  },
  {
    color: 'white',
    piece: 'rook'
  },
  null,
  null,
  {
    color: 'black',
    piece: 'rook'
  },
  {
    color: 'black',
    piece: 'knight'
  },
  {
    color: 'black',
    piece: 'king'
  }
]

function initialState() {
  return {
    board: INITIAL_BOARD_STATE.slice(),
    whosTurn: "white",
    selectedPiece: null, // index in this.state.board
  }
}

const SQUARE_SIDE_LENGTH = 60 // px

// COMPONENTS

function Board({ board, onSquareClick, highlightedSquares, clickableSquares }) {
  // Transform board state to svg elements
  let squares = []
  for (let i = 0; i < 8; i++) {
    let className = "square "
    className += (i % 2 == 0 ? "dark " : "light ")
    squares.push([
        <rect
          width={SQUARE_SIDE_LENGTH}
          height={SQUARE_SIDE_LENGTH}
          className={className}
          key="rect"
        />
    ])
  }

  // add piece SVGs
  for (let i = 0; i < board.length; i++) {
    if (board[i] == null) continue
    const { color, piece } = board[i]
    const style = {height: SQUARE_SIDE_LENGTH, width: SQUARE_SIDE_LENGTH}
    squares[i].push(
      <image
        href={PIECE_SVG_MAP[`${color}_${piece}`]}
        style={style}
        key="image"
      />)
  }

  // add dots for legal moves
  for (let i = 0; i < board.length; i++) {
    if (highlightedSquares.includes(i)) {
      squares[i].push(
        <circle
          className="legal-move-dot"
          r="10"
          cx={SQUARE_SIDE_LENGTH / 2}
          cy={SQUARE_SIDE_LENGTH / 2}
          key="dot"
        ></circle>
      )
    }
  }

  squares = squares.map((elems, i) => {
    const style = {
      transform: `translate(${SQUARE_SIDE_LENGTH*i}px,0)`,
      cursor: clickableSquares.includes(i) || highlightedSquares.includes(i) ? "pointer" : "auto",
    }
    return (
      <g style={style} onClick={() => onSquareClick(i)} key={i}>
        {elems}
      </g>
    )
  })

  return (
    <svg width={SQUARE_SIDE_LENGTH * 8} height={SQUARE_SIDE_LENGTH}>
      {squares}
    </svg>
  )
}

function DebugPanel({ board, whosTurn, selectedPiece }) {
  const isCheck = utils.isCheck(board, whosTurn)
  const isCheckmate = utils.isCheckmate(board, whosTurn)
  const isStalemate = utils.isStalemate(board, whosTurn)
  const legalMoves = utils.legalMovesForColor(board, whosTurn)
  const legalMovesForPiece = utils.legalMovesForPiece(board, selectedPiece)

  return (
    <div className="debug-panel">
      <p>Turn: {whosTurn}</p>
      <p>Selected piece: {selectedPiece}</p>
      <p>Is check: {`${isCheck}`}</p>
      <p>Is checkmate: {`${isCheckmate}`}</p>
      <p>Is stalemate: {`${isStalemate}`}</p>
      <p>Legal moves: {JSON.stringify(legalMoves)}</p>
      <p>Legal moves for piece: {JSON.stringify(legalMovesForPiece)}</p>
    </div>
  )
}

class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = initialState()

    this.onSquareClick = this.onSquareClick.bind(this)
    this.reset = this.reset.bind(this)
    this.getHighlightedSquares = this.getHighlightedSquares.bind(this)
    this.getClickableSquares = this.getClickableSquares.bind(this)
  }

  onSquareClick(i) {
    if (this.state.selectedPiece === i) {
      // de-select piece
      this.setState({selectedPiece: null})
    } else if (utils.isColorsPiece(this.state.board[i], this.state.whosTurn)) {
      // select piece
      this.setState({selectedPiece: i})
    } else if (this.state.selectedPiece != null) {
      if (!utils.isLegalMove(this.state.board, [this.state.selectedPiece, i])) {
        return
      }

      // make move
      this.setState(({ board, whosTurn, selectedPiece }) => {
        const newBoard = utils.makeMove(board, [selectedPiece, i])
        return {
          board: newBoard,
          whosTurn: utils.other(whosTurn),
          selectedPiece: null,
        }
      })
    }
  }

  reset() {
    this.setState(initialState())
  }

  getHighlightedSquares() {
    let result = []
    if (this.state.selectedPiece != null) {
      for (const [_, dest] of utils.legalMovesForPiece(this.state.board, this.state.selectedPiece)) {
        result.push(dest)
      }
    }
    return result
  }

  getClickableSquares() {
    let result = []
    for (let i = 0; i < this.state.board.length; i++) {
      if (this.state.board[i] != null && this.state.board[i].color === this.state.whosTurn) {
        result.push(i)
      }
    }
    return result
  }

  render() {
    const highlightedSquares = this.getHighlightedSquares()
    const clickableSquares = this.getClickableSquares()
    const isStalemate = utils.isStalemate(this.state.board, this.state.whosTurn)
    const isCheckmate = utils.isCheckmate(this.state.board, this.state.whosTurn)
    const isCheck = utils.isCheck(this.state.board, this.state.whosTurn)

    const gameOver = isStalemate || isCheckmate

    return (
      <div className="chess-ui">
        <button name="reset" onClick={this.reset}>Reset</button>
        <Board
          board={this.state.board}
          onSquareClick={gameOver ? null : this.onSquareClick}
          highlightedSquares={gameOver ? [] : highlightedSquares}
          clickableSquares={gameOver ? [] : clickableSquares}
        />
        {isStalemate && <h2>Stalemate!</h2>}
        {isCheckmate && <h2>Checkmate - {utils.other(this.state.whosTurn)} wins!</h2>}
        {isCheck && !isCheckmate && <h2>{utils.capitalize(this.state.whosTurn)} is in check!</h2>}
        {/* <DebugPanel
          board={this.state.board}
          selectedPiece={this.state.selectedPiece}
          whosTurn={this.state.whosTurn}
        /> */}
      </div>
    )
  }
}

export default Container
