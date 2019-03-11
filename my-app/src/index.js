import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// pick up here https://reactjs.org/tutorial/tutorial.html#why-immutability-is-important
// run from here: C:\Users\debor\source\repos\ReactIntro\my-app

class Square extends React.Component {
// no constructor is needed because this component is not keeping track of the game's state
// note that a built-in component like button needs onClick as the name of the prop that represents the Click event
// A custom component could have a different prop name
// But by convention, it's typical in React to use "on[Event]" for props representing events
// and "handle[Event]" for the methods that handle those events
// Because Square does not maintain its own state, but receives it from Board via props, and informs Board when changes should be made via props
// Square is a controlled component

    render() {
      return (
        <button 
          className="square" 
          onClick={() =>  this.props.onClick() }
        >
          {this.props.value}
        </button>
      );
    }
  }
  
  class Board extends React.Component {
    constructor(props){
      super(props);
      // we're filling each square with a null value to start
      this.state = {
        squares: Array(9).fill(null),
      };
    }

    // this is the method that handles the click event in the Square component.  It's accessible to the child Square component
    // because it's passed down as a prop.
    handleClick(i) {
      // we're using slice with no args to populate a new array "const squares" with the entire this.state.squares array
      const squares = this.state.squares.slice();

      // changing the current square to show 'X'
      squares[i] = 'X';

      // updating the state (can only do this with setState, of course, which is why we do the slice thing above - 
      //state is immutable other than when being changed via setState)
      this.setState({squares: squares});
    }

    renderSquare(i) {
      const status = 'Next Player: X';
      // Here we're passing down the current square value to the Square component and a function that Square can call when clicked; both as props
      // the parentheses are necessary after return so JS doesn't insert a ';' after return
      return (
        <Square 
          value={this.state.squares[i]} 
          onClick={() => this.handleClick(i)}
        />
      );
    }
  
    render() {
      const status = 'Next player: X';
  
      return (
        <div>
          <div className="status">{status}</div>
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
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
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
  