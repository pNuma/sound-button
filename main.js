document.addEventListener('DOMContentLoaded', () => {
    const sounds = [
        'silence',
        'decay_level1_d50.wav',
        'decay_level2_d150.wav',
        'decay_level3_d300.wav',
        'decay_level4_d600.wav',
        '440.wav',
        'sweep_440to880.wav',
        'sweep_440to1760.wav',
        'sweep_880to440.wav',
        'sweep_1760to440.wav',
        'composite_chord.wav',
        'sequential_double_click.wav'
    ];
    const audioFolder = './sample/';

    // 要素の取得
    const mainButton = document.getElementById('main-button');
    const soundSelector = document.getElementById('sound-selector');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const volumeSlider = document.getElementById('volume-slider');

    // 状態管理
    let currentMode = 'fixed'; // 初期モード
    let clickCount = 0;
    let currentVolume = 0.5;


    // キャッシュ
    const audioCache = {};

    const preloadSounds = () => {
        sounds.forEach(soundFile => {
            if (soundFile === 'silence') return;
            const audio = new Audio(audioFolder + soundFile);
            audio.load(); // 
            audioCache[soundFile] = audio; // 読み込んだオーディオをキャッシュに保存
        });
    };


    const playSound = (soundFile) => {
        if (soundFile === 'silence') return;
        const audio = audioCache[soundFile];

        audio.volume = currentVolume
        audio.currentTime = 0; // 連続で押された場合、再生位置を最初に戻す
        audio.play();
    };

    // セレクター
    const setupSoundSelector = () => {
        sounds.forEach((soundFile, index) => {
            const option = document.createElement('option');
            option.value = soundFile;
            if (soundFile === 'silence') {
                option.textContent = 'Silence';
            } else {
                option.textContent = `Sound ${index}: ${soundFile.split('.')[0]}`;
            }

            soundSelector.appendChild(option);
        });
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
    mainButton.addEventListener('mousedown', () => {
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

    volumeSlider.addEventListener('input', () => {
        currentVolume = volumeSlider.value;
    });

    // 初期化
    setupSoundSelector();
    preloadSounds();
});