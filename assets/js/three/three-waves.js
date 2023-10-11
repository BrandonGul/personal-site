import * as THREE from 'three';
import {colors} from '../colors/colors.js';

export default function wavesInit(container) {
  const clock = new THREE.Clock();
  window.addEventListener( 'resize', onWindowResize, false );

  // Quick side note. I use folds so that is why everything is indented.

  // POST PROCESS DOWN RES SCREEN 
  // CREDIT: https://eriksachse.medium.com/three-js-pixelated-lo-fi-energy-look-298b8dc3eaad
  //
    const postProcessCamera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 1000 );
    postProcessCamera.position.z = 1;

    const postProcessScene = new THREE.Scene();

    var postProcessTexture = new THREE.WebGLRenderTarget( 
      window.innerWidth/4,
      window.innerHeight/4,
      { 
        minFilter: THREE.LinearFilter, 
        magFilter: THREE.NearestFilter, 
        format: THREE.RGBFormat 
      }
    );

    var postProcessMaterial = new THREE.ShaderMaterial( {
      uniforms: { u_diffuse: { value: postProcessTexture.texture } },
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv;

        void main() {

          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        }
      ` ,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D u_diffuse;

        void main() {

          gl_FragColor = texture2D( u_diffuse, vUv );

        }
      `
    } );

    const postProcessPlane     = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight );
    const postProcessMesh      = new THREE.Mesh( postProcessPlane, postProcessMaterial );
    postProcessMesh.position.z = - 100;
    postProcessScene.add( postProcessMesh );
  // END POST PROCESS DOWN RES SCREEN


  // WAVE SECTION
  // CREDITS:
  //    All credits for shaders are listed in the shaders. Some shaders are modified from their original form.
  //    I would also like to credit Yuri Artiukh (https://www.youtube.com/@akella_) for all of the great videos on three js. I got some really great inspiration from Yuris' videos.
  //
    const waveCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    waveCamera.position.z = 20;

    const waveScene = new THREE.Scene();

    const waveUniforms = {
      u_time: {
        type: 'f',
        value: clock.getElapsedTime()
      },
      r_color: {
        type: 'f',
        value: colors[0].r_color
      },
      g_color: {
        type: 'f',
        value: colors[0].g_color
      },
      b_color: {
        type: 'f',
        value: colors[0].b_color
      }
    }

    const wavePlane = new THREE.PlaneGeometry( 80, 80, 50, 50 );
    const waveMaterial = new THREE.ShaderMaterial({
      uniforms: waveUniforms,
      vertexShader: `
        uniform float u_time;
        varying vec2 vUv;

        //	Simplex 3D Noise 
        //	by Ian McEwan, Ashima Arts
        //
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

        float snoise(vec3 v){ 
          const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

          // First corner
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 =   v - i + dot(i, C.xxx) ;

          // Other corners
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );

          //  x0 = x0 - 0. + 0.0 * C 
          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1. + 3.0 * C.xxx;

          // Permutations
          i = mod(i, 289.0 ); 
          vec4 p = permute( permute( permute( 
                     i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

          // Gradients
          // ( N*N points uniformly over a square, mapped onto an octahedron.)
          float n_ = 1.0/7.0; // N=7
          vec3  ns = n_ * D.wyz - D.xzx;

          vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);

          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );

          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));

          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);

          //Normalise gradients
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;

          // Mix final noise value
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                        dot(p2,x2), dot(p3,x3) ) );
        }

        void main()	{
          vUv = uv;
          vec4 result;

          vec2 noiseCord = uv*vec2(2.8, 4.5);
          float noise = snoise(vec3(noiseCord, u_time * 0.1));
          vec3 pos = vec3(position.x, position.y, position.z + noise * 6.0);

          gl_Position = projectionMatrix
            * modelViewMatrix
            * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float u_time;
        uniform float r_color;
        uniform float g_color;
        uniform float b_color;

        // Author @patriciogv - 2015
        // http://patriciogonzalezvivo.com

        #ifdef GL_ES
        precision mediump float;
        #endif

        float random (in vec2 st) {
            return fract(sin(dot(st.xy,
                                 vec2(12.9898,78.233)))
                        * 43758.5453123);
        }

        // Value noise by Inigo Quilez - iq/2013
        // https://www.shadertoy.com/view/lsf3WH
        float noise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);
            vec2 u = f*f*(3.0-2.0*f);
            return mix( mix( random( i + vec2(0.0,0.0) ),
                             random( i + vec2(1.0,0.0) ), u.x),
                        mix( random( i + vec2(0.0,1.0) ),
                             random( i + vec2(1.0,1.0) ), u.x), u.y);
        }

        mat2 rotate2d(float angle){
            return mat2(cos(angle),-sin(angle),
                        sin(angle),cos(angle));
        }

        float lines(in vec2 pos, float b){
            float scale = 10.112;
            pos *= scale;
            return step(0.364+b*0.232, abs((sin(pos.x*1.205)+b*2.392))*0.572);
        }

        void main() {
            vec2 st = vUv.xy;
            st.y *= vUv.y;

            vec2 pos = st.yx*vec2(10.,3.);

            float pattern = pos.x;

            pos = rotate2d( noise(pos + u_time / 50.) ) * pos;

            pattern = lines(pos,.5);

            if (pattern > .0){
              gl_FragColor = vec4(vec3(pattern - r_color, pattern - g_color, pattern - b_color), 1.0);
            } else {
              gl_FragColor = vec4(0., 0., 0., 0.0);
            }
        }
      `,
    });
    var waveMesh = new THREE.Mesh( wavePlane, waveMaterial );
    waveScene.add( waveMesh );

    waveMesh.rotation.set((Math.PI / 2) - 0.3, -0.1, 0);
  // END WAVE SECTION 

  // COLOR CHANGE SECTION 
  //    Listens to body class changes to change the color of the waves
    const body  = document.body;
    const colorTrack = {
      'mode': colors[0].mode,
      'r_color': colors[0].r_color,
      'g_color': colors[0].g_color,
      'b_color': colors[0].b_color,
      'r_value': 0.0,
      'r_under': false,
      'g_value': 0.0,
      'g_under': false,
      'b_value': 0.0,
      'b_under': false
    };

    function colorDifference(a, b) {
      return (Math.round(Math.abs(a - b) * 10) / 10) / 100;
    }

    function isPositive(a, b) {
      if(a >= b) {
        return false;
      }
      else {
        return true;
      }
    }
    
    function changeColor() {
      if(colorTrack.r_under) {
        if(waveUniforms.r_color.value > colorTrack.r_color) {
          waveUniforms.r_color.value -= colorTrack.r_value;
        }
      }
      else {
        if(waveUniforms.r_color.value < colorTrack.r_color) {
          waveUniforms.r_color.value += colorTrack.r_value;
        }
      }

      if(colorTrack.g_under) {
        if(waveUniforms.g_color.value > colorTrack.g_color) {
          waveUniforms.g_color.value -= colorTrack.g_value;
        }
      }
      else {
        if(waveUniforms.g_color.value < colorTrack.g_color) {
          waveUniforms.g_color.value += colorTrack.g_value;
        }
      }

      if(colorTrack.b_under) {
        if(waveUniforms.b_color.value > colorTrack.b_color) {
          waveUniforms.b_color.value -= colorTrack.b_value;
        }
      }
      else {
        if(waveUniforms.b_color.value < colorTrack.b_color) {
          waveUniforms.b_color.value += colorTrack.b_value;
        }
      }
    }

    const observer = new MutationObserver((mutations) => {
      if(mutations[0].attributeName === 'class') {
        const colorMode = (mutations[0].target.classList.value != '')? mutations[0].target.classList.value : 'normal';

        colors.forEach(mode => {
          if(mode.mode == colorMode) {
            let rValue = colorDifference(waveUniforms.r_color.value, mode.r_color); 
            let gValue = colorDifference(waveUniforms.g_color.value, mode.g_color); 
            let bValue = colorDifference(waveUniforms.b_color.value, mode.b_color); 

            colorTrack.r_value = rValue;
            colorTrack.g_value = gValue;
            colorTrack.b_value = bValue;

            colorTrack.r_under = isPositive(mode.r_color, colorTrack.r_color);
            colorTrack.g_under = isPositive(mode.g_color, colorTrack.g_color);
            colorTrack.b_under = isPositive(mode.b_color, colorTrack.b_color);

            colorTrack.r_color = mode.r_color;
            colorTrack.g_color = mode.g_color;
            colorTrack.b_color = mode.b_color;
          }
        });
      }
    });

    observer.observe(body, {attributes: true});

    const storageMode = localStorage.getItem('mode');
    if (storageMode) {
      for (const i in colors) {
        let value = colors[i];
        if(value.mode == storageMode) {
          waveUniforms.r_color.value = value.r_color;
          waveUniforms.g_color.value = value.g_color;
          waveUniforms.b_color.value = value.b_color;
          colorTrack.r_color = value.r_color;
          colorTrack.g_color = value.g_color;
          colorTrack.b_color = value.b_color;
          break;
        }
      }
    }
  // COLOR CHANGE SECTION 

  // RENDER ANIMATE AND RESIZE SECTION
  //
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
    });

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;
    container.appendChild( renderer.domElement );

    function onWindowResize() {
      waveCamera.aspect = window.innerWidth / window.innerHeight;
      waveCamera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function animate() {
      requestAnimationFrame( animate );
      waveUniforms.u_time.value = clock.getElapsedTime();
      changeColor();
      renderer.setRenderTarget( postProcessTexture );
      renderer.clear();
      renderer.render( waveScene, waveCamera );

      renderer.setRenderTarget( null );
      renderer.clear();
      renderer.render( postProcessScene, postProcessCamera );
    }

    animate();
  // END RENDER ANIMATE AND RESIZE SECTION

}
