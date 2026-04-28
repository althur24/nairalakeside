document.addEventListener('DOMContentLoaded', () => {
  /* ========================================================================
     0. Premium Loader & Parallax/Reveal
     ======================================================================== */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => loader.classList.add('loaded'), 500);
    }
  });

  const heroBg = document.querySelector('.hero-bg');
  const revealElements = document.querySelectorAll('.reveal-text');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    if (heroBg) {
      heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
    }
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  /* ========================================================================
     1. Navbar Scroll Effect & Mobile Menu
     ======================================================================== */
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navCta = document.getElementById('nav-cta');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Add scrolled class when scrolling down
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    navCta.classList.toggle('active');
    document.body.classList.toggle('mobile-menu-active');
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      navCta.classList.remove('active');
      document.body.classList.remove('mobile-menu-active');
    });
  });

  /* ========================================================================
     2. Smooth Scroll for Anchor Links
     ======================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Offset for fixed navbar height
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ========================================================================
     3. Scroll Animations (Intersection Observer)
     ======================================================================== */
  const animateElements = document.querySelectorAll('[data-animate]');
  
  const animateObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        
        // Add delay if specified via data-delay attribute
        const delay = target.getAttribute('data-delay');
        if (delay) {
          setTimeout(() => {
            target.classList.add('animate-in');
          }, parseInt(delay));
        } else {
          target.classList.add('animate-in');
        }
        
        // Stop observing once animated
        observer.unobserve(target);
      }
    });
  }, {
    threshold: 0.15, // Trigger when 15% is visible
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before coming into view
  });

  animateElements.forEach(element => {
    animateObserver.observe(element);
  });

  /* ========================================================================
     4. Number Counter Animation for Hero Stats
     ======================================================================== */
  const counters = document.querySelectorAll('.counter');
  let animationTriggered = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Only run once
      if (entry.isIntersecting && !animationTriggered) {
        animationTriggered = true;
        
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 2000; // ms
          const start = 0;
          let startTime = null;
          
          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Easing function (ease-out cubic)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            counter.innerText = Math.floor(easeProgress * target);
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              counter.innerText = target;
            }
          };
          
          window.requestAnimationFrame(step);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    countObserver.observe(heroStats);
  }

  /* ========================================================================
     5. Active Nav Link on Scroll
     ======================================================================== */
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100; // Offset for navbar
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  /* ========================================================================
     6. Smart WhatsApp Contact Form Logic
     ======================================================================== */
  const customSelectTrigger = document.getElementById('custom-select-trigger');
  const customOptions = document.getElementById('custom-options');
  const selectLabel = document.getElementById('select-label');
  const houseTypeInput = document.getElementById('houseType');
  const customOptionItems = document.querySelectorAll('.custom-option');
  
  // Toggle Custom Dropdown
  if (customSelectTrigger) {
    customSelectTrigger.addEventListener('click', () => {
      customSelectTrigger.classList.toggle('open');
      customOptions.classList.toggle('open');
    });

    // Handle Option Click
    customOptionItems.forEach(option => {
      option.addEventListener('click', () => {
        const value = option.getAttribute('data-value');
        const text = option.innerText;
        
        // Update label and hidden input
        selectLabel.innerText = text;
        houseTypeInput.value = value;
        selectLabel.style.color = 'var(--text-dark)'; // ensure visible color
        
        // Close dropdown
        customSelectTrigger.classList.remove('open');
        customOptions.classList.remove('open');
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!customSelectTrigger.contains(e.target) && !customOptions.contains(e.target)) {
        customSelectTrigger.classList.remove('open');
        customOptions.classList.remove('open');
      }
    });
  }

  // Handle Form Submission
  const inquireForm = document.getElementById('inquireForm');
  const formLoading = document.getElementById('formLoading');

  if (inquireForm) {
    inquireForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Mencegah form reload halaman

      // Ambil Data
      const name = document.getElementById('name').value.trim();
      const whatsapp = document.getElementById('whatsapp').value.trim();
      const houseType = document.getElementById('houseType').value;

      // Validasi ringan
      if (!name || !whatsapp) {
        alert("Mohon lengkapi nama dan nomor WhatsApp Anda.");
        return;
      }
      if (!houseType) {
        alert("Mohon pilih tipe rumah terlebih dahulu.");
        return;
      }

      // Merakit Pesan WhatsApp
      const destinationNumber = "6281181150666"; // Nomor WA CS
      const message = `Halo, saya *${name}*. Saya ingin mendapatkan informasi lengkap dan pricelist untuk *Tipe ${houseType}* di Naira Lakeside.`;
      const encodedMessage = encodeURIComponent(message);
      const waUrl = `https://wa.me/${destinationNumber}?text=${encodedMessage}`;

      // Efek Transisi Memproses (Premium UI)
      inquireForm.style.opacity = '0.5';
      inquireForm.style.pointerEvents = 'none'; // cegah double click
      formLoading.classList.remove('hidden'); // map loading overlay on top

      // Memicu Meta Pixel / FB Ads Event Tracking (Opsional)
      if (typeof fbq === 'function') {
        fbq('trackCustom', 'Lead_NairaResidence');
        console.log('FB Pixel Lead Event Fired');
      }

      // Redirect ke WA setelah 2 detik
      setTimeout(() => {
        window.location.href = waUrl;
        
        // Reset form di background (jika user pencet 'Back' dari WA)
        setTimeout(() => {
          inquireForm.reset();
          houseTypeInput.value = '';
          selectLabel.innerText = 'Pilih Tipe';
          inquireForm.style.opacity = '1';
          inquireForm.style.pointerEvents = 'auto';
          formLoading.classList.add('hidden');
        }, 1000);
      }, 2000);
    });
  }

  /* ========================================================================
     7. Dynamic Living Options (JSON Render)
     ======================================================================== */
  const houseData = [
    {
      id: "como",
      title: "Como",
      badge: "Compact & Warm",
      badgeColor: "var(--green-primary)",
      image: "assets/FOTO RUMAH NAIRA LAKESIDE/NAIRA_LAKE_VIEW_202604272121.jpeg",
      desc: "Desain cerdas yang memaksimalkan setiap metrik spasial dengan peleburan atmosfer kehangatan yang tak lekang oleh waktu.",
      specs: {
        kamarTidur: "3 + Mezzanine",
        kamarMandi: "2",
        luasBangunan: "60",
        luasTanah: "70",
        carport: "2 Mobil"
      },
      hargaMulai: "1,3 M-an",
      floorplans: [
        { name: "Opsi A", url: "assets/FOTO RUMAH NAIRA LAKESIDE/DENAH-COMO-A-80.jpg" },
        { name: "Opsi B", url: "assets/FOTO RUMAH NAIRA LAKESIDE/DENAH-COMO-B-80.jpg" }
      ]
    },
    {
      id: "alexandrina",
      title: "Alexandrina",
      badge: "Perfect Harmony",
      badgeColor: "var(--gold-accent)",
      image: "assets/FOTO RUMAH NAIRA LAKESIDE/RUMAH ALEXANDRINA.jpeg",
      desc: "Keseimbangan sempurna antara estetika fasad modern dan fungsionalitas tata ruang keluarga yang flawless.",
      specs: {
        kamarTidur: "2",
        kamarMandi: "2",
        luasBangunan: "50",
        luasTanah: "60",
        carport: "2 Mobil"
      },
      hargaMulai: "1 M-an",
      floorplans: [
        { name: "Opsi A", url: "assets/FOTO RUMAH NAIRA LAKESIDE/DENAH-ALEXANDRINA-A-80.jpg" },
        { name: "Opsi B", url: "assets/FOTO RUMAH NAIRA LAKESIDE/DENAH-ALEXANDRINA-B-80.jpg" }
      ]
    },
    {
      id: "lago",
      title: "Lago",
      badge: "The Pinnacle of Luxury",
      badgeColor: "var(--text-dark)",
      image: "assets/FOTO RUMAH NAIRA LAKESIDE/NAIRA_2_1_Lantai_Lago_3_Edit_202604272133.jpeg",
      desc: "Puncak eksklusivitas. Menyuguhkan dimensi ruang yang spacious dan indah demi menjaga privasi serta kemewahan sejati.",
      specs: {
        kamarTidur: "2",
        kamarMandi: "1",
        luasBangunan: "35",
        luasTanah: "60",
        carport: "1 Mobil"
      },
      hargaMulai: "500 Jutaan",
      floorplans: [
        { name: "Denah Utama", url: "assets/FOTO RUMAH NAIRA LAKESIDE/NAIRA 2_Denah Type Lago November 2025 (1).jpg" }
      ]
    }
  ];

  const livingContainer = document.getElementById('container-2-lantai');
  if (livingContainer) {
    const htmlOutput = houseData.map((item, index) => {
      const delay = (index + 1) * 150;
      return `
        <div class="type-card" data-animate="fade-up" data-delay="${delay}">
          <div class="type-img-wrap">
            <div class="type-badge">${item.badge}</div>
            <img src="${item.image}" alt="Tipe ${item.title}" class="type-img" loading="lazy" style="object-position: ${item.objectPosition || 'center'};">
          </div>
          <div class="type-content">
            <div class="type-header-title" style="margin-bottom: 24px;">
              <span class="type-prefix">Tipe</span>
              <span class="type-name-badge">${item.title}</span>
            </div>
            
            <div class="spec-grid-cards">
              <div class="spec-card-item">
                <div class="spec-card-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
                  <span>KAMAR TIDUR</span>
                </div>
                <div class="spec-card-value">${item.specs.kamarTidur}</div>
              </div>
              <div class="spec-card-item">
                <div class="spec-card-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
                  <span>KAMAR MANDI</span>
                </div>
                <div class="spec-card-value">${item.specs.kamarMandi}</div>
              </div>
              <div class="spec-card-item">
                <div class="spec-card-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <span>LUAS BANGUNAN</span>
                </div>
                <div class="spec-card-value">${item.specs.luasBangunan}m&sup2;</div>
              </div>
              <div class="spec-card-item">
                <div class="spec-card-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                  <span>LUAS TANAH</span>
                </div>
                <div class="spec-card-value">${item.specs.luasTanah}m&sup2;</div>
              </div>
              <div class="spec-card-item">
                <div class="spec-card-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg>
                  <span>CARPORT</span>
                </div>
                <div class="spec-card-value">${item.specs.carport}</div>
              </div>
            </div>

            <div class="price-block">
              <span class="price-label">Mulai dari</span>
              <span class="price-value">${item.hargaMulai}</span>
            </div>

            <div class="type-actions-new">
              <a href="#contact" class="btn btn-primary w-full">Dapatkan Pricelist</a>
              <button class="btn btn-secondary w-full btn-denah" data-id="${item.id}">Lihat Denah</button>
            </div>
          </div>
        </div>
      `;
    }).join("");
    
    livingContainer.innerHTML = htmlOutput;
    
    // Sembunyikan indikator swipe saat user berinteraksi
    const swipeIndicator = document.getElementById('swipe-indicator');
    if (swipeIndicator) {
      livingContainer.addEventListener('scroll', () => {
        if (!swipeIndicator.classList.contains('hidden')) {
          swipeIndicator.classList.add('hidden');
        }
      }, { once: true });
    }

    // Pastikan kartu yang baru di-render diobservasi oleh animasi
    const newCards = livingContainer.querySelectorAll('[data-animate]');
    if (typeof animateObserver !== 'undefined') {
      newCards.forEach(card => animateObserver.observe(card));
    }
  }

  /* ========================================================================
     8. Floorplan Modal Logic
     ======================================================================== */
  const denahModal = document.getElementById('denahModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalTabs = document.getElementById('modalTabs');
  
  if (denahModal) {
    const closeModal = document.querySelector('.close-modal');
    
    // Inject logic via event delegation because buttons are dynamic
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-denah')) {
        const houseId = e.target.getAttribute('data-id');
        const house = houseData.find(h => h.id === houseId);
        
        if (!house) return;

        modalTitle.innerText = "Denah Tipe " + house.title;
        
        // Render tabs if there are multiple floorplans
        modalTabs.innerHTML = '';
        if (house.floorplans && house.floorplans.length > 1) {
          house.floorplans.forEach((plan, idx) => {
            const btn = document.createElement('button');
            btn.className = `modal-tab-btn ${idx === 0 ? 'active' : ''}`;
            btn.innerText = plan.name;
            btn.addEventListener('click', () => {
              // Update active class
              modalTabs.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              // Fade out, change src, fade in
              modalImg.style.opacity = 0;
              setTimeout(() => {
                modalImg.src = plan.url;
                modalImg.style.opacity = 1;
              }, 300);
            });
            modalTabs.appendChild(btn);
          });
        }
        
        // Set initial image
        if (house.floorplans && house.floorplans.length > 0) {
          modalImg.src = house.floorplans[0].url;
        }

        modalImg.onerror = function() {
          this.onerror = null;
          this.src = 'https://via.placeholder.com/800x600?text=Denah+Belum+Tersedia';
        };

        denahModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
      }
    });

    closeModal.addEventListener('click', () => {
      denahModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });

    denahModal.addEventListener('click', (e) => {
      if (e.target === denahModal) {
        denahModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

});
