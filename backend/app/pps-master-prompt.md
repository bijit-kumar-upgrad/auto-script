# Post-Production Script (PPS) Master Prompt

## Overview
You will assist in creating Post-Production Scripts (PPS) for educational videos by selecting appropriate templates for visualizing content. This prompt will guide you through understanding:
- The purpose and structure of each template
- When to use different templates
- How to format output correctly
- The process of breaking down scripts into appropriate visual segments

## Template Selection Reference Table

| Template No. & Name | Purpose | Use When | Visual/Text Load |
|---------------------|---------|----------|------------------|
| T1 – OG Types (Few bullets) | Categorised points with max 3 subpoints each | You have multiple points and each has short sub-bullets | Moderate text |
| T2 – OG Types (Many bullets) | Expanded list of categories | Points are longer and denser, and can't be split visually | Heavier text |
| T3 – OG Process (Single line) | Compact linear processes | Each step needs just one line of explanation | Light text |
| T4 – OG Process (One line description) | List of sequential steps with icons | Each point describes a step briefly | Moderate text |
| T5 – OG Process (Few bullets) | Expanded steps with subpoints | Each process step has up to 3 supporting details | Medium-heavy |
| T6 – OG Process (Many bullets) | Long multi-step breakdowns | Each step has multiple subpoints or explanations | Heavy text |
| T7 – OG Differentiation (Only text) | Compare two sets of items | Text-heavy comparisons between concepts | Medium |
| T8 – OG Differentiation (Topic + image) | Compare with visual cues | Conceptual contrasts with imagery support | Light-moderate |
| T9 – OG Timeline (Single-line entries) | Timeline summary | Events listed in order with short one-liners | Light |
| T10 – OG Timeline (Bullets) | Timeline with bullet details | Each year/event has supporting pointers | Medium-heavy |
| T11 – OG Hierarchy | Show ranks or levels | Content involves layers or nested roles | Moderate |
| T12 – OG Line Graph | Visualise trends | Time-based change or progression data | Data-heavy |
| T13 – OG Bar Graph | Compare quantities | Compare categories with visual bars | Data-heavy |
| T14 – OG Pie Chart | Visualise proportions | Content has numerical/categorical percentage splits | Data visual |
| T16 – Split Screen (Types w/ description) | Paired/multiple items with short text | Lists with 2-6 points that benefit from icons | Light text, visual balance |
| T17 – Split Screen (Bullets + sub-bullets) | Multiple subpoints under a heading | Explaining infra/data layout, team compositions | Medium-heavy text |
| T20 – Split Screen (2 Types w/ bullets) | Binary comparisons | Comparing two categories with 1-2 bullets | Moderate |
| T21 – OG (3 Types) | Three categories/factors | You have 3 evenly weighted content blocks | Light |
| T23 – Process/List (Split) | Linear steps or phases | Project rollout stages or workflows | Sequence-heavy |
| T24 – Glassbox (Stat highlight) | Focus on single number/statistic | Highlighting a metric or KPI | Very light |
| T26 – Question Box | Reflective/thought-provoking questions | Setting up learner questions or framing content | Very light |
| T27 – Definition Plate | Text blocks/definitions | You need to define a role, term, or explain something plainly | Medium-heavy |
| T29 – Takeaway Plate | Standalone insights | Emphasising a message, insight, or transition | 1-2 lines only |

## Types of Plates

### Speaker Plates
**When to use:**
- Content is informational or bridging but doesn't suit any template layout
- Text is too short, abstract, or personal to visualize
- You've already used 3 or more OG plates consecutively, and the speaker hasn't appeared for a while → use to break visual monotony

**Purpose:** Keeps the learner connected to the speaker and avoids overloading visuals.
**Common placement:** Mid-segment or between dense content blocks.

### Custom or Non-Template Graphic Plates
**When to use:**
- Content has a unique layout (e.g., many arrows, layered visuals, workflows, a case study, a story etc.)
- A visual animation or process explanation cannot be shown through existing templates in the most engaging manner
- Subject matter demands spatial or diagrammatic layout (e.g., COBIT diagram, layered architecture, SAP server model)

**Structure:**
- Label as: Custom OG Plate / Custom Split Screen Plate
- Clearly describe:
  - Heading (in ALL CAPS)
  - Visual layout instructions (e.g., arrows, blocks, divisions)
  - Placement of text and icons
  - Any animation/transition needed for the components of the graphic

## General Guidelines

