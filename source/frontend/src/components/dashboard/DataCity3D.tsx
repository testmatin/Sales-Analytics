import { useEffect, useRef, useState } from 'react';

export function DataCity3D({ values }: { values: Array<{ revenue: number }> }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || values.length === 0) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const start = async () => {
      const THREE = await import('three');
      if (disposed || !mountRef.current) return;

      const currentMount = mountRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(6.5, 6, 8.5);
      camera.lookAt(0, 0.6, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      currentMount.appendChild(renderer.domElement);

      const city = new THREE.Group();
      city.rotation.y = -0.35;
      scene.add(city);

      const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x111725, metalness: 0.65, roughness: 0.42 });
      const accentMaterials = [
        new THREE.MeshStandardMaterial({ color: 0x6c5ce7, metalness: 0.38, roughness: 0.25 }),
        new THREE.MeshStandardMaterial({ color: 0x00d2ff, metalness: 0.34, roughness: 0.26 }),
        new THREE.MeshStandardMaterial({ color: 0x00d084, metalness: 0.3, roughness: 0.3 }),
      ];
      const capMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.48 });

      const floorGeometry = new THREE.BoxGeometry(8.6, 0.16, 5.7);
      const towerGeometry = new THREE.BoxGeometry(0.72, 1, 0.72);
      const capGeometry = new THREE.BoxGeometry(0.8, 0.08, 0.8);

      const floor = new THREE.Mesh(floorGeometry, baseMaterial);
      floor.position.y = -0.15;
      city.add(floor);

      const max = Math.max(...values.map(v => v.revenue), 1);
      values.slice(0, 10).forEach((item, index) => {
        const height = 0.6 + (item.revenue / max) * 3.9;
        const x = (index % 5 - 2) * 1.35;
        const z = (Math.floor(index / 5) - 0.5) * 2.1;

        const tower = new THREE.Mesh(towerGeometry, accentMaterials[index % accentMaterials.length]);
        tower.scale.y = height;
        tower.position.set(x, height / 2, z);
        city.add(tower);

        const cap = new THREE.Mesh(capGeometry, capMaterial);
        cap.position.set(x, height + 0.05, z);
        city.add(cap);
      });

      scene.add(new THREE.HemisphereLight(0xdde5ff, 0x080b12, 1.8));
      const key = new THREE.DirectionalLight(0xffffff, 3.1);
      key.position.set(5, 8, 6);
      scene.add(key);
      const violet = new THREE.PointLight(0x6c5ce7, 24, 14, 2);
      violet.position.set(-4, 4, 3);
      scene.add(violet);
      const cyan = new THREE.PointLight(0x00d2ff, 18, 12, 2);
      cyan.position.set(4, 2, -2);
      scene.add(cyan);

      let pointerX = 0;
      let pointerY = 0;
      let targetY = city.rotation.y;
      let dragging = false;
      let lastX = 0;
      let frame = 0;
      let visible = true;

      const pointerMove = (event: PointerEvent) => {
        const rect = currentMount.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        pointerX = (event.clientX - rect.left) / rect.width - 0.5;
        pointerY = (event.clientY - rect.top) / rect.height - 0.5;
        if (dragging) {
          targetY += (event.clientX - lastX) * 0.006;
          lastX = event.clientX;
        }
      };
      const pointerDown = (event: PointerEvent) => {
        dragging = true;
        lastX = event.clientX;
        currentMount.setPointerCapture?.(event.pointerId);
      };
      const pointerUp = () => { dragging = false; };

      currentMount.addEventListener('pointermove', pointerMove);
      currentMount.addEventListener('pointerdown', pointerDown);
      currentMount.addEventListener('pointerup', pointerUp);
      currentMount.addEventListener('pointercancel', pointerUp);

      const resize = () => {
        const rect = currentMount.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(currentMount);
      resize();

      const visibilityObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      }, { threshold: 0.05 });
      visibilityObserver.observe(currentMount);

      const animate = () => {
        if (!visible || document.hidden) {
          frame = requestAnimationFrame(animate);
          return;
        }
        if (!dragging) targetY += 0.0012;
        city.rotation.y += (targetY + pointerX * 0.08 - city.rotation.y) * 0.05;
        city.rotation.x += ((-0.08 + pointerY * 0.05) - city.rotation.x) * 0.05;
        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
      };

      setReady(true);
      animate();

      cleanup = () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        currentMount.removeEventListener('pointermove', pointerMove);
        currentMount.removeEventListener('pointerdown', pointerDown);
        currentMount.removeEventListener('pointerup', pointerUp);
        currentMount.removeEventListener('pointercancel', pointerUp);
        floorGeometry.dispose();
        towerGeometry.dispose();
        capGeometry.dispose();
        baseMaterial.dispose();
        accentMaterials.forEach(material => material.dispose());
        capMaterial.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    // Let the dashboard shell paint first; load WebGL immediately after.
    const timer = window.setTimeout(start, 0);

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      cleanup?.();
    };
  }, [values]);

  return <div ref={mountRef} className={`data-city ${ready ? 'is-ready' : ''}`} aria-label="نمای سه‌بعدی حجم فروش">
    {!ready && <div className="data-city-placeholder"><span/><small>نمای سه‌بعدی در حال آماده‌سازی</small></div>}
  </div>;
}
