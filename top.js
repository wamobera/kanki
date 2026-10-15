// === ここをあなたのGASのURLに書き換える ===
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw4uCOeoL5o4zBXOL8DKoQuMzYoGpt7fNVfHjuQrcBEMe3_RkjjJbJjfVSBUrp2jHy3/exec";
// ===========================================

document.addEventListener("DOMContentLoaded", function() {
  const statusElem = document.getElementById("worship-status");
  const buttonElem = document.getElementById("worship-button");
  const buttonImgElem = buttonElem.querySelector("img"); // ボタンの中の画像を取得
  const today = new Date().toLocaleDateString("sv-SE"); // yyyy-mm-dd
  
  // 画像のパス（必要に応じてファイル名に合わせてください）
  const imgStart = "image/参拝ボタン.webp";        // 「参拝する」画像
  const imgDone = "image/参拝済みボタン.webp";   // 「参拝済み」画像
  
  // 1. 自分のブラウザに「今日の参拝記録」があるかチェック
  const myVisitStatus = localStorage.getItem("worship_" + today);
  
  if (myVisitStatus === "done") {
    // 参拝済みなら画像を切り替えてボタンを無効化
    if (buttonImgElem) {
      buttonImgElem.src = imgDone;
      buttonImgElem.alt = "本日参拝済み";
    }
    buttonElem.disabled = true;
  }
  
  // 2. 共有のスプレッドシートに「今日の最初の気配」があるかチェック（常時）
  // ※ &t= をつけてブラウザがキャッシュ（古い記憶）を読まないようにしています
  fetch(GAS_WEB_APP_URL + "?action=check&t=" + Date.now())
    .then(response => response.json())
    .then(data => {
      if (data.hasVisitor) {
        statusElem.innerText = "今日、すでに誰かが訪れた気配がします。";
      } else {
        statusElem.innerText = "今日はまだ静かなようです。";
      }
    })
    .catch(error => console.error("気配の確認に失敗しました:", error));
  
  // 3. 参拝ボタンを押した時の処理
  buttonElem.addEventListener("click", function() {
    // 自分のブラウザに記録
    localStorage.setItem("worship_" + today, "done");
    
    // 押した瞬間に画像を切り替えてボタンを無効化
    if (buttonImgElem) {
      buttonImgElem.src = imgDone;
      buttonImgElem.alt = "本日参拝済み";
    }
    buttonElem.disabled = true;
    
    // スプレッドシートに「気配」を送る
    fetch(GAS_WEB_APP_URL + "?action=visit")
      .then(response => response.json())
      .then(data => {
        if (data.status === "recorded" || data.status === "already_exists") {
          // 記録成功（またはすでに誰か来ていた場合）
          statusElem.innerText = "今日、すでに誰かが訪れた気配がします。";
        }
      })
      .catch(error => console.error("参拝の記録に失敗しました:", error));
  });
});