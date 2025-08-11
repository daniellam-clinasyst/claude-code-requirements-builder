# Context7 MCP Adapter

Adapter for integrating Context7 MCP server for library validation and documentation lookup.

## Overview

Context7 provides access to official library documentation, best practices, and version-specific information. It validates technical feasibility and ensures requirements align with library capabilities.

## Core Functions

### validateLibrary(libraryName, version)
Validates that a library exists and is compatible with the project.

**Process:**
1. Resolve library ID using fuzzy matching
2. Retrieve documentation for specific version
3. Check deprecation status
4. Identify breaking changes
5. Return compatibility assessment

**Example Usage:**
```javascript
const validation = await validateLibrary("react", "18.2.0");
// Returns:
{
  valid: true,
  library: {
    id: "react",
    name: "React",
    version: "18.2.0",
    latest: "18.3.0",
    deprecated: false
  },
  compatibility: {
    node: ">=14.0.0",
    typescript: ">=4.7.0",
    breaking_changes_from: "17.0.0"
  },
  documentation_url: "https://react.dev/",
  migration_guide: "https://react.dev/blog/2022/03/08/react-18-upgrade-guide"
}
```

### getBestPractices(technology)
Retrieves best practices and recommended patterns.

**Categories:**
```yaml
best_practices:
  architecture: "Structural patterns and organization"
  performance: "Optimization techniques"
  security: "Security considerations"
  testing: "Testing strategies"
  accessibility: "A11y requirements"
  deployment: "Production considerations"
```

**Example Output:**
```javascript
{
  technology: "react",
  practices: [
    {
      category: "architecture",
      title: "Component Composition",
      description: "Prefer composition over inheritance",
      example: "const Button = ({ children, ...props }) => <button {...props}>{children}</button>",
      documentation: "https://react.dev/learn/thinking-in-react"
    },
    {
      category: "performance",
      title: "Memoization",
      description: "Use React.memo for expensive components",
      example: "const MemoizedComponent = React.memo(ExpensiveComponent)",
      when_to_use: "Components with stable props that re-render frequently"
    }
  ]
}
```

### extractConstraints(library)
Identifies technical constraints and limitations.

**Constraint Types:**
- **Version Requirements**: Minimum/maximum supported versions
- **Dependency Conflicts**: Known incompatibilities
- **Performance Limits**: Rate limits, size restrictions
- **Platform Restrictions**: Browser/OS compatibility
- **License Constraints**: Usage restrictions

**Example:**
```javascript
{
  constraints: [
    {
      type: "version",
      description: "Requires Node.js 14 or higher",
      severity: "hard",
      mitigation: "Upgrade Node.js version"
    },
    {
      type: "dependency",
      description: "Incompatible with React 16",
      severity: "hard",
      mitigation: "Use React 17+ or find alternative library"
    },
    {
      type: "performance",
      description: "Bundle size impact: +45KB",
      severity: "soft",
      mitigation: "Consider lazy loading"
    }
  ]
}
```

### getImplementationExamples(library, useCase)
Retrieves code examples for specific use cases.

**Use Case Categories:**
```yaml
use_cases:
  basic_setup: "Minimal configuration"
  authentication: "Auth implementation"
  data_fetching: "API integration"
  state_management: "State handling"
  routing: "Navigation setup"
  testing: "Test configuration"
  production: "Production deployment"
```

**Example Response:**
```javascript
{
  library: "express",
  use_case: "authentication",
  examples: [
    {
      title: "JWT Authentication",
      description: "Implementing JWT-based authentication",
      code: `
const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};`,
      dependencies: ["jsonwebtoken"],
      documentation: "https://expressjs.com/en/advanced/best-practice-security.html"
    }
  ]
}
```

## MCP Integration

### Command Mappings
```yaml
mcp_commands:
  resolve_id: mcp__context7__resolve_library_id
  get_docs: mcp__context7__get_library_docs
  
parameters:
  library_id: "exact or fuzzy match"
  version: "specific or latest"
  topic: "specific documentation section"
  include_examples: true
```

### Library Resolution Process
```javascript
// Step 1: Resolve library ID
const libraryId = await mcp__context7__resolve_library_id({
  query: "React Router",
  fuzzy: true
});
// Returns: "react-router-dom"

// Step 2: Get documentation
const docs = await mcp__context7__get_library_docs({
  library: libraryId,
  version: "6.0.0",
  topic: "authentication"
});
```

## Validation Workflows

### Workflow 1: Technology Stack Validation
```javascript
async function validateTechStack(requirements) {
  const technologies = extractTechnologies(requirements);
  const validations = [];
  
  for (const tech of technologies) {
    const validation = await validateLibrary(tech.name, tech.version);
    
    // Check compatibility matrix
    const compatible = await checkCompatibility(tech, technologies);
    
    validations.push({
      technology: tech,
      valid: validation.valid,
      compatible: compatible,
      constraints: validation.constraints
    });
  }
  
  return {
    all_valid: validations.every(v => v.valid),
    compatibility_issues: validations.filter(v => !v.compatible),
    recommendations: generateRecommendations(validations)
  };
}
```

