import flatpickr from "flatpickr";
import iziToast from "izitoast";
import "flatpickr/dist/flatpickr.min.css";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.getElementById("datetime-picker");
const startButton = document.querySelector(".timer-button");
let date = null;
let intervalId = null;
startButton.disabled = true;
iziToast.settings({
    timeout: 10000,
    resetOnHover: true,
    icon: 'material-icons',
    transitionIn: 'flipInX',
    transitionOut: 'flipOutX'
});


const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        if(!selectedDates[0]) return;

        const dateObject = new Date(selectedDates[0]);
        if (dateObject <= Date.now()) {
            iziToast.show({message: 'Please choose a date in the future', color: 'red'})
            startButton.disabled = true;
            return;
        }
        startButton.disabled = false;
        date = dateObject;
    },
};
flatpickr(datetimePicker, options);

startButton.addEventListener("click", () => {
    if(!date) return;
    if (date <= Date.now()) {
        iziToast.show({message: 'Please choose a date in the future', color: 'red'})
        startButton.disabled = true;
        return;
    }
    datetimePicker.disabled = true;
    startTimer(date);
    startButton.disabled = true;
});

function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function startTimer(dateObject) {
    if (intervalId) {
        clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
        const timeLeft = dateObject - Date.now();

        if (timeLeft <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            updateTimerValues(0, 0, 0, 0);
            datetimePicker.disabled = false;
            startButton.disabled = true;
            return;
        }

        const { days, hours, minutes, seconds } = convertMs(timeLeft);
        updateTimerValues(days, hours, minutes, seconds);
    }, 1000);
}

function addLeadingZero(value) {
    return value.padStart(2, "0")
}

function updateTimerValues(days, hours, minutes, seconds) {
    const allValues = document.querySelectorAll(".value");
    allValues.forEach((value) => {
        if (value.dataset.days !== undefined) { value.innerHTML = addLeadingZero(days.toString()); }
        if (value.dataset.hours !== undefined) { value.innerHTML = addLeadingZero(hours.toString()); }
        if (value.dataset.minutes !== undefined) { value.innerHTML = addLeadingZero(minutes.toString()); }
        if (value.dataset.seconds !== undefined) { value.innerHTML = addLeadingZero(seconds.toString()); }
    });
}