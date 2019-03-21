import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// pick up here https://reactjs.org/tutorial/tutorial.html#picking-a-key
// run from here: C:\Users\debor\source\repos\ReactIntro\my-app

// class Square extends React.Component {
// // no constructor is needed because this component is not keeping track of the game's state
// // note that a built-in component like button needs onClick as the name of the prop that represents the Click event
// // A custom component could have a different prop name
// // But by convention, it's typical in React to use "on[Event]" for props representing events
// // and "handle[Event]" for the methods that handle those events
// // Because Square does not maintain its own state, but receives it from Board via props, and informs Board when changes should be made via props
// // Square is a controlled component

//     render() {
//       return (
//         <button 
//           className="square" 
//           onClick={() =>  this.props.onClick() }
//         >
//           {this.props.value}
//         </button>
//       );
//     }
//   }

// Because Square does not maintain its own state and only has a render method, we can convert it to a function component:

function Square(props){
  return(
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

  class Board extends React.Component {    
    // the handleclick is raised up to the Game level so we can concatenate new history entries (i.e. the current state of the board) onto history
    renderSquare(i) {

      // Here we're passing down the current square value to the Square component and a function that Square can call when clicked; both as props
      // the parentheses are necessary after return so JS doesn't insert a ';' after return
      return (
        <Square 
          value={this.props.squares[i]} 
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      //determining if there's a winner and what to display "next player" or "winner" is now lifted up to the Game component instead of here  
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
  
  // The top-level component, Game, allows us to store each prior state of the board, allowing us to see a list of past moves
  // Each prior state consists of the squares array at that moment in time; so the history is an array of squares arrays
  // We have removed the squares array from the Board, as well as xIsNext, and lifted it up to this top-level component
  class Game extends React.Component {
    // constructor to set up the initial state
    constructor(props){
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        xIsNext: true,
      };
    }

    // this is the method that handles the click event in the Square component.  It's accessible to the child Square component
    // because it's passed down as a prop.
    handleClick(i) {
      const history = this.state.history;
      const current = history[history.length - 1];

      // we're using slice with no args to populate a new array "const squares" with the entire current.squares array
      const squares = current.squares.slice();

      // early out if we have a winner or the square is already filled
      if(calculateWinner(squares) || squares[i]){
        return;
      }

      // if xIsNext = true, then we return 'X' as what should be shown in the current square
      squares[i] = this.state.xIsNext ? 'X' : 'O';

      // updating the state (can only do this with setState, of course, which is why we do the slice thing above - 
      //state is immutable other than when being changed via setState)
      this.setState({
        // we add the current.squares to the history using concat because it doesnt mutate the original array
        history: history.concat([{
          squares: squares,
        }]),        
        // we flip this so we know if the next square should be X or O
        xIsNext: !this.state.xIsNext,
      });
    }

    render() {
      // entire history
      const history = this.state.history;
      // current state of the board
      const current = history[history.length - 1];

      // is there a winner? This was also lifted up from the child component Board
      const winner = calculateWinner(current.squares);

      // by mapping over history, we can allow the user to jump around the history of the game
      const moves = history.map((step, move) => {
        const desc = move ?
        'Go to move #' + move :
        'Go to game start';

        // we return a list of buttons that when clicked jump to the appropriate move, and have the description text 'desc' as defined above
        return (
          <li>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      let status;
      if (winner){
        status = 'Winner: ' + winner;
      } else{
        status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      // Note that we are returning status in a div below, right under the Board component
      // we are also listing out the buttons that will take us to each move (i.e. the history of the game)
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  // takes the current values of all squares and compares each square in a winning line
  // if matches, returns the square value (X or O); otherwise null
  // called from the Board's render function to see if the current render (re-render occurs when each square is clicked) has a winning line
  // the Board contains all the current square values
  function calculateWinner(squares) {
    const lines = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6],
    ];

    for (let i = 0; i < lines.length; i++){
      const [a,b,c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
        return squares[a];
      }
    }
    return null;
  }
  