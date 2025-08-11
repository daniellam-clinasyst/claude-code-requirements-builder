# MCP Usage Guide for Requirements Builder

## What are MCPs?

MCP (Model Context Protocol) servers are specialized AI tools that extend Claude Code's capabilities. For requirements gathering, they provide:

- **Deeper Analysis**: Systematic decomposition of complex requirements
- **Technical Validation**: Verify library compatibility and best practices
- **Visual Prototyping**: Generate UI mockups and component specs
- **Test Generation**: Create comprehensive test scenarios

## Available MCP Servers

### 🧠 Sequential-Thinking
**Purpose**: Systematic analysis and problem decomposition

**Best for**:
- Complex, multi-component requirements
- Identifying hidden dependencies
- Risk assessment
- Generating targeted questions

**Auto-activates when**:
- Complexity score ≥ 0.7
- Keywords: "complex", "system", "enterprise", "workflow"
- Multiple integrated components detected

### 📚 Context7
**Purpose**: Library validation and documentation lookup

**Best for**:
- Validating technical feasibility
- Checking library compatibility
- Finding best practices
- Version conflict resolution

**Auto-activates when**:
- External libraries mentioned
- Framework-specific requirements
- API integrations needed

### 🎨 Magic
**Purpose**: UI component generation and prototyping

**Best for**:
- Creating visual mockups
- Generating component specifications
- Design system alignment
- Accessibility validation

**Auto-activates when**:
- UI/UX requirements detected
- Keywords: "component", "interface", "dashboard", "responsive"
- Frontend framework mentioned

### 🧪 Playwright
**Purpose**: Test scenario generation and validation

**Best for**:
- Creating acceptance criteria
- E2E test scenarios
- Performance benchmarks
- Cross-browser requirements

**Auto-activates when**:
- Testing requirements mentioned
- Performance criteria needed
- Validation scenarios required

## How to Use MCPs

### Automatic Mode (Recommended)
Let the system detect when to use MCPs:

```bash
# System auto-detects optimal MCPs
/requirements-start implement user authentication

# You'll see:
🧠 MCP Analysis: Sequential ✅ | Context7 ✅ | Magic ❌ | Playwright ✅
```

### Manual Control
Explicitly control MCP usage:

```bash
# Enable all MCPs
/requirements-start implement dashboard --mcp

# Enable specific MCPs
/requirements-start build API --mcp-sequential --mcp-context7

# Disable MCPs for speed
/requirements-start add simple feature --no-mcp
```

### Mid-Process Analysis
Analyze existing requirement with MCPs:

```bash
# Run all available analyses
/requirements-analyze

# Run specific analysis
/requirements-analyze --sequential
/requirements-analyze --context7
```

## Understanding MCP Output

### During Question Generation
```
🧠 Sequential identified 3 critical decision points
📚 Context7 validated React compatibility
```

### In Progress Display
```
📊 MCP Analysis Progress:
  Sequential-Thinking: [████████░░] 80%
  Context7: [██████████] 100% ✅
  Magic: [████░░░░░░] 40%
```

### In Final Requirements
```markdown
## MCP-Validated Technical Stack
- React 18.2.0 ✅ (Context7 validated)
- Express 4.18.0 ✅ (Requires Node 14+)

## Risk Assessment (Sequential-Thinking)
- HIGH: Authentication token storage
- MEDIUM: Session management complexity

## Test Scenarios (Playwright)
1. User login flow validation
2. Session timeout handling
3. Password reset process
```

## Best Practices

### 1. Let Auto-Detection Work
The system is smart about when to use MCPs:
- Simple features → No MCPs (faster)
- Complex systems → Multiple MCPs (comprehensive)

### 2. Use --mcp for Important Requirements
For critical features, explicitly enable all MCPs:
```bash
/requirements-start implement payment system --mcp
```

### 3. Leverage Context7 for Technical Decisions
When choosing libraries or frameworks:
```bash
/requirements-analyze --context7
```

### 4. Generate Prototypes for UI Work
For user-facing features, use Magic:
```bash
/requirements-analyze --magic
```

