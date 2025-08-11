# Start Requirements Gathering (MCP-Enhanced Edition)

Begin gathering requirements for: $ARGUMENTS

## 🚀 New Features
- **Natural Language**: Understands "yes", "definitely", "nope", conditional responses
- **Adaptive Questions**: 3-10 questions based on complexity (not fixed 5)
- **Smart Templates**: Use `--template auth|crud-api|dashboard` to skip common questions
- **Learning System**: Defaults improve from your team's patterns
- **Visual Progress**: Clear indicators throughout the process
- **🧠 MCP Intelligence**: Leverage Claude Code MCPs for deeper analysis

## 🎯 MCP Flags (Optional)
- `--mcp` - Enable all available MCP servers (recommended for complex requirements)
- `--mcp-sequential` - Use Sequential-Thinking for systematic analysis
- `--mcp-context7` - Use Context7 for library/framework validation
- `--mcp-magic` - Use Magic for UI component prototyping
- `--mcp-playwright` - Use Playwright for test scenario generation
- `--no-mcp` - Disable all MCP servers (faster but less comprehensive)
- `--mcp-auto` - Auto-detect optimal MCPs based on requirement (default)

## Full Workflow:

### Phase 0: MCP Detection & Complexity Analysis
0. MCP Server Detection & Configuration:
   - Load .requirements-mcp-config.json if exists
   - Check which MCP servers are available:
     * mcp__sequential_thinking__create_thought_stream (Sequential-Thinking)
     * mcp__context7__resolve_library_id & get_library_docs (Context7)
     * mcp__magic__generate_ui_component (Magic)
     * mcp__playwright__* (Playwright)
   - Auto-enable MCPs based on complexity and keywords (unless --no-mcp)
   - Display MCP status: "🧠 MCP Analysis: Sequential ✅ | Context7 ✅ | Magic ❌ | Playwright ✅"

   Check for template flag: If `--template [name]` provided:
   - Load template from templates/[name].json
   - Pre-fill common answers
   - Skip to focus questions only
   - Show time saved

   Analyze complexity of $ARGUMENTS:
   - Simple (3-4 questions): "basic", "simple", "standard" keywords
   - Moderate (5-6 questions): "custom", "enhanced" keywords
   - Complex (7-10 questions): "enterprise", "comprehensive", "advanced" keywords
   - If complexity >= 0.7 and Sequential-Thinking available → Enable for deep analysis
   
   Detect domain and auto-enable relevant MCPs:
   - Authentication: "auth", "login", "sign" → auth-specific questions + Context7 for auth libraries
   - API: "api", "endpoint", "rest" → API-specific questions + Context7 for frameworks
   - UI: "component", "ui", "interface" → UI-specific questions + Magic for prototypes

### Phase 1: Initial Setup & MCP-Enhanced Codebase Analysis
1. Create timestamp-based folder: requirements/YYYY-MM-DD-HHMM-[slug]
   - IMPORTANT: Use the ACTUAL current date and time from your environment
   - Format: Current year-month-day-hourminute (e.g., 2025-08-08-1445 for August 8, 2025 at 2:45 PM)
   - Month should be 01-12 (01=January, 08=August, 12=December)
   - Use 24-hour format for time (0000-2359)
2. Extract slug from $ARGUMENTS (e.g., "add user profile" → "user-profile")
3. Create initial files:
   - 00-initial-request.md with the user's request
   - metadata.json with status tracking
4. Read and update requirements/.current-requirement with folder name
5. Enhanced codebase analysis with MCPs:
   - Use mcp__RepoPrompt__get_file_tree (if available) for structure
   - If Sequential-Thinking enabled:
     * Use mcp__sequential_thinking__create_thought_stream to systematically analyze the requirement
     * Break down into components and identify dependencies
     * Assess complexity and risks
   - If Context7 enabled:
     * Extract mentioned technologies/libraries from description
     * Pre-validate feasibility with mcp__context7__resolve_library_id
   - Document MCP insights in metadata.json under 'mcp_analysis' field

### Phase 2: MCP-Powered Context Discovery Questions
6. Generate adaptive questions with MCP intelligence:
   - If Sequential-Thinking enabled:
     * Use thought stream to identify knowledge gaps
     * Generate targeted questions based on decomposition
     * Prioritize by impact and dependencies
   - If Context7 enabled:
     * Skip questions about validated libraries
     * Add questions about configuration options
   - Questions informed by both codebase structure AND MCP analysis
   - Show MCP contribution: "🧠 Sequential identified 3 critical decision points"
   - Questions about user interactions and workflows
   - Questions about similar features users currently use
   - Questions about data/content being worked with
   - Questions about external integrations or third-party services
   - Questions about performance or scale expectations
   - Write questions to 01-discovery-questions.md with intelligent defaults
   - Load learning from .requirements-config.json if exists
   - Adjust defaults based on >75% team preference
   - Accept natural language: "yes", "y", "yeah", "definitely", "sure", "👍"
   - Accept negative: "no", "n", "nope", "not really", "never", "👎"
   - Handle conditionals: "yes, but only for X" → record condition + follow-up
   - Begin asking questions one at a time with:
     * Smart default based on learning + context
     * Show progress: [████░░░░░░░░] 33% (2/6 questions)
     * Impact indicator: (High/Medium/Low impact question)
   - Only after all questions are asked, record answers in 02-discovery-answers.md as received and update metadata.json. Not before.

