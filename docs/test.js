// let faceDetector = new FaceDetector();
// let faceImage = new Image();
// faceImage.onload = function() {
//     document.body.appendChild(faceImage);
//     faceDetector.detect(faceImage).then(result => {
//         for(const res of result) {
//             console.log(res);
//         }
//     }).catch(err => {
//         console.log(err);
//     })
// }
// faceImage.src = 'kao.jpg';

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

let barcodeImages = [];
let barcodeDetector = null;
let browserVersion = null;
let check = /Chrome\/([0-9]+)/.exec(navigator.userAgent);
if (navigator.userAgent.includes('Android') && check) browserVersion = +check[1];
if (browserVersion && browserVersion >= 57) {
    try {
        barcodeDetector = new BarcodeDetector();
    } catch (e) {
        warningmsg.style.display = '';
    }
} else {
    platformwarning.style.display = '';
}

barcodeDetector && Promise.all(barcodeNames.map(name => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = function () {
            // let cnv = document.createElement('canvas');
            // cnv.width = img.naturalWidth + 20;
            // cnv.height = img.naturalHeight + 20;
            // cnv.style.width = cnv.width + 'px';
            // cnv.style.height = cnv.height + 'px';
            // let ctx = cnv.getContext('2d');
            // ctx.drawImage(img, 10, 10);
            // cnv.toBlob(blob => {
            //     var paddingImg = new Image();
            //     paddingImg.onload = _ => {
            //         resolve(paddingImg);
            //     };
            //     paddingImg.src = URL.createObjectURL(blob);
            // });
            resolve(img);
        }
        img.src = name + '.png';
    });
})).then(imgs => {
    return new Promise((resolve, reject) => {
        let cnvAllBarcode = document.createElement('canvas');
        let rout = Math.sqrt(imgs.length);
        let w = rout | 0;
        let h = Math.ceil(rout);
        cnvAllBarcode.width = w * 100;
        cnvAllBarcode.height = h * 100;
        let ctxAllBarcode = cnvAllBarcode.getContext('2d');
        imgs.forEach((img, i) => {
            let x = i % w;
            let y = i / w | 0;
            let ratio = Math.min(90 / img.naturalWidth, 90 / img.naturalHeight);
            let previewW = img.naturalWidth * ratio;
            let previewH = img.naturalHeight * ratio | 0;
            let posX = Math.round((x * 100) + 5 + ((90 - previewW) / 2));
            let posY = Math.round((y * 100) + 5 + ((90 - previewH) / 2));
            console.log(w, h, x, y, previewW, previewH, posX, posY, w, h);
            ctxAllBarcode.drawImage(img, posX, posY);
        })
        let allImageURL = cnvAllBarcode.toDataURL();
        let imgAll = new Image();
        imgAll.onload = _ => {
            imgs.push(imgAll);
            resolve(imgs);
        }
        imgAll.src = allImageURL;
    });
}).then(imgs => {
    Promise.all(imgs.map(img => {
        barcodeImages.push(img);
        return barcodeDetector.detect(img);
    })).then(detectBarcords => {
        detectBarcords.forEach((results, i) => {
            let cnv = document.createElement('canvas');
            cnv.width = barcodeImages[i].naturalWidth;
            cnv.height = barcodeImages[i].naturalHeight;
            let ctx = cnv.getContext('2d');
            ctx.lineWidth = 4;
            ctx.drawImage(barcodeImages[i], 0, 0);
            let trBarcode = document.createElement('tr');
            let tdImg = document.createElement('td');
            tdImg.appendChild(cnv);
            let tdResults = document.createElement('td');
            trBarcode.appendChild(tdImg);
            trBarcode.appendChild(tdResults);
            if (!results.length) {
                tdResults.textContent = 'Detect fail.';
                tdResults.style.color = 'red';
            }
            barcodeTable.appendChild(trBarcode);
            let resultTable = document.createElement('table');
            results.forEach((result, i) => {
                ctx.beginPath();
                ctx.strokeStyle = colors[i];
                let trResult = document.createElement('tr');
                let tdItemColor = document.createElement('td');
                let itemColor = document.createElement('div')
                itemColor.classList.add('item-color');
                itemColor.style.borderColor = colors[i];
                tdItemColor.appendChild(itemColor);
                let tdRawValue = document.createElement('td');
                trResult.appendChild(tdItemColor);
                trResult.appendChild(tdRawValue);
                tdRawValue.textContent = result.rawValue;
                if (result.boundingBox) {
                    let boundingBox = document.createElement('ul');
                    boundingBox.classList.add('boundingbox');
                    ctx.strokeRect(result.boundingBox.x, result.boundingBox.y, result.boundingBox.width, result.boundingBox.height);
                }
                resultTable.appendChild(trResult);
                ctx.closePath();
            });
            tdResults.appendChild(resultTable);
        });
    }).catch(error => {
        console.log(error);
    });
});
