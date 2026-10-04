---
paths:
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/*.html"
  - "**/*.css"
---
# Front-End UI Generation & Design Rules

1. **No Inline CSS or Generic Fallback Templates**:
   - Never use inline CSS (`style={{ ... }}`) or unstyled HTML templates.
   - Do not output generic fallback templates or stereotypical LLM card patterns.
   - All styling must utilize Tailwind CSS v4 design tokens and semantic utility classes.

2. **Component Discovery & Scaffolding (21st.dev & v0)**:
   - Always query **21st.dev MCP** or **v0 API MCP** for production-grade UI components (Shadcn, Aceternity, Magic UI) before generating components from scratch.
   - Reuse verified, accessible, high-end components with complete micro-interactions.

3. **Strict Figma Token Mapping**:
   - If a Figma URL or Node ID is provided, use the Figma MCP server to extract design tokens, variables, auto-layout rules, and padding.
   - Strictly map Tailwind classes to the exact Figma design tokens without approximation.

4. **Visual Validation & Autonomous Correction (Playwright)**:
   - Validate generated UI visually using **Playwright** (headless DOM inspection, bounding boxes, element positioning) before returning output.
   - If elements overlap, text clips, or spacing is misaligned, diagnose the layout and autonomously rectify the code.

5. **Mandatory Stack**:
   - Enforce **Shadcn UI + Tailwind CSS v4 + Framer Motion** as the default standard stack for all web and UI projects.
