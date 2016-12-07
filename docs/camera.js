/// <reference path="three.min.js" />

let barcodeDetector, browserVersion, drawFrameRafId, ratio, drawLeft, drawTop, drawWidth, drawHeight, blobURL, prevSecond, fpsCnt;

let frameImg = new Image();
let video = document.createElement('video');
let previewCtx = preview.getContext('2d');
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

colorValuePair = {};

previewCtx.lineWidth = 4;

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

let constraints = {
    video: {
        width: { min: 720, max: 1280 },
        height: { min: 720, max: 1280 }
    },
    audio: false
};
navigator.mediaDevices.enumerateDevices().then(devices => {
    let frontCameras = devices.filter(device => device.kind === 'videoinput' && device.label.includes('facing back'));
    if (frontCameras.length) constraints.video = { deviceId: frontCameras[0].deviceId };
});

barcodeDetector && navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    if (video.srcObject) {
        let oldStream = video.srcObject;
        oldStream.getTracks().forEach(track => track.stop());
        video.srcObject;
        oldStream;
    }
    video.oncanplay = _ => {
        cnv.width = video.videoWidth;
        cnv.height = preview.videoHeight;
        ratio = Math.min(cnv.width / video.videoWidth, cnv.height / video.videoHeight);
        drawWidth = video.videoWidth * ratio;
        drawHeight = video.videoHeight * ratio;
        drawLeft = (cnv.width - drawWidth) / 2 | 0;
        drawTop = (cnv.height - drawHeight) / 2 | 0;
        fpsCnt = 0;
        if (!drawFrameRafId) drawFrame();
    }
    video.srcObject = stream;
});

function drawFrame() {
    if (drawFrameRafId) cancelAnimationFrame(drawFrameRafId);
    if (blobURL) URL.revokeObjectURL(blobURL);
    prevSecond = Date.now();
    rawValueList.innerHTML = '';
    previewCtx.clearRect(0, 0, cnv.width, cnv.height);
    previewCtx.drawImage(video, drawLeft, drawTop, drawWidth, drawHeight);
    preview.toBlob(blob => {
        blobURL = URL.createObjectURL(blob);
        frameImage.src = blobURL;
    })
}

frameImage.onload = _ => {
    barcodeDetector.detect(frameImage).then(barcodes => {
        barcodes.forEach((barcode, i) => {
            previewCtx.beginPaht();
            if (!colorValuePair[barcode.rawValue]) {
                previewCtx.strokeStyle = colors[i];
                previewCtx.fillStyle = colors[i];
                colorValuePair[barcode.rawValue] = colors[i];
            } else {
                previewCtx.strokeStyle = colorValuePair[barcode.rawValue];
                previewCtx.fillStyle = colorValuePair[barcode.rawValue];
            }
            let bb = barcode.boundingBox;
            previewCtx.strokeRect(bb.x + drawLeft, bb.y + drawTop, bb.width, bb.height);
            previewCtx.closePath();

            let rawValueItem = document.createElement('div');
            rawValueItem.className = 'rawvalue-item';
            let colorIcon = document.createElement('span');
            colorIcon.className = 'rawvalue-icon';
            colorIcon.style.color = colorValuePair[barcode.rawVlaue];
            colorIcon.textContent = '■';
            let rawValueLabel = document.createElement('span');
            rawValueLabel.textContent = barcode.rawValue;
            rawValueItem.appendChild(rawValueIcon);
            rawValueItem.appendChild(rawValueLabel);
            rawValueList.appendChild(rawValueItem);
        });
    }).catch(err => {
        console.log(err);
    }).then(_ => {
        fpsCnt++;
        let nowSeconds = Date.now() / 1000 | 0
        if(prevSeconds !== nowSeconds) {
            fps.textContent = fps;
            fpsCnt = 0;
        }
        prevSecond = nowSeconds;
        requestAnimationFrame(drawFrame);
    });
}

