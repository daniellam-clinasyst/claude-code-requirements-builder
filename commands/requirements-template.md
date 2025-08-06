# Load Requirements Template

Quick-start requirement gathering with pre-built templates.

## Usage
```
/requirements-template [template-name]
```

## Available Templates
- **auth** - User authentication system (8 questions pre-answered)
- **crud-api** - REST CRUD API (10 questions pre-answered)
- **dashboard** - Analytics dashboard (11 questions pre-answered)

## Execution

1. Load template from templates/[template-name].json
2. Show template overview:
   ```
   ✨ Using [Template Name]
   📋 Pre-answered [X] common questions based on best practices
   ⏱️ Time saved: [Y] minutes
   
   Pre-filled decisions:
   ✅ [Decision 1]
   ✅ [Decision 2]
   ✅ [Decision 3]
   
   Focus questions remaining:
   • [Question 1]
   • [Question 2]
   • [Question 3]
   ```

3. Create requirement folder with template data
4. Copy pre_answered questions to answer files
5. Skip to focus_questions only
6. Continue with normal flow but faster

## Template Benefits
- Skip 60-80% of questions
- Start with best practices
- Save 30-45 minutes per requirement
- Consistent architecture decisions
- Learn from proven patterns

## Creating Custom Templates
Save frequently used patterns:
1. Complete a requirement normally
2. Extract common answers
3. Create templates/custom-name.json
4. Share with team for consistency