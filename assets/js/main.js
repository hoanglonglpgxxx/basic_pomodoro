const modes = [
    ['Pomodoro', document.querySelector('#pomodoroMode'), 'rgb(90 109 142)', 60],
    ['Short Break', document.querySelector('#shortBreakMode'), 'rgb(192 110 130)', 15],
    ['Long Break', document.querySelector('#longBreakMode'), '#375192', 30],
];
const setPageTitle = text => document.title = text;
const minutesToSeconds = minutes => minutes * 60;
const secondsToMinutes = seconds => Math.floor(seconds / 60);
const setButtonColor = color => controlBtn.style.color = color;
const setButtonText = text => controlBtn.value = text;
const setPageColor = color => document.body.style.background = color;
const clearActiveMode = () => document.querySelector('.active').classList.remove('active');
const getActiveMode = () => document.querySelector('.active').innerText;
const setActiveMode = mode => {
    clearActiveMode();
    // console.log(mode);
    mode.classList.add('active');
};
// const texrt = document.querySelector('#texrt');
// texrt.addEventListener('change',);
const timerIsRunning = () => controlBtn.value === 'STOP';
let interval = 0;
var sessions = 0;
const updateDisplayTimer = value => displayTimer.innerText = value;
const sess = document.getElementById('sess');
const displayTimer = document.querySelector('#timer');

const controlBtn = document.querySelector('#control-btn');
controlBtn.addEventListener('click', () => timerIsRunning() ? stopTimer() : startTimer());

//start
const startTimer = () => {
    interval = setInterval(() => {
        timerInSeconds--;
        updateDisplayTimer(formatTimer());
        setPageTitle(`${formatTimer()} - ${getActiveMode()}`);
        console.log();
        if (timerInSeconds === 0) resetTimer();
        // if (Notification.permission === 'granted') {
        //     const text =
        //         getActiveMode() === 'Pomodoro' ? 'Get back to work!' : 'Take a break!';
        //     new Notification(text);
        // }
    }, 1000);
    setButtonText('STOP');


    playAudio('button_press.wav');
};
console.log(getActiveMode());

//stop
const stopTimer = () => {
    clearInterval(interval);
    setButtonText('START');
    playAudio('button_press.wav');
};

//setup format timer
const formatTimer = () => {
    const minutes = secondsToMinutes(timerInSeconds);
    const seconds = timerInSeconds % 60;

    const minutesZeroLeft = String(minutes).padStart(2, '0');
    const secondsZeroLeft = String(seconds).padStart(2, '0');

    return `${minutesZeroLeft}:${secondsZeroLeft}`;
};


const resetTimer = () => {
    stopTimer();
    timerInSeconds = minutesToSeconds(timeInMinutes);
    updateDisplayTimer(formatTimer());
    // sessions = 1;
    if (getActiveMode() === 'Pomodoro') {
        sessions++;
        //mỗi 4 sess sẽ có 1 long break
        sessions % 4 === 0 ? autoRun('Long Break') : autoRun('Short Break');
    } else {
        getMode('Pomodoro').click();
    }

    setPageTitle(getActiveMode());

    playAudio('end_sound.mp3');
    sess.innerText = sessions;
    // console.log(sessions);

};

// setActiveMode(document.querySelector('#longBreakMode'));
// console.log(modes.includes('Short Break'));
const autoRun = (modeName) => {
    //chưa tối ưu lắm nhỉ :/ 
    //thử nghĩ cách nào chạy autorun ok hon 
    //nếu là short thì destructuring modes[1], cái kia thì modes[2]
    if (modeName === 'Short Break') {
        const [name, mode, color, time] = modes[1];
        timerIsRunning() && stopTimer();
        setActiveMode(mode);
        setButtonColor(color);
        setPageColor(color);
        setPageTitle(name);
        timeInMinutes = time;
        timerInSeconds = minutesToSeconds(timeInMinutes);
        updateDisplayTimer(formatTimer(timerInSeconds));
        console.log(mode);
        startTimer();
    }
    else if (modeName === 'Long Break') {
        const [name, mode, color, time] = modes[2];
        timerIsRunning() && stopTimer();
        setActiveMode(mode);
        setButtonColor(color);
        setPageColor(color);
        setPageTitle(name);
        timeInMinutes = time;
        timerInSeconds = minutesToSeconds(timeInMinutes);
        updateDisplayTimer(formatTimer(timerInSeconds));
        console.log(mode);
        startTimer();
    }

};
// console.log(modes[1]);
//get mode
const getMode = name => {
    let mode;
    modes.forEach(([modeName, element]) => {
        if (name == modeName) mode = element;
    });
    return mode;
};
// console.log(getMode('Long Break'));

//chuyển mode
const onClickModes = () => {
    modes.forEach(([name, mode, color, time]) => {
        mode.onclick = () => {
            timerIsRunning() && stopTimer();
            setActiveMode(mode);
            setButtonColor(color);
            setPageColor(color);
            setPageTitle(name);
            timeInMinutes = time;
            timerInSeconds = minutesToSeconds(timeInMinutes);
            updateDisplayTimer(formatTimer(timerInSeconds));
        };
        name == 'Pomodoro' && mode.click();

    });

};
onClickModes();


const playAudio = file => {
    const audio = document.createElement('audio');
    audio.style.display = 'none';
    audio.src = `./assets/audios/${file}`;
    audio.autoplay = true;
    audio.onended = () => audio.remove();
    document.body.appendChild(audio);
};

//notification, phần này phải search lại rồi, không thấy noti
// document.addEventListener('DOMContentLoaded', () => {
//     if ('Notification' in window) {
//         if (
//             Notification.permission !== 'granted' &&
//             Notification.permission !== 'denied'
//         ) {
//             Notification.requestPermission().then(function (permission) {
//                 if (permission === 'granted') {
//                     new Notification(
//                         'Awesome! You will be notified at the start of each session'
//                     );
//                 }
//             });
//         }
//     }

// });
