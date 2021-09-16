import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
  return (
    <button
      className={`square ${props.winningSeries ? 'highlight' : ''}`}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}
// onClick={() => props.onClick()} ----> onClick="{props.onClick}"
// onClick is event, and the name cannot be changed, props.onClick can be changed and depends on the prop name.

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      winningSeries={this.props.winningSeries && this.props.winningSeries.includes(i)}
      onClick={() => this.props.onClick(i)}/>;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      allMovesArray: []
    }
  }
  handleClick (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    const location = findTheMoveLocation(i)
    const arr = this.state.allMovesArray.slice(0, this.state.stepNumber)
    arr.push(location)
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      allMovesArray: arr,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }
  jumpTo (step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0 
    })
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerObj = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?  `Go to move ${move}` : `Go to Start`;
      return (
        <li key={move}>
          <button
            className={move === this.state.stepNumber ? 'btn-highlight btn' : 'btn'}
            onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      )
    })
    const moveLocation = this.state.allMovesArray.map((arr, index) => {
      return (
        <li key={index}>
          {index + 1} : Column {arr[0]}, Row {arr[1]}
        </li>
      )
    })
    let status;
    if (winnerObj) {
      status = `Winner: ${winnerObj.winner}`;
    } else {
      status = current.squares.includes(null) ? `Next player: ${this.state.xIsNext ? 'X' : 'O'}` : 'It is a draw. No winner';
    }
    return (
      <div className="game">
        <div className="game-heading">Tic Tac Toe</div>
          <div className="game-board">
            <Board squares={current.squares} onClick={(i) => this.handleClick(i)} winningSeries={winnerObj ? winnerObj.series : null}/>
            {/* This onClick is prop. Any name can be given here. Its conventional to give a name starting with on. */}
          </div>
          <div className="game-history">
            <div className="game-info">
              <div>{status}</div>
              <ol>{moves}</ol>
            </div>
            <div>
              Moves History
              <ul>{moveLocation}</ul>
            </div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], series: [a, b, c]};
    }
  }
  return null;
}

function findTheMoveLocation (i) {
  const value = i % 3
  const column = value === 1 ? 2 : value === 2 ? 3 : 1
  const row = i < 3 ? 1 : i < 6 ? 2 : 3
  return [column, row]
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);