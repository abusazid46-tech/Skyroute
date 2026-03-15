// Load and apply settings
async function applySettings() {
    const result = await getSettings();
    if (!result.success) return;
    
    const settings = result.data;
    
    // Update page title
    if (settings.seo_title) {
        document.title = settings.seo_title;
    }
    
    // Update meta tags
    if (settings.seo_description) {
        updateMetaTag('description', settings.seo_description);
    }
    
    if (settings.seo_keywords) {
        updateMetaTag('keywords', settings.seo_keywords);
    }
    
    // Update contact info in footer
    const footer = document.querySelector('footer');
    if (footer && settings.address) {
        const addressEl = footer.querySelector('p:last-child');
        if (addressEl) {
            addressEl.innerHTML = `📍 ${settings.address}`;
        }
    }
    
    // Update WhatsApp number in floating button
    const whatsappBtn = document.querySelector('.float-btn.whatsapp');
    if (whatsappBtn && settings.whatsapp) {
        whatsappBtn.setAttribute('onclick', `openWhatsApp('Hi! I need travel help', '${settings.whatsapp}'); return false;`);
    }
    
    // Update call button
    const callBtn = document.querySelector('.float-btn.call');
    if (callBtn && settings.phone) {
        const cleanPhone = settings.phone.replace(/\D/g, '');
        callBtn.setAttribute('href', `tel:${cleanPhone}`);
    }
    
    // Update hero section if present
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroTitle = heroSection.querySelector('h1');
        const heroSubtitle = heroSection.querySelector('p');
        const heroImage = heroSection.querySelector('.hero-image img');
        
        if (heroTitle && settings.hero_title) {
            heroTitle.textContent = settings.hero_title;
        }
        
        if (heroSubtitle && settings.hero_subtitle) {
            heroSubtitle.textContent = settings.hero_subtitle;
        }
        
        if (heroImage && settings.hero_image) {
            heroImage.src = settings.hero_image;
        }
        
        const trustBadge = heroSection.querySelector('p[style*="font-size:14px"]');
        if (trustBadge && settings.trust_badge_text) {
            trustBadge.textContent = settings.trust_badge_text;
        }
    }
}

function updateMetaTag(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}
