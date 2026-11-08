// Sakura (gilos guli) barglarining to'kilishi va sichqonchaga reaksiyasi
(function() {
  // Canvas elementini yaratish va sahifaga ulash
  let canvas = document.getElementById('sakura-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'sakura-canvas';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Sichqoncha pozitsiyasi va ta'sir doirasi
  const mouse = {
    x: -2000,
    y: -2000,
    radius: 140, // Sichqoncha ta'sir radiusi
    active: false
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.x = -2000;
    mouse.y = -2000;
  });

  // Mobil qurilmalarda teginish (touch) uchun
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.active = false;
    mouse.x = -2000;
    mouse.y = -2000;
  });

  // Sakura gul bargi klassi
  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30 - Math.random() * 60;
      this.size = Math.random() * 10 + 14; // Barg kattaligi (14px - 24px)
      this.speedY = Math.random() * 1.2 + 0.8; // Pastga tushish tezligi
      this.speedX = Math.random() * 0.8 - 0.2; // Yengil shamol oqimi
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.03;
      this.flip = Math.random() * Math.PI;
      this.flipSpeed = Math.random() * 0.03 + 0.01;
      this.opacity = Math.random() * 0.35 + 0.65;
      
      // Mayin sakura pushti ranglar palitrasi
      const colors = [
        'rgba(255, 183, 197, ', // Klassik och pushti
        'rgba(255, 192, 203, ', // Sakura pushti
        'rgba(255, 218, 224, ', // Oqish pushti
        'rgba(244, 154, 175, ', // Jonli pushti
        'rgba(255, 228, 235, '  // Mayin shaffof pushti
      ];
      this.baseColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Sichqoncha ta'siridagi turtki tezliklari
      this.pushVx = 0;
      this.pushVy = 0;
    }

    update() {
      // Sichqoncha yaqinlashganda barglarning itarilishi (reaksiya)
      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          // Yaqinroq bo'lganda kuchliroq itarilish kuchi
          const force = (1 - dist / mouse.radius) * 6;
          const angle = Math.atan2(dy, dx);
          this.pushVx += Math.cos(angle) * force * 0.45;
          this.pushVy += Math.sin(angle) * force * 0.45;
          this.rotationSpeed += (Math.random() - 0.5) * 0.06;
        }
      }

      // Kuchning sekin-asta so'nishi (inersiya)
      this.pushVx *= 0.92;
      this.pushVy *= 0.92;

      // Pozitsiyani siljitish va tebranish berish
      this.x += this.speedX + Math.sin(this.flip) * 0.7 + this.pushVx;
      this.y += this.speedY + this.pushVy;
      this.rotation += this.rotationSpeed;
      this.flip += this.flipSpeed;

      // Ekranning pastki yoki yon chegaralaridan chiqqanda yuqoridan yangitdan tushirish
      if (this.y > height + 40 || this.x < -50 || this.x > width + 50) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(Math.cos(this.flip), 1);

      ctx.beginPath();
      // Tabiiy sakura bargining chiroyli yuraksimon egri chizig'i
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.85, -this.size * 0.85, this.size * 0.9, this.size * 0.4, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.9, this.size * 0.4, -this.size * 0.85, -this.size * 0.85, 0, -this.size);
      
      ctx.fillStyle = this.baseColor + this.opacity + ')';
      ctx.shadowColor = 'rgba(255, 182, 193, 0.35)';
      ctx.shadowBlur = 4;
      ctx.fill();

      // Barg markazidagi nafis chiziq (tomiri)
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.7);
      ctx.lineTo(0, this.size * 0.6);
      ctx.strokeStyle = 'rgba(235, 130, 155, ' + (this.opacity * 0.35) + ')';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    }
  }

  // Ekran kengligiga mos barglar soni
  const petalCount = Math.min(Math.floor(width / 24), 60);
  const petals = [];
  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
  }

  // Animatsiya sikli
  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
})();
