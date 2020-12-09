// コンポーネント間で共有される情報（送信されたメッセージ）を管理するreduxのstoreのファイル。
import { createStore } from "redux";

// メッセージに関する情報を格納するオブジェクトのデータ型
export type Message = {
  name: string; // 送信者の名前の文字列（1～10文字）※inputタグの設定で入力チェックを行う。
  content: string; // メッセージの内容の文字列（1～255文字）※inputタグの設定で入力チェックを行う。
  date: string; // メッセージの送信日時の文字列（YYYY-MM-DD HH:mm:ss）
};

// Store中にのstateに保管するメッセージのリストのデータ型
export type MessageList = {
  messageList: Message[]; // リストとして表示するメッセージ
  updateTime: string; // メッセージのリストの更新時間の文字列（YYYY-MM-DD HH:mm:ss）
};

// ローカルストレージ中に保存するデータのKey名を指定する。
const MESSAGE_LIST_KEY = "MessageList";

// ローカルストレージから、最新のメッセージリストのデータを取得する。
// 戻り値：以下のように、条件によって異なる。
// 　　　　◆ローカルストレージ中の最新のメッセージリストが存在する場合
// 　　　　　最新のメッセージリスト
// 　　　　◆存在しない場合
// 　　　　　空のメッセージリスト
export function getLatestMessageListFromLocalStorage(): MessageList {
  // ローカルストレージ中の最新のメッセージリストの値を取得する。
  const localStorageData = localStorage.getItem(MESSAGE_LIST_KEY);

  // 取得したデータを、関数の戻り値の型に変換した上で、返却する。
  if (typeof localStorageData === "string") {
    const latestMessageList: MessageList = JSON.parse(localStorageData);
    return latestMessageList;

　// ローカルストレージのデータが存在しない場合は、空のメッセージリストを生成し返却する。
  } else {
    return {
      messageList: [],
      updateTime: "",
    };
  }
}

// 指定したメッセージリストのデータを、ローカルストレージに保存する。
// 第1引数：メッセージリストのデータ
function setMessageListToLocalStorage(msgList: MessageList): void {
  // 第1引数の情報を文字列型に変換し、ローカルストレージに保存する。
  localStorage.setItem(MESSAGE_LIST_KEY, JSON.stringify(msgList));
}

// getLatestMessageListFromLocalStorage()によって、現在の最新のメッセージリストのデータを取得する。
// Store中のstateの初期値initMessageListを、以下の条件に従って設定する。
// ◆最新のメッセージリストがローカルストレージから取得できた場合
// 　ローカルストレージの値を各プロパティに代入する。
// ◆取得できなかった場合
// 　messageList： []
// 　updateTime: ''
const initMessageList: MessageList = getLatestMessageListFromLocalStorage();

// ディスパッチ時に送信されたアクションを元に、storeのstateの値を変更し、表示に反映させるレデューサー
// 第1引数：store中のstate
// 第2引数：ディスパッチ時に送信されたアクション
// 戻り値：新たにstoreに保管するstate
export function chatReducer(
  state: MessageList = initMessageList,
  action: SendMessageAction | ReloadListAction
): MessageList {
  // 第2引数actionのtype属性の値に応じて返却値を切り替える。
  switch (action.type) {
    // ◆type属性値 = "SEND"の場合
    // 　sendMessageReduce関数の戻り値を返す。
    case "SEND":
      return sendMessageReduce(action as SendMessageAction);

    // ◆type属性値 = "RELOAD"の場合
    // 　reloadListReduce関数の戻り値を返す。
    case "RELOAD":
      return reloadListReduce();

    default:
      return state;
  }
}

// レデューサー内で用いられる関数：送信されたメッセージの内容を現在のメッセージのリストに追加したstateを返す。
// 第1引数：ディスパッチ時に送信されたアクション
// 戻り値：新たにstoreに保管するstate
function sendMessageReduce(action: SendMessageAction): MessageList {
  // getLatestMessageListFromLocalStorage()によって、現在の最新のメッセージリストのデータを取得する。
  const latestMessageList = getLatestMessageListFromLocalStorage();

  // 第2引数actionから、新しくメッセージリストに新しく追加するMessageを取り出す。
  const newMessage = action.message;

  // 最新のメッセージリストのデータの先頭に、新しく追加するMessageの情報を挿入する。
  latestMessageList.messageList.unshift(newMessage);
  latestMessageList.updateTime = newMessage.date;

  // 追加後のメッセージリストのデータと更新時間を、改めてローカルストレージに保存し直す。
  setMessageListToLocalStorage(latestMessageList);

  // 新たなメッセージリストのデータを含むstateを返す。
  return latestMessageList;
}

// レデューサー内で用いられる関数：現在のローカルストレージの情報を反映させたstateを返す。
// 戻り値：新たにstoreに保管するstate
function reloadListReduce(): MessageList {
  // getLatestMessageListFromLocalStorage()によって、現在の最新のメッセージリストのデータを取得する。
  // 最新のメッセージリストのデータを含むstateを返す。
  return getLatestMessageListFromLocalStorage();
}

// メッセージ送信時のディスパッチ処理で、ストアに送信するアクションの型を宣言
type SendMessageAction = {
  type: string; // レデューサーで処理の判断を行うための識別子の文字列
  message: Message; // メッセージの情報
};

// 送信されたメッセージを表示するためのアクションを生成する。
// 第1引数：送信されたメッセージの情報
// 戻り値：第一引数を元に生成されたアクション
export function createSendMessageAction(message: Message): SendMessageAction {
  // SendMessageAction型の変数を用意する。
  // typeプロパティに"SEND", messageObjプロパティに第1引数を代入して、返却する。
  return {
    type: "SEND",
    message: message
  };
}

// メッセージのリストの更新時のディスパッチ処理でストアに送信するアクションの型を宣言
type ReloadListAction = {
  type: string; // レデューサーで処理の判断を行うための識別子の文字列
};

// メッセージのリストを更新するためのアクションを生成する。
// 戻り値：生成されたアクション
export function createReloadListAction(): ReloadListAction {
  // ReloadListAction型の変数を用意する。
  // typeプロパティに"RELOAD"を代入して、返却する。
  return {
    type: "RELOAD",
  };
}

// レデューサーchatReducerを用いて、storeを作成する。
export default createStore(chatReducer);
