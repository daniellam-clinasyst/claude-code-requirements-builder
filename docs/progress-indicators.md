# Progress Indicator Implementation Guide

## Correct Progress Bar Scaling

### The Problem
When showing 33% with 10 blocks: [███░░░░░░░] looks wrong because 3/10 = 30%, not 33%

### The Solution
Use proper scaling for accurate visual representation:

```
For percentage P and bar width W:
filled_blocks = Math.round(P * W / 100)
```

## Accurate Progress Bars

### 10-Block Width (Each block = 10%)
```
  0% [░░░░░░░░░░]
 10% [█░░░░░░░░░]
 20% [██░░░░░░░░]
 30% [███░░░░░░░]
 33% [███░░░░░░░] (rounds to 30%)
 40% [████░░░░░░]
 50% [█████░░░░░]
 60% [██████░░░░]
 70% [███████░░░]
 80% [████████░░]
 90% [█████████░]
100% [██████████]
```

### 15-Block Width (Each block ≈ 6.67%)
```
  0% [░░░░░░░░░░░░░░░]
 20% [███░░░░░░░░░░░░]
 33% [█████░░░░░░░░░░] (5/15 = 33.3%)
 40% [██████░░░░░░░░░]
 50% [████████░░░░░░░]
 67% [██████████░░░░░]
 80% [████████████░░░]
100% [███████████████]
```

### 20-Block Width (Each block = 5%)
```
  0% [░░░░░░░░░░░░░░░░░░░░]
 25% [█████░░░░░░░░░░░░░░░]
 33% [███████░░░░░░░░░░░░░] (7/20 = 35%, closer)
 50% [██████████░░░░░░░░░░]
 75% [███████████████░░░░░]
100% [████████████████████]
```

## Recommended Implementation for Claude Code

### For Question Progress (e.g., 2/6 questions = 33%)

Use 12-block width for better granularity:
```
 0% (0/6) [░░░░░░░░░░░░]
17% (1/6) [██░░░░░░░░░░]
33% (2/6) [████░░░░░░░░]  ← Accurate!
50% (3/6) [██████░░░░░░]
67% (4/6) [████████░░░░]
83% (5/6) [██████████░░]
100% (6/6) [████████████]
```

### Alternative: Precise Fraction Display
```
Progress: ●●○○○○ 2/6 (33%)
Progress: ████░░░░░░░░ 2/6 questions
Progress: [===>      ] 33% (2 of 6)
```

### Enhanced Visual Indicators

#### Circular Progress
```
○○●●●● 2/6 questions answered
◉◉○○○○ 33% complete
⬤⬤⭘⭘⭘⭘ 2 of 6
```

#### Step Progress
```
[1]→[2]→[3]→[4]→[5]→[6]
 ✓   ✓   ○   ○   ○   ○   33% (2/6)
```

#### Emoji Progress
```
✅✅⏸️⏸️⏸️⏸️ 2/6 questions
🟢🟢⚪⚪⚪⚪ 33% complete
```

## Implementation in Commands

### Update for requirements-status.md:
```markdown
**Progress**: Discovery Phase - 2/6 questions answered

[████░░░░░░░░] 33% (2 of 6 questions)
```

### Update for requirements-current.md:
```markdown
Phase 2: Discovery Questions [████░░░░░░░░] 33% (2/6)
Phase 3: Context Gathering  [████████████] 100% ✅
Phase 4: Expert Questions    [░░░░░░░░░░░░] 0% (0/5)
```

## Calculation Function (Pseudo-code for Claude Code)

```
To display progress bar:
1. Calculate percentage: (current / total) * 100
2. Determine bar width (recommend 12 for questions, 20 for overall)
3. Calculate filled blocks: round(percentage * width / 100)
4. Generate bar: filled_char.repeat(filled) + empty_char.repeat(width - filled)
5. Display with context: [bar] percentage% (current/total)

Example for 2/6 questions:
- Percentage: 33.33%
- Bar width: 12
- Filled blocks: round(33.33 * 12 / 100) = 4
- Display: [████░░░░░░░░] 33% (2/6 questions)
```

## Best Practice for Claude Code

Use 12-block width for individual phases and 20-block for overall progress:

```
📊 Requirement Progress

Individual Phases (12 blocks each):
Discovery:  [████░░░░░░░░] 33% (2/6)
Expert:     [██████░░░░░░] 50% (3/6)
Context:    [████████████] 100% ✅

Overall Progress (20 blocks):
[███████░░░░░░░░░░░░░] 35% complete
```

This provides accurate visual representation where:
- Each block in 12-width = 8.33%
- Each block in 20-width = 5%
- Percentages align visually with actual progress