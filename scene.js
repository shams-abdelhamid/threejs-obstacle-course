var ww = window.innerWidth,
	wh = window.innerHeight;

var control=null;
var camera=null;
var score =document.getElementById('score');
var hits =document.getElementById('hits');
var scorevalue=0;
var hitsvalue=0;
var rightPressed ;
var leftPressed ;
var upPressed ;
var downPressed ;
var car;

var endbox = new THREE.BoxGeometry(ww,150,50);

var called=false;

var geometryPlane=new THREE.PlaneGeometry( 600, 60000);
loader = new THREE.TextureLoader();
texture  =  loader.load("textures/road1.jfif");
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 1, 50);
material = new THREE.MeshLambertMaterial({map : texture , side:THREE.DoubleSide});

var plane = new THREE.Mesh(geometryPlane, material);
plane.rotateX(Math.PI/2);


var geometrysides=new THREE.PlaneGeometry( 600*14, 60000);
loaders = new THREE.TextureLoader();
textures  =  loader.load("textures/sand2.jpg");
textures.wrapT = THREE.RepeatWrapping;
textures.repeat.set( 1, 40);
materials = new THREE.MeshLambertMaterial({map : textures , side:THREE.DoubleSide});
var planes = new THREE.Mesh(geometrysides, materials);
planes.rotateX(Math.PI/2);
planes.position.y=-20;


raycaster = new THREE.Raycaster();


elements = new THREE.Object3D();

