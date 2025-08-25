document.addEventListener('DOMContentLoaded', function() {
    // Interactive Skin Demo
    const skinDemo = document.getElementById('skinDemo');
    const demoBtns = document.querySelectorAll('.demo-btn');
    
    demoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            demoBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const skinType = this.dataset.skinType;
            updateSkinDemo(skinType);
        });
    });
    
    function updateSkinDemo(type) {
        skinDemo.style.background = 
            type === 'dry' ? '#f3c8b1' :
            type === 'oily' ? '#f7e0c0' : '#f5d7c7';
        
        // Animate skin issues
        gsap.to('.issue', {
            scale: type === 'oily' ? 1.2 : 1,
            duration: 0.5
        });
    }
    
    // Testimonial Carousel
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        testimonials[index].classList.add('active');
        currentIndex = index;
    }
    
    prevBtn.addEventListener('click', function() {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = testimonials.length - 1;
        showTestimonial(newIndex);
    });
    
    nextBtn.addEventListener('click', function() {
        let newIndex = currentIndex + 1;
        if (newIndex >= testimonials.length) newIndex = 0;
        showTestimonial(newIndex);
    });
    
    // Auto-rotate testimonials
    setInterval(() => {
        let newIndex = currentIndex + 1;
        if (newIndex >= testimonials.length) newIndex = 0;
        showTestimonial(newIndex);
    }, 5000);
    
    // Animate skin issues on hover
    document.querySelectorAll('.issue').forEach(issue => {
        issue.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.2,
                duration: 0.3
            });
        });
        
        issue.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3
            });
        });
    });
});