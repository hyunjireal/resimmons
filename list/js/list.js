gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const productSection = document.querySelector('.product');
    const productAll = document.querySelector('.product_all');
    const nameCards = document.querySelectorAll('.more .name');
    let productTween = null;
    const productScrollStartDelay = 140;

    const setupProductScroll = () => {
        if (!productSection || !productAll) return;

        if (productTween) {
            productTween.scrollTrigger.kill();
            productTween.kill();
            productTween = null;
            gsap.set(productAll, { clearProps: 'transform' });
        }

        const totalWidth = () => Math.max(productAll.scrollWidth - productSection.clientWidth, 0);

        productTween = gsap.to(productAll, {
            x: () => -totalWidth(),
            ease: 'none',
            scrollTrigger: {
                trigger: productSection,
                start: () => `top top-=${productScrollStartDelay}`,
                end: () => '+=' + totalWidth(),
                scrub: true,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });
    };

    const syncCardSlider = (card) => {
        const track = card.querySelector('.slider_track');
        const sliderViewport = card.querySelector('.slider_viewport');
        const bullets = card.querySelectorAll('.bullet');
        const slides = card.querySelectorAll('.slide');
        const activeIndex = Number(card.dataset.currentIndex ?? 0);
        const currentIndex = activeIndex > -1 ? activeIndex : 0;

        if (!track || !sliderViewport || !slides.length) return;

        const slideWidth = sliderViewport.clientWidth;
        slides.forEach((slide) => {
            slide.style.width = `${slideWidth}px`;
        });
        track.style.width = `${slideWidth * slides.length}px`;
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        bullets.forEach((bullet, index) => {
            bullet.classList.toggle('active', index === currentIndex);
        });
    };

    setupProductScroll();

    nameCards.forEach((card) => {
        const tab = card.querySelector('.tab');
        if (tab) {
            tab.addEventListener('click', () => {
                if (card.classList.contains('active')) return;

                nameCards.forEach((item) => item.classList.remove('active'));
                card.classList.add('active');

                requestAnimationFrame(() => {
                    syncCardSlider(card);
                    ScrollTrigger.refresh();
                });
            });
        }

        const track = card.querySelector('.slider_track');
        if (!track) return;

        const prevBtn = card.querySelector('.icon_all.prev');
        const nextBtn = card.querySelector('.icon_all.next');
        const bullets = card.querySelectorAll('.bullet');
        const sliderViewport = card.querySelector('.slider_viewport');
        const slides = card.querySelectorAll('.slide');
        const slideCount = slides.length;
        let currentIndex = Number(card.dataset.currentIndex ?? 0);

        const updateSlider = () => {
            card.dataset.currentIndex = String(currentIndex);
            syncCardSlider(card);
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                currentIndex = (currentIndex + 1) % slideCount;
                updateSlider();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                currentIndex = (currentIndex - 1 + slideCount) % slideCount;
                updateSlider();
            });
        }

        bullets.forEach((bullet, index) => {
            bullet.addEventListener('click', (event) => {
                event.stopPropagation();
                currentIndex = index;
                updateSlider();
            });
        });

        slides.forEach((slide) => {
            slide.style.flexShrink = '0';
        });

        updateSlider();
    });

    window.addEventListener('resize', () => {
        setupProductScroll();
        nameCards.forEach((card) => syncCardSlider(card));
        ScrollTrigger.refresh();
    });
});