### Workflow 2: Best Practice Alignment
```javascript
async function checkBestPractices(requirement) {
  const practices = await getBestPractices(requirement.technology);
  
  const alignment = {
    followed: [],
    violations: [],
    recommendations: []
  };
  
  for (const practice of practices) {
    const isFollowed = checkPracticeAlignment(requirement, practice);
    
    if (isFollowed) {
      alignment.followed.push(practice);
    } else {
      alignment.violations.push(practice);
      alignment.recommendations.push({
        practice: practice.title,
        suggestion: practice.description,
        example: practice.example
      });
    }
  }
  
  return alignment;
}
```

### Workflow 3: Migration Path Analysis
```javascript
async function analyzeMigrationPath(current, target) {
  const currentDocs = await getLibraryDocs(current.library, current.version);
  const targetDocs = await getLibraryDocs(target.library, target.version);
  
  return {
    breaking_changes: identifyBreakingChanges(currentDocs, targetDocs),
    migration_steps: generateMigrationSteps(current, target),
    effort_estimate: calculateMigrationEffort(current, target),
    risks: assessMigrationRisks(current, target)
  };
}
```

## Output Integration

### Into metadata.json
```json
{
  "mcp_analysis": {
    "context7": {
      "timestamp": "2024-01-27T14:30:00Z",
      "libraries_validated": [
        {
          "name": "react",
          "version": "18.2.0",
          "valid": true,
          "constraints": []
        },
        {
          "name": "express",
          "version": "4.18.0",
          "valid": true,
          "constraints": [
            "Requires Node.js 14+"
          ]
        }
      ],
      "best_practices": [...],
      "compatibility_matrix": {...}
    }
  }
}
```

### Into 03-context-findings.md
```markdown
## Context7 Library Validation

### Validated Technologies
✅ **React 18.2.0** - Fully compatible
  - Latest stable version
  - No breaking changes from current
  - Recommended for production

✅ **Express 4.18.0** - Compatible with constraints
  - Requires Node.js 14 or higher
  - Security patches up to date
  - Migration guide available for v5

### Best Practices Applied
1. **Component Architecture**
   - Using functional components with hooks
   - Implementing proper error boundaries
   - Following composition patterns

2. **API Design**
   - RESTful conventions
   - Proper error handling
   - Rate limiting implemented

### Constraints & Considerations
- Node.js version must be 14.0.0 or higher
- Bundle size will increase by ~120KB
- Rate limiting required for production
```

## Performance Optimization

### Caching Strategy
```yaml
cache_layers:
  library_validation: 
    ttl: 3600  # 1 hour
    key: "{library}:{version}"
  
  best_practices:
    ttl: 7200  # 2 hours
    key: "{technology}:practices"
  
  documentation:
    ttl: 1800  # 30 minutes
    key: "{library}:{version}:{topic}"
```

### Batch Operations
```javascript
// Validate multiple libraries in parallel
const validations = await Promise.all(
  libraries.map(lib => validateLibrary(lib.name, lib.version))
);

// Batch documentation retrieval
const docs = await batchGetDocumentation(libraries);
```

## Error Handling

### Common Scenarios
1. **Library not found**: Suggest alternatives or fuzzy matches
2. **Version not available**: Use latest stable version
3. **Documentation timeout**: Use cached or fallback to web search
4. **Rate limiting**: Implement exponential backoff

### Fallback Strategies
```javascript
async function validateWithFallback(library) {
  try {
    return await context7Validate(library);
  } catch (error) {
    console.log(`Context7 failed, trying fallback for ${library}`);
    
    // Fallback 1: Check package.json
    const packageJson = await checkPackageJson(library);
    if (packageJson) return packageJson;
    
    // Fallback 2: Web search
    const webResults = await searchWebForLibrary(library);
    if (webResults) return webResults;
    
    // Fallback 3: Manual specification
    return requestManualSpecification(library);
  }
}
```

## Success Metrics

### Validation Accuracy
- Library resolution success: > 95%
- Version compatibility accuracy: > 90%
- Best practice relevance: > 85%
- Constraint detection: > 90%

### Performance Targets
- Library validation: < 1 second
- Documentation retrieval: < 2 seconds
- Best practice lookup: < 1.5 seconds
- Full stack validation: < 10 seconds

## Integration Examples

### Example 1: React Component Requirements
```javascript
const requirement = "Create a dashboard with real-time updates";

// Validate React and related libraries
const validation = await validateLibrary("react", "18.2.0");
const socketValidation = await validateLibrary("socket.io-client", "4.5.0");

// Get best practices for real-time React
const practices = await getBestPractices("react-realtime");

// Get implementation examples
const examples = await getImplementationExamples("react", "real-time-updates");
```

### Example 2: API Framework Selection
```javascript
// Compare frameworks
const express = await validateLibrary("express", "latest");
const fastify = await validateLibrary("fastify", "latest");
const koa = await validateLibrary("koa", "latest");

// Get comparative analysis
const comparison = await compareFrameworks([express, fastify, koa], {
  criteria: ["performance", "ecosystem", "learning_curve"]
});
```

## Future Enhancements

1. **Version Compatibility Matrix**: Automated compatibility checking across entire stack
2. **Security Advisory Integration**: Include security vulnerabilities in validation
3. **Performance Benchmarks**: Include performance data in library comparison
4. **Custom Documentation Sources**: Support private/internal documentation
5. **AI-Powered Recommendations**: Suggest optimal library combinations based on requirements