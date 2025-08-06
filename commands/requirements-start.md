# Start Requirements Gathering (Opus 4.1 Enhanced)

Begin gathering requirements for: $ARGUMENTS

## 🚀 New Features
- **Natural Language**: Understands "yes", "definitely", "nope", conditional responses
- **Adaptive Questions**: 3-10 questions based on complexity (not fixed 5)
- **Smart Templates**: Use `--template auth|crud-api|dashboard` to skip common questions
- **Learning System**: Defaults improve from your team's patterns
- **Visual Progress**: Clear indicators throughout the process

## Full Workflow:

### Phase 0: Template & Complexity Analysis
0. Check for template flag: If `--template [name]` provided:
   - Load template from templates/[name].json
   - Pre-fill common answers
   - Skip to focus questions only
   - Show time saved

   Analyze complexity of $ARGUMENTS:
   - Simple (3-4 questions): "basic", "simple", "standard" keywords
   - Moderate (5-6 questions): "custom", "enhanced" keywords
   - Complex (7-10 questions): "enterprise", "comprehensive", "advanced" keywords
   
   Detect domain:
   - Authentication: "auth", "login", "sign" → auth-specific questions
   - API: "api", "endpoint", "rest" → API-specific questions
   - UI: "component", "ui", "interface" → UI-specific questions

### Phase 1: Initial Setup & Codebase Analysis
1. Create timestamp-based folder: requirements/YYYY-MM-DD-HHMM-[slug]
2. Extract slug from $ARGUMENTS (e.g., "add user profile" → "user-profile")
3. Create initial files:
   - 00-initial-request.md with the user's request
   - metadata.json with status tracking
4. Read and update requirements/.current-requirement with folder name
5. Use mcp__RepoPrompt__get_file_tree (if available) to understand overall structure:
   - Get high-level architecture overview
   - Identify main components and services
   - Understand technology stack
   - Note patterns and conventions

### Phase 2: Context Discovery Questions (Adaptive)
6. Generate adaptive number of questions based on complexity to understand the problem space:
   - Questions informed by codebase structure
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
     * Show progress: [████████░░] 80% (4/5 questions)
     * Impact indicator: (High/Medium/Low impact question)
   - Only after all questions are asked, record answers in 02-discovery-answers.md as received and update metadata.json. Not before.

### Phase 3: Targeted Context Gathering (Autonomous)
7. After all discovery questions answered:
   - Use mcp__RepoPrompt__search (if available) to find specific files based on discovery answers
   - Use mcp__RepoPrompt__set_selection and read_selected_files (if available) to batch read relevant code
   - Deep dive into similar features and patterns
   - Analyze specific implementation details
   - Use WebSearch and or context7 for best practices or library documentation
   - Document findings in 03-context-findings.md including:
     - Specific files that need modification
     - Exact patterns to follow
     - Similar features analyzed in detail
     - Technical constraints and considerations
     - Integration points identified

### Phase 4: Expert Requirements Questions (Context-Aware)
8. Now ask adaptive expert questions based on discovery answers:
   - Generate 3-7 questions based on complexity and gaps
   - Skip questions that don't apply based on previous answers
   - Example: Skip SSO if no role-based access needed to 04-detail-questions.md
   - Questions should be as if you were speaking to the product manager who knows nothing of the code
   - These questions are meant to to clarify expected system behavior now that you have a deep understanding of the code
   - Include smart defaults based on codebase patterns
   - Ask questions one at a time
   - Only after all questions are asked, record answers in 05-detail-answers.md as received

### Phase 5: Requirements Documentation
9. Generate comprehensive requirements spec in 06-requirements-spec.md:
   - Problem statement and solution overview
   - Functional requirements based on all answers
   - Technical requirements with specific file paths
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

## Metadata Structure:
```json
{
  "id": "feature-slug",
  "started": "ISO-8601-timestamp",
  "lastUpdated": "ISO-8601-timestamp",
  "status": "active",
  "phase": "discovery|context|detail|complete",
  "progress": {
    "discovery": { "answered": 0, "total": 5 },
    "detail": { "answered": 0, "total": 0 }
  },
  "contextFiles": ["paths/of/files/analyzed"],
  "relatedFeatures": ["similar features found"]
}
```

## Phase Transitions:
- After each phase, announce: "Phase complete. Starting [next phase]..."
- Save all work before moving to next phase
- User can check progress anytime with /requirements-status
