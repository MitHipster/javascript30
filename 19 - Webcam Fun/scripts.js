const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
	navigator.mediaDevices
		.getUserMedia({ video: true, audio: false })
		.then(localMediaStream => {
			console.log(localMediaStream);
			video.src = window.URL.createObjectURL(localMediaStream);
			video.play();
			// Will catch if user denies access to webcam
		})
		.catch(err => {
			console.error('The following error occurred: ', err);
		});
}

function paintToCanvas() {
	const width = video.videoWidth;
	const height = video.videoHeight;

	canvas.width = width;
	canvas.height = height;

	return setInterval(() => {
		ctx.drawImage(video, 0, 0, width, height);

		// Get pixel data from image
		let pixels = ctx.getImageData(0, 0, width, height);

		// Manipulate data
		// pixels = redEffect(pixels);
		// pixels = rgbSplit(pixels);

		// Creates a ghosting effect
		// ctx.globalAlpha = 0.1;

		pixels = greenScreen(pixels);

		// Put pixel data in image
		ctx.putImageData(pixels, 0, 0);
	}, 16);
}

function takePhoto() {
	// Play sound when taking an image
	snap.currentTime = 0;
	snap.play();

	// Capture data from the canvas
	const data = canvas.toDataURL('image/jpeg');
	const link = document.createElement('a');

	link.href = data;
	link.setAttribute('download', 'image');
	link.innerHTML = `<img src="${data}" alt="webcam filmstrip image" />`;
	strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
	for (let i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i + 0] = pixels.data[i + 0] + 100; // red value
		pixels.data[i + 1] = pixels.data[i + 1] - 50; // green value
		pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue value
	}
	return pixels;
}

function rgbSplit(pixels) {
	for (let i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i - 150] = pixels.data[i + 0]; // red value
		pixels.data[i + 100] = pixels.data[i + 1]; // green value
		pixels.data[i - 150] = pixels.data[i + 2]; // blue value
	}
	return pixels;
}

function greenScreen(pixels) {
	const levels = {};

	document.querySelectorAll('.rgb input').forEach(input => {
		levels[input.name] = input.value;
	});

	for (i = 0; i < pixels.data.length; i = i + 4) {
		red = pixels.data[i + 0];
		green = pixels.data[i + 1];
		blue = pixels.data[i + 2];
		alpha = pixels.data[i + 3];

		if (
			red >= levels.rmin &&
			green >= levels.gmin &&
			blue >= levels.bmin &&
			red <= levels.rmax &&
			green <= levels.gmax &&
			blue <= levels.bmax
		) {
			// Remove values between the min and max
			pixels.data[i + 3] = 0;
		}
	}

	return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
