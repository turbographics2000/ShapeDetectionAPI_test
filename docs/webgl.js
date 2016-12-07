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

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
let texture = new THREE.texture();
let plane = new THREE.PlaneBufferGeometry();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('pointerdown', evt => {

});
window.addEventListener('pointerup', evt => {

})
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();

