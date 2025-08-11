/**
 * ErrorHandler - Comprehensive error handling and recovery system
 * Provides graceful error recovery, user-friendly messages, and fallback strategies
 */

class ErrorHandler {
  constructor() {
    this.strategies = {
      // MCP-related errors
      MCP_TIMEOUT: this.handleMCPTimeout.bind(this),
      MCP_UNAVAILABLE: this.handleMCPUnavailable.bind(this),
      MCP_ERROR: this.handleMCPError.bind(this),
      
      // File system errors
      FILE_NOT_FOUND: this.handleFileNotFound.bind(this),
      FILE_LOCKED: this.handleFileLocked.bind(this),
      FILE_CORRUPT: this.handleFileCorrupt.bind(this),
      
      // Metadata errors
      METADATA_CORRUPT: this.handleMetadataCorrupt.bind(this),
      METADATA_MISSING: this.handleMetadataMissing.bind(this),
      
      // Validation errors
      INVALID_INPUT: this.handleInvalidInput.bind(this),
      VALIDATION_FAILED: this.handleValidationFailed.bind(this),
      
      // System errors
      OUT_OF_MEMORY: this.handleOutOfMemory.bind(this),
      RATE_LIMIT: this.handleRateLimit.bind(this),
      NETWORK_ERROR: this.handleNetworkError.bind(this)
    };
    
    this.userMessages = {
      MCP_TIMEOUT: "The AI analysis is taking longer than expected. Using standard analysis instead.",
      MCP_UNAVAILABLE: "Advanced analysis features are temporarily unavailable. Continuing with basic analysis.",
      MCP_ERROR: "An error occurred during analysis. Some features may be limited.",
      FILE_NOT_FOUND: "Required file not found. Creating default structure.",
      FILE_LOCKED: "File is being used by another process. Please wait a moment.",
      FILE_CORRUPT: "File appears to be corrupted. Attempting recovery.",
      METADATA_CORRUPT: "Project metadata is corrupted. Rebuilding from available data.",
      METADATA_MISSING: "Project metadata not found. Creating new metadata.",
      INVALID_INPUT: "The input provided is invalid. Please check and try again.",
      VALIDATION_FAILED: "Validation failed. Please review the requirements.",
      OUT_OF_MEMORY: "System resources are low. Optimizing operations.",
      RATE_LIMIT: "Too many requests. Please wait a moment before continuing.",
      NETWORK_ERROR: "Network connection issue. Some features may be unavailable."
    };
    
    this.errorLog = [];
    this.maxLogSize = 100;
  }
  
  /**
   * Main error handling method
   */
  async handle(error, context = {}) {
    // Log error
    this.logError(error, context);
    
    // Determine error type
    const errorType = this.classifyError(error);
    
    // Get recovery strategy
    const strategy = this.strategies[errorType];
    
    if (strategy) {
      try {
        // Execute recovery strategy
        const result = await strategy(error, context);
        
        // Log successful recovery
        this.logRecovery(errorType, result);
        
        return result;
      } catch (recoveryError) {
        // Recovery failed, use fallback
        return this.ultimateFallback(error, recoveryError);
      }
    }
    
    // No strategy available, use default handling
    return this.defaultHandler(error, context);
  }
  
  /**
   * Classify error type
   */
  classifyError(error) {
    // Check error code
    if (error.code) {
      return error.code;
    }
    
    // Check error message patterns
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('timeout')) return 'MCP_TIMEOUT';
    if (message.includes('not found')) return 'FILE_NOT_FOUND';
    if (message.includes('locked')) return 'FILE_LOCKED';
    if (message.includes('corrupt')) return 'FILE_CORRUPT';
    if (message.includes('invalid')) return 'INVALID_INPUT';
    if (message.includes('network')) return 'NETWORK_ERROR';
    if (message.includes('memory')) return 'OUT_OF_MEMORY';
    if (message.includes('rate')) return 'RATE_LIMIT';
    
