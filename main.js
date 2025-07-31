document.addEventListener('DOMContentLoaded', () => {
    const sounds = [
        '440.wav',
        '440to880.wav',
        '440to1760.wav',
        '880to440.wav',
        '1760to440.wav'
    ];
    const audioFolder = './sample/'; 

    // 要素の取得
    const mainButton = document.getElementById('main-button');
    const soundSelector = document.getElementById('sound-selector');
    const modeButtons = document.querySelectorAll('.mode-btn');

    // 状態管理
    let currentMode = 'fixed'; // 初期モード
    let clickCount = 0;


    // セレクター
    const setupSoundSelector = () => {
        sounds.forEach((soundFile, index) => {
            const option = document.createElement('option');
            option.value = soundFile;
            option.textContent = `Sound ${index + 1}: ${soundFile.split('.')[0]}`;
            soundSelector.appendChild(option);
        });
    };

    const playSound = (soundFile) => {
        if (!soundFile) return; 
        const audio = new Audio(audioFolder + soundFile);
        audio.play().catch(error => console.error("音声の再生に失敗しました:", error));
    };

    // モード選択ボタン
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentMode = button.dataset.mode;
            clickCount = 0;
        });
    });

    // 再生ボタン
    mainButton.addEventListener('click', () => {
        let soundToPlay;

        switch (currentMode) {
            //同じサウンドを鳴らす
            case 'fixed':
                soundToPlay = soundSelector.value;
                break;

            // 5の倍数の時にサウンドを変更
            case 'five-times':
                clickCount++;
                if (clickCount > 0 && clickCount % 5 === 0) {
                    const nextIndex = (soundSelector.selectedIndex + 1) % sounds.length;
                    soundSelector.selectedIndex = nextIndex;
                }
                soundToPlay = soundSelector.value;
                break;

            //ランダム
            case 'random':
                const randomIndex = Math.floor(Math.random() * sounds.length);
                soundSelector.selectedIndex = randomIndex;
                soundToPlay = soundSelector.value;
                break;
        }

        playSound(soundToPlay);
    });

    // 初期化
    setupSoundSelector();
});