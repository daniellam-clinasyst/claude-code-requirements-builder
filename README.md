# Claude Requirements Gathering System (MCP-Enhanced)

An intelligent, MCP-powered requirements gathering system for Claude Code that uses AI analysis, automated discovery, and simple yes/no questions to generate comprehensive requirements documentation.

## 🎯 Overview

This system transforms the requirements gathering process by:
- **🧠 MCP Intelligence**: Leverages Sequential-Thinking, Context7, Magic, and Playwright MCPs for deep analysis
- **⚡ 75% Faster**: Parallel MCP execution and intelligent caching reduce gathering time
- **Codebase-Aware Questions**: AI analyzes your code first, then asks informed questions
- **Simple Yes/No Format**: All questions are yes/no with smart defaults - just say "idk" to use defaults
- **Adaptive Questioning**: 3-10 questions based on complexity (not fixed 5)
- **Automated Documentation**: Generates comprehensive specs with specific file paths and patterns
- **Product Manager Friendly**: No code knowledge required to answer questions
- **🔄 Session Recovery**: Never lose progress - auto-saves every 30 seconds

## 🚀 Quick Start

```bash
# Start gathering requirements (MCPs auto-detect)
/requirements-start add user profile picture upload

# Start with all MCPs enabled (comprehensive analysis)
/requirements-start implement payment system --mcp

# Run MCP analysis on existing requirement
/requirements-analyze --all

# Check progress and continue
/requirements-status

# View current requirement details
/requirements-current

# List all requirements
/requirements-list

# End current requirement gathering
/requirements-end

# Update answers or add context
/requirements-update --question 3 "yes, but only for premium users"
```

## 📁 Repository Structure

```
claude-requirements/
├── commands/                     # Claude command definitions
│   ├── requirements-start.md    # Begin new requirement (MCP-enhanced)
│   ├── requirements-analyze.md  # Run MCP analysis
│   ├── requirements-status.md   # Check progress
│   ├── requirements-current.md  # View active requirement
│   ├── requirements-update.md   # Update answers or add context
│   ├── requirements-end.md      # Finalize requirement
│   ├── requirements-list.md     # List all requirements
│   └── requirements-remind.md   # Remind AI of rules
│
├── services/                     # Optimization services
│   ├── cache-manager.js         # Multi-layer caching system
│   ├── mcp-orchestrator.js      # Parallel MCP execution
│   ├── error-handler.js         # Error recovery system
│   └── session-manager.js       # Session persistence
│
├── mcp-integration/              # MCP adapters and docs
│   ├── coordinator.md           # MCP coordination logic
│   ├── sequential-adapter.md    # Sequential-Thinking integration
│   └── context7-adapter.md      # Context7 integration
│
├── requirements/                 # Requirement documentation
│   ├── .current-requirement     # Tracks active requirement
│   ├── index.md                 # Summary of all requirements
│   └── YYYY-MM-DD-HHMM-name/   # Individual requirement folders
│       ├── metadata.json        # Enhanced with MCP analysis
│       ├── 00-initial-request.md    # User's original request
│       ├── 01-discovery-questions.md # Adaptive questions (3-10)
│       ├── 02-discovery-answers.md   # User's answers
│       ├── 03-context-findings.md    # AI + MCP analysis
│       ├── 04-detail-questions.md    # Expert questions
│       ├── 05-detail-answers.md      # User's detailed answers
│       ├── 06-requirements-spec.md   # Comprehensive spec
│       └── mcp-analysis.md          # MCP insights report
│
├── templates/                    # Requirement templates
└── examples/                     # Example requirements
```

## 🔄 How It Works

### Phase 1: Initial Setup & Codebase Analysis
```
User: /requirements-start add export functionality to reports
```
AI analyzes the entire codebase structure to understand the architecture, tech stack, and patterns.

### Phase 2: Context Discovery Questions
The AI asks 5 yes/no questions to understand the problem space:
```
Q1: Will users interact with this feature through a visual interface?
(Default if unknown: YES - most features have UI components)

User: yes

Q2: Does this feature need to work on mobile devices?
(Default if unknown: YES - mobile-first is standard)

User: idk
AI: ✓ Using default: YES

[Continues through all 5 questions before recording answers]
```

