// === ここをあなたのGASのURLに書き換える ===
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyqPVbXn0rexxxnNAc0IAGh8W7NYmtt7hH7cnkg0DVgEGELD9wjNzwTTyc0LbEhS3g/exec";
// ===========================================

document.addEventListener("DOMContentLoaded", function() {
  const statusElem = document.getElementById("worship-status");
  const buttonElem = document.getElementById("worship-button");
  const buttonImgElem = buttonElem ? buttonElem.querySelector("img") : null;
  const today = new Date().toLocaleDateString("sv-SE"); // yyyy-mm-dd
  
  // 画像のパス
  const imgStart = "image/参拝ボタン.webp";        // 「参拝する」画像
  const imgDone = "image/参拝済みボタン.webp";   // 「参拝済み」画像
  
  // 1. 自分のブラウザに「今日の参拝記録」があるかチェック
  const myVisitStatus = localStorage.getItem("worship_" + today);
  
  if (myVisitStatus === "done") {
    if (buttonImgElem) {
      buttonImgElem.src = imgDone;
      buttonImgElem.alt = "本日参拝済み";
    }
    if (buttonElem) buttonElem.disabled = true;
  }
  
  // 2. 共有のスプレッドシートに「今日の最初の気配」があるかチェック（常時）
  // ※ &t= をつけてブラウザがキャッシュを読まないようにしています
  fetch(GAS_WEB_APP_URL + "?action=check&t=" + Date.now())
    .then(response => response.json())
    .then(data => {
      if (data.hasVisitor) {
        if (statusElem) statusElem.innerText = "今日、すでに誰かが訪れた気配がします。";
      } else {
        if (statusElem) statusElem.innerText = "今日はまだ静かなようです。";
      }
    })
    .catch(error => console.error("気配の確認に失敗しました:", error));
  
  // 3. 参拝ボタンを押した時の処理
  if (buttonElem) {
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
            if (statusElem) statusElem.innerText = "今日、すでに誰かが訪れた気配がします。";
          }
        })
        .catch(error => console.error("参拝の記録に失敗しました:", error));
    });
  }
});