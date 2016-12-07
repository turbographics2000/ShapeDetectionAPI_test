let img_url = new Image();
img_url.onload = _ => {
    let barcodeDetector = new BarcodeDetector();
    function addResult(text, type) {
        let p = document.createElement('p');
        p.textContent = text;
        p.classList.add(type);
        results.appendChild(p);
    }

    let cnv = document.createElement('canvas');
    cnv.width = img_url.naturalWidth;
    cnv.height = img_url.naturalHeight;
    cnv.style.width = cnv.width + 'px';
    cnv.style.height = cnv.height + 'px';
    let ctx = cnv.getContext('2d');
    ctx.drawImage(img_url, 0, 0);
    barcodeDetector.detect(img_url).then(_ => {
        addResult('<img>(URL)', 'support');
    }).catch(err => {
        addResult('<img>(URL)', 'not-support', err.message);
    }).then(_ => {
        return new Promise((resolve, reject) => {
            let img_dataURL = new Image();
            img_dataURL.onload = _ => {
                let barcodeDetector = new BarcodeDetector();
                barcodeDetector.detect(img_dataURL).then(resolve).catch(reject);
            }
            img_dataURL.src = cnv.toDataURL('image/png');
        });
    }).catch(_ => {
        add('<img>(Data URL)', 'not-support' + err.message);
    }).then(_ => {
        add('<img>(Data URL)', 'support');
        return new Promise((resolve, reject) => {
            let img_objectURL = new Image();
            img_objectURL.onload = _ => {
                let barcodeDetector = new BarcodeDetector();
                barcodeDetector.detect(img_objectURL).then(resolve).catch(reject);
            }
            cnv.toBlob(blob => {
                img_objectURL.src = URL.createObjectURL(blob);
            });
        });
    }).catch(_ => {
        add('<img>(Object URL)', 'not-support');
    }).then(_ => {
        add('<img>(Object URL)', 'support');
        return barcodeDetector.detect(cnv);
    }).then(_ => {
        let imgData = ctx.getImageData(0, 0, cnv.width, cnv.height);
        return barcodeDetector.detect(imgData);
    }).catch(err => {
        addResult('imageData', 'not-support', err.message);
    }).then(_ => {
        addResult('imageData', 'support');
    });
    img_url.src = 'code128.png';

