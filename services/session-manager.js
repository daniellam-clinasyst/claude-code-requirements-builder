/**
 * SessionManager - Session persistence and recovery system
 * Enables seamless continuation of requirements gathering across sessions
 */

class SessionManager {
  constructor(cacheManager) {
    this.cache = cacheManager;
    this.sessionFile = '.requirements-session.json';
    this.autoSaveInterval = 30000; // 30 seconds
    this.sessionTimeout = 3600000; // 1 hour
    
    this.currentSession = {
      id: this.generateSessionId(),
      startTime: Date.now(),
      lastUpdate: Date.now(),
      requirement: null,
      phase: null,
      answers: {},
      mcpResults: {},
      progress: {
        overall: 0,
        phases: {}
      }
    };
    
    this.autoSaveTimer = null;
    this.recoveryAttempted = false;
  }
  
  /**
   * Initialize session manager
   */
  async initialize() {
    // Try to recover previous session
    const recovered = await this.recoverSession();
    
    if (recovered) {
      console.log('📌 Previous session recovered. Continuing where you left off...');
      this.displayRecoveryInfo();
    } else {
      console.log('🆕 Starting new requirements gathering session');
    }
    
    // Start auto-save
    this.startAutoSave();
    
    return recovered;
  }
  
  /**
   * Recover previous session
   */
  async recoverSession() {
    if (this.recoveryAttempted) return false;
    this.recoveryAttempted = true;
    
    try {
      // Load session from file
      const savedSession = await this.loadSessionFile();
      
      if (!savedSession) return false;
      
      // Check if session is still valid
      if (this.isSessionExpired(savedSession)) {
        console.log('⏰ Previous session expired');
        return false;
      }
      
      // Restore session state
      this.currentSession = savedSession;
      
      // Restore cache if available
      if (savedSession.cacheSnapshot) {
        await this.restoreCache(savedSession.cacheSnapshot);
      }
      
      return true;
      
    } catch (error) {
      console.log('Could not recover previous session');
      return false;
    }
  }
  
  /**
   * Save current session
   */
  async saveSession() {
    try {
      const sessionData = {
        ...this.currentSession,
        lastUpdate: Date.now(),
        cacheSnapshot: await this.createCacheSnapshot()
      };
      
      // Save to file
      await this.saveSessionFile(sessionData);
      
      // Also save to persistent cache
      await this.cache.set('current-session', sessionData, {
        layer: 'persistent',
        ttl: this.sessionTimeout
      });
      
    } catch (error) {
      console.log('Warning: Could not save session state');
    }
  }
  
  /**
   * Start auto-save timer
   */
  startAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
    