### 5. Define Tests Early with Playwright
For testable requirements:
```bash
/requirements-analyze --playwright
```

## Common Scenarios

### Scenario 1: Complex Backend System
```bash
/requirements-start implement microservice architecture

# Auto-enables:
# ✅ Sequential-Thinking (complexity)
# ✅ Context7 (framework validation)
# ✅ Playwright (integration tests)
```

### Scenario 2: UI Component Library
```bash
/requirements-start create design system

# Auto-enables:
# ✅ Magic (component generation)
# ✅ Context7 (framework patterns)
```

### Scenario 3: Simple CRUD Feature
```bash
/requirements-start add user profile field

# Auto-enables:
# None (keeps it fast and simple)
```

### Scenario 4: Performance-Critical Feature
```bash
/requirements-start optimize search performance --mcp

# Manually enables all for comprehensive analysis
```

## Interpreting MCP Insights

### Sequential-Thinking Insights
```
Component Breakdown:
- Shows how requirement splits into parts
- Identifies which parts are most complex
- Maps dependencies between components

Risk Assessment:
- Critical risks need immediate attention
- High risks should influence design
- Medium/Low risks to monitor
```

### Context7 Validations
```
✅ Green checks: Library is compatible
⚠️ Warnings: Constraints or considerations
❌ Red X: Incompatibility or not found

Version info shows minimum requirements
Best practices guide implementation
```

### Magic Prototypes
```
Component specifications define structure
Design tokens ensure consistency
Accessibility scores guide improvements
Responsive breakpoints show adaptability
```

### Playwright Scenarios
```
Test scenarios become acceptance criteria
Performance benchmarks set expectations
Cross-browser matrix defines support
E2E flows validate user journeys
```

## Troubleshooting

### MCP Not Available
```
⚠️ Sequential-Thinking not installed
```
**Solution**: MCPs are optional. System uses fallback analysis.

### MCP Timeout
```
⚠️ Context7 validation timed out
```
**Solution**: Retry with `/requirements-analyze --context7`

### MCP Conflicts
```
⚠️ Magic and current framework incompatible
```
**Solution**: Use manual specification instead of prototypes

### Performance Issues
```
MCP analysis taking too long...
```
**Solution**: Use `--no-mcp` for faster, simpler analysis

## Performance Impact

| Operation | Without MCPs | With MCPs |
|-----------|-------------|-----------|
| Simple requirement | 5-10 min | 8-12 min |
| Moderate requirement | 15-20 min | 18-25 min |
| Complex requirement | 30-40 min | 25-35 min* |

*Complex requirements are actually faster with MCPs due to better question targeting

## Advanced Usage

### Force Refresh Cache
```bash
/requirements-analyze --all --refresh
```

### Compare With/Without MCP
```bash
# First pass without
/requirements-start feature --no-mcp

# Later, add MCP analysis
/requirements-analyze --all
```

### Export MCP Analysis
```bash
# Creates detailed MCP report
/requirements-analyze --all --export
```

## Tips & Tricks

1. **Trust Auto-Detection**: The system is good at knowing when MCPs help
2. **Use for Complex Work**: MCPs shine on multi-component systems
3. **Context7 for Libraries**: Always validate external dependencies
4. **Sequential for Architecture**: Best for system design decisions
5. **Magic for Mockups**: Quickly visualize UI requirements
6. **Playwright for Testing**: Define acceptance criteria early

## When NOT to Use MCPs

- Very simple, straightforward requirements
- Time-critical gathering (use `--no-mcp`)
- When you already know the technical stack well
- For non-technical requirement updates

## Future Capabilities

Coming soon:
- Parallel MCP execution for speed
- Custom project-specific MCPs
- MCP learning from your patterns
- Cross-project MCP insights
- Real-time collaborative MCP analysis

## Getting Help

- Check MCP status: `/requirements-analyze --status`
- View MCP logs: Check `mcp-analysis.md` in requirement folder
- Report issues: Include MCP status in bug reports
- Get support: MCP output helps troubleshooting

Remember: MCPs are enhancement tools. The requirements builder works great with or without them!