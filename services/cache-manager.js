/**
 * CacheManager - Multi-layer caching system for requirements builder
 * Provides memory, session, and persistent caching with TTL support
 */

class CacheManager {
  constructor() {
    this.layers = {
      memory: new Map(),     // Fast, short-lived (5 min default)
      session: new Map(),    // Medium duration (30 min default)
      persistent: new Map()  // Long-term (24 hours default)
    };
    
    this.config = {
      memory: { ttl: 5 * 60 * 1000, maxSize: 100 },
      session: { ttl: 30 * 60 * 1000, maxSize: 500 },
      persistent: { ttl: 24 * 60 * 60 * 1000, maxSize: 1000 }
    };
    
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
    
    // Start cleanup interval
    this.startCleanup();
  }
  
  /**
   * Get value from cache or fetch if not present
   * @param {string} key - Cache key
   * @param {Function} fetcher - Function to fetch value if not cached
   * @param {Object} options - Cache options (layer, ttl)
   */
  async get(key, fetcher = null, options = {}) {
    const layer = options.layer || 'memory';
    
    // Check cache layers in order of speed
    const cached = this.getFromLayers(key);
    if (cached !== null) {
      this.stats.hits++;
      return cached;
    }
    
    this.stats.misses++;
    
    // Fetch if fetcher provided
    if (fetcher) {
      const value = await fetcher();
      this.set(key, value, options);
      return value;
    }
    
    return null;
  }
  
  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {Object} options - Cache options
   */
  set(key, value, options = {}) {
    const layer = options.layer || 'memory';
    const ttl = options.ttl || this.config[layer].ttl;
    
    const entry = {
      value,
      timestamp: Date.now(),
      ttl,
      hits: 0
    };
    
    // Check size limits
    this.enforceSize(layer);
    
    // Store in appropriate layer
    this.layers[layer].set(key, entry);
    
    // Promote to higher layers if frequently accessed
    if (options.promote && layer === 'memory') {
      this.promoteEntry(key, entry);
    }
  }
  
  /**
   * Get value from cache layers
   */
  getFromLayers(key) {
    // Check each layer
    for (const [layerName, layer] of Object.entries(this.layers)) {
      if (layer.has(key)) {
        const entry = layer.get(key);
        
        // Check if expired
        if (this.isExpired(entry)) {
          layer.delete(key);
          continue;
        }
        
        entry.hits++;
        
        // Promote frequently accessed items
        if (entry.hits > 5 && layerName === 'memory') {
          this.promoteEntry(key, entry);
        }
        
        return entry.value;
      }
    }
    
    return null;
  }
  
  /**
   * Check if cache entry is expired
   */
  isExpired(entry) {
    return Date.now() - entry.timestamp > entry.ttl;
  }
  
  /**
   * Enforce size limits for a cache layer
   */
  enforceSize(layer) {
    const maxSize = this.config[layer].maxSize;
    const currentLayer = this.layers[layer];
    
    if (currentLayer.size >= maxSize) {
      // Remove oldest entries (LRU)
      const entriesToRemove = currentLayer.size - maxSize + 1;
      const entries = Array.from(currentLayer.entries());
      
      // Sort by last access time
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      for (let i = 0; i < entriesToRemove; i++) {
        currentLayer.delete(entries[i][0]);
        this.stats.evictions++;
      }
    }
  }
  
  /**
   * Promote entry to longer-lived cache layer
   */
  promoteEntry(key, entry) {
    // Promote to session cache
    if (!this.layers.session.has(key)) {
      this.layers.session.set(key, {
        ...entry,
        ttl: this.config.session.ttl
      });
    }
    
    // Promote to persistent if very frequently accessed
    if (entry.hits > 10 && !this.layers.persistent.has(key)) {
      this.layers.persistent.set(key, {
        ...entry,
        ttl: this.config.persistent.ttl
      });
    }
  }
  
  /**
   * Clear expired entries periodically
   */
  startCleanup() {
    setInterval(() => {
      for (const [layerName, layer] of Object.entries(this.layers)) {
        for (const [key, entry] of layer.entries()) {
          if (this.isExpired(entry)) {
            layer.delete(key);
          }
        }
      }
    }, 60000); // Clean every minute
  }
  
  /**
   * Clear specific cache layer or all
   */
  clear(layer = null) {
    if (layer) {
      this.layers[layer].clear();
    } else {
      Object.values(this.layers).forEach(l => l.clear());
    }
  }
  
  /**
   * Get cache statistics
   */
  getStats() {
    const layerStats = {};
    
    for (const [name, layer] of Object.entries(this.layers)) {
      layerStats[name] = {
        size: layer.size,
        maxSize: this.config[name].maxSize,
        utilization: (layer.size / this.config[name].maxSize * 100).toFixed(1) + '%'
      };
    }
    
    return {
      ...this.stats,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
      layers: layerStats
    };
  }
  
  /**
   * Cache key generators for common patterns
   */
  static keys = {
    mcp: (server, operation, input) => 
      `mcp:${server}:${operation}:${CacheManager.hash(input)}`,
    
    file: (path) => 
      `file:${path}`,
    
    analysis: (requirement, type) => 
      `analysis:${CacheManager.hash(requirement)}:${type}`,
    
    template: (name) => 
      `template:${name}`,
    
    library: (name, version) => 
      `library:${name}:${version || 'latest'}`
  };
  
  /**
   * Simple hash function for cache keys
   */
  static hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
}

// Singleton instance
let cacheInstance = null;

/**
 * Get or create cache manager instance
 */
function getCacheManager() {
  if (!cacheInstance) {
    cacheInstance = new CacheManager();
  }
  return cacheInstance;
}

// Export for use in requirements builder
module.exports = {
  CacheManager,
  getCacheManager,
  cacheKeys: CacheManager.keys
};