

# Ghibli Days — ASMR Content Generator

A beautiful, Ghibli-inspired frontend app that captures user inputs, sends them to an n8n webhook, and displays AI-generated ASMR content in a warm, painterly interface.

---

## Phase 1: Ghibli Design System & Layout Shell

- Set up Google Fonts (Playfair Display, Lora, DM Sans)
- Implement the full Ghibli color palette (parchment background, forest green, terracotta, warm charcoal)
- Add paper grain texture overlay, watercolor blob shapes (pure CSS), warm card shadows
- Create brushstroke-style dividers and soft fade-in animations
- Build the app shell with header ("Ghibli Days" branding with CSS leaf/cloud motif) and settings icon for webhook URL configuration (stored in localStorage)

## Phase 2: Input Form Page

- Primary Task text input with helper text
- Number of Titles and Number of Images inputs with min/max validation
- Channel Screenshot drag-and-drop upload zone styled as a wooden frame, with image preview
- "Generate Content ✦" submit button with hover glow effect
- Form validation and Enter key submission support

## Phase 3: Loading / Generation State

- Full-page loading view with CSS-only floating leaves animation
- 7-stage progress indicator that lights up sequentially on a timer (~20s per stage)
- Ambient message: "Your Ghibli world is being painted..."
- Ink-spreading progress bar effect
- Disable re-submission while loading

## Phase 4: n8n Webhook Integration

- POST multipart/form-data to the user-configured webhook URL
- Send Primary Task, Number of Titles, Number of Images, and Screenshot file
- Wait for synchronous JSON response
- Parse the `output` field and split into sections (Channel DNA, Titles, Story, Characters, Image Prompts, Video Prompts)
- Handle errors: missing webhook URL prompt, timeout after 5 minutes with retry, malformed response fallback showing raw output

## Phase 5: Results Page

- "Your Content is Ready ✦" header with generation timestamp
- Top action bar: Copy All, Download as .txt, Generate Again
- Sticky sidebar/tab navigation for jumping between sections
- 6 expandable accordion sections, each with icon and styled content:
  - **Channel DNA Analysis** — formatted text + syntax-highlighted JSON code block
  - **Titles** — numbered list with per-title copy buttons
  - **Story** — flowing serif text with comfortable line height
  - **Characters** — individual cards for Father, Mother, One Boy
  - **Image Prompts** — numbered cards with copy buttons
  - **Video Prompts** — numbered cards paired with image numbers, copy buttons
- All sections have one-click copy functionality

## Phase 6: Polish & Responsiveness

- Desktop-first responsive design, tablet-friendly, acceptable on mobile
- Accessibility: proper labels, contrast ratios, keyboard navigation
- Smooth CSS transitions between all app states (form → loading → results)
- localStorage persistence for webhook URL setting

