var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 16;


var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//var controls = new THREE.OrbitControls(camera, renderer.domElement);
//controls.enableDamping = true;
//controls.dampingFactor = 0.25;
//controls.enableZoom = true;

controls = new THREE.TrackballControls( camera, renderer.domElement);
controls.rotateSpeed = 3;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;
//Object { x: 1.7066381020728765, y: 0.6383089697943447, z: -1.6018495100704266 }
//controls.target.set(1., 5, 2.0);



var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
keyLight.position.set(-100, 0, 100);

var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 0, 100);

var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);

var loader = new THREE.ImageLoader();
loader.setPath('Conqueror_textures/');
var texture_head = new THREE.Texture();
loader.load('Conqueror.png', function(image) {
  texture_head.image = image;
  texture_head.needsUpdate = true;
} );

var texture_tracks = new THREE.Texture();
loader.load('Conqueror_Tracks.png', function(image) {
    texture_tracks.wrapT=THREE.RepeatWrapping
  texture_tracks.image = image;
  texture_tracks.needsUpdate = true;

} );

var loader = new THREE.OBJLoader();

loader.setPath('Conqueror_meshes/');
var head_elements=[];


function head(_file){
loader.load(_file, function ( object ) {
  object.traverse( function ( child ) {
    if ( child instanceof THREE.Mesh ) {
      child.material.map = texture_head;
    }
    scene.add( object );
    head_elements.push(child)

    //object.position.y -= 60;
  });
});
};

function tracks(_file){
loader.load(_file, function ( object ) {
  object.traverse( function ( child ) {
    if ( child instanceof THREE.Mesh ) {
      child.material.map = texture_tracks;
    }
    scene.add( object );
    //object.position.y -= 60;
  });
});
};


tracks('1_chassis_wheel_L_01_batch_0.obj');
tracks('1_chassis_wheel_L_02_batch_0.obj');
tracks('1_chassis_wheel_L_03_batch_0.obj');
tracks('1_chassis_wheel_L_04_batch_0.obj');
tracks('1_chassis_wheel_L_05_batch_0.obj');
tracks('1_chassis_wheel_L_06_batch_0.obj');
tracks('1_chassis_wheel_L_07_batch_0.obj');
tracks('1_chassis_wheel_L_08_batch_0.obj');
tracks('1_chassis_wheel_L_09_batch_0.obj');
tracks('1_chassis_wheel_L_10_batch_0.obj');
tracks('1_chassis_track_L_batch_0.obj');
tracks('1_chassis_track_R_batch_0.obj');
tracks('1_chassis_wheel_R_01_batch_0.obj');
tracks('1_chassis_wheel_R_02_batch_0.obj');
tracks('1_chassis_wheel_R_03_batch_0.obj');
tracks('1_chassis_wheel_R_04_batch_0.obj');
tracks('1_chassis_wheel_R_05_batch_0.obj');
tracks('1_chassis_wheel_R_06_batch_0.obj');
tracks('1_chassis_wheel_R_07_batch_0.obj');
tracks('1_chassis_wheel_R_08_batch_0.obj');
tracks('1_chassis_wheel_R_09_batch_0.obj');
tracks('1_chassis_wheel_R_10_batch_0.obj');
head('1_hull_batch_0.obj');
head('1_gun_01_batch_0.obj');
head('1_gun_03_batch_0.obj');
head('1_gun_05_batch_0.obj');
head('1_gun_06_batch_0.obj');
head('1_gun_07_batch_0.obj');
head('1_hull_batch_0.obj');
head('1_turret_01_batch_0.obj');
head('1_turret_02_batch_0.obj');


var obj = {};
obj.sampleNumber = 1;
obj.Wireframe=false;
//obj.test=true;

var gui = new dat.GUI();
gui.add(obj, 'Wireframe').onChange(function(value ){
    console.log(value);
    if (value){
    material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe : true  }  ); 
    }else{
    material = new THREE.MeshPhongMaterial();
    };

    for (var i = 0; i < head_elements.length; i++) {
    
        head_elements[i].material = material
        head_elements[i].material.map = texture_head;
    }



});


//gui.add(obj, 'test').onChange(function(value ){
//    for (var i = 0; i < head_elements.length; i++) {
//    head_elements[i].traverse( function ( child ) {
//    if ( child instanceof THREE.Mesh ) {
//      console.log(child.material)
//    }
//      });
//    }
//
//});
var animate = function () {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render(scene, camera);
    //console.log(controls.target);
};

animate();



