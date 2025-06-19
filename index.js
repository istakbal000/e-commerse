// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Loader Animation
    const loaderWrapper = document.getElementById('loader-wrapper');
    if (loaderWrapper) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                loaderWrapper.style.opacity = '0';
                setTimeout(function() {
                    loaderWrapper.style.display = 'none';
                }, 500);
            }, 1500);
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navLinks.contains(event.target) && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // Search Bar Functionality
    const searchIcon = document.querySelector('.fa-search');
    const searchForm = document.createElement('div');
    searchForm.className = 'search-form';
    searchForm.innerHTML = `
        <div class="search-container">
            <input type="text" placeholder="Search products..." class="search-input">
            <button type="submit" class="search-btn"><i class="fas fa-search"></i></button>
            <button type="button" class="close-search"><i class="fas fa-times"></i></button>
        </div>
    `;
    document.body.appendChild(searchForm);
    
    if (searchIcon) {
        searchIcon.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            searchForm.classList.add('active');
            setTimeout(() => {
                searchForm.querySelector('.search-input').focus();
            }, 100);
        });
        
        // Close search when clicking the close button
        searchForm.querySelector('.close-search').addEventListener('click', function() {
            searchForm.classList.remove('active');
        });
        
        // Handle search submission
        searchForm.querySelector('.search-btn').addEventListener('click', function(e) {
            e.preventDefault();
            const searchValue = searchForm.querySelector('.search-input').value.trim().toLowerCase();
            if (searchValue !== '') {
                // Here you would typically perform a search operation
                // For now, we'll just show a notification
                showNotification(`Searching for: ${searchValue}`);
                searchForm.classList.remove('active');
                searchForm.querySelector('.search-input').value = '';
            }
        });
        
        // Close search when clicking outside
        document.addEventListener('click', function(e) {
            if (searchForm.classList.contains('active') && 
                !searchForm.contains(e.target) && 
                !searchIcon.parentElement.contains(e.target)) {
                searchForm.classList.remove('active');
            }
        });
    }

    // Hero Carousel Functionality
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    // Initialize carousel if elements exist
    if (carousel && slides.length > 0) {
        // Function to update slide position
        function updateSlide(index) {
            // Remove active class from all slides and indicators
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            // Add active class to current slide and indicator
            slides[index].classList.add('active');
            if (indicators[index]) {
                indicators[index].classList.add('active');
            }
            
            // Update current slide index
            currentSlide = index;
        }

        // Function to go to next slide
        function nextSlide() {
            let nextIndex = currentSlide + 1;
            if (nextIndex >= slides.length) {
                nextIndex = 0;
            }
            updateSlide(nextIndex);
        }

        // Function to go to previous slide
        function prevSlide() {
            let prevIndex = currentSlide - 1;
            if (prevIndex < 0) {
                prevIndex = slides.length - 1;
            }
            updateSlide(prevIndex);
        }

        // Start auto-sliding
        function startSlideInterval() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        // Stop auto-sliding
        function stopSlideInterval() {
            clearInterval(slideInterval);
        }

        // Event listeners for carousel controls
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                stopSlideInterval();
                nextSlide();
                startSlideInterval();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                stopSlideInterval();
                prevSlide();
                startSlideInterval();
            });
        }

        // Event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                stopSlideInterval();
                updateSlide(index);
                startSlideInterval();
            });
        });

        // Touch events for mobile swipe
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            stopSlideInterval();
        }, false);

        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startSlideInterval();
        }, false);

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                // Swipe left, go to next slide
                nextSlide();
            } else if (touchEndX > touchStartX + 50) {
                // Swipe right, go to previous slide
                prevSlide();
            }
        }

        // Start the carousel
        startSlideInterval();
    }

    // Product Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');

    if (filterButtons.length > 0 && productItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                productItems.forEach(item => {
                    if (filterValue === 'all') {
                        item.style.display = 'block';
                    } else if (item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Product Quick View Modal
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const productModal = document.querySelector('.product-modal');
    const closeModalBtn = document.querySelector('.close-modal');

    if (quickViewBtns.length > 0 && productModal) {
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = this.getAttribute('data-product-id');
                // Here you would typically fetch product details based on ID
                // For now, we'll just show the modal
                productModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                productModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === productModal) {
                productModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Profile Button Functionality
    const profileIcon = document.querySelector('.fa-user');
    const profileDropdown = document.createElement('div');
    profileDropdown.className = 'profile-dropdown';
    profileDropdown.innerHTML = `
        <div class="profile-menu">
            <ul>
                <li><a href="#"><i class="fas fa-user-circle"></i> My Account</a></li>
                <li><a href="#"><i class="fas fa-heart"></i> Wishlist</a></li>
                <li><a href="#"><i class="fas fa-box"></i> Orders</a></li>
                <li><a href="#"><i class="fas fa-cog"></i> Settings</a></li>
                <li><a href="#"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        </div>
    `;
    document.body.appendChild(profileDropdown);
    
    if (profileIcon) {
        profileIcon.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            profileDropdown.classList.toggle('active');
            
            // Position the dropdown below the profile icon
            const iconRect = this.getBoundingClientRect();
            profileDropdown.style.top = `${iconRect.bottom + window.scrollY}px`;
            profileDropdown.style.left = `${iconRect.left + window.scrollX - 100}px`; // Adjust left position
        });
        
        // Close profile dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (profileDropdown.classList.contains('active') && 
                !profileDropdown.contains(e.target) && 
                !profileIcon.parentElement.contains(e.target)) {
                profileDropdown.classList.remove('active');
            }
        });
        
        // Handle profile menu item clicks
        profileDropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const action = this.textContent.trim();
                showNotification(`${action} selected`);
                profileDropdown.classList.remove('active');
            });
        });
    }
    
    // Add to Cart Functionality
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartIcon = document.querySelector('.fa-shopping-cart');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Create cart dropdown
    const cartDropdown = document.createElement('div');
    cartDropdown.className = 'cart-dropdown';
    cartDropdown.innerHTML = `
        <div class="cart-dropdown-header">
            <h3>Shopping Cart</h3>
            <button class="close-cart"><i class="fas fa-times"></i></button>
        </div>
        <div class="cart-items">
            <!-- Cart items will be dynamically added here -->
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Total:</span>
                <span class="total-amount">$0.00</span>
            </div>
            <div class="cart-buttons">
                <a href="#" class="btn view-cart-btn">View Cart</a>
                <a href="#" class="btn checkout-btn">Checkout</a>
            </div>
        </div>
    `;
    document.body.appendChild(cartDropdown);

    // Update cart count display
    function updateCartCount() {
        if (cartCount) {
            cartCount.textContent = cartItems.length;
        }
    }
    
    // Update cart dropdown content
    function updateCartDropdown() {
        const cartItemsContainer = cartDropdown.querySelector('.cart-items');
        const totalAmount = cartDropdown.querySelector('.total-amount');
        
        // Clear current items
        cartItemsContainer.innerHTML = '';
        
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            totalAmount.textContent = '$0.00';
            return;
        }
        
        // Calculate total
        let total = 0;
        
        // Add each item to the cart dropdown
        cartItems.forEach((item, index) => {
            // Extract price as a number
            const priceText = item.price.replace(/[^0-9.]/g, '');
            const price = parseFloat(priceText);
            const itemTotal = price * item.quantity;
            total += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">
                        <span>${item.price}</span> x <span>${item.quantity}</span>
                    </div>
                </div>
                <button class="remove-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Update total
        totalAmount.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to remove buttons
        cartDropdown.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cartItems.splice(index, 1);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                updateCartCount();
                updateCartDropdown();
                showNotification('Item removed from cart');
            });
        });
    }

    // Initialize cart count and dropdown
    updateCartCount();
    updateCartDropdown();
    
    // Toggle cart dropdown when clicking the cart icon
    if (cartIcon) {
        cartIcon.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            cartDropdown.classList.toggle('active');
            
            // Position the dropdown
            const iconRect = this.getBoundingClientRect();
            cartDropdown.style.top = `${iconRect.bottom + window.scrollY}px`;
            cartDropdown.style.right = `20px`; // Align to right side
            
            // Update cart content
            updateCartDropdown();
        });
        
        // Close cart dropdown when clicking the close button
        cartDropdown.querySelector('.close-cart').addEventListener('click', function() {
            cartDropdown.classList.remove('active');
        });
        
        // Close cart dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (cartDropdown.classList.contains('active') && 
                !cartDropdown.contains(e.target) && 
                !cartIcon.parentElement.contains(e.target)) {
                cartDropdown.classList.remove('active');
            }
        });
        
        // Handle cart buttons
        cartDropdown.querySelector('.view-cart-btn').addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('View Cart clicked');
            cartDropdown.classList.remove('active');
        });
        
        cartDropdown.querySelector('.checkout-btn').addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Checkout clicked');
            cartDropdown.classList.remove('active');
        });
    }

    if (addToCartBtns.length > 0) {
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get product details
                const productCard = this.closest('.product-card');
                const productId = this.getAttribute('data-product-id');
                const productName = productCard.querySelector('.product-title').textContent;
                const productPrice = productCard.querySelector('.product-price').textContent;
                const productImg = productCard.querySelector('.product-img img').src;
                
                // Create product object
                const product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    img: productImg,
                    quantity: 1
                };
                
                // Check if product already in cart
                const existingProductIndex = cartItems.findIndex(item => item.id === productId);
                
                if (existingProductIndex > -1) {
                    // Increase quantity if product already in cart
                    cartItems[existingProductIndex].quantity++;
                } else {
                    // Add new product to cart
                    cartItems.push(product);
                }
                
                // Save to localStorage
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                
                // Update cart count
                updateCartCount();
                
                // Show success message
                showNotification('Product added to cart!');
                
                // Add animation to cart icon
                const cartIcon = document.querySelector('.fa-shopping-cart');
                if (cartIcon) {
                    cartIcon.classList.add('bounce');
                    setTimeout(() => {
                        cartIcon.classList.remove('bounce');
                    }, 1000);
                }
            });
        });
    }

    // Notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Testimonial Slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    let currentTestimonial = 0;

    if (testimonialSlider && testimonialSlides.length > 0) {
        function showTestimonial(index) {
            testimonialSlides.forEach(slide => slide.classList.remove('active'));
            testimonialDots.forEach(dot => dot.classList.remove('active'));
            
            testimonialSlides[index].classList.add('active');
            testimonialDots[index].classList.add('active');
            
            currentTestimonial = index;
        }

        // Initialize testimonial dots
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showTestimonial(index);
            });
        });

        // Auto-rotate testimonials
        setInterval(() => {
            let nextIndex = currentTestimonial + 1;
            if (nextIndex >= testimonialSlides.length) {
                nextIndex = 0;
            }
            showTestimonial(nextIndex);
        }, 6000);
    }

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email === '') {
                showNotification('Please enter your email address.');
                return;
            }
            
            // Here you would typically send the email to your server
            // For now, we'll just show a success message
            showNotification('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        });
    }

    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
        
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Button Ripple Effect
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Parallax Effect for Hero Section
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            if (scrollPosition < window.innerHeight) {
                heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
            }
        });
    }

    // Image Lazy Loading
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});