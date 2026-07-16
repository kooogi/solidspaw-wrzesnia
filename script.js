(function () {
  'use strict';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');
  const filterBtns = document.querySelectorAll('.chip[data-filter]');
  const galleryItems = document.querySelectorAll('.bento__item[data-category]');
  const galleryPagination = document.getElementById('galleryPagination');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');
  const galleryPageStatus = document.getElementById('galleryPageStatus');
  const gallerySection = document.getElementById('galeria');
  const navAnchors = document.querySelectorAll('.site-nav__link[href^="#"]');
  const navSectionIds = Array.from(navAnchors).map(function (anchor) {
    return anchor.getAttribute('href').slice(1);
  });
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (location.protocol === 'file:') {
    console.warn(
      'hCaptcha nie działa przy otwarciu pliku (file://). ' +
      'Uruchom lokalny serwer, np. „python -m http.server 8080” lub „npx serve .”, ' +
      'a następnie otwórz http://localhost:8080'
    );
  }

  /* Header scroll */
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 16);
    updateActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  navToggle.addEventListener('click', function () {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  function closeMobileNav() {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileNav();
      const href = link.getAttribute('href');
      if (href && href.charAt(0) === '#') {
        setActiveNav(href.slice(1));
      }
    });
  });

  /* Active nav */
  function setActiveNav(id) {
    navAnchors.forEach(function (anchor) {
      anchor.classList.toggle('active', anchor.getAttribute('href') === '#' + id);
    });
  }

  function updateActiveNav() {
    const marker = header.offsetHeight + 120;
    let current = '';

    navSectionIds.forEach(function (id) {
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top <= marker) {
        current = id;
      }
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 48) {
      current = navSectionIds[navSectionIds.length - 1];
    }

    setActiveNav(current);
  }

  /* Scroll reveal */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* Gallery filters & pagination */
  let galleryFilter = 'all';
  let galleryPage = 1;
  let galleryResizeTimer;

  function getGalleryPageSize() {
    if (window.matchMedia('(max-width: 767px)').matches) return 4;
    if (window.matchMedia('(max-width: 1179px)').matches) return 6;
    return 8;
  }

  function getFilteredGalleryItems() {
    return Array.from(galleryItems).filter(function (item) {
      return galleryFilter === 'all' || item.dataset.category === galleryFilter;
    });
  }

  function scrollToGallery() {
    if (!gallerySection) return;
    const offset = header ? header.offsetHeight + 16 : 16;
    const top = gallerySection.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  function updateGalleryView(scrollOnPageChange) {
    const pageSize = getGalleryPageSize();
    const filtered = getFilteredGalleryItems();
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

    if (galleryPage > totalPages) galleryPage = totalPages;
    if (galleryPage < 1) galleryPage = 1;

    const start = (galleryPage - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);
    const pageSet = new Set(pageItems);

    galleryItems.forEach(function (item) {
      const matchesFilter = galleryFilter === 'all' || item.dataset.category === galleryFilter;
      item.classList.toggle('hidden', !matchesFilter || !pageSet.has(item));
    });

    if (galleryPagination) {
      const showPagination = filtered.length > pageSize;
      galleryPagination.hidden = !showPagination;
      if (galleryPageStatus) {
        galleryPageStatus.textContent = 'Strona ' + galleryPage + ' z ' + totalPages;
      }
      if (galleryPrev) galleryPrev.disabled = galleryPage <= 1;
      if (galleryNext) galleryNext.disabled = galleryPage >= totalPages;
    }

    if (scrollOnPageChange) scrollToGallery();
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      galleryFilter = btn.dataset.filter;

      filterBtns.forEach(function (b) {
        b.classList.remove('chip--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('chip--active');
      btn.setAttribute('aria-pressed', 'true');

      galleryPage = 1;
      updateGalleryView(false);
    });
  });

  if (galleryPrev) {
    galleryPrev.addEventListener('click', function () {
      if (galleryPage <= 1) return;
      galleryPage -= 1;
      updateGalleryView(true);
    });
  }

  if (galleryNext) {
    galleryNext.addEventListener('click', function () {
      galleryPage += 1;
      updateGalleryView(true);
    });
  }

  window.addEventListener('resize', function () {
    clearTimeout(galleryResizeTimer);
    galleryResizeTimer = setTimeout(function () {
      updateGalleryView(false);
    }, 150);
  });

  updateGalleryView(false);

  /* Gallery lightbox */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrevBtn = document.getElementById('lightboxPrev');
  const lightboxNextBtn = document.getElementById('lightboxNext');
  let lightboxTrigger = null;
  let lightboxIndex = -1;

  function safeApiMessage(msg) {
    if (typeof msg !== 'string') return 'Nie udało się wysłać wiadomości. Spróbuj ponownie.';
    return msg.trim().slice(0, 500);
  }

  function getLightboxItems() {
    return Array.from(galleryItems).filter(function (item) {
      return !item.classList.contains('hidden');
    });
  }

  function setLightboxCaption(tagText, nameText) {
    if (!lightboxCaption) return;
    lightboxCaption.replaceChildren();
    if (!tagText && !nameText) {
      lightboxCaption.hidden = true;
      return;
    }
    if (tagText) {
      const tagEl = document.createElement('span');
      tagEl.className = 'lightbox__caption-tag';
      tagEl.textContent = tagText;
      lightboxCaption.appendChild(tagEl);
    }
    if (nameText) {
      lightboxCaption.appendChild(document.createTextNode(nameText));
    }
    lightboxCaption.hidden = false;
  }

  function updateLightboxNav() {
    const items = getLightboxItems();
    const hasPrev = lightboxIndex > 0;
    const hasNext = lightboxIndex >= 0 && lightboxIndex < items.length - 1;

    if (lightboxPrevBtn) {
      lightboxPrevBtn.disabled = !hasPrev;
      lightboxPrevBtn.hidden = !hasPrev;
    }
    if (lightboxNextBtn) {
      lightboxNextBtn.disabled = !hasNext;
      lightboxNextBtn.hidden = !hasNext;
    }
  }

  function showLightboxItem(item) {
    if (!lightbox || !lightboxImg || !item) return;
    const img = item.querySelector('.bento__img');
    const tag = item.querySelector('.bento__tag');
    const name = item.querySelector('.bento__name');
    if (!img) return;

    lightboxTrigger = item;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';

    if (lightboxCaption) {
      const tagText = tag ? tag.textContent.trim() : '';
      const nameText = name ? name.textContent.trim() : '';
      setLightboxCaption(tagText, nameText);
    }

    updateLightboxNav();
  }

  function openLightbox(item) {
    if (!lightbox || !lightboxImg) return;
    const items = getLightboxItems();
    lightboxIndex = items.indexOf(item);
    if (lightboxIndex < 0) return;

    showLightboxItem(item);

    lightbox.removeAttribute('hidden');
    requestAnimationFrame(function () {
      lightbox.classList.add('is-open');
    });
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  function navigateLightbox(direction) {
    const items = getLightboxItems();
    if (!items.length || lightboxIndex < 0) return;
    const nextIndex = lightboxIndex + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    lightboxIndex = nextIndex;
    showLightboxItem(items[lightboxIndex]);
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    lightboxIndex = -1;
    if (lightboxTrigger) {
      lightboxTrigger.focus();
      lightboxTrigger = null;
    }
    setTimeout(function () {
      lightbox.setAttribute('hidden', '');
      if (lightboxImg) lightboxImg.removeAttribute('src');
    }, 300);
  }

  galleryItems.forEach(function (item) {
    const nameEl = item.querySelector('.bento__name');
    if (nameEl) {
      item.setAttribute('aria-label', 'Powiększ: ' + nameEl.textContent.trim());
    }
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');

    item.addEventListener('click', function () {
      openLightbox(item);
    });

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      navigateLightbox(-1);
    });
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      navigateLightbox(1);
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateLightbox(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigateLightbox(1);
    }
  });

  /* Form validation */
  const validators = {
    name: function (v) {
      const t = v.trim();
      if (!t) return 'Podaj imię i nazwisko.';
      if (t.length < 3) return 'Minimum 3 znaki.';
      if (t.length > 100) return 'Maksimum 100 znaków.';
      return '';
    },
    email: function (v) {
      const t = v.trim();
      if (!t) return 'Podaj adres e-mail.';
      if (t.length > 254) return 'Adres e-mail jest zbyt długi.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return 'Nieprawidłowy adres e-mail.';
      return '';
    },
    phone: function (v) {
      const t = v.trim();
      if (!t) return '';
      if (t.length > 20) return 'Numer telefonu jest zbyt długi.';
      if (!/^[\d\s+\-()]{7,20}$/.test(t)) return 'Nieprawidłowy numer telefonu.';
      return '';
    },
    subject: function (v) {
      if (!v) return 'Wybierz temat.';
      return '';
    },
    message: function (v) {
      const t = v.trim();
      if (!t) return 'Wpisz wiadomość.';
      if (t.length < 10) return 'Minimum 10 znaków.';
      if (t.length > 5000) return 'Maksimum 5000 znaków.';
      return '';
    },
    consent: function (checked) {
      if (!checked) return 'Wymagana zgoda na przetwarzanie danych.';
      return '';
    }
  };

  function showError(id, msg) {
    const input = document.getElementById(id);
    const err = document.getElementById(id + 'Error');
    if (input) input.classList.toggle('error', !!msg);
    if (err) err.textContent = msg;
  }

  function validateForm() {
    let ok = true;
    Object.keys(validators).forEach(function (field) {
      const val = field === 'consent'
        ? document.getElementById('consent').checked
        : document.getElementById(field).value;
      const err = validators[field](val);
      showError(field, err);
      if (err) ok = false;
    });
    return ok;
  }

  function validateCaptcha() {
    const field = contactForm && contactForm.querySelector('textarea[name="h-captcha-response"]');
    const token = field && field.value;
    const err = document.getElementById('captchaError');
    const msg = token ? '' : 'Potwierdź, że nie jesteś robotem.';
    if (err) err.textContent = msg;
    return !!token;
  }

  function resetCaptcha() {
    if (typeof window.hcaptcha !== 'undefined') {
      try { window.hcaptcha.reset(); } catch (e) {}
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (formSuccess) formSuccess.hidden = true;
      if (formError) formError.hidden = true;
      if (!validateForm() || !validateCaptcha()) return;

      const accessKey = window.SITE_CONFIG && window.SITE_CONFIG.web3formsAccessKey;
      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        if (formError) {
          formError.textContent = 'Formularz nie jest skonfigurowany. Skontaktuj się bezpośrednio przez e-mail.';
          formError.hidden = false;
        }
        return;
      }

      const btn = contactForm.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Wysyłanie…';

      const formData = new FormData(contactForm);
      formData.delete('consent');
      formData.set('access_key', accessKey);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { response: response, data: data };
          });
        })
        .then(function (result) {
          if (result.response.ok && result.data.success) {
            contactForm.reset();
            resetCaptcha();
            if (formSuccess) {
              formSuccess.hidden = false;
              formSuccess.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
            }
            Object.keys(validators).forEach(function (f) { showError(f, ''); });
            const captchaErr = document.getElementById('captchaError');
            if (captchaErr) captchaErr.textContent = '';
          } else if (formError) {
            formError.textContent = safeApiMessage(result.data.message) || 'Nie udało się wysłać wiadomości. Spróbuj ponownie.';
            formError.hidden = false;
            resetCaptcha();
          }
        })
        .catch(function () {
          if (formError) {
            formError.textContent = 'Coś poszło nie tak. Sprawdź połączenie i spróbuj ponownie.';
            formError.hidden = false;
          }
          resetCaptcha();
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = originalText;
        });
    });

    contactForm.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        const id = input.id;
        if (!validators[id]) return;
        const val = input.type === 'checkbox' ? input.checked : input.value;
        showError(id, validators[id](val));
      });
    });
  }
})();
