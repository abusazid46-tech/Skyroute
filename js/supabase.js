// Initialize Supabase client
const supabase = window.supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.key
);

// Cache for settings to avoid repeated calls
let settingsCache = null;
let settingsCacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Generic fetch function with error handling
async function fetchFromSupabase(table, options = {}) {
    try {
        let query = supabase.from(table).select(options.select || '*');
        
        if (options.filter) {
            query = query.filter(options.filter.column, options.filter.operator, options.filter.value);
        }
        
        if (options.orderBy) {
            query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending || false });
        }
        
        if (options.limit) {
            query = query.limit(options.limit);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error(`Error fetching from ${table}:`, error);
        return { success: false, error: error.message };
    }
}

// Get settings with caching
async function getSettings(forceRefresh = false) {
    if (!forceRefresh && settingsCache && settingsCacheTime && (Date.now() - settingsCacheTime < CACHE_DURATION)) {
        return { success: true, data: settingsCache };
    }
    
    const result = await fetchFromSupabase('settings');
    if (result.success) {
        // Convert array to key-value object
        const settingsObj = {};
        result.data.forEach(item => {
            settingsObj[item.key] = item.value;
        });
        settingsCache = settingsObj;
        settingsCacheTime = Date.now();
        return { success: true, data: settingsObj };
    }
    
    return result;
}

// Upload image to Supabase Storage
async function uploadImage(file, bucket = 'images', path = '') {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${path}${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file);
        
        if (error) throw error;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);
        
        return { success: true, url: publicUrl };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { success: false, error: error.message };
    }
}

// Delete image from storage
async function deleteImage(url, bucket = 'images') {
    try {
        // Extract filename from URL
        const fileName = url.split('/').pop();
        const { error } = await supabase.storage
            .from(bucket)
            .remove([fileName]);
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting image:', error);
        return { success: false, error: error.message };
    }
}