    this.autoSaveTimer = setInterval(() => {
      this.saveSession();
    }, this.autoSaveInterval);
  }
  
  /**
   * Stop auto-save timer
   */
  stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }
  
  /**
   * Update session state
   */
  updateSession(updates) {
    this.currentSession = {
      ...this.currentSession,
      ...updates,
      lastUpdate: Date.now()
    };
    
    // Trigger immediate save for important updates
    if (updates.phase || updates.requirement) {
      this.saveSession();
    }
  }
  
  /**
   * Add answer to session
   */
  addAnswer(questionId, answer) {
    if (!this.currentSession.answers) {
      this.currentSession.answers = {};
    }
    
    this.currentSession.answers[questionId] = {
      value: answer,
      timestamp: Date.now()
    };
    
    this.updateProgress();
  }
  
  /**
   * Add MCP result to session
   */
  addMCPResult(mcpName, result) {
    if (!this.currentSession.mcpResults) {
      this.currentSession.mcpResults = {};
    }
    
    this.currentSession.mcpResults[mcpName] = {
      data: result,
      timestamp: Date.now()
    };
  }
  
  /**
   * Update progress tracking
   */
  updateProgress() {
    const phases = ['discovery', 'context', 'detail', 'spec'];
    const currentPhaseIndex = phases.indexOf(this.currentSession.phase);
    
    // Calculate phase progress
    if (this.currentSession.phase === 'discovery' || this.currentSession.phase === 'detail') {
      const totalQuestions = this.currentSession.totalQuestions || 5;
      const answeredQuestions = Object.keys(this.currentSession.answers || {}).length;
      
      this.currentSession.progress.phases[this.currentSession.phase] = 
        (answeredQuestions / totalQuestions) * 100;
    }
    
    // Calculate overall progress
    let overallProgress = 0;
    
    phases.forEach((phase, index) => {
      if (index < currentPhaseIndex) {
        overallProgress += 25; // Each completed phase is 25%
      } else if (index === currentPhaseIndex) {
        const phaseProgress = this.currentSession.progress.phases[phase] || 0;
        overallProgress += (phaseProgress / 100) * 25;
      }
    });
    
    this.currentSession.progress.overall = overallProgress;
  }
  
  /**
   * Get progress display
   */
  getProgressDisplay() {
    const overall = Math.round(this.currentSession.progress.overall);
    const filled = Math.floor(overall / 10);
    const empty = 10 - filled;
    
    const progressBar = '█'.repeat(filled) + '░'.repeat(empty);
    
    return {
      bar: `[${progressBar}] ${overall}%`,
      percentage: overall,
      phase: this.currentSession.phase,
      phaseProgress: this.currentSession.progress.phases[this.currentSession.phase] || 0
    };
  }
  
  /**
   * Display recovery information
   */
  displayRecoveryInfo() {
    const timeSinceUpdate = Date.now() - this.currentSession.lastUpdate;
    const minutesAgo = Math.floor(timeSinceUpdate / 60000);
    
    console.log(`
📋 Recovered Session Information:
  Requirement: ${this.currentSession.requirement?.substring(0, 50)}...
  Phase: ${this.currentSession.phase}
  Progress: ${this.getProgressDisplay().bar}
  Last activity: ${minutesAgo} minutes ago
  Answers collected: ${Object.keys(this.currentSession.answers || {}).length}
  MCP analyses: ${Object.keys(this.currentSession.mcpResults || {}).length}
    `);
  }
  
  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Check if session is expired
   */
  isSessionExpired(session) {
    const age = Date.now() - session.lastUpdate;
    return age > this.sessionTimeout;
  }
  
  /**
   * Create cache snapshot
   */
  async createCacheSnapshot() {
    // Save important cache entries
    const snapshot = {
      mcpResults: {},
      analysisResults: {},
      timestamp: Date.now()
    };
    
    // Get MCP results from cache
    const mcpKeys = ['sequential', 'context7', 'magic', 'playwright'];
    for (const key of mcpKeys) {
      const cached = await this.cache.get(`mcp:${key}:current`);
      if (cached) {
        snapshot.mcpResults[key] = cached;
      }
    }
    
    return snapshot;
  }
  
  /**
   * Restore cache from snapshot
   */
  async restoreCache(snapshot) {
    if (!snapshot) return;
    
    // Restore MCP results
    for (const [key, value] of Object.entries(snapshot.mcpResults || {})) {
      await this.cache.set(`mcp:${key}:current`, value, {
        layer: 'session'
      });
    }
  }
  
  /**
   * Load session from file
   */
  async loadSessionFile() {
    // This would use actual file system in production
    // For now, simulate with cache
    return await this.cache.get('session-file');
  }
  
  /**
   * Save session to file
   */
  async saveSessionFile(sessionData) {
    // This would use actual file system in production
    // For now, simulate with cache
    await this.cache.set('session-file', sessionData, {
      layer: 'persistent',
      ttl: this.sessionTimeout
    });
  }
  
  /**
   * Clear current session
   */
  clearSession() {
    this.stopAutoSave();
    
    this.currentSession = {
      id: this.generateSessionId(),
      startTime: Date.now(),
      lastUpdate: Date.now(),
      requirement: null,
      phase: null,
      answers: {},
      mcpResults: {},
      progress: {
        overall: 0,
        phases: {}
      }
    };
    
    // Clear session file
    this.saveSessionFile(null);
  }
  
  /**
   * Get session summary
   */
  getSessionSummary() {
    const duration = Date.now() - this.currentSession.startTime;
    const minutes = Math.floor(duration / 60000);
    
    return {
      id: this.currentSession.id,
      duration: `${minutes} minutes`,
      requirement: this.currentSession.requirement,
      phase: this.currentSession.phase,
      progress: this.getProgressDisplay(),
      answersCollected: Object.keys(this.currentSession.answers || {}).length,
      mcpAnalyses: Object.keys(this.currentSession.mcpResults || {}).length,
      lastUpdate: new Date(this.currentSession.lastUpdate).toLocaleTimeString()
    };
  }
  
  /**
   * Export session for debugging
   */
  exportSession() {
    return {
      ...this.currentSession,
      exported: new Date().toISOString(),
      version: '1.0.0'
    };
  }
  
  /**
   * Import session for testing
   */
  importSession(sessionData) {
    if (sessionData && sessionData.id) {
      this.currentSession = sessionData;
      this.saveSession();
      return true;
    }
    return false;
  }
}

// Export for use in requirements builder
module.exports = SessionManager;