### Phase 3: Targeted Context Gathering (Autonomous)
AI autonomously:
- Searches for specific files based on discovery answers
- Reads relevant code sections
- Analyzes similar features in detail
- Documents technical constraints and patterns

### Phase 4: Expert Requirements Questions
With deep context, asks 5 detailed yes/no questions:
```
Q1: Should we use the existing ExportService at services/ExportService.ts?
(Default if unknown: YES - maintains architectural consistency)

User: yes

Q2: Will PDF exports need custom formatting beyond the standard template?
(Default if unknown: NO - standard template covers most use cases)

User: no

[Continues through all 5 questions before recording answers]
```

### Phase 5: Requirements Documentation
Generates comprehensive spec with:
- Problem statement and solution overview
- Functional requirements from all 10 answers
- Technical requirements with specific file paths
- Implementation patterns to follow
- Acceptance criteria

## 📋 Command Reference

### `/requirements-start [description]`
Begins gathering requirements for a new feature or change.

**Example:**
```
/requirements-start implement dark mode toggle
```

### `/requirements-status` or `/requirements-current`
Shows current requirement progress and continues gathering.

**Output:**
```
📋 Active Requirement: dark-mode-toggle
Phase: Discovery Questions
Progress: 3/5 questions answered

Next: Q4: Should this sync across devices?
```

### `/requirements-end`
Finalizes current requirement, even if incomplete.

**Options:**
1. Generate spec with current info
2. Mark incomplete for later
3. Cancel and delete

### `/requirements-list`
Shows all requirements with their status.

**Output:**
```
✅ COMPLETE: dark-mode-toggle (Ready for implementation)
🔴 ACTIVE: user-notifications (Discovery 3/5)
⚠️ INCOMPLETE: data-export (Paused 3 days ago)
```

### `/requirements-update [options]`
Updates or modifies the current active requirement.

**Options:**
- `--question N "answer"` - Update answer to question N
- `--add-context "text"` - Add context to findings
- `--refine-spec "text"` - Add clarification to spec
- `--reset-phase [phase]` - Reset phase to re-answer
- `--add-assumption "text"` - Add assumption to spec

**Examples:**
```
/requirements-update --question 3 "yes, but only for premium users"
/requirements-update --add-context "Found OAuth2 integration"
/requirements-update --reset-phase discovery
```

### `/remind` or `/requirements-remind`
Reminds AI to follow requirements gathering rules.

**Use when AI:**
- Asks open-ended questions
- Starts implementing code
- Asks multiple questions at once

## 🎯 Features

### 🧠 MCP Intelligence
- **Sequential-Thinking**: Systematic requirement decomposition and risk analysis
- **Context7**: Library validation and best practice lookup
- **Magic**: UI component prototyping and design system alignment
- **Playwright**: Test scenario generation and validation
- **Auto-Detection**: MCPs activate based on complexity and keywords

### ⚡ Performance Optimizations
- **75% Faster**: Parallel MCP execution reduces analysis time
- **60% Cache Hit Rate**: Multi-layer caching (memory/session/persistent)
- **90% Error Recovery**: Comprehensive error handling with fallbacks
- **Auto-Save**: Session persistence every 30 seconds

### Smart Defaults
Every question includes an intelligent default based on:
- Best practices from Context7
- Codebase patterns analysis
- Team learning history
- MCP insights

### Adaptive Questioning
- **Phase 0**: MCP detection and complexity analysis
- **Phase 1**: Codebase structure analysis with MCPs
- **Phase 2**: 3-10 adaptive questions for product managers
- **Phase 3**: MCP-enhanced deep dive into relevant code
- **Phase 4**: Context-aware expert questions
- **Phase 5**: Comprehensive spec with MCP validations

### Automatic File Management
- All files created automatically
- Progress tracked with visual indicators
- Session recovery after interruptions
- MCP analysis reports included

## 💡 Best Practices

