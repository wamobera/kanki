// ギャラリーを読み込んで描画する関数
async function loadGallery(filename) {
    const container = document.getElementById('gallery-container');
    container.innerHTML = ''; // 一度中身を空にする

    try {
        const response = await fetch(filename);
        const markdownText = await response.text();

        const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
        let match;

        while ((match = imageRegex.exec(markdownText)) !== null) {
            const altText = match[1];
            const imgPath = match[2];

            const thumbDiv = document.createElement('div');
            thumbDiv.className = 'thumbnail';

            const imgElem = document.createElement('img');
            imgElem.src = imgPath;
            imgElem.alt = altText;

            imgElem.loading = "lazy";

            thumbDiv.appendChild(imgElem);
            container.appendChild(thumbDiv);
            
        }

        // 新しく表示されたサムネイルに対して拡大機能を再度有効化
        setupModal();

    } catch (error) {
        console.log('Markdownの読み込みに失敗しました', error);
    }
}

// タブボタンの切り替え制御
const tabButtons = document.querySelectorAll('.tab-btn');

tabButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // すべてのボタンから active クラスを外す
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // クリックされたボタンに active クラスを付ける
        e.target.classList.add('active');

        // ボタンに設定されているファイル名を取得して読み込む
        const targetFile = e.target.getAttribute('data-file');
        loadGallery(targetFile);
    });
});

// ページを開いたときは「オリジナル」をデフォルトで読み込む
loadGallery('gallery-original.md');


// 拡大表示（モーダル）の仕組み
function setupModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close-btn');
    const thumbnails = document.querySelectorAll('.thumbnail img');
    const fixedNav = document.querySelector('.fixed-nav');

    thumbnails.forEach(img => {
        // 既存のイベント重複を防ぐため一度クローンするか、シンプルに記述
        img.onclick = () => {
            modal.style.display = 'flex';
            modalImg.src = img.src;
            modalCaption.textContent = img.alt;
            if (fixedNav) fixedNav.style.display = 'none';
        };
    });

    function closeModal() {
        modal.style.display = 'none';
        modalCaption.textContent = '';
        if (fixedNav) fixedNav.style.display = 'block';
    }

    closeBtn.onclick = closeModal;

    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };
}