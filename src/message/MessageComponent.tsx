// 送信された1つのメッセージの情報をを1行で表示するコンポーネントのファイル。
import * as React from "react";
import { Message } from "../store/Store";
import * as styles from "./Message.module.css";

export default class MessageComponent extends React.Component<Message> {
  // 1つのメッセージの情報を<tr>～</tr>の形で返却する。
  // メッセージの情報としては、上位コンポーネントから渡された以下の3つの値を用いる。
  // 　１．送信者の名前の文字列（1～10文字）※inputタグの設定で入力チェックを行う。
  // 　２．メッセージの内容の文字列（1～255文字）※inputタグの設定で入力チェックを行う。
  // 　３．メッセージの送信日時の文字列（YYYY-MM-DD HH:mm:ss）
  // 渡された値を表示する際には、「送信者の名前」：「メッセージ内容」　「送信日時」　の形にする。
  // styleについてはMessage.module.cssに従う。

  render() {
    return (
      <tr className={styles.messageRow}>
        <td className={styles.messageContent}>
          {this.props.name}：{this.props.content}
        </td>
        <td className={styles.messageDate}>{this.props.date}</td>
      </tr>
    );
  }
}
