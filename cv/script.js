/* CURSOR */
const curOuter = document.getElementById('curOuter');
const curInner = document.getElementById('curInner');
const curLabel = document.getElementById('curLabel');
let mx=0,my=0,ox=0,oy=0;
document.addEventListener('mousemove', e=>{
  mx = e.clientX; my = e.clientY;
  curInner.style.left = mx+'px';
  curInner.style.top  = my+'px';
  curLabel.style.left = (mx+30)+'px';
  curLabel.style.top  = (my-30)+'px';
});
(function raf(){
  ox += (mx-ox)*0.15;
  oy += (my-oy)*0.15;
  curOuter.style.left = ox+'px';
  curOuter.style.top  = oy+'px';
  requestAnimationFrame(raf);
})();
document.querySelectorAll('a,button,.tech-chip,.project,.social,[data-cursor]').forEach(el=>{
  el.addEventListener('mouseenter', ()=>{
    curOuter.classList.add('hover');
    const lbl = el.getAttribute('data-cursor');
    if(lbl){ curLabel.textContent = lbl; curLabel.classList.add('show'); }
  });
  el.addEventListener('mouseleave', ()=>{
    curOuter.classList.remove('hover');
    curLabel.classList.remove('show');
  });
});

/* NAV */
const nav = document.getElementById('nav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('[data-nav]');
window.addEventListener('scroll', ()=>{
  nav.classList.toggle('scrolled', window.scrollY > 50);
  let cur = '';
  sections.forEach(s=>{
    if(window.scrollY >= s.offsetTop - 200) cur = s.id;
  });
  navLinks.forEach(l=> l.classList.toggle('active', l.getAttribute('href') === '#'+cur));
});

/* REVEAL */
const io = new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=> e.target.classList.add('in'), i*80);
      io.unobserve(e.target);
    }
  });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

/* PROJECT FILTER */
const filterBtns = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project');
filterBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    filterBtns.forEach(b=> b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    projects.forEach(p=>{
      const show = f === 'all' || p.dataset.cat === f;
      p.style.transition = 'opacity .4s, transform .4s';
      if(show){
        p.style.display = '';
        requestAnimationFrame(()=>{
          p.style.opacity = 1;
          p.style.transform = 'translateY(0)';
        });
      } else {
        p.style.opacity = 0;
        p.style.transform = 'translateY(20px)';
        setTimeout(()=> p.style.display = 'none', 350);
      }
    });
  });
});

/* 3D CARD TILT */
const card = document.getElementById('idCard');
const wrap = document.querySelector('.hero-3d-wrap');
wrap.addEventListener('mousemove', e=>{
  const r = wrap.getBoundingClientRect();
  const x = (e.clientX - r.left)/r.width - 0.5;
  const y = (e.clientY - r.top)/r.height - 0.5;
  card.style.animation = 'none';
  card.style.transform = `perspective(1200px) rotateY(${x*30}deg) rotateX(${-y*30}deg) translateZ(40px)`;
});
wrap.addEventListener('mouseleave', ()=>{
  card.style.transform = '';
  card.style.animation = 'cardFloat 8s ease-in-out infinite';
});

/* THREE.JS */
(function(){
  const canvas = document.getElementById('webgl');
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030308, 0.035);
  const camera = new THREE.PerspectiveCamera(65, innerWidth/innerHeight, 0.1, 200);
  camera.position.set(0, 0, 14);
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true, powerPreference:'high-performance'});
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const count = 4000;
  const pos = new Float32Array(count*3);
  const col = new Float32Array(count*3);
  const sizes = new Float32Array(count);
  const c1 = new THREE.Color(0x7c5cff);
  const c2 = new THREE.Color(0xff2d92);
  const c3 = new THREE.Color(0x00e5ff);

  for(let i=0;i<count;i++){
    const r = 4 + Math.random()*18;
    const th = Math.random()*Math.PI*2;
    const ph = Math.acos(2*Math.random()-1);
    pos[i*3]   = r*Math.sin(ph)*Math.cos(th);
    pos[i*3+1] = r*Math.sin(ph)*Math.sin(th)*0.6;
    pos[i*3+2] = r*Math.cos(ph);
    const mix = Math.random();
    const c = mix<0.5 ? c1.clone().lerp(c2, Math.random()) : c2.clone().lerp(c3, Math.random());
    col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    sizes[i] = Math.random()*2 + 0.5;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color', new THREE.BufferAttribute(col,3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes,1));

  const vtx = `
    attribute float aSize; attribute vec3 color; varying vec3 vColor;
    uniform float uTime; uniform vec2 uMouse;
    void main(){
      vColor = color; vec3 p = position;
      p.x += sin(uTime*0.3 + p.y*0.5) * 0.4;
      p.y += cos(uTime*0.4 + p.x*0.5) * 0.4;
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = aSize * (280.0 / -mv.z) * (1.0 + abs(uMouse.x*0.5));
    }`;
  const frg = `
    varying vec3 vColor;
    void main(){
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv);
      if(d > 0.5) discard;
      float a = 1.0 - smoothstep(0.0, 0.5, d);
      gl_FragColor = vec4(vColor, a);
    }`;
  const mat = new THREE.ShaderMaterial({
    vertexShader: vtx, fragmentShader: frg,
    uniforms: { uTime:{value:0}, uMouse:{value:new THREE.Vector2()} },
    transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, vertexColors:true
  });
  const stars = new THREE.Points(geo, mat);
  scene.add(stars);

  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.5, 1),
    new THREE.MeshBasicMaterial({color:0x7c5cff, wireframe:true, transparent:true, opacity:0.18})
  );
  ico.position.set(0,0,-2); scene.add(ico);

  const inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.2, 0),
    new THREE.MeshBasicMaterial({color:0xff2d92, wireframe:true, transparent:true, opacity:0.25})
  );
  inner.position.set(0,0,-2); scene.add(inner);

  const rings = [];
  for(let i=0;i<3;i++){
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(5 + i*1.5, 0.02, 16, 120),
      new THREE.MeshBasicMaterial({color:[0x7c5cff,0xff2d92,0x00e5ff][i], transparent:true, opacity:0.4})
    );
    ring.rotation.x = Math.PI/2 + i*0.3;
    ring.rotation.y = i*0.5;
    scene.add(ring); rings.push(ring);
  }

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e=>{
    mouseX = (e.clientX/innerWidth)*2 - 1;
    mouseY = -(e.clientY/innerHeight)*2 + 1;
    mat.uniforms.uMouse.value.set(mouseX, mouseY);
  });

  const clock = new THREE.Clock();
  function animate(){
    const t = clock.getElapsedTime();
    mat.uniforms.uTime.value = t;
    stars.rotation.y = t*0.04;
    stars.rotation.x = Math.sin(t*0.1)*0.1;
    ico.rotation.y = t*0.15; ico.rotation.x = t*0.1;
    inner.rotation.y = -t*0.25; inner.rotation.z = t*0.15;
    rings.forEach((r,i)=> r.rotation.z = t*(0.1 + i*0.05));
    camera.position.x += (mouseX*2 - camera.position.x)*0.05;
    camera.position.y += (mouseY*1.2 - camera.position.y)*0.05;
    camera.lookAt(0,0,-2);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  addEventListener('resize', ()=>{
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  addEventListener('scroll', ()=>{
    camera.position.z = 14 + (window.scrollY / innerHeight)*6;
  });
})();

/* SMOOTH ANCHOR */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id.length > 1){
      e.preventDefault();
      const t = document.querySelector(id);
      if(t) t.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});
