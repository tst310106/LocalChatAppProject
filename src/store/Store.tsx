// コンポーネント間で共有される情報（送信されたメッセージ）を管理するreduxのstoreのファイル。

// メッセージに関する情報を格納するオブジェクトのデータ型
type Message = {
    name: string; // 送信者の名前の文字列（1～10文字）※inputタグの設定で入力チェックを行う。
    content: string; // メッセージの内容の文字列（1～255文字）※inputタグの設定で入力チェックを行う。
    date: string; // メッセージの送信日時の文字列（YYYY-MM-DD HH:mm:ss）
}

// Store中にのstateに保管するメッセージのリストのデータ型
type MessageList = {
    messageList: Message[]; // リストとして表示するメッセージ
    updateTime: string; // メッセージのリストの更新時間の文字列（YYYY-MM-DD HH:mm:ss）
}

// ローカルストレージから、最新のメッセージリストのデータを取得する。
// 第1引数：データのKey名
// 戻り値：ローカルストレージ中に最新のメッセージリストが存在した場合は、最新のメッセージリスト
// 　　　　存在しなかった場合は、null
function getLatestMessageListFromLocalStorage(): MessageList {

    // ローカルストレージ中の最新のメッセージリストの値を取得する。
    // 取得したデータを、関数の戻り値の型に変換した上で、返却する。

}

// getLatestMessageListFromLocalStorage()によって、現在の最新のメッセージリストのデータを取得する。

// Store中のstateの初期値initMesasgeListを、以下の条件に従って設定する。
// ◆最新のメッセージリストがローカルストレージから取得できた場合
// 　ローカルストレージの値を各プロパティに代入する。
// ◆取得できなかった場合
// 　messageList： []
// 　updateTime: ''
const initMesasgeList: MessageList;

// ディスパッチ時に送信されたアクションを元に、storeのstateの値を変更し、表示に反映させるレデューサー
// 第1引数：store中のstate
// 第2引数：ディスパッチ時に送信されたアクション
// 戻り値：新たにstoreに保管するstate
export function chatReducer(state: MessageList = initMesasgeList, action: SendMessageAction | ReloadListAction): MessageList{

    // 第2引数actionのtype属性の値に応じて返却値を切り替える。
    // ◆type属性値 = "SEND"の場合
    // 　sendMessageReduce関数の戻り値を返す。
    // ◆type属性値 = "RELOAD"の場合
    // 　reloadListReduce関数の戻り値を返す。

}

// レデューサー内で用いられる関数：送信されたメッセージの内容を現在のメッセージのリストに追加したstateを返す。
// 第1引数：store中のstate
// 第2引数：ディスパッチ時に送信されたアクション
// 戻り値：新たにstoreに保管するstate
function sendMessageReduce(state: MessageList, action: ReloadListAction): MessageList {

    // getLatestMessageListFromLocalStorage()によって、現在の最新のメッセージリストのデータを取得する。
    // 第2引数actionから、新しくメッセージリストに新しく追加するMessageObjを取り出す。
    // 最新のメッセージリストのデータの先頭に、新しく追加するMessageObjの情報を挿入する。
    // 追加後のメッセージリストのデータと更新時間を、改めてローカルストレージに保存し直す。
    // 新たなメッセージリストのデータを含むstateを返す。
    
}

// レデューサー内で用いられる関数：現在のローカルストレージの情報を反映させたstateを返す。
// 第1引数：store中のstate
// 戻り値：新たにstoreに保管するstate
function reloadListReduce(state: MessageList): MessageList  {

    // getLatestMessageListFromLocalStorage()によって、現在の最新のメッセージリストのデータを取得する。
    // 最新のメッセージリストのデータを含むstateを返す。

}

// メッセージ送信時のディスパッチ処理で、ストアに送信するアクションの型を宣言
type SendMessageAction = {
    type: string; // レデューサーで処理の判断を行うための識別子の文字列
    message: Message; // メッセージの情報
}

// 送信されたメッセージを表示するためのアクションを生成する。
// 第1引数：送信されたメッセージの情報
// 戻り値：第一引数を元に生成されたアクション
export function sendMessage(message: Message): SendMessageAction{

    // SendMessageAction型の変数を用意する。
    // typeプロパティに"SEND", messageObjプロパティに第1引数を代入して、返却する。

}

// メッセージのリストの更新時のディスパッチ処理でストアに送信するアクションの型を宣言
type ReloadListAction = {
    type: string; // レデューサーで処理の判断を行うための識別子の文字列
}

// メッセージのリストを更新するためのアクションを生成する。
// 戻り値：生成されたアクション
export function reloadList(): ReloadListAction{

    // ReloadListAction型の変数を用意する。
    // typeプロパティに"RELOAD"を代入して、返却する。

}

// レデューサーchatReducerを用いて、storeを作成する。
