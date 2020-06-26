import React from "react";
import ReactDOM from "react-dom";
import "./index.css";


var height = 1000,
   increment = 40,
   maxSpeed = 100,
   minSpeed = 40,
   pos = 0;


var holder,
  lock = false;

var characters = ["1", "0", "d", "r", "t"];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var randomText = function () {
  return characters[getRandomInt(0, characters.length - 1)];
};

var thread = function () {
  var div = document.createElement("div");
  div.className = "thread";

  var msg = "";

  for (let i = 0; i < 200; i++) {
    msg += randomText();
  }
  div.innerHTML = msg;
  return div;
};

var animate = function (div, speed) {
  var topVal = parseInt(div.style.top, 10);
  if (topVal > height) {
    holder.removeChild(div);
  } else {
    div.style.top = parseInt(topVal + speed) + "px";
    setTimeout(function () {
      animate(div, speed);
    }, speed);
  }
};

var matrix = function () {
  var div = thread();
  holder.appendChild(div);
  div.style.left = pos + increment + "px";
  pos += increment;
  div.style.top = -5000 + "px";
  console.log(div.style.top);

  var speed = getRandomInt(minSpeed, maxSpeed);

  setTimeout(function () {
    animate(div, speed);
  }, speed);
  if (!lock) {
    setTimeout(matrix, 20);
  }
};

var stop = function () {
  lock = true;
};

var loaded = function() {
  document.getElementById("loader").style.display = "none";
}

window.onload = function () {
  holder = document.getElementById("loader");
  matrix();
  
  setTimeout(stop, 1200);
  setTimeout(loaded,3000);
};



function Status(props) {
  const status = props.noWinner
    ? "No Winner"
    : props.winner
    ? "Winner " + props.winner
    : "Next Player " + (props.xIsNext ? "x" : "o");
  return <div className="status">{status}</div>;
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props) {
  function renderSquare(i) {
    return <Square onClick={() => props.onClick(i)} value={props.squares[i]} />;
  }
  return (
    <div className="the-board">
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

function Accessibility(props) {
  return (
    <div className="accessibility">
      <button id="play-again-button" onClick={props.playAgain}>
        Play Again
      </button>
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      winner: "",
      noWinner: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.playAgain = this.playAgain.bind(this);
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    let winner = calculateWinner(squares);

    if (winner || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "x" : "o";

    winner = calculateWinner(squares);

    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
      winner: winner,
    });

    if (
      !winner &&
      squares[0] &&
      squares[1] &&
      squares[2] &&
      squares[3] &&
      squares[4] &&
      squares[5] &&
      squares[6] &&
      squares[7] &&
      squares[8]
    ) {
      this.setState({
        noWinner: true,
      });
    }
  }

  playAgain() {
    this.setState({
      squares: Array(9).fill(null),
      xIsNext: true,
      winner: "",
      noWinner: false,
    });
  }

  render() {
    return (
      <div className="game">
        <Status
          xIsNext={this.state.xIsNext}
          winner={this.state.winner}
          noWinner={this.state.noWinner}
        />
        <Board
          squares={this.state.squares}
          onClick={(i) => this.handleClick(i)}
        />
        <Accessibility playAgain={this.playAgain} />
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
      return squares[a];
    }
  }
  return null;
}

ReactDOM.render(<Game />, document.getElementById("root"));
