import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
  最初はSquareで状態を管理していたが、Boradで管理するように
  なったため、こstateを削除した。
*/

//子 React.Componentを継承してpropsを受け取ってる。
// super()を実行したのでthisが使用出来る。
// このthisはSquareを参照してる。
// class Square extends React.Component {

//   render() {
//     return (
//       <button 
//         className="square" 
//         onClick={() => this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

//クラスコンポーネントから関数コンポーネントに変更された。
/*
  組み込みの DOM コンポーネントである <button> に onClick プロパティが設定されているため React がクリックに対するイベントリスナを設定します。
*/
function Square(props) {
  return (
    /*
      最初のonClickはbuttonの組み込みでpropsのonClickはBoardから渡されたもので
      クリックによって実行されるとBoardのhandleClickが実行される。それでStateの値を更新する。
    */
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

//親 propsを通して親から子へデータが流れる。
/*
ただ親ならボードより上にあると上から下に流れるというイメージで
わかりやすいのに、ダメなのか？
*/
class Board extends React.Component {
  // GameにStateをリフトアップしたのでコンストラクタを削除する。
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     //{squares: [null, null,.......]}
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //   };
  // }
  // handleClick(i) {
  //   //配列のコピーを生成している。それに変更を加えている。
  //   //履歴の機能をあとから追加するため。
  //   const squares = this.state.squares.slice();
  //   //勝敗がついていたらまたはすでにoxが埋まってたら、押せないようにする。
  //   if (calculateWinner(squares) || squares[i]) {
  //     return
  //   }
  //   squares[i] = this.state.xIsNext ? 'X': 'O';
  //   this.setState({
  //     squares: squares,
  //     xIsNext: !this.state.xIsNext,
  //   });
  // }

  renderSquare(i) {
    return (
      <Square 
        /*
          iにはthis.renderSquare(0~8)の0~8が入る。
          その番号を使ってBoardに作成された。Stateにアクセスしてる。
          state はそれを定義しているコンポーネント内でプライベートなものですので、
          Square から Board の state を直接書き換えることはできません。
          そのため、stateを更新する際はboradのhandleClick関数をsquareから実行する事で更新する。
        */
        // Boradはstateを持たなくなったので、propsに置き換える。
        // value={this.state.squares[i]}
        value={this.props.squares[i]}
        /*
          このonClickはboradが定義してsuquareにpropsを通して渡している。
          SquareにあるonClickとは別
        */
        // Gameからもらうようになるので変更する。
        // onClick={() => this.handleClick(i)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  // Stateの値が更新されるたびに自動でrenderが走る。
  // なのでこのコンポーネントではSquareがクリックされるたびにhandleClick()が実行され、
  // そこでStateの値が更新されrenderが走る。
  render() {
    // const winner = 
    //   calculateWinner(this.state.squares);
    //   let status;
    //   if (winner) {
    //     status = 'Winner: ' + winner;
    //   } else {
    //     status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    //   }

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
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    // ここ別にslice()だけでも同じ動作だと思うけど、パフォーマンスを思ってなのか？？この考えがそもそも違った。
    // historyに[Null, Null, .......]が入る。
    /*
      ここでsliceして現在の指定されているstepNumberまでの履歴を取得するもし
      戻ったりしていなければ、slice()と同じ意味で配列が消えたりしない。
      jumpToを返してstepNumberが変更されている場合は、stepNumberまでの値を取得しているため
      そこまでをスライスしてあとは切り捨てられる。そのため履歴を戻れば、それに合わせて
      戻った箇所より前にある履歴が消える。
    */
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // ここでsquaresにXかOを代入してる。最初はTrueでXが入る。
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      // pushだと元の配列が変更されてしまうのでconcatで新しい配列を作成してる。
      // history[{squares: [Null, Null, ...]}, {squares: [Null, Null, X ...]}, {毎回ここをconcutで追加してる}... ]追加してる。
      /*
        const array1 = ['a', 'b', 'c'];
        const array2 = ['d', 'e', 'f'];
        const array3 = array1.concat(array2);

        console.log(array3);
        // expected output: Array ["a", "b", "c", "d", "e", "f"]
      */
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    //第一引数は{suquare: ...}、第二引数に0,1,2と要素の添字が入る。
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={i => this.handleClick(i)}
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
    // 一番左側を起点に真ん中、左側を比較してマス目が揃っているか判断する。
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // 揃っていたマス目の一つを返して勝利したプレーヤーを表示する。
      return squares[a];
    }
  }
  return null;
}