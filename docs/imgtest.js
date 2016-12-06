let img_url = new Image();
img_url.onload = _ => {
    let barcodeDetector = new BarcodeDetector();
    barcodeDetector.detect(img_url).then(results = {

    }).catch(e => {
        console.log('img_url error', e);
    });

    let cnv = document.createElement('canvas');
    cnv.width = img_url.naturalWidth;
    cnv.height = img_url.naturalHeight;
    cnv.style.width = cnv.width + 'px';
    cnv.style.height = cnv.height + 'px';
    let ctx = cnv.getContext('2d');
    ctx.drawImage(img_url);

    let img_dataURL = new Image();
    img_dataURL.onload = _ => {
        let barcodeDetector = new BarcodeDetector();
        barcodeDetector.detect(img_dataURL).then(results = {

        }).catch(e => {
            console.log('img_dataURL error', e);
        });
    }
    img_dataURL.src = cnv.toDataURL('image/png');

    let img_objectURL = new Image();
    img_objectURL.onload = _ => {
        let barcodeDetector = new BarcodeDetector();
        barcodeDetector.detect(img_objectURL).then(results = {

        }).catch(e => {
            console.log('img_objectURL error', e);
        });
    }
    cnv.toBlob(blob => {
        img_objectURL.src = URL.createObjectURL(blob);
    });
};
img_url.src = 'code128.png';

