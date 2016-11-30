let barcodeNames = [
    '39',
    'codabar',
    'code128',
    'Databar_1-300x122',
    'EAN',
    'gtin14',
    'i25',
    'pdf4172',
    'postnet', 
    'qrcode',
    'ucc128',
    'upcA',
    'upcE'
];
let barcodeDetector = new BarcodeDetector();

Promise.all(barcodeNames.map(name => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = function () {
            resolve(img);
        }
        img.src = name + '.png';
    });
})).then(barcodeImages => {
    barcodeDetector.detect(barcodeImages[barcodeImages.indexOf('qrcode')]).then(val => {
        console.log(val);
    }).catch(val => {
        console.log(val);
    });
    Promise.all(barcodeImages.map(img => barcodeDetector.detect(img)))
    .then(detectBarcords => {
        detectBarcords.forEach((result, i) => {
            let li = (text, parent) => {
                let elm = document.createElement('li');
                elm.textContent = text;
                parent.appendChild(elm);
            }
            let resultItem = document.createElement('li');
            let rawValue = 'rawValue: ' + document.createElement('div');
            let boundingBox = document.createElement('ul');
            boundingBox.classList.add('boundingbox');
            li('x: ' + result.boundingBox.x, boundingBox);
            li('y: ' + result.boundingBox.y, boundingBox);
            li('w: ' + result.boundingBox.w, boundingBox);
            li('h: ' + result.boundingBox.h, boundingBox);
            resultItem.appendChild(rawValue);
            resultItem.appendChild(barcodeImages[i]);
            resultItem.appendChild(boundingBox);
        });
    }).catch(error => {
        console.log(error);
    });
});