### Phase 3: MCP-Enhanced Targeted Context Gathering
7. After all discovery questions answered, leverage MCPs for deep analysis:
   - Use mcp__RepoPrompt__search (if available) to find specific files
   - If Sequential-Thinking enabled:
     * Create thought stream for implementation strategy
     * Map dependencies and integration points
     * Identify potential risks and blockers
   - If Context7 enabled:
     * Validate all mentioned libraries with mcp__context7__get_library_docs
     * Gather best practices and constraints
     * Check version compatibility and deprecations
   - If Magic enabled (for UI requirements):
     * Generate initial component specifications
     * Create design system alignment notes
   - Deep dive into similar features and patterns
   - Analyze specific implementation details
   - Document findings in 03-context-findings.md including:
     - Specific files that need modification
     - Exact patterns to follow
     - Similar features analyzed in detail
     - Technical constraints and considerations
     - Integration points identified
     - **MCP Insights Section**:
       * Sequential-Thinking: Component breakdown, risks, dependencies
       * Context7: Library validations, best practices, constraints
       * Magic: UI specifications, design tokens (if applicable)
       * Playwright: Test scenarios outline (if applicable)

### Phase 4: MCP-Informed Expert Requirements Questions
8. Generate expert questions enhanced by MCP analysis:
   - If Sequential-Thinking enabled:
     * Questions address identified risks and dependencies
     * Focus on critical decision points from decomposition
   - If Context7 enabled:
     * Questions about library-specific configuration
     * Validate architectural alignment with best practices
   - If Magic enabled:
     * Questions about design system preferences
     * Component interaction patterns
   - Generate 3-7 questions based on complexity, gaps, and MCP insights
   - Skip questions already answered by MCP validation
   - Example: Skip library choice if Context7 validated compatibility
   - Questions should be as if you were speaking to the product manager who knows nothing of the code
   - These questions are meant to to clarify expected system behavior now that you have a deep understanding of the code
   - Include smart defaults based on codebase patterns
   - Ask questions one at a time
   - Only after all questions are asked, record answers in 05-detail-answers.md as received

### Phase 5: MCP-Comprehensive Requirements Documentation
9. Generate MCP-enhanced requirements spec in 06-requirements-spec.md:
   - Problem statement and solution overview
   - Functional requirements based on all answers
   - Technical requirements with specific file paths
   - **MCP-Validated Technical Stack**:
     * Libraries validated by Context7 with versions
     * Architectural patterns from Sequential-Thinking
     * UI components specified by Magic (if applicable)
   - **Risk Assessment** (from Sequential-Thinking):
     * Technical risks and mitigation strategies
     * Dependencies and integration points
   - **Test Scenarios** (from Playwright if enabled):
     * Acceptance test outlines
     * Performance benchmarks
   - Implementation hints and patterns to follow
   - Acceptance criteria
   - Assumptions for any unanswered questions

## Question Formats:

### Discovery Questions (Phase 2):
```
## Q1: Will users interact with this feature through a visual interface?
**Default if unknown:** Yes (most features have some UI component)

## Q2: Does this feature need to work on mobile devices?
**Default if unknown:** Yes (mobile-first is standard practice)

## Q3: Will this feature handle sensitive or private user data?
**Default if unknown:** Yes (better to be secure by default)

## Q4: Do users currently have a workaround for this problem?
**Default if unknown:** No (assuming this solves a new need)

## Q5: Will this feature need to work offline?
**Default if unknown:** No (most features require connectivity)
```

### Expert Questions (Phase 4):
```
## Q7: Should we extend the existing UserService at services/UserService.ts?
**Default if unknown:** Yes (maintains architectural consistency)

## Q8: Will this require new database migrations in db/migrations/?
**Default if unknown:** No (based on similar features not requiring schema changes)
```

## Important Rules:
- ONLY yes/no questions with smart defaults
- ONE question at a time
- Write ALL questions to file BEFORE asking any
- Stay focused on requirements (no implementation)
- Use actual file paths and component names in detail phase
- Document WHY each default makes sense
- Use tools available if recommended ones aren't installed or available

## Enhanced Metadata Structure with MCP:
```json
{
  "id": "feature-slug",
  "started": "ISO-8601-timestamp",
  "lastUpdated": "ISO-8601-timestamp",
  "status": "active",
  "phase": "discovery|context|detail|complete",
  "complexity_score": 0.0,
  "mcp_enabled": {
    "sequential_thinking": false,
    "context7": false,
    "magic": false,
    "playwright": false
  },
  "progress": {
    "discovery": { "answered": 0, "total": 5 },
    "detail": { "answered": 0, "total": 0 }
  },
  "mcp_analysis": {
    "sequential_thinking": {
      "timestamp": null,
      "decomposition": [],
      "dependencies": {},
      "risks": [],
      "confidence": 0
    },
    "context7": {
      "timestamp": null,
      "libraries_validated": [],
      "best_practices": [],
      "constraints": []
    },
    "magic": {
      "timestamp": null,
      "prototypes": [],
      "components": [],
      "design_tokens": []
    },
    "playwright": {
      "timestamp": null,
      "test_scenarios": [],
      "performance_metrics": {},
      "accessibility_score": null
    }
  },
  "contextFiles": ["paths/of/files/analyzed"],
  "relatedFeatures": ["similar features found"]
}
```

## Phase Transitions:
- After each phase, announce: "Phase complete. Starting [next phase]..."
- Save all work before moving to next phase
- User can check progress anytime with /requirements-status