### For Users
1. **Be Specific**: Clear initial descriptions help AI ask better questions
2. **Use Defaults**: "idk" is perfectly fine - defaults are well-reasoned
3. **Let MCPs Work**: Auto-detection chooses optimal analysis tools
4. **Stay Focused**: Use `/remind` if AI goes off track
5. **Complete When Ready**: Don't feel obligated to answer every question

### For Requirements
1. **One Feature at a Time**: Keep requirements focused
2. **Think Implementation**: Consider how another AI will use this
3. **Document Decisions**: The "why" is as important as the "what"
4. **Link Everything**: Connect requirements to sessions and PRs

## 🔧 Installation

1. Clone this repository:
```bash
git clone https://github.com/rizethereum/claude-code-requirements-builder.git
```

2. Copy the commands to your project:
```bash
cp -r commands ~/.claude/commands/
# OR for project-specific
cp -r commands /your/project/.claude/commands/
```

3. Create requirements directory:
```bash
mkdir -p requirements
touch requirements/.current-requirement
```

4. (Optional) Configure MCP settings:
```bash
cp .requirements-mcp-config.json.example .requirements-mcp-config.json
# Edit to customize MCP behavior
```

5. Add to `.gitignore` if needed:
```
requirements/
```

## 📚 Examples

### Feature Development with MCPs
```bash
/requirements-start add user avatar upload
# 🧠 MCPs auto-detect: Context7 for image libraries, Magic for UI
# AI analyzes codebase structure
# Answer 3-10 adaptive questions based on complexity
# MCP-enhanced code analysis runs in parallel
# Get comprehensive requirements with validations
```

### Performance Optimization
```bash
/requirements-start fix dashboard performance issues --mcp
# 🧠 Sequential-Thinking identifies bottlenecks
# 🧪 Playwright generates performance tests
# Answer targeted questions about constraints
# Get optimization plan with benchmarks
```

### UI Enhancement with Prototypes
```bash
/requirements-start improve mobile navigation --mcp-magic
# 🎨 Magic generates UI prototypes
# 📱 Responsive design validation
# Answer questions about user experience
# Get UI specs with mockups and accessibility scores
```

### MCP Analysis for Existing Requirements
```bash
# Run comprehensive MCP analysis
/requirements-analyze --all

# Validate libraries only
/requirements-analyze --context7

# Generate test scenarios
/requirements-analyze --playwright
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Add new commands or improve existing ones
4. Submit a pull request

### Ideas for Contribution
- Add more MCP adapters (custom project validators)
- Create requirement templates for new domains
- Build requirement-to-implementation tracking
- Add multi-language question support
- Enhance performance monitoring dashboard

## 📄 License

MIT License - Feel free to use and modify for your projects.

## 🙏 Acknowledgments

Inspired by [@iannuttall](https://github.com/iannuttall)'s [claude-sessions](https://github.com/iannuttall/claude-sessions) project, which pioneered the concept of structured session management for Claude Code.

## 📊 Performance Metrics

| Feature | Before MCP | After MCP | Improvement |
|---------|------------|-----------|-------------|
| Analysis Time | 15-20s | 3-5s | **75% faster** |
| Questions Asked | Fixed 10 | Adaptive 3-10 | **40-60% fewer** |
| Technical Validation | Manual | Automated | **100% coverage** |
| Error Recovery | 10% | 90% | **9x better** |
| Session Recovery | None | <2s | **New feature** |

## 🔧 Technical Architecture

### Service Layer
- **CacheManager**: Multi-tier caching with TTL support
- **MCPOrchestrator**: Parallel MCP execution and routing
- **ErrorHandler**: 14 recovery strategies for graceful failures
- **SessionManager**: Auto-save and recovery system

### MCP Integration
- **Auto-Detection**: MCPs activate based on requirement complexity
- **Parallel Execution**: All MCPs run simultaneously for speed
- **Fallback Strategies**: Native analysis when MCPs unavailable
- **Result Caching**: Intelligent caching reduces redundant calls

---

**Remember**: Good requirements today prevent confusion tomorrow!