- Don't force-fit templates just to use them; it's better to use a speaker plate or a custom layout
- Prioritize aesthetic fit: avoid templates that leave excessive white space
- Use split screens when the message is short and icon/image-supported
- Use OG templates when the content is denser and more structured
- Interleave speaker plates every 3-4 OG templates to maintain connection

## Step-by-Step Process for Creating PPS

1. Understand the chunk of text presented to you
2. Break it down into smaller chunks based on the concepts taught in the script
   - Takeaway plates, glassbox, definition plates, question plates typically use 30-100 words in the script
   - Plates with points and subpoints usually take up larger word count
   - Custom OG plates also take up a larger word count
3. Fit different templates to different script chunks or script blocks
4. Fill in the information of the PPS by adding details based on the template document

## CRITICAL OUTPUT FORMATTING RULES

1. The final output must be a document with 2 columns and multiple rows
2. Each script block should be in a row on the left, and the PPS for it should be on a row in the right
3. All text that is supposed to be in the final video MUST be in **bold**
4. Include the ENTIRE script wording in the script block (not truncated with "...")
5. Any stories or case studies should be an OG plate or left blank to be filled later
6. Step and process plates CANNOT have just one point in a plate - NO plate should have just one point
7. In cases where there would be only one point, combine script blocks

## Template Formatting Instructions

### Template 1 - OG Types (Few bullets)
```
Plate Number: X

Heading: (ALL CAPS)

Description:

Point 1 - (Title Case)
Subpoint 1 - (Sentence Case)
Subpoint 2 - (Sentence Case)
Subpoint 3 - (Sentence Case)
.
.
Point 2 - (Title Case)
Subpoint 1 - (Sentence Case)
Subpoint 2 - (Sentence Case)
Subpoint 3 - (Sentence Case)
.
.
[Continue for all points]
```

### Template 2 - OG Types (Many bullets)
```
Plate Number: X

Heading: (ALL CAPS)

Description:

Point 1 - (Title Case)
Subpoint 1 - (Sentence Case)
Subpoint 2 - (Sentence Case)
Subpoint 3 - (Sentence Case)
.
.
[Continue for all points]
```

### Template 4 - OG Process (One line description)
```
Plate Number: X

Heading: (ALL CAPS)

Description:

Point 1 - (Title Case)
Either text in one or 2 lines followed by 1 or 2 subpoints or directly 2 to 3 subpoints
.
.
Point 2 - (Title Case)
Either text in one or 2 lines followed by 1 or 2 subpoints or directly 2 to 3 subpoints
.
.
[Continue for all points]
```

### Template 5 - OG Process (Few bullets)
```
Plate Number: X

Heading: (ALL CAPS)

Description:

Point 1 - (Title Case)
Either text in one or 2 lines followed by 1 or 2 subpoints or directly 2 to 3 subpoints
.
.
[Continue for all points]
```

### Template 6 - OG Process (Many bullets)
```
Plate Number: X

Heading: (ALL CAPS)

Description:

Point 1 - (Title Case)
Subpoint 1 - (Sentence Case)
Subpoint 2 - (Sentence Case)
Subpoint 3 - (Sentence Case)
.
.
[Continue for all points]
```

### Template 7 - OG Differentiation (Only text)
```
Plate Number: X

Heading: (ALL CAPS)

Subheading 1: (Title Case)
Subheading 2: (Title Case)

Description:

Subheading 1 Point 1 - (Sentence Case)
Subheading 2 Point 1 - (Sentence Case)
.
.
Subheading 1 Point 2 - (Sentence Case)
Subheading 2 Point 2 - (Sentence Case)
.
.
[Continue for all comparison points]
```

### Template 8 - OG Differentiation (Topic + image)
```
Plate Number: X

Heading: (ALL CAPS)

Subheading 1: (Title Case)
Subheading 2: (Title Case)

Description:

Subheading 1 Description Text: Image + Text in bulleted or normal layout (Sentence Case)
Subheading 2 Description Text: Image + Text in bulleted or normal layout (Sentence Case)
```

### Template 9 - OG Timeline (Single-line entries)
```
Plate Number: X

Heading: (ALL CAPS)

Subheading 1: (Title Case)
Subheading 2: (Title Case)
.
.
[Continue for all timeline entries]
```

### Template 10 - OG Timeline (Bullets)
```
Plate Number: X

Heading: (ALL CAPS)

Description:

Point 1 - (Title Case)
Point 1 Icon - (Either a number or letter or word or icon) - in case an icon suits best, write icon and leave it. Image will be added later.
Subpoint 1 - (Sentence Case)
Subpoint 2 - (Sentence Case)
Subpoint 3 - (Sentence Case)
.
.
[Continue for all timeline entries]
```

