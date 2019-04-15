let countdown;
const displayTimer = document.querySelector('.display__time-left'),
	displayEnding = document.querySelector('.display__end-time'),
	buttons = document.querySelectorAll('button[data-time]');

function timer(seconds) {
	if (countdown) clearInterval(countdown);

	const now = Date.now(),
		future = now + seconds * 1000;

	displayTimeRemaining(seconds);
	displayEndingTime(future);

	countdown = setInterval(() => {
		const timeRemaining = Math.round((future - Date.now()) / 1000);

		if (timeRemaining < 0) {
			clearInterval(countdown);
			return;
		}
		displayTimeRemaining(timeRemaining);
	}, 1000);
}

function displayTimeRemaining(seconds) {
	const minutes = Math.floor(seconds / 60),
		remainder = seconds % 60,
		display = `${minutes}:${remainder < 10 ? '0' : ''}${remainder}`;

	document.title = `Timer: ${display}`;
	displayTimer.textContent = display;
}

function displayEndingTime(timestamp) {
	const finish = new Date(timestamp),
		hours = finish.getHours(),
		minutes = finish.getMinutes();

	displayEnding.textContent = `Be back at 
		${hours > 12 ? hours - 12 : hours}:${minutes < 10 ? '0' : ''}${minutes}
	`;
}

buttons.forEach(button => {
	button.addEventListener('click', function() {
		const seconds = parseInt(this.dataset.time);

		timer(seconds);
	});
});

// Can access named inputs directly of the document object
document.customForm.addEventListener('submit', function(e) {
	e.preventDefault();

	const seconds = parseInt(this.minutes.value) * 60;
	timer(seconds);

	this.reset();
});
