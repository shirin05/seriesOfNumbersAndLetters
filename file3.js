let pattern = [];
let progress = 0;
let gamePlaying = false;
let tonePlaying = false;
let volume = 0.5;
let guessCounter = 0;
let mode = 'easy';
let clueHoldTime = 1000;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;
const freqMap = { 1: 261.6, 2: 329.6, 3: 392, 4: 466.2 };

let AudioContext = window.AudioContext || window.webkitAudioContext;
let context = new AudioContext();
let o = context.createOscillator();
let g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function startGame() {
    pattern = Array.from({ length: 8 }, () => Math.floor(Math.random() * 4) + 1);
    progress = 0;
    gamePlaying = true;
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playClueSequence();
}

function stopGame() {
    gamePlaying = false;
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
}

function playTone(btn, len) {
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
    setTimeout(stopTone, len);
}

function startTone(btn) {
    if (!tonePlaying) {
        context.resume();
        o.frequency.value = freqMap[btn];
        g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
        context.resume();
        tonePlaying = true;
    }
}

function stopTone() {
    g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
    tonePlaying = false;
}

function lightButton(btn) {
    document.getElementById("button" + btn).classList.add("lit");
}

function clearButton(btn) {
    document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
    if (gamePlaying) {
        lightButton(btn);
        playTone(btn, clueHoldTime);
        setTimeout(clearButton, clueHoldTime, btn);
    }
}

function playClueSequence() {
    context.resume();
    let delay = nextClueWaitTime;
    guessCounter = 0;
    clueHoldTime = mode === 'hard' ? 500 : 1000;
    for (let i = 0; i <= progress; i++) {
        setTimeout(playSingleClue, delay, pattern[i]);
        delay += clueHoldTime;
        delay += cluePauseTime;
    }
}

function guess(btn) {
    if (!gamePlaying) return;
    if (pattern[guessCounter] === btn) {
        if (guessCounter === progress) {
            if (progress === pattern.length - 1) {
                winGame();
            } else {
                progress++;
                playClueSequence();
            }
        } else {
            guessCounter++;
        }
    } else {
        loseGame();
    }
}

function loseGame() {
    stopGame();
    alert("Game Over. You lost!");
}

function winGame() {
    stopGame();
    alert("Game Over. You won!");
}

function setMode(selectedMode) {
    mode = selectedMode;
    alert(`Mode set to ${selectedMode.toUpperCase()}`);
}