    return 'UNKNOWN_ERROR';
  }
  
  /**
   * MCP timeout handler
   */
  async handleMCPTimeout(error, context) {
    console.log(`⚠️ ${this.userMessages.MCP_TIMEOUT}`);
    
    // Return partial results if available
    if (context.partialResults) {
      return {
        success: true,
        partial: true,
        data: context.partialResults,
        message: 'Using partial results due to timeout'
      };
    }
    
    // Fallback to native analysis
    return {
      success: true,
      fallback: true,
      data: await this.nativeAnalysis(context.requirement),
      message: 'Using native analysis'
    };
  }
  
  /**
   * MCP unavailable handler
   */
  async handleMCPUnavailable(error, context) {
    console.log(`ℹ️ ${this.userMessages.MCP_UNAVAILABLE}`);
    
    // Use alternative MCP if available
    if (context.alternativeMCP) {
      return {
        success: true,
        alternative: true,
        data: await this.useAlternativeMCP(context),
        message: `Using ${context.alternativeMCP} instead`
      };
    }
    
    // Fallback to native
    return {
      success: true,
      fallback: true,
      data: await this.nativeAnalysis(context.requirement)
    };
  }
  
  /**
   * File not found handler
   */
  async handleFileNotFound(error, context) {
    console.log(`📁 ${this.userMessages.FILE_NOT_FOUND}`);
    
    const filePath = context.path || error.path;
    
    // Create missing file with defaults
    if (filePath?.includes('metadata.json')) {
      return this.createDefaultMetadata(filePath);
    }
    
    if (filePath?.includes('.md')) {
      return this.createDefaultMarkdown(filePath);
    }
    
    // Create empty file
    return this.createEmptyFile(filePath);
  }
  
  /**
   * File locked handler
   */
  async handleFileLocked(error, context) {
    console.log(`🔒 ${this.userMessages.FILE_LOCKED}`);
    
    // Retry with exponential backoff
    const maxRetries = 3;
    const baseDelay = 1000;
    
    for (let i = 0; i < maxRetries; i++) {
      await new Promise(resolve => 
        setTimeout(resolve, baseDelay * Math.pow(2, i))
      );
      
      try {
        // Retry operation
        return await context.retryOperation();
      } catch (retryError) {
        if (i === maxRetries - 1) {
          throw retryError;
        }
      }
    }
  }
  
  /**
   * Metadata corruption handler
   */
  async handleMetadataCorrupt(error, context) {
    console.log(`🔧 ${this.userMessages.METADATA_CORRUPT}`);
    
    const folder = context.folder;
    
    // Rebuild metadata from available files
    const metadata = {
      id: folder,
      status: 'recovered',
      phase: 'unknown',
      recovered: true,
      recoveredAt: new Date().toISOString()
    };
    
    // Try to recover data from other files
    try {
      const files = await this.listFiles(folder);
      
      if (files.includes('00-initial-request.md')) {
        metadata.hasInitialRequest = true;
      }
      
      if (files.includes('02-discovery-answers.md')) {
        metadata.phase = 'discovery';
      }
      
      if (files.includes('06-requirements-spec.md')) {
        metadata.phase = 'complete';
      }
    } catch (e) {
      // Continue with basic metadata
    }
    
    return metadata;
  }
  
  /**
   * Invalid input handler
   */
  async handleInvalidInput(error, context) {
    console.log(`❌ ${this.userMessages.INVALID_INPUT}`);
    
    // Provide specific guidance
    const guidance = this.getInputGuidance(error, context);
    
    return {
      success: false,
      error: 'INVALID_INPUT',
      message: guidance,
      suggestions: this.getInputSuggestions(context)
    };
  }
  
  /**
   * Out of memory handler
   */
  async handleOutOfMemory(error, context) {
    console.log(`💾 ${this.userMessages.OUT_OF_MEMORY}`);
    
    // Clear caches
    if (context.cache) {
      context.cache.clear('memory');
    }
    
    // Reduce operation scope
    return {
      success: true,
      reduced: true,
      message: 'Operating in reduced memory mode'
    };
  }
  
  /**
   * Rate limit handler
   */
  async handleRateLimit(error, context) {
    console.log(`⏳ ${this.userMessages.RATE_LIMIT}`);
    
    // Wait and retry
    const waitTime = error.retryAfter || 5000;
    
    console.log(`Waiting ${waitTime}ms before retry...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // Retry operation
    return context.retryOperation();
  }
  
  /**
   * Network error handler
   */
  async handleNetworkError(error, context) {
    console.log(`🌐 ${this.userMessages.NETWORK_ERROR}`);
    
    // Use offline mode
    return {
      success: true,
      offline: true,
      message: 'Operating in offline mode',
      limitations: [
        'No library validation available',
        'No web search available',
        'Using cached data only'
      ]
    };
  }
  
  /**
   * Default error handler
   */
  defaultHandler(error, context) {
    console.log(`⚠️ An unexpected error occurred: ${error.message}`);
    
    return {
      success: false,
      error: error.message,
      context: context,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Ultimate fallback when recovery fails
   */
  ultimateFallback(originalError, recoveryError) {
    console.log('❌ Error recovery failed. Please try again or report this issue.');
    
    return {
      success: false,
      originalError: originalError.message,
      recoveryError: recoveryError.message,
      suggestion: 'Please restart the requirements gathering process'
    };
  }
  
  /**
   * Native analysis fallback
   */
  async nativeAnalysis(requirement) {
    // Simple native analysis without MCP
    return {
      components: this.extractComponents(requirement),
      keywords: this.extractKeywords(requirement),
      complexity: this.assessComplexity(requirement)
    };
  }
  
  /**
   * Extract components from requirement
   */
  extractComponents(requirement) {
    // Simple component extraction
    const components = [];
    const patterns = [
      /user\s+(\w+)/gi,
      /(\w+)\s+system/gi,
      /(\w+)\s+feature/gi
    ];
    
    patterns.forEach(pattern => {
      const matches = requirement.match(pattern);
      if (matches) {
        components.push(...matches);
      }
    });
    
    return [...new Set(components)];
  }
  
  /**
   * Extract keywords from requirement
   */
  extractKeywords(requirement) {
    const keywords = [];
    const importantWords = ['auth', 'api', 'database', 'ui', 'security', 'performance'];
    
    importantWords.forEach(word => {
      if (requirement.toLowerCase().includes(word)) {
        keywords.push(word);
      }
    });
    
    return keywords;
  }
  
  /**
   * Assess requirement complexity
   */
  assessComplexity(requirement) {
    const length = requirement.length;
    const wordCount = requirement.split(/\s+/).length;
    
    if (wordCount > 20 || length > 200) return 'complex';
    if (wordCount > 10 || length > 100) return 'moderate';
    return 'simple';
  }
  
  /**
   * Get input guidance
   */
  getInputGuidance(error, context) {
    const inputType = context.inputType || 'unknown';
    
    const guidance = {
      requirement: 'Please provide a clear description of the feature or change needed.',
      answer: 'Please answer with yes, no, or "idk" if unsure.',
      template: 'Template name must be one of: auth, crud-api, dashboard',
      flag: 'Invalid flag. Use --help to see available flags.'
    };
    
    return guidance[inputType] || 'Please check your input and try again.';
  }
  
  /**
   * Get input suggestions
   */
  getInputSuggestions(context) {
    return [
      'Use clear, descriptive language',
      'Avoid special characters unless necessary',
      'Keep requirements focused on a single feature',
      'Use templates for common patterns'
    ];
  }
  
  /**
   * Create default metadata
   */
  createDefaultMetadata(path) {
    return {
      id: 'recovered',
      status: 'active',
      phase: 'discovery',
      created: new Date().toISOString(),
      recovered: true
    };
  }
  
  /**
   * Create default markdown
   */
  createDefaultMarkdown(path) {
    const filename = path.split('/').pop();
    
    return `# ${filename.replace('.md', '').replace(/-/g, ' ')}\n\nFile recovered/created by error handler.\n`;
  }
  
  /**
   * Create empty file
   */
  createEmptyFile(path) {
    return '';
  }
  
  /**
   * List files in directory
   */
  async listFiles(folder) {
    // Placeholder - would use actual file system
    return [];
  }
  
  /**
   * Log error
   */
  logError(error, context) {
    const entry = {
      timestamp: new Date().toISOString(),
      error: error.message,
      code: error.code,
      context: context
    };
    
    this.errorLog.push(entry);
    
    // Maintain log size limit
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }
  }
  
  /**
   * Log successful recovery
   */
  logRecovery(errorType, result) {
    const entry = {
      timestamp: new Date().toISOString(),
      errorType: errorType,
      recovered: true,
      strategy: result.fallback ? 'fallback' : 'recovery'
    };
    
    this.errorLog.push(entry);
  }
  
  /**
   * Get error statistics
   */
  getStats() {
    const stats = {
      total: this.errorLog.length,
      recovered: this.errorLog.filter(e => e.recovered).length,
      byType: {}
    };
    
    this.errorLog.forEach(entry => {
      const type = entry.errorType || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });
    
    stats.recoveryRate = stats.recovered / stats.total || 0;
    
    return stats;
  }
}

// Singleton instance
let errorHandlerInstance = null;

/**
 * Get or create error handler instance
 */
function getErrorHandler() {
  if (!errorHandlerInstance) {
    errorHandlerInstance = new ErrorHandler();
  }
  return errorHandlerInstance;
}

// Export for use in requirements builder
module.exports = {
  ErrorHandler,
  getErrorHandler
};