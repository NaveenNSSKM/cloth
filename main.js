/* global supabase, process */
document.addEventListener('DOMContentLoaded', () => {
    // Supabase Configuration
    const SUPABASE_URL = (typeof process !== 'undefined' && process?.env?.NEXT_PUBLIC_SUPABASE_URL) 
        || 'https://llcenvrwkhbalrkkeihd.supabase.co';
    const SUPABASE_KEY = (typeof process !== 'undefined' && process?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) 
        || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsY2VudnJ3a2hiYWxya2tlaWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1Njc1MTMsImV4cCI6MjA5NjE0MzUxM30.oGbrSx1p6ue9U0ZcnaEmsmoq_d2-OQEigYqy5RAwVQA';
    
    // Initialize Supabase Client
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
    const modalWhatsappBtn = document.querySelector('.modal-whatsapp-btn');
    if (modalWhatsappBtn) {
        modalWhatsappBtn.addEventListener('click', () => {
            const title = modalTitle.textContent || 'Product';
            const price = modalPrice.textContent || '';
            const imageSrc = modalImg.src || '';

            const phoneNumber = '919790486506';
            const message = `🛍️ *NEW INQUIRY - NEO CLOTHS*
----------------------------------
👕 *Product Name:* ${title}
💰 *Price:* ${price}
🖼️ *Product Image:* ${imageSrc}
----------------------------------
Hi, I would like to check the availability of this product.`;

            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

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
                        <div class="whatsapp-overlay">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 1.977 14.113.953 11.487.953c-5.43 0-9.854 4.371-9.858 9.799-.002 1.718.461 3.39 1.339 4.887L1.925 21.84l6.177-1.616c-.001 0-.001 0 0 0zm9.324-5.32c-.312-.156-1.848-.91-2.133-1.014-.286-.104-.494-.156-.702.156-.208.312-.806 1.014-.988 1.221-.182.208-.364.234-.676.078-.312-.156-1.317-.485-2.51-1.548-.928-.827-1.554-1.85-1.736-2.162-.182-.312-.02-.48.136-.635.14-.14.312-.364.468-.546.156-.182.208-.312.312-.52.104-.208.052-.39-.026-.546-.078-.156-.702-1.69-.961-2.313-.253-.607-.51-.524-.702-.534-.182-.01-.39-.01-.598-.01-.208 0-.546.078-.832.39-.286.312-1.092 1.066-1.092 2.6 0 1.534 1.118 3.016 1.274 3.224.156.208 2.19 3.344 5.304 4.69.741.32 1.319.51 1.77.653.745.237 1.423.203 1.959.123.598-.089 1.848-.755 2.107-1.444.259-.689.259-1.274.182-1.393-.078-.12-.286-.195-.598-.35z"/>
                            </svg>
                            <span>Order on WhatsApp</span>
                        </div>
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
            
            // Redirect to WhatsApp when clicking the product image
            const productImage = card.querySelector('.product-image');
            if (productImage) {
                productImage.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const title = card.querySelector('h3') ? card.querySelector('h3').textContent : 'Product';
                    const price = card.querySelector('.price-tag') ? card.querySelector('.price-tag').textContent : '';
                    const imageEl = card.querySelector('img');
                    const imageSrc = imageEl ? imageEl.src : '';
                    
                    const phoneNumber = '919790486506';
                    const message = `🛍️ *NEW INQUIRY - NEO CLOTHS*
----------------------------------
👕 *Product Name:* ${title}
💰 *Price:* ${price}
🖼️ *Product Image:* ${imageSrc}
----------------------------------
Hi, I would like to check the availability of this product.`;
                    
                    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                });
            }
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
