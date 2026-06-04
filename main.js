/* global process */
document.addEventListener('DOMContentLoaded', () => {
    // Supabase Configuration
    const SUPABASE_URL = (typeof process !== 'undefined' && process?.env?.NEXT_PUBLIC_SUPABASE_URL) ;
    const SUPABASE_KEY = (typeof process !== 'undefined' && process?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ;
    
    // Initialize Supabase Client
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // 1. Floating Particles System
    const createParticles = () => {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            particle.style.animationDelay = `${Math.random() * -20}s`;
            
            const size = Math.random() * 3 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            
            particlesContainer.appendChild(particle);
        }
    };
    createParticles();

    // 2. Animated Stats Counter
    const animateStats = () => {
        const stats = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'), 10);
                    let current = 0;
                    const duration = 1500;
                    const increment = target / (duration / 16);
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            entry.target.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            entry.target.textContent = target;
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    };
    animateStats();

    // 3. Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.top = '10px';
            header.style.width = '95%';
            header.style.height = '60px';
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
        } else {
            header.style.top = '52px';
            header.style.width = '90%';
            header.style.height = '70px';
            header.style.background = 'rgba(10, 10, 10, 0.6)';
            header.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)';
        }
    });

    // 4. ScrollSpy and Navigation Active States
    const sectionHeaders = document.querySelectorAll('.section-header, .hero-section');
    const desktopLinks = document.querySelectorAll('.nav-menu .nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-drawer .drawer-link');

    const scrollSpyOptions = {
        threshold: 0,
        rootMargin: "-25% 0px -65% 0px"
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                desktopLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });

                mobileLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, scrollSpyOptions);

    sectionHeaders.forEach(section => scrollSpyObserver.observe(section));

    // 5. Cart Functionality
    let cartItemCount = 0;
    const cartCountBadge = document.querySelector('.cart-count');
    
    const updateCartCount = (count) => {
        cartItemCount += count;
        if (!cartCountBadge) return;
        
        cartCountBadge.textContent = cartItemCount;
        
        if (cartItemCount > 0) {
            cartCountBadge.classList.add('show');
        } else {
            cartCountBadge.classList.remove('show');
        }
        
        cartCountBadge.style.transform = 'scale(1.4)';
        setTimeout(() => {
            cartCountBadge.style.transform = 'scale(1)';
        }, 200);
    };

    // 6. Quick View Modal Interaction
    const modalOverlay = document.getElementById('modal-overlay');
    const modalImg = document.getElementById('modal-img');
    const modalMeta = document.getElementById('modal-meta');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalAddBtn = document.querySelector('.modal-add-btn');

    const openQuickView = (card) => {
        const title = card.querySelector('h3').textContent;
        const description = card.querySelector('p').textContent;
        const price = card.querySelector('.price-tag').textContent;
        const imageSrc = card.querySelector('img').getAttribute('src');
        const category = card.querySelector('.product-meta').textContent;

        modalImg.setAttribute('src', imageSrc);
        modalImg.setAttribute('alt', title);
        modalMeta.textContent = category;
        modalTitle.textContent = title;
        modalDesc.textContent = description;
        modalPrice.textContent = price;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    modalAddBtn.addEventListener('click', () => {
        updateCartCount(1);
        modalAddBtn.textContent = 'ADDED TO BAG ✓';
        modalAddBtn.style.background = '#22c55e';
        setTimeout(() => {
            modalAddBtn.textContent = 'ADD TO BAG';
            modalAddBtn.style.background = 'var(--gradient-1)';
            closeModal();
        }, 1000);
    });

    // 7. Entrance Animations Observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .product-card.visible, .section-header.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // 8. Dynamic Supabase Rendering & Event Binding
    const fetchAndRenderProducts = async () => {
        try {
            const { data: products, error } = await supabaseClient
                .from('products')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            if (!products || products.length === 0) {
                console.warn("No products found in Supabase.");
                return;
            }

            // Select Grid containers
            const newArrivalsGrid = document.getElementById('new-arrivals-grid');
            const tshirtsGrid = document.getElementById('tshirts-grid');
            const hoodiesGrid = document.getElementById('hoodies-grid');
            const customDesignsGrid = document.getElementById('custom-designs-grid');

            // Clear loading elements
            if (newArrivalsGrid) newArrivalsGrid.innerHTML = '';
            if (tshirtsGrid) tshirtsGrid.innerHTML = '';
            if (hoodiesGrid) hoodiesGrid.innerHTML = '';
            if (customDesignsGrid) customDesignsGrid.innerHTML = '';

            products.forEach(product => {
                let targetGrid = null;
                let category = '';
                let badgeHTML = '';

                // Map tshirt_type to target sections and design patterns
                const typeLower = product.tshirt_type.toLowerCase();
                if (typeLower === 'new arrival') {
                    targetGrid = newArrivalsGrid;
                    category = 'custom';
                    badgeHTML = '<div class="product-badge">NEW</div>';
                } else if (typeLower === 'oversized t-shirt') {
                    targetGrid = tshirtsGrid;
                    category = 'tshirt';
                    badgeHTML = '<div class="product-badge">HOT</div>';
                } else if (typeLower === 'hoodie') {
                    targetGrid = hoodiesGrid;
                    category = 'hoodie';
                    badgeHTML = '<div class="product-badge">HOT</div>';
                } else if (typeLower === 'custom t-shirt') {
                    targetGrid = customDesignsGrid;
                    category = 'custom';
                    badgeHTML = '<div class="product-badge">LIMITED</div>';
                }

                if (!targetGrid) return;

                const card = document.createElement('div');
                card.className = 'product-card';
                card.setAttribute('data-category', category);

                // Format price as Indian Rupees (e.g. ₹799)
                const formattedPrice = `₹${parseFloat(product.price).toLocaleString('en-IN')}`;

                card.innerHTML = `
                    ${badgeHTML}
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" width="400" height="380" loading="lazy">
                    </div>
                    <div class="product-info">
                        <div class="product-meta">${product.tshirt_type.toUpperCase()}</div>
                        <h3>${product.name}</h3>
                        <p>${product.material}</p>
                        <div class="product-bottom">
                            <div class="price-tag">${formattedPrice}</div>
                            <button class="add-cart-btn" aria-label="Add to cart">+</button>
                        </div>
                    </div>
                `;

                targetGrid.appendChild(card);
            });

            // Bind events to the newly generated product cards
            bindProductEvents();

        } catch (err) {
            console.error("Error loading products from Supabase:", err);
            // Display error indicator in grids
            const grids = [
                document.getElementById('new-arrivals-grid'),
                document.getElementById('tshirts-grid'),
                document.getElementById('hoodies-grid'),
                document.getElementById('custom-designs-grid')
            ];
            grids.forEach(grid => {
                if (grid) {
                    grid.innerHTML = `<div style="grid-column: span 3; text-align: center; color: #ef4444; font-family: 'Roboto Mono', monospace; padding: 40px;">Error loading products. Please try again.</div>`;
                }
            });
        }
    };

    const bindProductEvents = () => {
        // Quick view overlay event listener
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => openQuickView(card));
        });

        // Add to cart buttons listeners
        document.querySelectorAll('.add-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateCartCount(1);
                
                btn.style.background = '#22c55e';
                btn.textContent = '✓';
                setTimeout(() => {
                    btn.style.background = 'rgba(255, 255, 255, 0.06)';
                    btn.textContent = '+';
                }, 1000);
            });
        });

        // Entrance animation on scroll trigger
        document.querySelectorAll('.product-card:not(.visible), .section-header:not(.visible)').forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            revealObserver.observe(el);
        });
    };

    // 9. Mobile Slide-out Drawer Menu
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileDrawerOverlay = document.getElementById('mobile-drawer-overlay');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const openDrawer = () => {
        mobileMenuToggle.classList.add('active');
        mobileDrawer.classList.add('active');
        mobileDrawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
        mobileMenuToggle.classList.remove('active');
        mobileDrawer.classList.remove('active');
        mobileDrawerOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('active')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });
    }

    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // Trigger dynamic fetch on load
    fetchAndRenderProducts();
});
