// Sakura (gilos guli) barglarining tushishi va kursorga ta'sirlanish animatsiyasi
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'sakura-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = {
    x: -1000,
    y: -1000,
    radius: 120, // Sichqoncha ta'sir doirasi
    active: false
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Touch screen (mobil) uchun
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.active = false;
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Sakura bargi klassi
  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30 - Math.random() * 50;
      this.size = Math.random() * 12 + 18; // Barg hajmi 18px - 30px ga kattalashtirildi
      this.speedY = Math.random() * 1.3 + 0.9; // Tushish tezligi
      this.speedX = Math.random() * 1.1 - 0.2; // Shamol yo'nalishi
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.025;
      this.flip = Math.random() * Math.PI;
      this.flipSpeed = Math.random() * 0.03 + 0.01;
      this.opacity = Math.random() * 0.4 + 0.6;
      
      // Mayin pushti sakura ranglari
      const colors = [
        'rgba(255, 183, 197, ',  // Klassik och pushti
        'rgba(255, 192, 203, ',  // Pushti
        'rgba(255, 218, 224, ',  // Juda nozik pushti
        'rgba(244, 166, 183, ',  // To'qroq sakura
        'rgba(255, 228, 235, '   // Oqimtir-pushti
      ];
      this.baseColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Kursor turtkisi uchun qo'shimcha tezliklar
      this.pushVx = 0;
      this.pushVy = 0;
    }

    update() {
      // Sichqoncha yaqinlashganda barglarning itarilishi (reaksiyasi)
      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          const force = (1 - dist / mouse.radius) * 7;
          const angle = Math.atan2(dy, dx);
          this.pushVx += Math.cos(angle) * force * 0.4;
          this.pushVy += Math.sin(angle) * force * 0.4;
          this.rotationSpeed += (Math.random() - 0.5) * 0.08;
        }
      }

      // Inersiya so'nishi
      this.pushVx *= 0.92;
      this.pushVy *= 0.92;

      // Pozitsiyani yangilash
      this.x += this.speedX + Math.sin(this.flip) * 0.6 + this.pushVx;
      this.y += this.speedY + this.pushVy;
      this.rotation += this.rotationSpeed;
      this.flip += this.flipSpeed;

      // Ekrandan chiqib ketganda qayta boshlash
      if (this.y > height + 30 || this.x < -40 || this.x > width + 40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(Math.cos(this.flip), 1);

      ctx.beginPath();
      // Tabiiy sakura gul bargi shakli (yuraksimon / bargsimon)
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.8, this.size * 0.9, this.size * 0.3, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.9, this.size * 0.3, -this.size * 0.8, -this.size * 0.8, 0, -this.size);
      
      ctx.fillStyle = this.baseColor + this.opacity + ')';
      ctx.shadowColor = 'rgba(255, 182, 193, 0.4)';
      ctx.shadowBlur = 4;
      ctx.fill();

      // Barg o'rtasidagi nozik tomir
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.7);
      ctx.lineTo(0, this.size * 0.6);
      ctx.strokeStyle = 'rgba(240, 140, 160, ' + (this.opacity * 0.3) + ')';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    }
  }

  // Barglar soni (ekran hajmiga moslab hisoblanadi va soni ko'paytirildi)
  const petalCount = Math.min(Math.floor(width / 22), 70);
  const petals = [];
  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
  }

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

