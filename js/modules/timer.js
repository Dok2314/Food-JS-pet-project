function timer(id, deadLine) {
    // TIMER

    function getTimer(endTime) {
        let days = 0, hours = 0, minutes = 0, seconds = 0;
        const t = Date.parse(endTime) - Date.parse(new Date());

        if (t > 0) {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            hours = Math.floor(t / (1000 * 60 * 60) % 24);
            minutes = Math.floor(t / (1000 * 60) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }

        return {
            total: t,
            days: getZero(days),
            hours: getZero(hours),
            minutes: getZero(minutes),
            seconds: getZero(seconds),
        };
    }

    function getZero(num) {
        return !(num < 0) && num < 10 ? `0${num}` : num;
    }

    function setClock(selector, endTime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timerId = setInterval(updateTime, 1000);

        updateTime();

        function updateTime() {
            const t = getTimer(endTime);

            days.innerHTML = t.days;
            hours.innerHTML = t.hours;
            minutes.innerHTML = t.minutes;
            seconds.innerHTML = t.seconds;

            if (t.total <= 0) {
                clearInterval(timerId);
            }
        }
    }

    setClock(id, deadLine);
}

export default timer;