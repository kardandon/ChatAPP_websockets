class Square extends React.Component {
  render() {
      return (
          <button className="square"
          onClick={() => this.props.onClick()}>
              {this.props.value}
          </button>
      );
  }
}
class Board extends React.Component{
  renderSquare(i){
      return (
          <Square value ={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}
          />
      );
  }
  render() {
      return(
          <div className="board">
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
function min(a, b){
  return a < b ? a : b;
}
function max(a, b){
  return a > b ? a : b;
}
class TicTacToe extends React.Component {
  constructor(props) {
      super(props);
      this.state ={
          history:[{
              squares: Array(9).fill(null)
          }],
          Xisnext: true,
          Xbot: false,
          Obot: false
      };
      
  }
  componentDidUpdate(){
      setTimeout(() => {this.go();}, 500);
  }
  buttonX(){
      this.setState({Xbot: !this.state.Xbot});
      //this.go();
  }
  buttonO(){
      this.setState({Obot: !this.state.Obot});
      //this.go();
  }
  go(){
      const history = this.state.history;
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if(this.state.Xisnext && this.state.Xbot){
          this.move(this.minimax(squares));
          return;
      }
      else if(!this.state.Xisnext && this.state.Obot){
          this.move(this.minimax(squares));
          return;
      }
      return;
  }
  Restart(){
      this.setState({
          history:[{
              squares: Array(9).fill(null)
          }],
          Xisnext: true
      });
  }
  Undo(){
      let l = this.state.Xbot == true || this.state.Obot == true ? 2 : 1;
      const history = this.state.history;
      if (history.length > l){
      this.setState({
          history:
              history.splice(0,history.length - l)
          ,
          Xisnext: (l == 2 ? this.state.Xisnext : !this.state.Xisnext)
      });
      }
  }
  move(i){
      const history = this.state.history;
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (this.terminal(squares) || squares[i]){
          return;
      }
      let u = this.state.Xisnext;
      squares[i] = u ? 'X' : 'O';
      this.setState({
          history: history.concat([{
              squares: squares
          }]),
          Xisnext: !u,
      });
  }
  handleClick(i){
      if(!(this.state.Xisnext && this.state.Xbot) && !(!this.state.Xisnext && this.state.Obot)){
      this.move(i);
      this.go();
      }
  }
  player(board){
      let isX = false;
      for (let i=0; i<9; i++)
      {
          if (board[i] == null)
              isX = !isX;
      }
      if (isX) return 'X';
      else return 'O';
  }
  actions(board){
      let acts = [];
      for (let i=0; i<9; i++)
      {
          if (board[i] == null)
              acts.push(i);
      }
      return acts;
  }
  result(board, action)
  {
      if (board[action] != null)
          return;
      const new_board = board.slice();
      new_board[action] = this.player(board);
      return new_board;
  }
  terminal(board){
      if (calculateWinner(board) != null) return true;
      for (let i=0; i<9; i++)
      {
          if (board[i] == null)
              return false;
      }
      return true;
  }
  utility(board){
      let win = calculateWinner(board);
      if (win == 'X')
          return 1;
      else if (win =='O')
          return -1;
      else
          return 0;
  }
  min_value(board){
      if(this.terminal(board)) return this.utility(board);
      let val = 2;
      const acts = this.actions(board);
      for (let i=0; i < acts.length; i++)
      {
          val = min(val, this.max_value(this.result(board,acts[i])));
          if (val == -1) break;
      }
      return val;
  }
  max_value(board){
      if(this.terminal(board)) return this.utility(board);
      let val = -2;
      const acts = this.actions(board);
      for (let i=0; i < acts.length; i++)
      {
          val = max(val, this.min_value(this.result(board,acts[i])));
          if (val == 1) break;
      }
      return val;
  }
  minimax(board){
      if (this.terminal(board)) return null;
      let flag = true;
      for (let i=0; i<9;i++){
          if (board[i] != null){
              flag = false;
              break;
          }
      }
      if (flag){
          return Math.floor(Math.random() * 9);
      }
      const acts = this.actions(board);
      const pl = this.player(board);
      let best = acts[0];
      if (pl == 'X'){
          let val = -2;
          for (let i = 0; i < acts.length; i++){
              let cv = this.min_value(this.result(board, acts[i]));
              if (val < cv){
                  val = cv;
                  best = acts[i];
              }
              if (val == 1) return best;
          }
      }
      if (pl == 'O'){
          let val = 2;
          for (let i = 0; i < acts.length; i++){
              let cv = this.max_value(this.result(board, acts[i]));
              if (val > cv){
                  val = cv;
                  best = acts[i];
              }
              if (val == -1) return best;
          }
      }
      return best;
  }
  render() {
      const history = this.state.history;
      const current = history[history.length -1];
      const winner = calculateWinner(current.squares);
      let status;
      if (winner) {
          status = "Winner: " + winner;
      } 
      else if (this.terminal(current.squares)){
          status = "It's a draw!";
      } 
      else {
          status = "Next Player: " + (this.state.Xisnext ? 'X' : 'O');
      }
      return (
          <div>
          <div style={{display: 'inline-flex', alignItems: 'center'}}>
              <p style={{justifyContent: 'space-around', padding: '10px'}}> X is bot:</p>
              <label class="switch">
                  <input onClick={() => this.buttonX()} type="checkbox"/>
                  <span class="slider round"/>
              </label>
              <p style={{padding: '10px'}}> O is bot:</p>
              <label class="switch">
                  <input onClick={() => this.buttonO()} type="checkbox"/>
                  <span class="slider round"/>
              </label>
          </div>
          <div className="game-info">
              <h3>{status}</h3>
              <button className="game-info-button" onClick={() => this.Restart()}> Restart game</button>
              <button className="game-info-button" onClick={() => this.Undo()}> Undo </button>
            </div>
            <div className="game-board">
              <Board
                squares={current.squares}
                onClick={i => this.handleClick(i)}
              />
            </div>
            
          </div>
        );
  }
}

function Nav() {
  return (
     <nav>
         <h3 style={{float: "left"}}><a href="/">Emre Küçükkaya </a></h3>
         <ul className="nav-links">
             <li className="nav-links-list"> <a href="https://github.com/kardandon">About </a></li>
         </ul>
     </nav> 
  )
}

function App() {
  return (
    <div>
      <Nav/>
      <TicTacToe/>
    </div>
  );
}