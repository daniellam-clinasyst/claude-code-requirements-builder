# Update Current Requirement (Opus 4.1 Enhanced)

Update or modify the current active requirement's specifications and answers.

## Instructions:

1. Read requirements/.current-requirement to identify active requirement
2. If no active requirement:
   - Show "No active requirement to update"
   - Suggest starting a new requirement with /requirements-start
   - Exit

3. Parse update arguments:
   - `--question N "new answer"` - Update answer to question N
   - `--add-context "additional context"` - Add context to findings
   - `--refine-spec "clarification"` - Add clarification to requirements spec
   - `--reset-phase [discovery|detail]` - Reset a phase to re-answer questions
   - `--add-assumption "assumption text"` - Add assumption to spec
   - `--remove-assumption N` - Remove assumption N from spec

## Update Modes:

### Update Answer Mode
```
/requirements-update --question 3 "yes, but only for premium users"
```
- Locate question 3 in appropriate phase file
- Update answer in corresponding answers file
- Mark metadata as updated with timestamp
- If answer changes core assumptions, flag for review
- Show before/after comparison

### Add Context Mode
```
/requirements-update --add-context "Found that AuthService also handles OAuth2"
```
- Append to 03-context-findings.md
- Update metadata with new context files if mentioned
- Highlight how this affects requirements

### Refine Spec Mode
```
/requirements-update --refine-spec "Should also support bulk operations"
```
- Add clarification section to 06-requirements-spec.md
- Update acceptance criteria if needed
- Mark as refined in metadata

### Reset Phase Mode
```
/requirements-update --reset-phase discovery
```
- Clear answers for specified phase
- Reset progress counters in metadata
- Prompt to continue with /requirements-status

### Manage Assumptions Mode
```
/requirements-update --add-assumption "Users will have modern browsers"
/requirements-update --remove-assumption 2
```
- Update assumptions section in requirements spec
- Track assumption changes in metadata
- Validate assumptions don't conflict

## Visual Feedback:

```
📝 Updating Requirement: user-authentication

✏️  Update Type: Answer Modification
📍 Location: Discovery Phase, Question 3

Before:
Q3: Will this handle sensitive data? NO

After:
Q3: Will this handle sensitive data? YES, but only for premium users

⚠️  Impact Analysis:
- Security requirements will be updated
- Additional encryption may be needed
- Compliance checks required

✅ Update successful!
💡 Recommendation: Review security questions in detail phase
```

## Validation Rules:

1. Cannot update non-existent questions
2. Cannot add context without active requirement
3. Cannot refine spec before it's generated
4. Reset phase requires confirmation for data loss
5. Assumptions must be specific and testable

## File Updates:

When updating, modify these files:
- metadata.json - Update lastUpdated timestamp and phase status
- Corresponding answer files (02-discovery-answers.md or 05-detail-answers.md)
- 03-context-findings.md for context additions
- 06-requirements-spec.md for spec refinements
- Track all changes with timestamps in metadata

## Cascade Effects:

After updates, check for:
- Conflicting answers that need resolution
- Requirements that may need adjustment
- New questions that should be asked
- Context that invalidates previous assumptions

## Important Notes:
- All updates are tracked with timestamps
- Previous values are preserved in metadata history
- Major changes trigger re-evaluation prompts
- Use /requirements-current to view updated state
- Use /requirements-status to continue gathering