# MCP Integration Test Guide

## Test Scenarios for MCP-Enhanced Requirements Builder

### Prerequisites
Ensure Claude Code has access to MCP servers:
- Sequential-Thinking MCP
- Context7 MCP  
- Magic MCP (optional)
- Playwright MCP (optional)

## Test 1: Basic MCP Detection

### Command
```bash
/requirements-start implement user authentication system
```

### Expected Behavior
1. System detects available MCPs
2. Shows MCP status: `🧠 MCP Analysis: Sequential ✅ | Context7 ✅ | Magic ❌ | Playwright ✅`
3. Auto-enables Sequential (complexity) and Context7 (auth libraries)
4. Proceeds with enhanced analysis

### Verification
- Check `metadata.json` for `mcp_enabled` field
- Verify MCP insights appear in questions

## Test 2: Manual MCP Control

### Command
```bash
/requirements-start build simple API endpoint --no-mcp
```

### Expected Behavior
1. MCPs disabled despite available
2. Uses traditional analysis only
3. Faster execution, simpler questions

### Verification
- `mcp_enabled` all set to false in metadata
- No MCP analysis sections in output

## Test 3: Specific MCP Usage

### Command
```bash
/requirements-start create dashboard component --mcp-magic --mcp-context7
```

### Expected Behavior
1. Only enables Magic and Context7
2. Magic generates UI prototypes
3. Context7 validates React/Vue/Angular

### Verification
- Only specified MCPs in metadata
- UI specifications in findings

## Test 4: Mid-Process Analysis

### Setup
```bash
# First, start a requirement without MCPs
/requirements-start add search feature --no-mcp
# Answer some questions
# Then analyze with MCPs
/requirements-analyze --all
```

### Expected Behavior
1. Initial gathering without MCP
2. `/requirements-analyze` adds MCP insights
3. Updates metadata with MCP analysis
4. Creates `mcp-analysis.md` file

### Verification
- Compare before/after metadata
- Check for mcp-analysis.md creation

## Test 5: Sequential-Thinking Deep Analysis

### Command
```bash
/requirements-start implement complex microservice architecture --mcp-sequential
```

### Expected Behavior
1. Sequential-Thinking activates
2. See decomposition: "🧠 Sequential identified 5 components"
3. Risk assessment appears
4. Dependency mapping shown
5. Questions target identified risks

### Sample Output
```
🧠 Sequential-Thinking Analysis:
  ✅ Decomposed into 5 components
  ✅ Identified 7 dependencies
  ⚠️ Found 3 high-risk areas
  💡 Generated 8 targeted questions
```

## Test 6: Context7 Library Validation

### Command
```bash
/requirements-start integrate Stripe payment processing --mcp-context7
```

### Expected Behavior
1. Context7 validates Stripe library
2. Shows version compatibility
3. Provides best practices
4. Identifies constraints

### Sample Output
```
📚 Context7 Validation:
  ✅ Stripe 12.0.0 - Compatible
  ✅ Node.js 18+ required
  📋 Retrieved 5 best practices
  ⚠️ PCI compliance constraints identified
```

## Test 7: Complex Requirement Full MCP

### Command
```bash
/requirements-start build real-time collaborative editor with authentication --mcp
```

### Expected Behavior
1. All available MCPs activate
2. Sequential: Breaks down into auth, editor, sync components
3. Context7: Validates WebSocket, auth libraries
4. Magic: Generates editor UI mockups (if available)
5. Playwright: Creates collaboration test scenarios

### Verification Timeline
```
Phase 0: MCP Detection [2s]
Phase 1: Codebase Analysis + Sequential [5s]
Phase 2: Discovery Questions (MCP-informed) [varies]
Phase 3: Context Gathering + Context7 [3s]
Phase 4: Expert Questions (MCP-refined) [varies]
Phase 5: Comprehensive spec with all MCP insights
```

## Test 8: MCP Cache Behavior

### Commands
```bash
# First run
/requirements-analyze --context7
# Immediate second run (should use cache)
/requirements-analyze --context7
# Force refresh
/requirements-analyze --context7 --refresh
```

### Expected Behavior
1. First run: ~2-3 seconds
2. Second run: <500ms (from cache)
3. Refresh: ~2-3 seconds (bypasses cache)

## Test 9: MCP Failure Handling

### Simulate Failure
```bash
# If MCP server is unavailable
/requirements-start complex feature --mcp
```

### Expected Behavior
1. Detects MCP unavailable
2. Shows: `⚠️ Sequential-Thinking not available, using fallback`
3. Continues with native analysis
4. Completes successfully without MCP

## Test 10: Template with MCP

### Command
```bash
/requirements-start implement login --template auth --mcp
```

### Expected Behavior
1. Loads auth template
2. Applies MCP analysis to template
3. Context7 validates auth libraries
4. Sequential analyzes remaining complexity
5. Skips pre-answered questions

## Validation Checklist

### Metadata Structure
✅ Check `metadata.json` contains:
```json
{
  "mcp_enabled": {
    "sequential_thinking": true/false,
    "context7": true/false,
    "magic": true/false,
    "playwright": true/false
  },
  "mcp_analysis": {
    "sequential_thinking": {...},
    "context7": {...}
  }
}
```

### File Generation
✅ Verify files created:
- `03-context-findings.md` includes MCP insights
- `mcp-analysis.md` (if `/requirements-analyze` used)
- `06-requirements-spec.md` includes MCP validations

### Question Quality
✅ Compare questions with/without MCP:
- MCP questions more targeted
- Fewer redundant questions
- Risk-focused priorities

### Performance Metrics
✅ Measure timing:
- MCP detection: <1s
- Sequential analysis: 3-5s
- Context7 validation: 2-3s per library
- Total overhead: 10-15s for full MCP

## Debugging

### Check MCP Availability
```javascript
// In Claude Code, check for functions:
mcp__sequential_thinking__create_thought_stream // Sequential
mcp__context7__resolve_library_id // Context7
mcp__magic__generate_ui_component // Magic
mcp__playwright__navigate // Playwright
```

### View MCP Config
```bash
cat .requirements-mcp-config.json
```

### Check Current Requirement MCP Status
```bash
cat requirements/[current]/metadata.json | grep mcp_enabled
```

### Force MCP Redetection
```bash
rm .requirements-mcp-config.json
/requirements-start test --mcp
```

## Expected Success Metrics

After MCP integration:
- 🎯 40-60% fewer questions needed
- ⚡ 30-50% faster for complex requirements
- 📊 85%+ technical validation accuracy
- 🧪 100% requirements with test scenarios
- 💡 3x more specific implementation guidance

## Common Issues

### Issue: MCPs not auto-activating
**Solution**: Check complexity keywords and thresholds in config

### Issue: MCP analysis too slow
**Solution**: Use specific MCPs instead of --all

### Issue: Cache not working
**Solution**: Check cache TTL settings in config

### Issue: Questions not reflecting MCP insights
**Solution**: Ensure MCP analysis completes before question generation

## Report Results

After testing, document:
1. Which MCPs were available
2. Activation success rate
3. Performance impact
4. Question quality improvement
5. Any errors or timeouts
6. User experience feedback

This validates the MCP integration is working correctly!