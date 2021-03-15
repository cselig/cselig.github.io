import React from 'react'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'

import * as ai from './ai'
import * as utils from './utils'

var $ = require("jquery")

function Board({ board, onSquareClick, highlightedSquares, clickableSquares }) {
  // Transform board state to svg elements
  const SQUARE_SIDE_LENGTH = 60 // px
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
        href={utils.PIECE_SVG_MAP[`${color}_${piece}`]}
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
    <svg className="board" width={SQUARE_SIDE_LENGTH * 8} height={SQUARE_SIDE_LENGTH}>
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
  const score = utils.scoreBoard(board)
  const aiNextMove = ai.computeNextMove(board, whosTurn)

  const searchTree = ai.buildSearchTree(board, whosTurn)
  console.log("search tree:", searchTree)

  return (
    <div className="debug-panel">
      <p>Turn: {whosTurn}</p>
      <p>Selected piece: {selectedPiece}</p>
      <p>Is check: {`${isCheck}`}</p>
      <p>Is checkmate: {`${isCheckmate}`}</p>
      <p>Is stalemate: {`${isStalemate}`}</p>
      <p>Legal moves: {JSON.stringify(legalMoves)}</p>
      <p>Legal moves for piece: {JSON.stringify(legalMovesForPiece)}</p>
      <p>Score: {score}</p>
      <p>AI's next move: {JSON.stringify(aiNextMove)}</p>
    </div>
  )
}

class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = utils.initialState()

    this.currBoard = this.currBoard.bind(this)
    this.whosTurn = this.whosTurn.bind(this)
    this.reset = this.reset.bind(this)
    this.advance = this.advance.bind(this)
    this.rewind = this.rewind.bind(this)
    this.onSquareClick = this.onSquareClick.bind(this)
    this.makeMove = this.makeMove.bind(this)
    this.makeAIMove = this.makeAIMove.bind(this)
    this.isDraw = this.isDraw.bind(this)
    this.isStalemate = this.isStalemate.bind(this)
    this.isCheckmate = this.isCheckmate.bind(this)
    this.isCheck = this.isCheck.bind(this)
    this.gameOver = this.gameOver.bind(this)
    this.getHighlightedSquares = this.getHighlightedSquares.bind(this)
    this.getClickableSquares = this.getClickableSquares.bind(this)
  }

  currBoard() {
    return this.state.timeline[this.state.timelineInd]
  }

  whosTurn() {
    return (this.state.timelineInd % 2 === 0) ? "white" : "black"
  }

  reset() {
    this.setState(utils.initialState())
  }

  advance() {
    this.setState(({ timeline, timelineInd }) => ({
      timelineInd: (timelineInd < timeline.length - 1) ? timelineInd + 1 : timelineInd
    }))
  }

  rewind() {
    this.setState(({ timelineInd }) => ({
      timelineInd: (timelineInd > 0) ? timelineInd - 1 : timelineInd
    }))
  }

  onSquareClick(i) {
    if (this.whosTurn() === "black") return

    if (this.state.selectedPiece === i) {
      // de-select piece
      this.setState({selectedPiece: null})
    } else if (utils.isColorsPiece(this.currBoard()[i], this.whosTurn())) {
      // select piece
      this.setState({selectedPiece: i})
    } else if (this.state.selectedPiece != null) {
      if (!utils.isLegalMove(this.currBoard(), [this.state.selectedPiece, i])) {
        return
      }
      this.makeMove([this.state.selectedPiece, i])
    }
  }

  makeMove(move) {
    this.setState(({ timeline, timelineInd }) => {
      const newBoard = utils.makeMove(timeline[timelineInd], move)
      let newTimeline = timeline.slice(0, timelineInd + 1)
      newTimeline.push(newBoard)
      return {
        timeline: newTimeline,
        timelineInd: timelineInd + 1,
        selectedPiece: null,
      }
    })
  }

  makeAIMove() {
    const move = ai.computeNextMove(this.currBoard(), this.whosTurn())
    this.makeMove(move)
  }

  getHighlightedSquares() {
    if (this.whosTurn() === "black") return []

    let result = []
    if (this.state.selectedPiece != null) {
      for (const [_, dest] of utils.legalMovesForPiece(this.currBoard(), this.state.selectedPiece)) {
        result.push(dest)
      }
    }
    return result
  }

  getClickableSquares() {
    if (this.whosTurn() === "black") return []

    let result = []
    for (let i = 0; i < this.currBoard().length; i++) {
      if (this.currBoard()[i] != null && this.currBoard()[i].color === this.whosTurn()) {
        result.push(i)
      }
    }
    return result
  }

  isDraw() {
    return utils.isDraw(this.currBoard())
  }

  isStalemate() {
    return utils.isStalemate(this.currBoard(), this.whosTurn())
  }

  isCheckmate() {
    return utils.isCheckmate(this.currBoard(), this.whosTurn())
  }

  isCheck() {
    return utils.isCheck(this.currBoard(), this.whosTurn())
  }

  gameOver() {
    return this.isStalemate() || this.isCheckmate()
  }

  componentDidUpdate() {
    if (!this.gameOver() && this.whosTurn() === "black") {
      setTimeout(this.makeAIMove, 500)
    }

    if (utils.isCheckmate(this.currBoard(), "black")) {
      // kind of hacky
      $("#unlockable-text").removeClass("hidden")
      setTimeout(
        () => $("#unlockable-text").addClass("visible"),
        300
      )
    }
  }

  render() {
    const highlightedSquares = this.getHighlightedSquares()
    const clickableSquares = this.getClickableSquares()

    // Doing this because I don't think you can apply classNames to material-ui icon components
    const canRewind = this.state.timelineInd > 0
    const canAdvance = this.state.timelineInd < this.state.timeline.length - 1
    const rewindStyle = {
      cursor: "pointer",
      fontSize: "32px",
      opacity: canRewind ? 1 : 0.3,
      pointerEvents: canRewind ? "all" : "none",
    }
    const advanceStyle = {
      cursor: "pointer",
      fontSize: "32px",
      opacity: canAdvance ? 1 : 0.3,
      pointerEvents: canAdvance ? "all" : "none",
    }

    return (
      <div className="chess-ui">
        <div className="control-panel">
          <button name="reset" onClick={this.reset}>Reset</button>
          {/* TODO: figure out how to make this work cleanly with the automatic AI moves */}
          {/* <div className="timeline-buttons">
            <ChevronLeft style={rewindStyle} onClick={this.rewind} />
            <ChevronRight style={advanceStyle} onClick={this.advance} />
          </div> */}
        </div>
        <Board
          board={this.currBoard()}
          onSquareClick={this.gameOver() ? () => null : this.onSquareClick}
          highlightedSquares={this.gameOver() ? [] : highlightedSquares}
          clickableSquares={this.gameOver() ? [] : clickableSquares}
        />
        <div className="game-state-display">
          {this.isDraw() && <h2>Draw by insufficient material!</h2>}
          {this.isStalemate() && <h2>Stalemate!</h2>}
          {this.isCheckmate() && <h2>Checkmate - {utils.other(this.whosTurn())} wins!</h2>}
          {this.isCheck() && !this.isCheckmate() && !this.isStalemate() &&!this.isDraw() &&
            <h2>{utils.capitalize(this.whosTurn())} is in check!</h2>}
        </div>
        {/* <DebugPanel
          board={this.currBoard()}
          selectedPiece={this.state.selectedPiece}
          whosTurn={this.whosTurn()}
        /> */}
      </div>
    )
  }
}

export default Container
