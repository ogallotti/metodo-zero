# 3D Floating Objects

## Quando usar
Objetos 3D flutuando ao redor do hero com movimento orgânico e interação com mouse. Ideal para landing pages de produto, SaaS, fintech, crypto, e-commerce premium. Tom futurista e imersivo. Usa Three.js com Dynamic Import para não bloquear carregamento.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--fo-bg` | `#0a0a0a` | Cor de fundo |
| `--fo-color-primary` | `#6366f1` | Cor primária dos objetos |
| `--fo-color-secondary` | `#ec4899` | Cor secundária dos objetos |
| `--fo-object-count` | `5` | Número de objetos (via JS) |
| `--fo-float-range` | `0.5` | Amplitude da flutuação (via JS) |
| `--fo-mouse-influence` | `0.3` | Influência do mouse na rotação (via JS) |

## Dependências
- Three.js (Dynamic Import) — `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`

## HTML

```html
<section class="fo-hero" id="floatingObjHero">
  <canvas class="fo-hero__canvas" id="foCanvas"></canvas>
  <div class="fo-hero__content">
    <h1 class="fo-hero__title">Build the Future</h1>
    <p class="fo-hero__subtitle">Next-generation tools for modern teams</p>
    <a href="#" class="fo-hero__cta">Start Free Trial</a>
  </div>
</section>
```

## CSS

```css
.fo-hero {
  --fo-bg: var(--color-bg, #0a0a0a);

  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--fo-bg);
}

.fo-hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.fo-hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 50rem;
}

.fo-hero__title {
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 800;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.05;
}

.fo-hero__subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  margin: 0 0 2rem;
  line-height: 1.5;
}

.fo-hero__cta {
  display: inline-block;
  padding: 0.875rem 2.5rem;
  background: var(--color-primary, #6366f1);
  color: #ffffff;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.fo-hero__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.4);
}

@media (prefers-reduced-motion: reduce) {
  .fo-hero__canvas {
    opacity: 0.3;
  }
}
```

## JavaScript

```javascript
(function () {
  const hero = document.getElementById('floatingObjHero');
  const canvas = document.getElementById('foCanvas');
  if (!hero || !canvas) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const config = {
    objectCount: window.innerWidth < 768 ? 3 : 5,
    floatRange: 0.5,
    mouseInfluence: 0.3,
    primaryColor: 0x6366f1,
    secondaryColor: 0xec4899,
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        loadScene();
      }
    },
    { threshold: 0.1 }
  );
  observer.observe(hero);

  function loadScene() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = initScene;
    document.head.appendChild(script);
  }

  function initScene() {
    const THREE = window.THREE;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);

    /* Lighting */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(config.primaryColor, 1, 20);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(config.secondaryColor, 0.8, 20);
    pointLight2.position.set(-3, -2, 2);
    scene.add(pointLight2);

    /* Objects */
    const geometries = [
      new THREE.IcosahedronGeometry(0.5, 0),
      new THREE.OctahedronGeometry(0.4, 0),
      new THREE.TorusGeometry(0.35, 0.15, 16, 32),
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.ConeGeometry(0.3, 0.6, 6),
    ];

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.4,
      wireframe: false,
    });

    const objects = [];
    for (let i = 0; i < config.objectCount; i++) {
      const geo = geometries[i % geometries.length];
      const mesh = new THREE.Mesh(geo, material.clone());

      mesh.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3
      );

      mesh.userData = {
        basePos: mesh.position.clone(),
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
        },
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.3 + Math.random() * 0.4,
      };

      scene.add(mesh);
      objects.push(mesh);
    }

    /* Mouse tracking */
    let mouseX = 0, mouseY = 0;
    if (!reducedMotion) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      }, { passive: true });
    }

    /* Animation */
    let animId;
    const clock = new THREE.Clock();

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      objects.forEach((obj) => {
        const ud = obj.userData;

        if (!reducedMotion) {
          obj.rotation.x += ud.rotSpeed.x;
          obj.rotation.y += ud.rotSpeed.y;

          obj.position.y = ud.basePos.y +
            Math.sin(t * ud.floatSpeed + ud.floatOffset) * config.floatRange;
          obj.position.x = ud.basePos.x +
            Math.cos(t * ud.floatSpeed * 0.7 + ud.floatOffset) * config.floatRange * 0.5;
        }
      });

      /* Subtle camera follow mouse */
      if (!reducedMotion) {
        camera.position.x += (mouseX * config.mouseInfluence - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * config.mouseInfluence - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    }

    /* Visibility management */
    const visObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!animId) animate();
        } else {
          cancelAnimationFrame(animId);
          animId = null;
        }
      },
      { threshold: 0.1 }
    );
    visObserver.observe(hero);

    /* Resize */
    window.addEventListener('resize', () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    if (reducedMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }
  }
})();
```

## Integração
Three.js é carregado via Dynamic Import apenas quando a seção entra na viewport (IntersectionObserver). Canvas é transparente (alpha: true) — o fundo vem do CSS. Os objetos flutuam organicamente e respondem ao mouse. Em reduced-motion, renderiza frame estático. Em mobile, reduz contagem de objetos para 3.

## Variações

### Variação 1: Wireframe Aesthetic
Objetos em wireframe para visual mais técnico/developer.
```javascript
const material = new THREE.MeshStandardMaterial({
  color: 0x6366f1,
  wireframe: true,
  metalness: 0,
  roughness: 1,
});
```

### Variação 2: Glass/Transparent Objects
Objetos semi-transparentes com refração simulada.
```javascript
const material = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.1,
  roughness: 0.05,
  transmission: 0.9,
  thickness: 0.5,
  ior: 1.5,
});
```

### Variação 3: Flat Colored Shapes
Cores sólidas sem lighting complexo. Estilo flat/ilustrativo.
```javascript
const colors = [0x6366f1, 0xec4899, 0x06b6d4, 0xf59e0b, 0x10b981];
const material = new THREE.MeshBasicMaterial({ color: colors[i % colors.length] });
// Remover ambient e point lights (desnecessários com MeshBasicMaterial)
```
