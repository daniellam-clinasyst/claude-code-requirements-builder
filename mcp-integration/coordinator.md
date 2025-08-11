# MCP Coordinator Module

This module orchestrates all MCP server interactions for the requirements builder.

## Core Functions

### detectAvailableMCPs()
Checks which MCP servers are available in the current Claude Code session.

**Detection Methods:**
- Sequential-Thinking: Check for `mcp__sequential_thinking__create_thought_stream`
- Context7: Check for `mcp__context7__resolve_library_id` and `mcp__context7__get_library_docs`
- Magic: Check for `mcp__magic__generate_ui_component`
- Playwright: Check for `mcp__playwright__*` functions

### analyzeComplexity(description)
Analyzes requirement complexity to determine MCP activation.

**Complexity Scoring:**
```yaml
factors:
  keyword_analysis: 0.3
  component_count: 0.2
  integration_count: 0.2
  domain_complexity: 0.2
  scale_indicators: 0.1

thresholds:
  simple: [0, 0.3]
  moderate: [0.3, 0.7]
  complex: [0.7, 1.0]
```

### routeToOptimalMCP(task)
Routes tasks to the most appropriate MCP server.

**Routing Matrix:**
```yaml
task_types:
  decomposition: sequential_thinking
  library_validation: context7
  ui_prototyping: magic
  test_generation: playwright
  
fallback_strategy:
  sequential_thinking: native_analysis
  context7: web_search
  magic: manual_specification
  playwright: manual_test_creation
```

### orchestrateWorkflow(requirement)
Coordinates multiple MCPs for comprehensive analysis.

**Workflow Phases:**
1. **Analysis Phase**: Sequential-Thinking decomposes requirement
2. **Validation Phase**: Context7 validates technical feasibility
3. **Design Phase**: Magic generates UI prototypes (if applicable)
4. **Testing Phase**: Playwright creates test scenarios
5. **Synthesis Phase**: Combine all MCP outputs into unified spec

## MCP Server Adapters

### Sequential-Thinking Adapter
```yaml
capabilities:
  - requirement_decomposition
  - dependency_mapping
  - risk_assessment
  - smart_question_generation

usage:
  trigger: complexity >= 0.7 OR explicit_flag
  commands:
    - mcp__sequential_thinking__create_thought_stream
    - mcp__sequential_thinking__add_thought
    - mcp__sequential_thinking__get_thoughts
```

### Context7 Adapter
```yaml
capabilities:
  - library_validation
  - best_practice_lookup
  - constraint_detection
  - documentation_retrieval

usage:
  trigger: library_mentions OR framework_detection
  commands:
    - mcp__context7__resolve_library_id
    - mcp__context7__get_library_docs
```

### Magic Adapter
```yaml
capabilities:
  - component_generation
  - prototype_creation
  - design_system_compliance
  - accessibility_validation

usage:
  trigger: ui_components OR design_requirements
  commands:
    - mcp__magic__generate_ui_component
```

### Playwright Adapter
```yaml
capabilities:
  - test_scenario_generation
  - performance_testing
  - cross_browser_validation
  - accessibility_testing

usage:
  trigger: testing_requirements OR validation_needs
  commands:
    - mcp__playwright__navigate
    - mcp__playwright__screenshot
    - mcp__playwright__click
```

## Cache Strategy

### Cache Layers
1. **MCP Response Cache**: Store raw MCP responses (TTL: 30 min)
2. **Analysis Cache**: Store processed analysis (TTL: 1 hour)
3. **Validation Cache**: Store validation results (TTL: 2 hours)
4. **Session Cache**: Persist across requirement sessions

### Cache Keys
```yaml
pattern: {mcp_server}:{operation}:{hash(input)}
examples:
  - sequential:decompose:a3f4d5
  - context7:validate:react:18.2.0
  - magic:prototype:user-profile-component
```

## Error Handling

### Retry Strategy
```yaml
retry_config:
  max_attempts: 2
  delay: 1000ms
  backoff: exponential
  
failure_modes:
  timeout: fallback_to_native
  error: log_and_continue
  unavailable: skip_mcp_features
```

### Graceful Degradation
1. MCP unavailable → Use native Claude Code capabilities
2. MCP timeout → Cache partial results, continue with available data
3. MCP error → Log, notify user, provide manual alternative

## Integration Points

### With requirements-start.md
- Called in Phase 0 for MCP detection
- Called in Phase 1 for complexity analysis
- Called throughout for MCP orchestration

### With metadata.json
- Updates `mcp_enabled` field
- Populates `mcp_analysis` section
- Tracks MCP usage statistics

### With learning system
- Records successful MCP patterns
- Adjusts auto-activation thresholds
- Improves routing decisions

## Usage Examples

### Basic MCP Detection
```javascript
// At start of requirements gathering
const availableMCPs = detectAvailableMCPs();
console.log(`🧠 MCP Status: Sequential ${availableMCPs.sequential ? '✅' : '❌'}`);
```

### Complexity-Based Activation
```javascript
const complexity = analyzeComplexity(description);
if (complexity >= 0.7 && availableMCPs.sequential) {
  enableMCP('sequential_thinking');
}
```

### Full Orchestration
```javascript
const requirement = {
  description: "Build a real-time dashboard with user authentication",
  flags: { mcp: true }
};

const result = await orchestrateWorkflow(requirement);
// Result contains insights from all relevant MCPs
```

## Performance Metrics

### Target Metrics
- MCP detection: < 100ms
- Complexity analysis: < 200ms
- Single MCP call: < 3s
- Full orchestration: < 15s
- Cache hit rate: > 60%

### Monitoring
- Track MCP success rates
- Monitor response times
- Log fallback frequency
- Measure user satisfaction

## Future Enhancements

1. **Custom MCP Servers**: Support for project-specific MCPs
2. **Parallel Execution**: Run independent MCPs concurrently
3. **Smart Caching**: ML-based cache invalidation
4. **MCP Chaining**: Sequential MCP operations with data flow
5. **User Preferences**: Remember MCP preferences per project