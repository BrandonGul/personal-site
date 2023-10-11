import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// INIT 
//    Find all three-holder and render a new three instance on each
//
export default function projectsInit() {
  document.querySelectorAll('div.three-holder').forEach(holder=> {
    holder.getBoundingClientRect().width;
    render(holder)
  });
}

// PROJECT 
//    Extends THREE Mesh. Adds in some helpers for raycasting QOL
class Project extends THREE.Mesh {
  constructor(items, i, project) {
    super()
    const texture = new THREE.TextureLoader();

    const textures = [
      new THREE.MeshStandardMaterial({
        map: texture.load(project.p_texture),
      }),
      new THREE.MeshStandardMaterial({
        map: texture.load(project.s_texture),
      }),
      new THREE.MeshStandardMaterial({
        map: texture.load(project.p_texture),
      }),
      new THREE.MeshStandardMaterial({
        map: texture.load(project.p_texture),
      }),
      new THREE.MeshStandardMaterial({
        map: texture.load(project.f_texture),
      }),
      new THREE.MeshStandardMaterial({
        map: texture.load(project.b_texture),
      })
    ];

    this.geometry      = new THREE.BoxGeometry( 6, 8, .3 );
    this.material      = textures;
    this.receiveShadow = true;
    this.floor         = 5 * items - (5 + (10 * i));
    this.position.y    = this.floor;
    this.rotation.y    += Math.random(0.0, 0.5);
    this.userData.pos  = Math.random(0, 10);
    this.userData.url  = project.url;
  }
}

// PROJECTS
//    Class to render a three scene with multiple projects inside of it
//
class Projects {
  constructor(holder, projects, items) {
    this.holder   = holder;
    this.height   = this.holder.getBoundingClientRect().height;
    this.width    = this.holder.getBoundingClientRect().width;
    this.projects = projects;
    this.items    = items;

    this.init(holder, items);
  }

  init(holder, items) {
    const clock = new THREE.Clock();
    window.addEventListener( 'resize', onWindowResize, false );
    const scene = new THREE.Scene();
    let widthBla = (this.width / (this.height / 5)) * items;
    let heightBla = (this.height / ((this.width * 0.55) / 5));
    const camera = new THREE.OrthographicCamera( -widthBla, widthBla, heightBla, -heightBla, -100, 5000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( this.width, this.height );
    renderer.autoClear = false;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    holder.appendChild( renderer.domElement );

    for (let i = 0; i < items; i++) {
      const project = new Project( items, i, this.projects[i]);
      scene.add( project );
    }

    const light = new THREE.DirectionalLight( 0xFFFFFF, 1.1);
    light.castShadow = true;
    light.left = -widthBla;
    light.right = widthBla;
    light.top = heightBla;
    light.bottom = -heightBla;
    light.position.set(0, 0, 50);
    scene.add( light );

    const blaLight = new THREE.AmbientLight( 0x505050 ); // soft white light
    scene.add( blaLight );

    camera.position.z = 5;

    const size = 200;
    const divisions = 200;
    const gridHelper = new THREE.GridHelper( size, divisions );
    //scene.add( gridHelper );

    function onWindowResize() {
      holder.style.height = `calc(${holder.getBoundingClientRect().width}px * (${items} * 0.55))`;

      let height = holder.getBoundingClientRect().height;
      let width = holder.getBoundingClientRect().width;
      let widthBla = (width / (height / 5)) * items;
      let heightBla = (height / ((width * 0.55) / 5));
      camera.left = -widthBla;
      camera.right = widthBla;
      camera.top = heightBla;
      camera.bottom = -heightBla;
      light.left = -widthBla;
      light.right = widthBla;
      light.top = heightBla;
      light.bottom = -heightBla;
      camera.updateProjectionMatrix();
      light.updateMatrix()
      renderer.setSize( width, height );
    }

    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    var intersects = [];

    const onMove = (event) => {
      let height = holder.getBoundingClientRect().height;
      let width = holder.getBoundingClientRect().width;
      pointer.x = ((event.clientX - holder.getBoundingClientRect().left) / width) * 2 - 1;
      pointer.y = -((event.clientY - holder.getBoundingClientRect().top) / height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      intersects = raycaster.intersectObjects(scene.children);
    }

    holder.addEventListener('mousemove', onMove);

    const onClick = () => {
      raycaster.setFromCamera(pointer, camera);
      intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        const link = intersects[0].object.userData.url;
        window.open(link, '_self');
      }
    }

    holder.addEventListener('click', onClick);

    function animate() {
      scene.children.forEach(element => {
        if(element.type == 'Mesh') {
          element.rotation.y += 0.01;

          if (intersects.length > 0) {
            holder.style.cursor = "pointer";
            const object = intersects[0].object;
            if (object.rotation.x > -0.9) {
              object.rotation.x -= 0.01;
            }

            if (object.rotation.z > -0.4) {
              object.rotation.z -= 0.005;
            }
          }
          else {
            holder.style.cursor = "initial"; 
            //if ((Math.sin(clock.getElapsedTime() + element.userData.pos) / 0.5) >= 0) {
            //  element.position.y += 0.005;
            //}
            //else { 
            //  element.position.y -= 0.005;
            //}

            if (element.rotation.x <= 0) {
              element.rotation.x += 0.05;
            }

            if (element.rotation.z <= 0) {
              element.rotation.z += 0.02;
            }
          }
        }
      });

      renderer.render( scene, camera );
      requestAnimationFrame( animate );
    }

    animate();
  }
}

// RENDER
//    Find all projects in holder and make an array out of those projects.
//    Render a three scene in the holder then pass those projects
//
function render(holder) {
  var projects = [];

  holder.querySelectorAll('project-data').forEach(data => {
    projects.push({
      "f_texture":  data.dataset.frontTexture,
      "b_texture":  data.dataset.backTexture,
      "s_texture":  data.dataset.spineTexture,
      "p_texture":  data.dataset.pageTexture,
      "title":      data.dataset.title,
      "url":        data.dataset.url
    });
  });

  let width = holder.getBoundingClientRect().width;
  holder.style.height = `calc(${width}px * (${projects.length} * 0.55))`;

  new Projects(holder, projects, projects.length);
}

