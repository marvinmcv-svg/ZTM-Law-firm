import {
  WebGLRenderer, Scene, PerspectiveCamera, OrthographicCamera, Mesh, PlaneGeometry, ShaderMaterial,
  Color, Vector2, IcosahedronGeometry, TorusGeometry, MeshPhysicalMaterial, Group, PMREMGenerator,
  BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, AdditiveBlending, DirectionalLight,
  AmbientLight, MathUtils, SRGBColorSpace, ACESFilmicToneMapping, OctahedronGeometry, EdgesGeometry, LineSegments, LineBasicMaterial
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Fluid gold / ink gradient shader that lives behind the whole page.
const frag = `
precision highp float;
uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse; uniform float uScroll;
uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.); m=m*m; m=m*m;
  vec3 x=2.*fract(p*C.www)-1.; vec3 h=abs(x)-.5; vec3 ox=floor(x+.5); vec3 a0=x-ox;
  m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes; vec2 p=uv; p.x*=uRes.x/uRes.y;
  float t=uTime*.045;
  vec2 m=(uMouse-.5)*.25;
  float n1=snoise(p*1.1+vec2(t,-t*.7)+m);
  float n2=snoise(p*2.2-vec2(t*1.3,t)+n1*.6);
  float n3=snoise(p*.7+vec2(-t*.5,t*.4)+uScroll*.6);
  vec3 col=mix(uA,uB,smoothstep(-.6,.8,n1+n3*.5));
  col=mix(col,uC,smoothstep(.35,1.,n2*.7+n1*.5)*.75);
  // vignette + soft glow follows pointer
  float vig=smoothstep(1.25,.25,length(uv-.5));
  float glow=exp(-length(uv-uMouse)*3.2)*.10;
  col=col*vig+uC*glow;
  // film grain
  float g=fract(sin(dot(gl_FragCoord.xy+uTime,vec2(12.9898,78.233)))*43758.5453);
  col+=(g-.5)*.025;
  gl_FragColor=vec4(col,1.);
}`;
const vert = `void main(){gl_Position=vec4(position.xy,0.,1.);}`;

export function initScene(canvas, opts = {}) {
  const reduce = opts.reduceMotion;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 820 ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);

  // --- background gradient pass
  const bgScene = new Scene();
  const bgCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const bgMat = new ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, depthWrite: false,
    uniforms: {
      uTime: { value: 0 }, uRes: { value: new Vector2(1, 1) }, uMouse: { value: new Vector2(.5, .5) }, uScroll: { value: 0 },
      uA: { value: new Color('#05070d') }, uB: { value: new Color('#0c1424') }, uC: { value: new Color('#6b5320') }
    }
  });
  bgScene.add(new Mesh(new PlaneGeometry(2, 2), bgMat));

  // --- 3D object scene
  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 9);
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.add(new AmbientLight(0xffffff, 0.15));
  const key = new DirectionalLight(0xffe2a8, 2.2); key.position.set(4, 5, 6); scene.add(key);
  const rim = new DirectionalLight(0x6f9bff, 1.2); rim.position.set(-6, -2, -4); scene.add(rim);

  const rig = new Group(); scene.add(rig);
  const gold = new MeshPhysicalMaterial({ color: '#d8b56a', metalness: 1, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.15, flatShading: true, envMapIntensity: 1.4 });
  const gem = new Mesh(new IcosahedronGeometry(1.5, 1), gold);
  rig.add(gem);
  const wire = new LineSegments(new EdgesGeometry(new IcosahedronGeometry(1.78, 1)), new LineBasicMaterial({ color: '#e9d29b', transparent: true, opacity: 0.35 }));
  rig.add(wire);
  const ringMat = new MeshPhysicalMaterial({ color: '#f1dfae', metalness: 1, roughness: 0.12, envMapIntensity: 1.6 });
  const rings = [2.35, 2.9, 3.5].map((r, i) => {
    const m = new Mesh(new TorusGeometry(r, 0.012 + i * 0.004, 16, 220), ringMat);
    m.rotation.set(Math.PI / 2.4 + i * 0.5, i * 0.7, 0);
    rig.add(m); return m;
  });
  const shard = new Mesh(new OctahedronGeometry(0.28, 0), gold); rig.add(shard);

  // gold dust
  const N = 700, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i*3] = (Math.random()-.5)*26; pos[i*3+1] = (Math.random()-.5)*16; pos[i*3+2] = (Math.random()-.5)*14 - 2; }
  const pg = new BufferGeometry(); pg.setAttribute('position', new Float32BufferAttribute(pos, 3));
  const dust = new Points(pg, new PointsMaterial({ color: '#e8cf93', size: 0.028, transparent: true, opacity: 0.7, blending: AdditiveBlending, depthWrite: false }));
  scene.add(dust);

  const state = { scroll: 0, mx: .5, my: .5, tx: .5, ty: .5, visible: true, stage: 0, objX: 2.6, objY: 0, objS: 1, spin: 0, hue: 0 };
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    bgMat.uniforms.uRes.value.set(w * dpr, h * dpr);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    state.narrow = w < 820;
  }
  resize(); window.addEventListener('resize', resize);
  window.addEventListener('pointermove', e => { state.tx = e.clientX / window.innerWidth; state.ty = 1 - e.clientY / window.innerHeight; }, { passive: true });
  document.addEventListener('visibilitychange', () => { state.visible = !document.hidden; });

  const palettes = [ // [A,B,C] per chapter, interpolated on scroll
    ['#05070d', '#0c1424', '#7a5c22'],
    ['#060912', '#101a30', '#3d5a8c'],
    ['#07090f', '#1a1426', '#8a5a2b'],
    ['#05070d', '#0b1b1a', '#2f6b5e'],
  ];
  const cA = new Color(), cB = new Color(), cC = new Color(), tmp = new Color();
  function palette(t) {
    const f = t * (palettes.length - 1), i = Math.min(Math.floor(f), palettes.length - 2), k = f - i;
    [[cA, 0], [cB, 1], [cC, 2]].forEach(([c, j]) => { c.set(palettes[i][j]); tmp.set(palettes[i + 1][j]); c.lerp(tmp, k); });
    bgMat.uniforms.uA.value.copy(cA); bgMat.uniforms.uB.value.copy(cB); bgMat.uniforms.uC.value.copy(cC);
  }

  let last = performance.now(), time = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    if (!state.visible) return;
    const dt = Math.min((now - last) / 1000, .05); last = now;
    if (!reduce) time += dt;
    state.mx += (state.tx - state.mx) * Math.min(1, dt * 3); state.my += (state.ty - state.my) * Math.min(1, dt * 3);
    bgMat.uniforms.uTime.value = time; bgMat.uniforms.uMouse.value.set(state.mx, state.my); bgMat.uniforms.uScroll.value = state.scroll;
    palette(MathUtils.clamp(state.scroll, 0, 1));
    const s = state.scroll;
    // hero: big and centred right. After the hero it shrinks into an accent that glides along the page edges.
    const ph = MathUtils.smoothstep(s, 0.0, 0.07);
    const half = Math.tan(MathUtils.degToRad(19)) * 9 * camera.aspect;
    const side = Math.sin(s * Math.PI * 7) > 0 ? 1 : -1;
    const heroX = state.narrow ? half * 0.5 : half * 0.6, heroY = state.narrow ? 3.0 : 0;
    const edgeX = state.narrow ? half * 0.9 * side : (half - 0.4) * side;
    const edgeY = state.narrow ? 3 - s * 2 : Math.sin(s * Math.PI * 5) * 1.8;
    const baseX = MathUtils.lerp(heroX, edgeX, ph), baseY = MathUtils.lerp(heroY, edgeY, ph);
    rig.position.x += (baseX - rig.position.x) * Math.min(1, dt * 4);
    rig.position.y += (baseY - rig.position.y) * Math.min(1, dt * 4);
    rig.position.z += ((ph * -2.5) - rig.position.z) * Math.min(1, dt * 4);
    const sc = (state.narrow ? .5 : 1) * MathUtils.lerp(.88, 0.34, ph) * state.objS;
    rig.scale.setScalar(sc);
    gem.rotation.y = time * .25 + s * 9; gem.rotation.x = time * .12 + (state.my - .5) * .8;
    wire.rotation.copy(gem.rotation); wire.rotation.y *= -.6;
    rings.forEach((r, i) => { r.rotation.z = time * (.12 + i * .07) * (i % 2 ? -1 : 1) + s * (3 + i); r.rotation.x += (((state.my - .5) * .5) * .02); });
    shard.position.set(Math.cos(time * .6) * 3.1, Math.sin(time * .9) * .6, Math.sin(time * .6) * 3.1);
    shard.rotation.set(time, time * .7, 0);
    rig.rotation.y += ((state.mx - .5) * .6 - rig.rotation.y) * Math.min(1, dt * 2);
    dust.rotation.y = time * .015 + s * .6; dust.position.y = s * 2;
    camera.position.x += ((state.mx - .5) * .6 - camera.position.x) * Math.min(1, dt * 2);
    camera.lookAt(0, 0, 0);

    renderer.autoClear = true; renderer.render(bgScene, bgCam);
    renderer.autoClear = false; renderer.clearDepth(); renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
  return state;
}
