import * as THREE from './vendor/three.module.js';
// Illustrative rooftop neighbourhood: visual context, not a surveyed obstruction model.
export function createArchitectureContext(){
 const group=new THREE.Group();group.name='Rooftop neighbourhood';let seed=70319;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
 const material=color=>new THREE.MeshStandardMaterial({color,roughness:.95});
 const plaster=['#c7b6a3','#d4c6ae','#afb3ae','#cabca5','#bda999'].map(material),trim=material('#ada494'),tank=material('#454e4d'),treeMat=material('#64775c'),soilMat=material('#a5a590');
 function box(w,h,d,x,y,z,mat){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);group.add(m);return m}
 const terrain=new THREE.Mesh(new THREE.PlaneGeometry(240,220,1,1),soilMat);terrain.rotation.x=-Math.PI/2;terrain.position.set(0,-8.15,-30);group.add(terrain);
 const windowMatrices=[],litMatrices=[],dummy=new THREE.Object3D();
 for(let i=0;i<21;i++){const x=(i%7-3)*9+(random()-.5)*2,z=-20-Math.floor(i/7)*13,w=4.8+random()*2.5,d=5+random()*3,h=5+random()*12,roof=-8+h;
 box(w,h,d,x,-8+h/2,z,plaster[i%plaster.length]);box(w+.2,.18,d+.2,x,roof+.1,z,trim);
 for(const side of [-1,1])box(w,.45,.12,x,roof+.4,z+side*d/2,trim);
 for(const side of [-1,1])box(.12,.45,d,x+side*w/2,roof+.4,z,trim);
 const floors=Math.floor(h/2.7),cols=Math.max(2,Math.floor(w/1.7));for(let floor=0;floor<floors;floor++)for(let c=0;c<cols;c++){dummy.position.set(x-w*.36+c*w*.72/(cols-1),-6.7+floor*2.7,z+d/2+.02);dummy.scale.set(.72,1.1,1);dummy.rotation.set(0,0,0);dummy.updateMatrix();(random()<.18?litMatrices:windowMatrices).push(dummy.matrix.clone())}
 // Rooftop utility rooms and familiar cylindrical water tanks.
 if(i%2===0){box(w*.38,1.9,d*.34,x-w*.2,roof+.95,z-d*.18,plaster[(i+1)%plaster.length]);const t=new THREE.Mesh(new THREE.CylinderGeometry(.5,.53,1.0,12),tank);t.position.set(x+w*.22,roof+.52,z+d*.15);group.add(t)}
 if(i%3===0){const panel=new THREE.Mesh(new THREE.BoxGeometry(w*.55,.07,1.3),material('#566c77'));panel.rotation.x=-.25;panel.position.set(x,roof+.65,z);group.add(panel)}
 }
 for(const [matrices,color]of [[windowMatrices,'#536663'],[litMatrices,'#bcac8b']]){const m=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),material(color),matrices.length);matrices.forEach((matrix,i)=>m.setMatrixAt(i,matrix));m.instanceMatrix.needsUpdate=true;group.add(m)}
 // Trees lie below terrace level along the neighbouring plots.
 for(let i=0;i<17;i++){const x=(random()-.5)*90,z=-11-random()*45,h=3+random()*4;box(.28,h,.28,x,-8+h/2,z,trim);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.2+random(),2),treeMat);crown.position.set(x,-8+h,z);crown.scale.set(1,1.2,.9);group.add(crown)}
 const skyMaterial=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{sunDirection:{value:new THREE.Vector3(.4,.5,-.6).normalize()},day:{value:1}},vertexShader:`varying vec3 worldPoint;void main(){worldPoint=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
 varying vec3 worldPoint;uniform vec3 sunDirection;uniform float day;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
 float fbm(vec2 p){float n=0.,a=.5;for(int i=0;i<5;i++){n+=noise(p)*a;p=p*2.03+vec2(12.3,7.1);a*=.5;}return n;}
 void main(){vec3 ray=normalize(worldPoint-cameraPosition);float up=max(ray.y,0.);vec3 horizon=mix(vec3(.07,.09,.15),vec3(.79,.84,.85),day),zenith=mix(vec3(.025,.04,.09),vec3(.25,.48,.70),day);vec3 color=mix(horizon,zenith,pow(up,.45));float glow=pow(max(dot(ray,sunDirection),0.),32.);color+=vec3(1.,.74,.42)*glow*.16*day;vec2 uv=ray.xz/(max(ray.y,.01)+.14)*3.6;float cloud=smoothstep(.49,.67,fbm(uv))*smoothstep(.015,.18,ray.y);vec3 cloudColor=mix(vec3(.14,.17,.23),mix(vec3(.78,.79,.77),vec3(.98,.96,.90),fbm(uv+2.)),day);color=mix(color,cloudColor,cloud*.86);gl_FragColor=vec4(color,1.);#include <tonemapping_fragment>\n#include <colorspace_fragment>}
 `});
 // Put preprocessor directives on their own lines for WebGL shader compilation.
 skyMaterial.fragmentShader=skyMaterial.fragmentShader.replace(';#include',';\n#include').replace('<colorspace_fragment>}', '<colorspace_fragment>\n}');
 const skyDome=new THREE.Mesh(new THREE.SphereGeometry(160,32,16),skyMaterial);skyDome.name='Atmosphere and layered clouds';skyDome.renderOrder=-10;skyDome.frustumCulled=false;group.add(skyDome);
 return {group,setSun(elevation,direction){skyMaterial.uniforms.sunDirection.value.copy(direction).normalize();skyMaterial.uniforms.day.value=THREE.MathUtils.smoothstep(elevation,-10,12)}};
}
