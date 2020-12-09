// 複数のコンポーネントの配置を設定する、最上位のコンポーネントのファイル。
import React, { Component } from 'react';
import SendMessageFormComponent from './form/SendMessageFormComponent';
import MessageListComponent from './message/MessageListComponent';
import * as styles from "./App.module.css";

class App extends Component {

  // ローカルチャットアプリの表示をを<div>～</div>の形で返却する。
  // 下記のようにコンポーネント等を配置する。
  // =========================================
  // 簡易チャット
  // ≪SendMessageFormコンポーネント≫
  // ≪MessageListコンポーネント≫
  // =========================================
  // ※上記の「簡易チャット」は、タイトル文字を表す。
  // styleについてはApp.module.cssに従う。
  render() {
    return (
      <div className={styles.topDivBlock}>
        <h2>&nbsp;簡易チャット</h2>
        <SendMessageFormComponent />
        <MessageListComponent />
      </div>
    );
  };
}

export default App;
