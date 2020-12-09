// 送信するメッセージの情報を入力するためのフォームを表示する。
import * as React from "react";
import Store, { createSendMessageAction, Message } from "../store/Store";
import * as styles from "./SendMessageForm.module.css";

export default class SendMessageFormComponent extends React.Component<{}, Message> {
  constructor(props: {}) {
    super(props);

    // 入力された「送信者名」と「メッセージ内容」を保管するためのstateを用意する。
    this.state = {
      name: "",
      content: "",
      date: "",
    };

    // formの内容に関してのイベントが発生した時に実施するdo～の関数について、
    // 関数内で使用されるthisのbindを行う。
    this.doChangeName = this.doChangeName.bind(this);
    this.doChangeContent = this.doChangeContent.bind(this);
    this.doSubmit = this.doSubmit.bind(this);
  }

  // 名前フォームの入力値が変更された場合に、このコンポーネントのstateのname値を書き換える。
  doChangeName(e: any) {
    // 入力された値を、このコンポーネントのstate中に設定する。
    this.setState({
      name: e.target.value,
    });
  }

  // メッセージ内容フォームの入力値が変更された場合に、このコンポーネントのstateのcontent値を書き換える。
  doChangeContent(e: any) {
    // 入力された値を、このコンポーネントのstate中に設定する。
    this.setState({
      content: e.target.value,
    });
  }

  // フォームの内容が送信された場合に、メッセージリストに新しいメッセージを追加する。
  doSubmit(e: any) {
    e.preventDefault();
    // 現在の日時の文字列（YYYY-MM-DD HH:mm:ss）を生成する。
    // 月, 日, 時, 分, 秒が1桁だった場合は、0で穴埋めを行う。
    const nowDate = new Date();
    const nowDateString =
      nowDate.getFullYear() + "-" + // 年
      ("0" + (nowDate.getMonth() + 1)).slice(-2) + "-" + // 月
      ("0" + nowDate.getDate()).slice(-2) + " " + // 日
      ("0" + nowDate.getHours()).slice(-2) + ":" + // 時
      ("0" + nowDate.getMinutes()).slice(-2) + ":" + // 分
      ("0" + nowDate.getSeconds()).slice(-2); // 秒

    // フォームから入力された【送信者名】【メッセージ内容】の情報を取得する。
    // 【送信者名】【メッセージ内容】【日時】の情報を用いて、メッセージリストに新しいメッセージを追加する。（レデューサーにアクションを送信する。）
    const newMessage: Message = {
      name: this.state.name,
      content: this.state.content,
      date: nowDateString,
    };
    Store.dispatch(createSendMessageAction(newMessage));

    // コンポーネントのstate中の値を、初期値に戻す。
    this.setState({
      content: "",
    });
  }

  // フォームの表示のために、<div>～</div>の形で返却する。
  // 下記のようにフォームを配置する。
  // =========================================
  // 名前[名前の入力フォーム]
  // [メッセージ内容の入力フォーム][送信ボタン]
  // =========================================
  // 名前の入力フォームには、以下の設定を行う。
  // 　１．入力文字の最大長が10文字
  // 　２．入力を必須
  // 　３．入力フォームの直前に「名前」という文字を表示
  // メッセージ内容の入力フォームには、以下の設定を行う。
  // 　１．入力文字の最大長が255文字
  // 　２．入力を必須
  // 送信ボタンには、以下の設定を行う。
  // 　１．ボタン上に「送信」という文字を表示
  // styleについてはSendMessageForm.module.cssに従う。
  render() {
    return (
      <div>
        <form onSubmit={this.doSubmit}>
          <div>
            &nbsp;名前
            <input
              type="text"
              className={styles.inputName}
              value={this.state.name}
              onChange={this.doChangeName}
              maxLength={10}
              required
            />
          </div>
          <div>
            <textarea
              className={styles.inputContent}
              rows={1}
              wrap="soft"
              value={this.state.content}
              onChange={this.doChangeContent}
              maxLength={255}
              required
            ></textarea>
            <input
              className={styles.sendButton}
              type="submit"
              value="送信"
            />
          </div>
        </form>
      </div>
    );
  }
}
