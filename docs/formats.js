let video = document.createElement('video');
video.width = 320;
video.height = 240;
document.body.appendChild(video);

function addList(txt) {
    let p = document.createElement('p');
    p.textContent = txt;
    document.body.appendChild(p);
}

let maxW = 20;
let maxH = 20;
function gumMaxW() {
    navigator.mediaDevices.getUserMedia({
        video: {
            width: { min: 0, max: maxW }
        }
    }).then(stream => {
        video.onloadedmetadata = _ => {
            addList(`max width = ${maxW}: ${video.videoWidth}x${video.videoHeight}`);
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
            maxW += 20;
            if (maxW === 2000) {
                gumMaxH();
            } else {
                gumMaxW();
            }
        }
        video.srcObject = stream;
    });
}

function gumMaxH() {
    navigator.mediaDevices.getUserMedia({
        video: {
            height: { min: 0, max: maxH }
        }
    }).then(stream => {
        video.onloadedmetadata = _ => {
            addList(`max width = ${maxW}: ${video.videoWidth}x${video.videoHeight}`);
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
            maxH += 20;
            if (maxH !== 2000) gumMaxH();
        }
        video.srcObject = stream;
    });
}

gumMaxW();

