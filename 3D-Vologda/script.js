let camera, scene, renderer;

let fov = 70,
    texture_placeholder,
    isUserInteracting = false,
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0;

let mesh;

let indexPano = 0;

let currentPano = 0;

let indexSet = 0;

let currentSet = 0;

let  photo, choosing, movement_clock, movement_door, movement_beach, movement_800_years;

let panorama = ['img/k1.jpg','img/k2.jpg','img/k3.jpg','img/k4.jpg'];

movement_clock = document.getElementById('clock');
movement_door = document.getElementById('door');
movement_beach = document.getElementById('beach');
movement_800_years = document.getElementById('800_years');


init();
animate();

movement_clock.addEventListener('click', function () {
    goTo(0);
})
movement_door.addEventListener('click', function () {
    goTo(1);
})
movement_beach.addEventListener('click', function () {
    goTo(2);
})
movement_800_years.addEventListener('click', function () {
    goTo(3);
})

function goTo(drct) {
    currentPano  = indexSet;
    let tmpCount = drct;
    if (tmpCount != currentPano) {
        indexSet = tmpCount;
        console.log(indexSet);
        let filename = panorama[indexSet];
        loadTexture(filename);
    }
}

function loadTexture(filename) {

    let texture = new THREE.ImageUtils.loadTexture(filename)
    texture.colorSpace = THREE.SRGBColorSpace;
    let material = new THREE.MeshBasicMaterial({ map: texture });
    mesh.material = material;
}

function init() {

    let container;

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);

    scene = new THREE.Scene();

    mesh = new THREE.Mesh(new THREE.SphereGeometry(500, 60, 40), new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('img/k1.jpg') }));
    mesh.scale.x = -1;
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mousewheel', onDocumentMouseWheel, false);
    document.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {

    event.preventDefault();

    isUserInteracting = true;

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;
}

function onDocumentMouseMove(event) {

    if (isUserInteracting) {
        lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
        lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
    }
}

function onDocumentMouseUp(event) {

    isUserInteracting = false;
}

function onDocumentMouseWheel(event) {
    
    if (event.wheelDeltaY) {
        fov -= event.wheelDeltaY * 0.05;
    } 
    else if (event.wheelDelta) {
        fov -= event.wheelDelta * 0.05;
    }
    else if (event.detail) {
        fov += event.detail * 1.0;
    }


    camera.projectionMatrix.makePerspective(fov, window.innerWidth / window.innerHeight, 1, 1100);
    render();
}

function animate() {

    requestAnimationFrame(animate);
    render();
}

function render() {

    lat = Math.max(- 85, Math.min(85, lat));
    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(lon);

    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(camera.target);

    renderer.render(scene, camera);
}

function myFunction() {

    document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {

    if (!event.target.matches('.dropbtn')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}