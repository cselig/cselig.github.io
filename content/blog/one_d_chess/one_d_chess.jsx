import React from 'react'

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

const SQUARE_SIDE_LENGTH = 60 // px

// FUNCTIONS

// Transform board state to svg elements
function createSquaresArr(board, onSquareClick) {
  let squares = []
  for (let i = 0; i < 8; i++) {
    squares.push([
        <rect
          key={i}
          width={SQUARE_SIDE_LENGTH}
          height={SQUARE_SIDE_LENGTH}
          className={"square " + (i % 2 == 0 ? "dark" : "light")}
        />
    ])
  }

  for (let i = 0; i < board.length; i++) {
    if (board[i] == null) continue
    const { color, piece } = board[i]
    const style = {height: SQUARE_SIDE_LENGTH, width: SQUARE_SIDE_LENGTH}
    squares[i].push(<image href={PIECE_SVG_MAP[`${color}_${piece}`]} style={style} />)
  }

  squares = squares.map((elems, i) => {
    const style = {transform: `translate(${SQUARE_SIDE_LENGTH*i}px,0)`}
    return (
      <g style={style} onClick={() => onSquareClick(i)} key={i}>
        {elems}
      </g>
    )
  })

  return squares
}

// COMPONENT
class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      board: INITIAL_BOARD_STATE.slice(),
      selectedPiece: null, // index in this.state.board
    }

    this.onSquareClick = this.onSquareClick.bind(this)
    this.reset = this.reset.bind(this)
  }

  onSquareClick(i) {
    console.log("square click:", i)
    if (this.state.selectedPiece == null) {
      this.setState({selectedPiece: i})
    } else {
      this.setState(({ board, selectedPiece }) => {
        // put selected piece at i
        board[i] = board[selectedPiece]
        // remove selected piece
        board[selectedPiece] = null
        return {board: board, selectedPiece: null}
      })
    }
  }

  reset() {
    this.setState({board: INITIAL_BOARD_STATE.slice(), selectedPiece: null})
  }

  render() {
    const squares = createSquaresArr(this.state.board, this.onSquareClick)

    return (
      <div className="chess-ui">
        <button name="reset" onClick={this.reset}>Reset</button>
        <svg width={SQUARE_SIDE_LENGTH * 8} height={SQUARE_SIDE_LENGTH}>
          {squares}
        </svg>
      </div>
    )
  }
}

export default Container
