// === ここをあなたのGASのURLに書き換える ===
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx4qxPNOzipk2P1R5RFZmLEDEsulvP4oJgz9T0GZe4AUrcXCzq-7c3fRMudawErbdY/exec";
// ===========================================

document.addEventListener("DOMContentLoaded", function() {
  const statusElem = document.getElementById("worship-status");
  const buttonElem = document.getElementById("worship-button");
  const today = new Date().toLocaleDateString("sv-SE"); // yyyy-mm-dd
  
  // 1. 自分のブラウザに「今日の参拝記録」があるかチェック
  const myVisitStatus = localStorage.getItem("worship_" + today);
  
  if (myVisitStatus === "done") {
    // 参拝済みならボタンを無効化
    buttonElem.innerText = "本日参拝済み";
    buttonElem.disabled = true;
  }
  
  // 2. 共有のスプレッドシートに「今日の最初の気配」があるかチェック（常時）
  fetch(GAS_WEB_APP_URL + "?action=check")
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
    
    // ボタンを参拝済みに
    buttonElem.innerText = "本日参拝済み";
    buttonElem.disabled = true;
    
    // スプレッドシートに「気配」を送る
    fetch(GAS_WEB_APP_URL + "?action=visit")
      .then(response => response.json())
      .then(data => {
        if (data.status === "recorded") {
          // 自分が最初の1人だった場合、気配の表示も変える
          statusElem.innerText = "今日、すでに誰かが訪れた気配がします。";
        }
      })
      .catch(error => console.error("参拝の記録に失敗しました:", error));
  });
});