function init(){
  	renderer = new THREE.WebGLRenderer({canvas : document.getElementById('scene')});
  	renderer.setClearColor(0xff9966);
  	renderer.setSize(ww,wh);

  	scene = new THREE.Scene();
  	camera = new THREE.PerspectiveCamera(50, ww/wh, 1, 70000);

  	light = new THREE.DirectionalLight(0xffffff, 1);

  	light.position.set( 0, 100, 100 );
		light.target=plane;

  	scene.add(light);

		manyspheres();

  	createshapes();

  	scene.add(camera);

		function task() {
			if (called==false) {
				requestAnimationFrame(animate);
			}
		}
		setTimeout(task, 1000);

  	renderer.render(scene,camera);
  };


	  function onKeyDown(e)
	  {if(e.key == 'd') {
	    rightPressed = true;
	  }
	  else if(e.key == 'a') {
	    leftPressed = true;
	  }
	  if(e.key == 's') {
	    downPressed = true;
	  }
	  else if(e.key == 'w') {
	    upPressed = true;
	  }
	}

    function keyUpHandler(e)
    {if(e.key == 'd') {
      rightPressed = false;
    }
    else if(e.key == 'a') {
      leftPressed = false;
    }
    if(e.key == 's') {
      downPressed = false;
    }
    else if(e.key == 'w') {
      upPressed = false;
    }
  }

  function createshapes(){

	    var rightPressed = false;
	    var leftPressed = false;
	    var upPressed = false;
	    var downPressed = false;

	  	scene.add(plane);
			scene.add(planes);
			var loader = new THREE.STLLoader();
			console.log(elements.children);
		///	var geometryPromise = new Promise(function(resolve, reject) {
			loader.load( 'Mini_car_150pc.stl', function ( geometry ) {
			var material = new THREE.MeshLambertMaterial( { color: 0xFFA500 } );
			car = new THREE.Mesh( geometry, material );
			car.position.z=plane.position.z+(plane.geometry.parameters.height/2)-185
			car.position.y=25;
			car.position.x=28.5;
			car.scale=(100,100,100);
			car.rotation.y=-Math.PI/2;
			car.name="car";
			elements.add(car);
			console.log(elements.children[0]);
			});
	//	});


  	box = new THREE.BoxGeometry(60,60,60);
  	textureb = new THREE.MeshLambertMaterial({color:0x00ff00,transparent:true,opacity:0.0});
  	cube = new THREE.Mesh(box, textureb);
    cube.position.z=plane.position.z+(plane.geometry.parameters.height/2)-185;
    cube.position.y=25;
  	scene.add(cube);

		skybox = new THREE.BoxGeometry(ww*100,wh*100,50);
		loader = new THREE.TextureLoader();
		texture  =  loader.load("textures/sky2.jpg");
		skytextureb = new THREE.MeshLambertMaterial({map : texture});
  	sky = new THREE.Mesh(skybox, skytextureb);
    sky.position.z=-plane.position.z-(plane.geometry.parameters.height/2);
    sky.position.y=25000	;
  	scene.add(sky);

		loader = new THREE.TextureLoader();
		texturee = loader.load("textures/check.png");
		texturee.wrapT = THREE.RepeatWrapping;
		texturee.repeat.set( 1, 1);
		endboxtexture = new THREE.MeshLambertMaterial({map : texturee});
  	end = new THREE.Mesh(endbox, endboxtexture);
    end.position.z=-plane.position.z-(plane.geometry.parameters.height/2)+50;
    end.position.y=500	;
		console.log(end.position.z);
  	scene.add(end);


		function task() {
			  camera.position.set(0, 100, car.position.z+400);
		}
		setTimeout(task, 1000);
  };

		function manyspheres(){

        var Geo = new THREE.BoxGeometry(50, 50, 50);

				loader = new THREE.TextureLoader();
				texture  =  loader.load("textures/obstacles.jpg");
				skytextureb = new THREE.MeshLambertMaterial({map : texture});

        for (let i = 0; i < 240; i++)
        {
                spheres = new THREE.Mesh(Geo, skytextureb);


                spheres.position.x= (Math.random()-0.5)*plane.geometry.parameters.width;
                spheres.position.y= 30;
                spheres.position.z= (Math.random()-0.5)*-(plane.geometry.parameters.height-800)-400;
								spheres.name="obs";
                elements.add(spheres);
         }
         scene.add(elements);
}


	  function animate() {

			called =true;
			vector = new THREE.Vector3();
			vectordir = new THREE.Vector3();
				vector.set(
					cube.position.x,
					cube.position.y,
					cube.position.z-60/2
				);

			vectordir.set(
				cube.position.x,
				cube.position.y,
				cube.position.z-10-60/2
			);

			if(rightPressed) {
				raycaster.set(vector,vectordir.normalize(),0,1);
				intersects = raycaster.intersectObjects(elements.children);


				if(intersects.length > 0 && intersects[0].distance< 60/2 && intersects[0].object.name=="obs"){
						console.log("khabat");
						intersects[0].object.parent.remove(intersects[0].object);
						hitsvalue=hitsvalue+1;
						hits.innerHTML=hitsvalue;

						if (hitsvalue>=3)
						{
								score.innerHTML="Game Over";
								leftPressed=false;
								upPressed=false;
								rightPressed=false;
								setTimeout(restart, 2000);
						}
				}
				if (hitsvalue<3) {
					car.position.x += 5;
					cube.position.x += 5;
					camera.position.x+=5;
				}
				if(cube.position.x>plane.geometry.parameters.width/2+60/2)
				{
					score.innerHTML="GAME OVER";
					document.removeEventListener('keydown', onKeyDown, false);
					document.removeEventListener('keyup', keyUpHandler, false);
					leftPressed=false;
					upPressed=false;
					rightPressed=false;
					setTimeout(restart, 2000);
				}
			}
			if(leftPressed) {
				raycaster.set(vector,vectordir.normalize(),0,1);
				intersects = raycaster.intersectObjects(elements.children);
				diff = new THREE.Vector3(60/4,0,0);
				if(intersects.length > 0 && intersects[0].distance< 60/2 && intersects[0].object.name=="obs"){
						console.log("khabat");
						intersects[0].object.parent.remove(intersects[0].object);
						hitsvalue=hitsvalue+1;
						hits.innerHTML=hitsvalue;

						if (hitsvalue>=3)
						{
								score.innerHTML="Game Over";
								leftPressed=false;
								upPressed=false;
								rightPressed=false;
								setTimeout(restart, 2000);
						}
					}
					if (hitsvalue<3) {
						car.position.x -= 5;
						cube.position.x -= 5;
						camera.position.x-=5;
					}
					if(cube.position.x<-plane.geometry.parameters.width/2-60/2)
					{
						score.innerHTML="GAME OVER";
						document.removeEventListener('keydown', onKeyDown, false);
						document.removeEventListener('keyup', keyUpHandler, false);
						leftPressed=false;
						upPressed=false;
						rightPressed=false;
						setTimeout(restart, 2000);
					}
			}

			if(upPressed) {

				raycaster.set(vector,vectordir.normalize(),0,1);
				intersects = raycaster.intersectObjects(elements.children);

				diff = new THREE.Vector3(60/4,0,0);
				if(intersects.length > 0 && intersects[0].distance< 60/2 && intersects[0].object.name=="obs" ){
						console.log("khabat");
						console.log(intersects[0].object.name);
						intersects[0].object.parent.remove(intersects[0].object);
						hitsvalue=hitsvalue+1;
						hits.innerHTML=hitsvalue;
						if (hitsvalue>=3)
						{
								score.innerHTML="Game Over";
								leftPressed=false;
								upPressed=false;
								rightPressed=false;
								setTimeout(restart, 2000);
						}
				}
				if (hitsvalue<3) {
					car.position.z -= 20;
					cube.position.z -= 20;
					camera.position.z=camera.position.z-20;
					scorevalue=scorevalue+10;
					score.innerHTML = scorevalue;
					if (car.position.z<=end.position.z+200) {
						document.removeEventListener('keydown', onKeyDown, false);
						document.removeEventListener('keyup', keyUpHandler, false);
						leftPressed=false;
						upPressed=false;
						rightPressed=false;
						win();
					}
				}
			}



			function restart()
			{
				scene.remove.apply(scene, scene.children);
				console.log(scene.children);
				elements.remove.apply(elements, elements.children);
				init();
				document.addEventListener('keydown', onKeyDown, false);
				document.addEventListener('keyup', keyUpHandler, false);
				scorevalue=0;
				score.innerHTML="0";
				hitsvalue=0;
				hits.innerHTML="0";

				document.getElementById('overlay').style.display="block";
       	document.getElementById('btn').style.display="block";
				document.getElementById('instructions').style.display="block";
      	document.getElementById('btn').innerHTML="PLAY AGAIN";
        document.getElementById('btn').style.left="42%";

			}

			function win() {
				console.log("won");
				console.log(end.position.z);
				score.innerHTML="WON!";
				setTimeout(restart, 2000);
			}

		requestAnimationFrame(animate);
		renderer.render(scene,camera);


	};
	function start() {
		document.getElementById('overlay').style.display="none";
		document.getElementById('btn').style.display="none";
		document.getElementById('instructions').style.display="none";
		document.addEventListener('keydown', onKeyDown, false);
		document.addEventListener('keyup', keyUpHandler, false);
	}
  init();