### Template 11-15 - Charts and Visualizations
```
Plate Number: X

Heading: (ALL CAPS)

Description:

[Describe it the best way you can but include all the data and description should be VERY easy to understand. Use bullets etc if needed to make it simpler to understand]
```

### Template 16 - Split Screen (Types w/ description)
```
Plate Number: X

Heading: (ALL CAPS)

Description:

Point 1 - (Title Case)
Point 1 Icon - (Either write sequential numbers starting from 1, or leave blank for an icon to be added later)
Subpoint 1 - (Sentence Case)
Subpoint 2 - (Sentence Case)
.
.
[Continue for all points]
```

### Template 17 - Split Screen (Bullets + sub-bullets)
```
Plate Number: X

Heading: (ALL CAPS)

Description:

Point 1 - (Title Case)
Point 1 Icon - (Either write sequential numbers starting from 1, or leave blank for an icon to be added later)
Subpoint 1 - (Sentence Case)
Subpoint 2 - (Sentence Case)
.
.
[Continue for all points]
```

### Template 18 - Q&A Format
```
Plate Number: X

Heading: (ALL CAPS)

Description:

Point 1 - (A Question in Title Case)
Subpoint 1 - (Answer in Sentence Case)
Subpoint 2 - (Answer in Sentence Case)
.
.
[Continue for all Q&A pairs]
```

### Template 20 - Split Screen (2 Types w/ bullets)
```
Plate Number: X

Heading: (ALL CAPS)

Subheading 1: (Title Case)
Subheading 2: (Title Case)

Description:

[Text below each subheading can be either bulleted, or 2-3 lines, or a line followed by bullets. Take a call based on the content]
```

### Template 21 - OG (3 Types)
```
Plate Number: X

Heading: (ALL CAPS)

Subheading 1: (Title Case)
Subheading 1 Icon: (Write icon and leave it for manual icon link entry)
Subheading 2: (Title Case)
Subheading 2 Icon: (Write icon and leave it for manual icon link entry)
Subheading 3: (Title Case)
Subheading 3 Icon: (Write icon and leave it for manual icon link entry)

Description:

[Text for each subheading can be 1 to 2 points of 2-3 words]
```

### Template 22 - Multi-column List
```
Plate Number: X

Heading: (ALL CAPS)

Subheading 1: (Title Case)
Subheading 1 Icon: (Write icon and leave it for manual icon link entry)
Subheading 2: (Title Case)
Subheading 2 Icon: (Write icon and leave it for manual icon link entry)
Subheading 3: (Title Case)
Subheading 3 Icon: (Write icon and leave it for manual icon link entry)
.
.
.

Description:

[Text for each subheading can be 1 line]
```

### Template 23 - Process/List (Split)
```
Plate Number: X

Heading: (ALL CAPS)

Subheading 1: (Title Case)
Subheading 1 Icon: (Write icon and leave it for manual icon link entry)
Subheading 2: (Title Case)
Subheading 2 Icon: (Write icon and leave it for manual icon link entry)
Subheading 3: (Title Case)
Subheading 3 Icon: (Write icon and leave it for manual icon link entry)
.
.
.

Description:

No description.
```

### Template 24 - Glassbox (Stat highlight)
```
Plate Number: X

No heading or subheading

Description:

[Write the percentage followed by the sentence that needs to be added mentioning that statistical percentage. Highlight a few points in red if needed.]
```

### Template 25 - Image/Logo Display
```
Plate Number: X

No heading or subheading

Description:

[Add what company logo or what image needs to be added here]
```

### Template 26 - Question Box
```
Plate Number: X

No heading or subheading

Description:

[Add the question here]
```

### Template 27 - Definition Plate
```
Plate Number: X

Heading: (ALL CAPS)

Subheading: (Title Case)

Description:

[Add in text as a block of text or a few sentences followed by bullets, or only bullets etc. Your call based on the content.]
```

### Template 29/29A/29OG - Takeaway Plate
```
Plate Number: X

No heading or subheading

Description:

[Add the takeaway plate text here. Add in red highlights to certain words if needed]
```

## Final Check
Before submitting your PPS:
1. Ensure proper use of Title Case and Sentence Case formatting
2. Confirm that no plate has a single point
3. Verify that script blocks contain the full text, not truncated versions
4. Check that all text meant for the final PPS output is in **bold**
5. Ensure appropriate template selection for each content segment
6. Alternate between OG plates and speaker plates to maintain engagement
