// Load packages dynamically
async function loadPackages() {
    try {
        const { data, error } = await supabase
            .from('packages')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Group packages by category
        const packagesByCategory = {
            domestic: data.filter(p => p.category === 'domestic'),
            international: data.filter(p => p.category === 'international'),
            honeymoon: data.filter(p => p.category === 'honeymoon')
        };
        
        return packagesByCategory;
    } catch (error) {
        console.error('Error loading packages:', error);
        return null;
    }
}

// Render packages for a specific category
function renderPackages(category, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    loadPackages().then(packagesByCategory => {
        if (!packagesByCategory) return;
        
        const packages = packagesByCategory[category] || [];
        let html = '';
        
        packages.forEach(pkg => {
            const highlights = pkg.highlights || [];
            const features = pkg.features || ['Hotels', 'Transfers', 'Meals', 'Sightseeing'];
            
            html += `
                <div class="card" tabindex="0">
                    <img class="card-img" src="${pkg.image || 'https://via.placeholder.com/300x200?text=Package'}" 
                         alt="${pkg.name}" loading="lazy" onerror="handleImageError(this)">
                    <div class="card-content">
                        <div class="card-header">
                            <h3>${pkg.name}</h3>
                            <span class="rating"><i class="fas fa-star"></i> ${pkg.rating || 4.5} • ${pkg.reviews_count || 0} reviews</span>
                        </div>
                        <div class="duration"><i class="far fa-calendar-alt"></i> ${pkg.duration}</div>
                        <div class="features-list">
                            ${features.map(f => `<span><i class="fas fa-check-circle"></i> ${f}</span>`).join('')}
                        </div>
                        <ul class="highlights">
                            ${highlights.slice(0, 3).map(h => `<li><i class="fas fa-check-circle"></i> ${h}</li>`).join('')}
                        </ul>
                        <div class="price">₹${pkg.price} <small>per person</small></div>
                        <a href="#" class="enquire-btn" onclick="enquirePackage('${pkg.name}', '${pkg.price}'); return false;">
                            <i class="fab fa-whatsapp"></i> Enquire Now
                        </a>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html || '<p class="no-packages">No packages available in this category.</p>';
    });
}

// Enquire about a package
async function enquirePackage(packageName, price) {
    const name = prompt('Enter your name:');
    if (!name) return;
    
    const phone = prompt('Enter your phone number:');
    if (!phone) return;
    
    // Store lead in database
    try {
        await supabase.from('leads').insert([
            {
                name,
                phone,
                package_name: packageName,
                source: 'enquire',
                message: `Interested in ${packageName} package at ₹${price}`,
                status: 'new'
            }
        ]);
        
        // Open WhatsApp
        const msg = encodeURIComponent(`Hi, I'm interested in ${packageName} package at ₹${price}.\n\nName: ${name}\nPhone: ${phone}`);
        window.open(`https://wa.me/919395319499?text=${msg}`, '_blank');
    } catch (error) {
        console.error('Error saving lead:', error);
        // Still open WhatsApp even if DB fails
        const msg = encodeURIComponent(`Hi, I'm interested in ${packageName} package at ₹${price}.\n\nName: ${name}\nPhone: ${phone}`);
        window.open(`https://wa.me/919395319499?text=${msg}`, '_blank');
    }
}
