const modes = {
    focus: { duration: 25 * 60, label: "Focus session", idle: "Sẵn sàng để tập trung" },
    break: { duration: 5 * 60, label: "Break session", idle: "Đến lúc nghỉ ngơi" }
};

const timerElement = document.querySelector("#timer");
const sessionTitle = document.querySelector("#session-title");
const statusElement = document.querySelector("#status");
const startButton = document.querySelector("#start-button");
const resetButton = document.querySelector("#reset-button");
const modeButtons = document.querySelectorAll(".mode-button");
const timerRing = document.querySelector(".timer-ring");

let currentMode = "focus";
let remainingSeconds = modes[currentMode].duration;
let intervalId = null;

function renderTimer() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    document.title = `${timerElement.textContent} | Pomodoro`;
}

function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
    startButton.textContent = "Bắt đầu";
    timerRing.classList.remove("running");
}

function finishSession() {
    stopTimer();
    statusElement.textContent = currentMode === "focus" ? "Hoàn thành phiên tập trung" : "Kết thúc giờ nghỉ";
    timerRing.classList.add("complete");
}

function tick() {
    if (remainingSeconds === 0) {
        finishSession();
        return;
    }

    remainingSeconds -= 1;
    renderTimer();
}

function toggleTimer() {
    if (intervalId) {
        stopTimer();
        statusElement.textContent = "Đã tạm dừng";
        return;
    }

    intervalId = setInterval(tick, 1000);
    startButton.textContent = "Tạm dừng";
    statusElement.textContent = "Đang tập trung";
    timerRing.classList.remove("complete");
    timerRing.classList.add("running");
}

function resetTimer() {
    stopTimer();
    remainingSeconds = modes[currentMode].duration;
    statusElement.textContent = modes[currentMode].idle;
    timerRing.classList.remove("complete");
    renderTimer();
}

function setMode(mode) {
    currentMode = mode;
    sessionTitle.textContent = modes[mode].label;
    modeButtons.forEach(function (button) {
        button.classList.toggle("active", button.dataset.mode === mode);
    });
    resetTimer();
}

startButton.addEventListener("click", toggleTimer);
resetButton.addEventListener("click", resetTimer);
modeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        setMode(button.dataset.mode);
    });
});

renderTimer();