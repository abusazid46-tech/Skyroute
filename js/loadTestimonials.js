// Load testimonials dynamically
async function loadTestimonials() {
    try {
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(6);
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error loading testimonials:', error);
        return [];
    }
}

// Render testimonials
async function renderTestimonials(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    const testimonials = await loadTestimonials();
    
    if (!testimonials.length) {
        // Fallback to static testimonials if none in DB
        container.innerHTML = `
            <div class="testimonial-card">
                <i class="fas fa-quote-right"></i>
                <p>Sky Route made our Kashmir trip memorable. So affordable!</p>
                <div class="customer-row">
                    <img class="customer-photo" src="https://i.ibb.co/kgfvmCxG/images-4.jpg" alt="Priya" onerror="handleImageError(this)">
                    <span class="customer">— Priya, Guwahati</span>
                </div>
            </div>
            <div class="testimonial-card">
                <i class="fas fa-quote-right"></i>
                <p>Best Dubai deal! Everything was smooth. Thank you team.</p>
                <div class="customer-row">
                    <img class="customer-photo" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" alt="Rajesh" onerror="handleImageError(this)">
                    <span class="customer">— Rajesh, Delhi</span>
                </div>
            </div>
            <div class="testimonial-card">
                <i class="fas fa-quote-right"></i>
                <p>Group tour to Sikkim was fantastic. 24/7 support helped us.</p>
                <div class="customer-row">
                    <img class="customer-photo" src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e" alt="Anita" onerror="handleImageError(this)">
                    <span class="customer">— Anita, Kolkata</span>
                </div>
            </div>
        `;
        return;
    }
    
    let html = '';
    testimonials.forEach(t => {
        html += `
            <div class="testimonial-card">
                <i class="fas fa-quote-right"></i>
                <p>${t.review_text}</p>
                <div class="customer-row">
                    <img class="customer-photo" src="${t.customer_photo || 'https://via.placeholder.com/48?text=User'}" 
                         alt="${t.customer_name}" onerror="handleImageError(this)">
                    <span class="customer">— ${t.customer_name}${t.destination ? `, ${t.destination}` : ''}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}
