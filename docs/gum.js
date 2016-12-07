let video = document.createElement('video');
let videoDevices = null;
let vIdx = null;

function addList(txt) {
    let p = document.createElement('p');
    p.textContent = txt;
    document.body.appendChild(p);
}
navigator.mediaDevices.enumerateDevices().then(devices => {
    videoDevices = devices.filter(device => device.kind === 'videoinput');
    if(!videoDevices.length) {
        addList('Video input device nothing.');
    } else {
        vIdx = 0;
        gum();
    }
});

function gum(){
    if(video.srcObject) {
        let stream = video.srcObject;
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        video.srcObject = null;
    }
    navigator.mediaDevices.getUserMedia({
        video: {
            deviceId: videoDevices[vIdx].deviceId
        }
    }).then(stream => {
        video.oncanplay = _ => {
            addList(`${videoDevices[vIdx].label}: ${video.videoWidth}x${video.videoHeight}`);
            vIdx++;
            if(vIdx < videoDevices.length) gum();
        }
        video.srcObject = stream;
    })
}
