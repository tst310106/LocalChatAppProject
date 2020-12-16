// 送信するメッセージの情報を入力するためのフォームを表示する。
import * as React from "react";
import Store, { createSendMessageAction, Message } from "../store/Store";
import * as styles from "./SendMessageForm.module.css";

export default class SendMessageFormComponent extends React.Component<{},Message> {

  // 入力された全角文字が「変換中」の場合はtrue　「変換が完了している」場合はfalse
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

    let settingName: string = e.target.value; // 最終的にsetState()でname値に格納する値

    if (this.isComposing === false) { // 半角文字の入力時　及び　全角文字の変換完了時　に実施される処理

      // サロゲートペアの文字を考慮した上で、入力値を1文字ずつ配列に格納する。
      const inputNameArray: string[] = Array.from(settingName);
      // 名前フォームの可能最大文字数
      const MAX_CHAR_COUNT = 10;

      // 入力値の文字数が可能最大文字数を上回った場合、上回った部分の文字列は無くす。
      if (inputNameArray.length > MAX_CHAR_COUNT) {

        // 後にsubstring()で特定部分の文字列の切り取りを行うため、上回った部分の文字列のlengthをカウントする。
        // ※通常の文字は「1」とカウント、サロゲートペアは「2」とカウント
        let overCharLength = 0;
        for (let i_name_array = MAX_CHAR_COUNT; i_name_array < inputNameArray.length; i_name_array++) {
          overCharLength = overCharLength + inputNameArray[i_name_array].length;
        }

        // 可能最大文字数の分だけ、文字列を切り取る。
        settingName = settingName.substring(0, (settingName.length - overCharLength));
      }
    }

    this.setState({
        name: settingName,
    });
  }

  // メッセージ内容フォームの入力値が確定された場合に、入力値を文字数制限分だけ切り取った上で、state中のcontent値を書き換える。
  doChangeContent(e: any) {
    
    let settingContent: string = e.target.value; // 最終的にsetState()でcontent値に格納する値

    if (this.isComposing === false) { // 半角文字の入力時　及び　全角文字の変換完了時　に実施される処理

      // サロゲートペアの文字を考慮した上で、入力値を1文字ずつ配列に格納する。
      const inputContentArray: string[] = Array.from(settingContent);
      // メッセージ内容フォームの可能最大文字数
      const MAX_CHAR_COUNT = 255;

      // 入力値の文字数が可能最大文字数を上回った場合、上回った部分の文字列は無くす。
      if (inputContentArray.length > MAX_CHAR_COUNT) {

        // 後にsubstring()で特定部分の文字列の切り取りを行うため、上回った部分の文字列のlengthをカウントする。
        // ※通常の文字は「1」とカウント、サロゲートペアは「2」とカウント
        let overCharLength = 0;
        for (let i_content_array = MAX_CHAR_COUNT; i_content_array < inputContentArray.length; i_content_array++) {
          overCharLength = overCharLength + inputContentArray[i_content_array].length;
        }

        // 可能最大文字数の分だけ、文字列を切り取る。
        settingContent = settingContent.substring(0, (settingContent.length - overCharLength));
      }
    }

    this.setState({
        content: settingContent,
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
