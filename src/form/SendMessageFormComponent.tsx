// 送信するメッセージの情報を入力するためのフォームを表示する。
import * as React from "react";
import Store, { createSendMessageAction, Message } from "../store/Store";
import * as styles from "./SendMessageForm.module.css";

export default class SendMessageFormComponent extends React.Component<{},Message> {

  // 入力された全角文字が「変換中」の場合はfalse　「変換が完了している」場合はtrue
  isComposing: boolean = false;

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
    this.setCompositionStart = this.setCompositionStart.bind(this);
    this.setCompositionEnd = this.setCompositionEnd.bind(this);
  }

  // 名前フォームの入力値が確定された場合に、入力値を文字数制限分だけ切り取った上で、state中のname値を書き換える。
  doChangeName(e: any) {

    if (this.isComposing === false) { // 半角文字の入力時　及び　全角文字の変換完了時　に実施される処理

      // 入力値について、文字数制限の10文字分だけを切り取る。
      // for of を用いることで、サロゲートペアも1文字として処理できるようにする。
      let i_char_count = 0;
      let counted_name = "";
      for (let c of e.target.value) {
        counted_name = counted_name + c;
        i_char_count++;
        if (i_char_count >= 10) {
          break;
        }
      }

      // 切り取った文字を、このコンポーネントのstate中に設定する。
      this.setState({
        name: counted_name,
      });

    } else { // 全角文字の変換中　に実施される処理

      // 既に入力されている文字　及び　変換中の文字　を、このコンポーネントのstate中に設定する。
      this.setState({
        name: e.target.value,
      });
    }
  }

  // メッセージ内容フォームの入力値が確定された場合に、入力値を文字数制限分だけ切り取った上で、state中のcontent値を書き換える。
  doChangeContent(e: any) {
    
    if (this.isComposing === false) { // 半角文字の入力時　及び　全角文字の変換完了時　に実施される処理

      // 入力値について、文字数制限の255文字分だけを切り取る。
      // for of を用いることで、サロゲートペアも1文字として処理できるようにする。
      let i_char_count = 0;
      let counted_content = "";
      for (let c of e.target.value) {
        counted_content = counted_content + c;
        i_char_count++;
        if (i_char_count >= 255) {
          break;
        }
      }

      // 切り取った文字を、このコンポーネントのstate中に設定する。
      this.setState({
        content: counted_content,
      });

    } else { // 全角文字の変換中　に実施される処理

      // 既に入力されている文字　及び　変換中の文字　を、このコンポーネントのstate中に設定する。
      this.setState({
        content: e.target.value,
      });
    }
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

  // 名前・メッセージ内容のフォームに全角文字が入力され、変換中の状態になった場合に、メンバ変数の値を変更する。
  setCompositionStart(e: any) {
    this.isComposing = true;
  }

  // 名前・メッセージ内容のフォームに入力された全角文字の変換が完了した場合に、メンバ変数の値を変更し、入力文字数のチェックを行う。
  setCompositionEnd(e: any) {
    this.isComposing = false;

    if (e.target.id === "inputName") { // 名前のフォームで全角文字の変換が完了した場合
      this.doChangeName(e);
    } else { // メッセージ内容のフォームで全角文字の変換が完了した場合
      this.doChangeContent(e);
    }
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
              required
              onCompositionStart={this.setCompositionStart}
              onCompositionEnd={this.setCompositionEnd}
              id="inputName"
            />
          </div>
          <div>
            <textarea
              className={styles.inputContent}
              rows={1}
              wrap="soft"
              value={this.state.content}
              onChange={this.doChangeContent}
              required
              onCompositionStart={this.setCompositionStart}
              onCompositionEnd={this.setCompositionEnd}
              id="inputContent"
            ></textarea>
            <input className={styles.sendButton} type="submit" value="送信" />
          </div>
        </form>
      </div>
    );
  }
}
