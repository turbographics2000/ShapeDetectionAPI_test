/// <reference path="three.min.js" />

let barcodeDetector = null;
let browserVersion = null;
let detectRafId = null;
let frameImg = new Image();
let video = document.createElement('video');
let previewCtx = cnv.getContext('2d');
let ratio = null;
let blobURL = null;
let check = /Chrome\/([0-9]+)/.exec(navigator.userAgent);
let colors = [
    '#f39700',
    '#00a7db',
    '#009944',
    '#d7c447',
    '#9b7cb6',
    '#00ada9',
    '#bb641d',
    '#e85298',
    '#6cbb5a',
    '#b6007a',
    '#522886',
    '#019a66',
    '#9caeb7',
    'black',
    'gray'
];

if (navigator.userAgent.includes('Android') && check) browserVersion = +check[1];
if (browserVersion && browserVersion >= 57) {
    try {
        barcodeDetector = new BarcodeDetector();
        preview.style.display = '';
    } catch (e) {
        warningmsg.style.display = '';
    }
} else {
    platformwarning.style.display = '';
}

frameImage.onload = _ => {
    barcodeDetector.detect(frameImage).then(barcodes => {
        barcodes.forEach((barcode, i) => {
            
        });
    })
}

let constraints = { video: true, audio: false };
navigator.mediaDevices.enumerateDevices().then(devices => {
    let frontCameras = devices.filter(device => device.kind === 'videoinput' && device.label.includes('facing back'));
    if (frontCameras.length) constraints.video = { deviceId: frontCameras[0].deviceId };
});

barcodeDetector && navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    if(video.srcObject) {
        let oldStream = video.srcObject;
        oldStream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        oldStream = null;
    }
    video.oncanplay = _ => {
        cnv.width = video.videoWidth;
        cnv.height = preview.videoHeight;
        ratio = Math.min(cnv.width / video.videoWidth, cnv.height / video.videoHeight);
        if (!detectRafId) detect();
    }
    video.srcObject = stream;
});

function detect() {
    if(detectRafId) cancelAnimationFrame(detectRafId);
    if(blobURL) URL.revokeObjectURL(blob);

    ctx.drawImage(preview, 0, 0);
    frameImg.src = null;
    cnv.toBlob(blob => {
        blobURL = URL.createObjectURL(blob);
        frameImage.src = blobURL;
    })
}

