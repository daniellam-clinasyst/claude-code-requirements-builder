# Check Requirements Status (Opus 4.1 Enhanced)

Show current requirement gathering progress with smart context recap and continue.

## Instructions:

1. Read requirements/.current-requirement
2. If no active requirement:
   - Show message: "No active requirement gathering"
   - Suggest /requirements-start or /requirements-list
   - Exit

3. If active requirement exists:
   - Read metadata.json for current phase and progress
   - Show formatted status
   - Load appropriate question/answer files
   - Continue from last unanswered question

## Smart Context Recap Format:
```
📌 Quick recap: We're gathering requirements for **[feature description]**

You last worked on this [time] ago.
**Progress**: [Phase] - [X]/[Y] questions answered

[████░░░░░░░░] 33% (2/6 questions)

**Key Decisions So Far**:
  ✅ [Important decision 1]
  ✅ [Important decision 2]
  ✅ [Important decision 3]

**Implications**:
  ℹ️ [Technical implication based on answers]
  💡 [Suggestion based on patterns]

**Next Question** (Impact: [high/medium/low]):
  "[Question preview]"
  ([remaining] questions remaining)

💡 Tip: You can use natural language like "definitely" or "not really"
```

## Continuation Flow:
1. Read next unanswered question from file
2. Present with intelligent default from learning system
3. Accept natural language responses:
   - Positive: "yes", "y", "definitely", "sure", "👍"
   - Negative: "no", "n", "nope", "not really", "👎"
   - Uncertain: "idk", "maybe", "unsure", "depends"
   - Conditional: "yes, but only for X" → Generate follow-up
4. Update answer file
5. Update metadata progress
6. Move to next question or phase

## Phase Transitions:
- Discovery complete → Run context gathering → Generate detail questions
- Detail complete → Generate final requirements spec