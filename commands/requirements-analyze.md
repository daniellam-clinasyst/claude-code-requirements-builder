# Analyze Requirement with MCP Intelligence

Trigger MCP analysis for the current active requirement.

## Usage
```bash
/requirements-analyze [--sequential] [--context7] [--magic] [--playwright] [--all]
```

## Flags
- `--sequential` - Use Sequential-Thinking for decomposition and risk analysis
- `--context7` - Validate libraries and check best practices
- `--magic` - Generate UI component prototypes (for UI requirements)
- `--playwright` - Create test scenarios and acceptance criteria
- `--all` - Run all available MCP analyses (default if no flags specified)

## Workflow

### Step 1: Load Current Requirement
1. Read `requirements/.current-requirement` to get active requirement folder
2. Load `metadata.json` to check current phase and MCP status
3. Verify requirement is in appropriate phase (context or detail)

### Step 2: Detect Available MCPs
Check which MCP servers are available:
- Sequential-Thinking: `mcp__sequential_thinking__create_thought_stream`
- Context7: `mcp__context7__resolve_library_id`
- Magic: `mcp__magic__generate_ui_component`
- Playwright: `mcp__playwright__*`

Display status:
```
🧠 MCP Analysis Available:
  Sequential-Thinking: ✅
  Context7: ✅
  Magic: ❌ (not installed)
  Playwright: ✅
```

### Step 3: Run Selected Analyses

#### Sequential-Thinking Analysis
If `--sequential` or `--all`:
1. Create thought stream for requirement
2. Decompose into components
3. Map dependencies
4. Identify risks
5. Generate smart questions

Output:
```
🧠 Sequential-Thinking Analysis:
  ✅ Decomposed into 4 components
  ✅ Identified 3 dependencies
  ⚠️ Found 2 high-risk areas
  💡 Generated 5 targeted questions
```

#### Context7 Validation
If `--context7` or `--all`:
1. Extract mentioned technologies
2. Validate each library/framework
3. Check version compatibility
4. Retrieve best practices
5. Identify constraints

Output:
```
📚 Context7 Validation:
  ✅ React 18.2.0 - Compatible
  ✅ Express 4.18.0 - Compatible (requires Node 14+)
  ⚠️ Socket.io - Version conflict with existing
  📋 Retrieved 8 best practices
```

#### Magic UI Prototyping
If `--magic` or `--all` (and UI components detected):
1. Generate component specifications
2. Create design system alignment
3. Build interactive prototypes
4. Validate accessibility

Output:
```
🎨 Magic UI Generation:
  ✅ Generated 3 component prototypes
  ✅ Design system aligned
  ✅ Accessibility score: 94/100
  📱 Responsive breakpoints configured
```

#### Playwright Test Generation
If `--playwright` or `--all`:
1. Generate test scenarios
2. Create acceptance criteria
3. Define performance benchmarks
4. Build E2E test outlines

Output:
```
🧪 Playwright Test Scenarios:
  ✅ Generated 8 test scenarios
  ✅ Created 12 acceptance criteria
  ⚡ Performance targets defined
  🌐 Cross-browser test matrix ready
```

### Step 4: Update Metadata
Update `metadata.json` with MCP analysis results:
```json
{
  "mcp_analysis": {
    "sequential_thinking": {
      "timestamp": "2024-01-27T14:30:00Z",
      "completed": true,
      "insights": {...}
    },
    "context7": {
      "timestamp": "2024-01-27T14:31:00Z",
      "completed": true,
      "validations": {...}
    }
  }
}
```

### Step 5: Generate Analysis Report
Create or update `mcp-analysis.md` in requirement folder:

```markdown
# MCP Analysis Report

Generated: 2024-01-27 14:32:00

## Sequential-Thinking Insights
### Component Breakdown
1. Authentication Core (Complexity: 0.6)
2. Session Management (Complexity: 0.4)
3. SSO Integration (Complexity: 0.8)

### Risk Assessment
- HIGH: Token storage security
- MEDIUM: SSO provider compatibility

## Context7 Validation
### Technology Stack
- ✅ All libraries validated
- ⚠️ 1 version conflict found

### Best Practices
- Component composition recommended
- Use React.memo for performance

## Test Scenarios
1. User login flow
2. Session timeout handling
3. SSO redirect flow
```

### Step 6: Display Summary
Show analysis summary to user:
```
✨ MCP Analysis Complete!

📊 Analysis Coverage:
  Components analyzed: 4
  Libraries validated: 3
  Risks identified: 2
  Test scenarios: 8
  
💡 Key Insights:
  - SSO integration is highest complexity component
  - Socket.io version conflict needs resolution
  - 2 high-priority risks require mitigation
  
📁 Full report saved to: requirements/2024-01-27-1430-auth/mcp-analysis.md

Next: Continue with requirement gathering or use insights to refine questions
```

## Error Handling

### MCP Not Available
```
⚠️ Sequential-Thinking not available
   Using native analysis as fallback
```

### Analysis Timeout
```
⚠️ Context7 validation timed out
   Partial results saved, you can retry with:
   /requirements-analyze --context7
```

### Invalid Phase
```
❌ Cannot analyze - requirement not in valid phase
   Current phase: discovery
   Required phase: context or detail
   
   Complete discovery questions first
```

## Integration with Other Commands

### With /requirements-start
- Automatically triggered if `--mcp` flag used
- Runs after Phase 1 codebase analysis

### With /requirements-status
- Shows MCP analysis completion status
- Displays key insights inline

### With /requirements-current
- Includes MCP insights in detailed view
- Shows analysis timestamps

### With /requirements-end
- Incorporates all MCP findings into final spec
- Includes risk mitigation strategies
- Adds test scenarios to acceptance criteria

## Examples

### Analyze with all MCPs
```bash
/requirements-analyze --all
# or simply
/requirements-analyze
```

### Specific MCP analysis
```bash
# Just validate libraries
/requirements-analyze --context7

# Just decompose and assess risks
/requirements-analyze --sequential

# Generate UI prototypes
/requirements-analyze --magic
```

### Re-run failed analysis
```bash
# If Context7 timed out earlier
/requirements-analyze --context7
```

## Performance Considerations

- Sequential-Thinking: ~3-5 seconds
- Context7: ~2-3 seconds per library
- Magic: ~3-4 seconds per component
- Playwright: ~2-3 seconds for scenarios

Total time for `--all`: ~15-20 seconds

## Caching

Analysis results are cached for 30 minutes. To force refresh:
```bash
/requirements-analyze --all --refresh
```

## Future Enhancements

1. **Parallel Execution**: Run independent MCPs concurrently
2. **Incremental Analysis**: Only analyze changed portions
3. **Comparison Mode**: Compare before/after MCP insights
4. **Export Formats**: Export analysis to JSON, YAML, or PDF
5. **Custom MCP Integration**: Support for project-specific MCPs