// 送信された複数のメッセージの情報をリストで表示するコンポーネントのファイル。
import * as React from "react";
import Store, {
  getLatestMessageListFromLocalStorage,
  MessageList,
  Message,
  reloadList,
} from "../store/Store";
import { connect } from "react-redux";
import MessageComponent from "./MessageComponent";
import * as styles from "./MessageList.module.css";

class MessageListComponent extends React.Component<MessageList> {
    
  constructor(props: MessageList) {
    super(props);

    // タイマー処理によって1秒ごとに以下の操作を実行する。
    // 　１．ローカルストレージから、現在の最新のメッセージリストのデータを取得する。
    // 　２．現在表示しているメッセージリストの更新日と、最新のメッセージリストの更新日を比較し、
    // 　　一致していなければメッセージリストの表示の更新を行う。（レデューサーにアクションを送信する。）
    // this.state = {
    //     updateTime: ""
    // };
    setInterval(() => {
      let latestMessageList = getLatestMessageListFromLocalStorage();
      if (latestMessageList.updateTime !== this.props.updateTime) {
        Store.dispatch(reloadList());
      }
    }, 1000);
  }

  // リストで表示するメッセージの情報を、<div>～</div>の形で返却する。
  // メッセージの情報としては、reduxのstoreのstate中に保管されている以下の3つの値を用いる。
  // 　１．送信者の名前の文字列（1～10文字）※inputタグの設定で入力チェックを行う。
  // 　２．メッセージの内容の文字列（1～255文字）※inputタグの設定で入力チェックを行う。
  // 　３．メッセージの送信日時の文字列（YYYY-MM-DD HH:mm:ss）
  // 上記の3つの値を、Messageコンポーネントの属性として設定することで、メッセージを表示する。
  // また、ループ処理によって複数のMessageコンポーネントを作ることで、メッセージをリスト化して表示する。
  // Messageコンポーネントを作る際のkey値の設定は、メッセージ同士で重複しないように行う。
  // styleについてはMessageList.module.cssに従う。
  render() {
    let stateMessageList = this.props.messageList;
    let mapMessages = stateMessageList.map((value: Message) => (
      <MessageComponent
        key={value.name + value.date}
        name={value.name}
        content={value.content}
        date={value.date}
      />
    ));
    return (
      <div className={styles.listBlock}>
        <table className={styles.list}>
          <tbody>{mapMessages}</tbody>
        </table>
      </div>
    );
  }
}

// reduxのstoreのstateの値を、このコンポーネント内で取り出せるように、storeと接続を行う。
// （storeと接続することで、コンポーネント内でstore中のstateをthis.props.の形で取り出せる。）
// （また、storeのstateの値が変更された場合、stateの値を用いている箇所は再レンダリングされる。）
export default connect<MessageList>((state: any) => state)(MessageListComponent);
