const video = document.getElementById('video');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const recordedVideoPlayer = document.getElementById('recorded-video-player');
const videoContainer = document.getElementById('video-container');


const captureButton = document.getElementById('capture-button');
const enhanceButton = document.getElementById('enhance-button');
const recordButton = document.getElementById('record-button');

let stream;
let mediaRecorder;
let chunks = [];

navigator.mediaDevices.getUserMedia({ video: true }).then(mediaStream => {
	stream = mediaStream;
	video.srcObject = stream;
});

captureButton.addEventListener('click', () => {
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
	const dataURL = canvas.toDataURL('image/png');
	const img = new Image();
	img.src = dataURL;
	//document.body.appendChild(img);

	// Download the captured image
	const downloadLink = document.createElement('a');
	downloadLink.href = dataURL;
	downloadLink.download = 'captured-image.png';
	document.body.appendChild(downloadLink);
	downloadLink.click();
});
enhanceButton.addEventListener('click', () => {
	// Add your enhance code here
});


enhanceButton.addEventListener('click', () => {
	// Get the current image from the canvas
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
	// Loop through the image data and adjust the brightness of each pixel
	const brightnessFactor = 2; // Change this value to adjust the brightness
	const data = imageData.data;
	for (let i = 0; i < data.length; i += 4) {
	  data[i] += brightnessFactor;     // red
	  data[i + 1] += brightnessFactor; // green
	  data[i + 2] += brightnessFactor; // blue
	}
  
	// Put the modified image data back onto the canvas
	ctx.putImageData(imageData, 0, 0);
  
	// Create a download link for the enhanced image
	const downloadLink = document.createElement('a');
	downloadLink.href = canvas.toDataURL();
	downloadLink.download = 'enhanced_image.png';
	downloadLink.textContent = 'Download Enhanced Image';
	
	//document.body.appendChild(img);
  
	// Add an event listener for the download link to remove it from the DOM after download is complete
	downloadLink.addEventListener('load', () => {
	  // Trigger a click on the download link to start the download
	  downloadLink.click();
	  // Remove the download link from the DOM
	  document.body.removeChild(downloadLink);
	});
	
	// Simulate a click on the download link to start the download
	downloadLink.click();
  });
  
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  document.body.style.backgroundColor = getRandomColor();
recordButton.addEventListener('click', () => {

	
	if (recordButton.textContent === 'Record Video') {
		mediaRecorder = new MediaRecorder(stream);
		mediaRecorder.start();

		recordButton.textContent = 'Stop Recording';

		mediaRecorder.addEventListener('dataavailable', event => {
			chunks.push(event.data);
		});

		mediaRecorder.addEventListener('stop', () => {
			const blob = new Blob(chunks, { type: 'video/mp4' });
			chunks = [];

			const videoURL = URL.createObjectURL(blob);
			recordedVideoPlayer.src = videoURL;

			videoContainer.appendChild(recordedVideoPlayer);

			const downloadLink = document.createElement('a');
			downloadLink.href = URL.createObjectURL(blob);
			downloadLink.download = 'video_capture.mp4';
			downloadLink.textContent = 'Download Video';
			videoContainer.appendChild(downloadLink);

			// Trigger the download
			downloadLink.click();

			// Clean up the temporary URL object
			URL.revokeObjectURL(videoURL);
		});
	} else {
		mediaRecorder.stop();
		recordButton.textContent = 'Record Video';
	}
});
