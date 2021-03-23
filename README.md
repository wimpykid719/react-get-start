# Reactチュートリアル
今回のチュートリアルで実際に作成したOXゲーム

![react-get-start](https://user-images.githubusercontent.com/23703281/112090943-ca1c1680-8bd7-11eb-9ed6-a20b74d07022.gif)

## 最初に

Reactでアプリのフロント作成したり、NextJSやGatsbyJSを使って自分のブログをいつか作りたいのでその第一歩としてReactの公式チュートリアルを挑戦する事にした。

[チュートリアル：React の導入 - React](https://ja.reactjs.org/tutorial/tutorial.html)

簡単なOXゲームを通してReactの基本機能を学ぼうというものである。

その際に良く分からない機能を深掘りしていく事にした。

## render()は何をしているのか

Reactには2種類のrenderメソッドがある。

### ReactDOM.render()

誰かがReactのAPIを呼び出す文はこれだけと言っていたので、へぇーこれさえ覚えればいいのか意外に少ないなReact簡単じゃんと勘違いしました。

昔、このように書かれている記事を読んだ。

> React の API を露骨に呼び出しているのは最後の ReactDOM.render() だけ。しかもこれがこの記事に出てくる唯一の React の API です。

実際にはこの後に出てくる。 `component`, `Props・State`, `key`, `<button />`   等の概念・React組み込みのAPI、ReactでHTMLを扱う際に用いられる外部ライブラリ `JSX` などの知識が必要になってくるのでとても学習コスト高めです。 

**実際の使われ方**

Reactエレメントをドキュメント（生成されるhtml等の文書）にレンダリングする役割

公式チュートリアルではこのように使われている。

```jsx
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
```

`root` のIDをもつDOM要素（コンテナ）に `<Game />` をレンダリングしている。

複数のコンポーネントを返す事が出来ないみたいだ。

ReactDOM.render()による

**出来ない例**

```jsx
render() {
    return (
        <div>hoge</div>
        <div>fuga</div>
    )
}
```

**出来る例**

```jsx
render() {
    return (
        <div>
            <div>hoge</div>
            <div>fuga</div>
        </div>
    )
}
```

レンダリングが目的のメソッドなので、その他の処理を持たせないようにする。

### クラスコンポーネントで呼び出されるrender()

`React.Component` のサブクラスで定義する必要のある唯一のメソッドがこの `render()` になる。なので登場頻度は高めになる。

React.Componentの中で真っ先に呼び出されるのがrenderである。

Reactで画面を動かしたい時は、setStateメソッドを使用して、stateを更新する。

その際にrenderが自動で呼び出されるため、stateの変更差分が画面に反映される。

こちらも複数のコンポーネントは返す事が出来ない。

公式のチュートリアルに出てくる最初に気になった `render()` はこっちでクラスコンポーネントと呼ばれるクラスのメソッドとして書かれている。JSXなどで定義されたReactエレメントを返す処理を行なっている。

どこでrenderが実行されているんだろう?と思ってたが、Stateの値が更新されるたびに自動でrender()が走るのか。

### まとめ

- React.DOMのrender()が実際のDOM要素にレンダリングを行なっている。
- React.Componentのrender()はthis.propsとthis.stateを調べた後React要素などを返している。

## Componentとは

UIを再利用する事が出来る。

button.jsというのを作成して、それを `<button />` とする事で好きな場所で呼び出せるようにする。

コンポーネントには大きく2種類ある。

### Class Component（クラスコンポーネント）

props・state、lifecycleなどの状態を付与出来る。

### Functional Component（ファンクショナルコンポーネント）

propsのみ付与可能で余計な情報は付与させない。だがHooksを用いる事でstate、lifecycleを付与出来るようになった。最近はfunctional componentを使用するのが主流らしい。

### 実際の使用例

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <!--
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    -->
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
    -->
  </body>
</html>
```

**App.js**

```jsx
import React from 'react';

//Appというコンポーネントを作成
const App = () => {
	return (
		<div>
			<div>App</div>
		</div>
	);
};

//読み込み出来るように記述する。
export default App;
```

**index.js**

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

//App.jsを読み込む
import App from './App';

//index.htmlの#rootのdivタグ内に<div><div>App</div></div>が追加される。
ReactDOM.render(<App />, document.querySelector('#root'));
```

## Props とは

componentと合わせて使用される。親コンポーネントから子コンポーネントに値を渡す仕組み。

- 親→子に一方向のみ
- 受け取ったpropsを子コンポーネントで書き換える事は出来ない。

### なぜ使用するのか

ただコンポーネントだけだとそれと全く同じ物しか作成出来ない。融通が聞かない。

先ほどのapp Componentの例だとAppの中身を変更したいという時に似たような構成でも再びコンポーネントを作成する必要があるのでそれを回避してコンポーネントに柔軟性を持たせるためにpropsを使用する。

```jsx
const App = () => {
	return (
		<div>
			<div>App</div>
		</div>
	);
};
```

**親 Component MyApp.js**

```jsx
//APP.jsが2回それぞれのタイトル名で追加される。
<App title="My-App"/>
<App title="My-App2"/>

//index.htmlは下記のようになる。
<div>
	<div>My-App</div>
</div>
<div>
	<div>My-App2</div>
</div>
```

子コンポーネント App.js

```jsx
import React from 'react';

//Appというコンポーネントを作成
//たぶんこんな感じになってると思う。
//親コンポーネントから{title:'My-App'}の中身を受け取る。それをpropsという連想配列?に渡す。
const App = (props) => {
	return (
		<div>
			<div>{props.title}</div>
		</div>
	);
};

//読み込み出来るように記述する。
export default App;
```

これで一つのコンポーネントから別々のtitleを変更した要素を追加出来るようになった。

## Stateとは

コンポーネント単位で状態（数値、文字列、配列）を保持するための仕組み。

```jsx
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //{squares: [null, null,.......]}
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
```

こんな感じでコンストラクタで定義されて、使用される。

stateの中に連想配列で値を格納して取りさせ出せるようにしてる。少し違うのはstateの値を更新するには

`this.setState()` に更新したい値を代入する。 `this.setState()` を通す事で、更新する処理が終わったらクラスコンポーネントのに定義された`render()` が走るようになっている。そのため更新作業が複数ある場合はそれらの処理が終了したのちに `render()` が走るためたくさん `render()` が走ることはない。

```jsx
this.setState({
	squares: squares,
  xIsNext: !this.state.xIsNext,
});
```

最近ではStateの管理にReduxよりもHooksが使用されるのが主流になりつつある。しかし今回のチュートリアルではそれらを使用しなくても状態を管理するには十分なのでおいおいにしようと思う。

## Keyとは

Reactで予約されたプロパティ、動的に `<li>` のようなリスト要素が作成される際に割り当てる。

チュートリアルには下記のように書かれています。

> Keyは、どの要素が変更、追加もしくは削除されたのかをReactが識別するのに役立ちます。配列内の項目に安定した識別性を与えるため、それぞれの項目にkeyを与えるべきです。

Keyを使って再描画の処理を最小限に止めることが出来る。

**keyを使用しないと**

```html
<ul>
	<li>cat</li>
  <li>dog</li>
  <li>bird</li>
</ul>
```

このような要素があって `<li>` の一番上に  `<li>lion</li>` を追加する。

この場合にデータを一つ追加しただけですが、それぞれの要素順が1つずれる。lionは0, catは0→１~ birdは2→3になる。

するとReactでは兄弟要素全てが再描画の対象になり無駄にリソースを消費する。

### 参照

[[React]setState実行時のrenderメソッドの動きを検証する - Qiita](https://qiita.com/ozaki25/items/b7cc9434e83b5e0fe59b)

[コンポーネントの state - React](https://ja.reactjs.org/docs/faq-state.html)

[reactのrenderは何をやっているのか？コード付きで説明します。 |](https://mabui.org/react-render-description/)

[ReactDOMのrender()とReact.Componentのrender()の違いを理解する - Qiita](https://qiita.com/tatane616/items/9808f8861586fb2b2926)

[Reactを使うとなぜjQueryが要らなくなるのか - Qiita](https://qiita.com/naruto/items/fdb61bc743395f8d8faf)

[コンポーネントと props - React](https://ja.reactjs.org/docs/components-and-props.html)

### 一応読んだ。

タイトルはReact学習を楽にしてくれていると書いてあるが、あんまり関係ない気がする。難しそうな関数型プログラミングについて書かれているだけだった。

[React学習を楽にしてくれるJavaScriptでの関数型プログラミングの基礎知識 - Qiita](https://qiita.com/terry_6518/items/4b39826d9ee76076a0a7)

stateを理解したかったが、いまいちピンとこなかった。

[【Reactのstateとpropsの違いが知りたい！(変更・更新の仕方等デモあり)】過去のReact初心者の自分にpropsとstateの違いを説明する | 武骨日記](https://kenjimorita.jp/imadakarawakattareact/)

[](https://se-tomo.com/2019/03/09/%E3%80%90react-js%E3%80%91%E3%83%AA%E3%82%B9%E3%83%88%E3%81%A8key%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/)