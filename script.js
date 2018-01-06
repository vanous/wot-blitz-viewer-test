//pvr exporter tool https://github.com/buutuud/PvrTexTool
//https://github.com/dataarts/dat.gui
//./PVRTexToolCLI -i T-34-85_chassis_01_AM.mali.pvr -d -f RGBG8888
//for i in `ls`; do ../PVRTexToolCLI -i $i -d -f RGBG8888; done
//https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js
//
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



head_elements=[];
function head_texture(textr){
    obj.Wireframe=false;
    var loader = new THREE.ImageLoader();
    loader.setPath(selected_tank.path_textures);
    texture_head = new THREE.Texture();
    loader.load(textr.file, function(image) {
        console.log(textr);
        if (textr.params=="flip"){
                texture_head.wrapT = THREE.RepeatWrapping;
                texture_head.repeat.y = - 1;
            }else if (textr.params=="repeat"){
    texture_head.wrapT=texture_head.wrapS=THREE.RepeatWrapping;
                texture_head.offset.set(0,0);
                texture_head.repeat.set(2,2);
            }else{
            }

      texture_head.image = image;
      texture_head.needsUpdate = true;
        } );

//normal mask NM
    var loaderNM = new THREE.ImageLoader();
    loaderNM.setPath(selected_tank.path_textures);
    texture_head_NM = new THREE.Texture();
    loaderNM.load(selected_tank["head"]["textures"]["mask"].file, function(image) {
        //console.log(textr);

      texture_head_NM.image = image;
      texture_head_NM.needsUpdate = true;
        } );


        material = new THREE.MeshPhongMaterial();
        material.map = texture_head;
        material.normalMap = texture_head_NM;
        material.normalScale.set(1,2);
        material.needsUpdate = true;
        console.log(material);
        for (var i = 0; i < head_elements.length; i++) {
        
            head_elements[i].material = material

        }
    console.log("applied nm map");
};



function track_texture(_file){
var loader = new THREE.ImageLoader();
loader.setPath(selected_tank.path_textures);
texture_tracks = new THREE.Texture();
loader.load(_file, function(image) {
    texture_tracks.wrapT=THREE.RepeatWrapping
  texture_tracks.image = image;
  texture_tracks.needsUpdate = true;

} );
};



function head(_file){
var loader = new THREE.OBJLoader();
loader.setPath(selected_tank.path_meshes);
loader.load(_file, function ( object ) {
  object.traverse( function ( child ) {
    if ( child instanceof THREE.Mesh ) {
        if (typeof texture_head !== 'undefined'){
      child.material.map = texture_head;
        }
    }
    head_elements.push(child)

    //object.position.y -= 60;
  });
    scene.add( object );
});
};

function tracks(_file){
var loader = new THREE.OBJLoader();
loader.setPath(selected_tank.path_meshes);
//loader.setPath('Conqueror_meshes/');
loader.load(_file, function ( object ) {
  object.traverse( function ( child ) {
    if ( child instanceof THREE.Mesh ) {
      child.material.map = texture_tracks;
    }
    //object.position.y -= 60;
  });
    scene.add( object );
});
};



obj = {};
obj.sampleNumber = 1;
obj.Wireframe=false;
//obj.test=true;

gui = new dat.GUI();

dat.GUI.prototype.removeFolder = function(name) {
    var folder = this.__folders[name];
    if (!folder) {
      return;
    }
    folder.close();
    this.__ul.removeChild(folder.domElement.parentNode);
    delete this.__folders[name];
    this.onResize();
 }



gui.domElement.id = 'gui';


gui.add(obj, 'Wireframe').listen().onChange(function(value ){
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



function clearScene(){
    for( var i = scene.children.length - 1; i >= 3; i--) { 
     obj = scene.children[i];
         scene.remove(obj);
    }
};




function add_tank(){

clearScene();
selected_tank.head.mesh.forEach(function(entry) {
    //console.log("head obj: ", entry);
    head(entry);
});

track_texture(selected_tank.tracks.textures.default);


selected_tank.tracks.mesh.forEach(function(entry) {
    //console.log("track obj: ", entry);
    tracks(entry);
});

};

//head_texture(selected_tank.head.textures.Default);

json = JSON.parse(data);
json_full = JSON.parse(data_full);
selected_tank="";
ff=false;

gui.add(json, "Tanks", json.Tanks).onChange(function(value){
json = JSON.parse(data); //datgui keeeps changind the data, cannot unbind
//console.log(json);
selected_tank=json_full.Tanks[value];
if(ff){
    gui.remove(ff);
};
if (selected_tank.head.textures.hasOwnProperty("Default")){

textr=selected_tank.head.textures["Default"];
}
else{
textr=selected_tank.head.textures[Object.keys(selected_tank.head.textures)[0]];
}
head_texture(textr);
add_menu(value);
add_tank();

var uri = window.location.href.split("?")[0];
history.pushState("", "/wot-blitz-viewer-test", uri + "?" + value);

});

//f2.open();

function add_menu(_name){

//console.log(selected_tank, _name)
//gui.removeFolder('Mods')
//_name="Conqueror"
//f3 = gui.addFolder('Mods');
ff=gui.add(json, "Skins", json.Skins[_name]).onChange(function(value) {

var uri = window.location.href.split("?")[0];
history.pushState("", "/wot-blitz-viewer-test", uri + "?" + selected_tank.name + "&"+ value);


obj.Wireframe=false;
textr=selected_tank.head.textures[value]
head_texture(textr);


});
//f3.open();
};



var uri = window.location.href.split("?")[1];
if (typeof uri !="undefined"){
var t=unescape(uri.split("&")[0]);;
var c=unescape(uri.split("&")[1]);
}
if (typeof t==="undefined" ){
    t="A-20"
}

if (typeof c==="undefined" ){
    c="Default"
}

if (json_full.Tanks[t]!="undefined" ){

selected_tank=json_full.Tanks[t];
}else{
selected_tank=json_full.Tanks["A-20"];
}

if (selected_tank.head.textures.hasOwnProperty(c)){
    textr=selected_tank.head.textures[c];
}
else if (selected_tank.head.textures.hasOwnProperty("Default")){

    textr=selected_tank.head.textures["Default"];
}
else{
    textr=selected_tank.head.textures[Object.keys(selected_tank.head.textures)[0]];
}
head_texture(textr);
//selected_tank=json_full.Tanks["Dicker Max"];
add_tank();

var animate = function () {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render(scene, camera);
    //console.log(controls.target);
};

animate();



