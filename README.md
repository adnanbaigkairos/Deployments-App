# 🧠 VisiCraft AI - Technical Overview

This application, **VisiCraft AI**, is designed to generate images and videos from text prompts using AI. Here's an overview of its technical workings:

### Run:
* npm install
* Run Genkit in one terminal
    * For a single run: npm run genkit:dev
    * To watch for changes in your AI flow files and automatically restart: npm run genkit:watch
* Run the Next.js Development Server in another terminal : npm run dev
---

## 1. 🎨 Frontend (User Interface & Interaction)

### ⚙️ Framework:
- Built with **Next.js** (App Router) and **React**
- Provides server-side rendering, client-side navigation, and component-based architecture

### 📄 Core Pages:
- **Welcome Page (`src/app/page.tsx`)**
  - Landing page introducing app features
  - Includes a "Get Started" CTA

- **Generate Page (`src/app/generate/page.tsx`)**
  - Main workspace for user interaction
  - Contains key components:

    - `PromptPanel`: Input area + AI "Enhance" feature  
    - `GenerationPanel`: Image/Video generation, selection of number of images, progress display, download buttons  
    - `HistoryPanel`: Past generations stored in `localStorage`, view/download previous results

### 🧩 UI Components:
- **ShadCN UI** (`src/components/ui/`)
  - Pre-built, accessible, customizable components (buttons, cards, dialogs, etc.)

- **Custom Components** (`src/components/`)
  - Specific elements like `PageHeader`, `Logo`, `ThemeToggleButton`, and generation panels

### 🎨 Styling:
- **Tailwind CSS**: Utility-first styling framework
- **CSS Variables** (`src/app/globals.css`): Color palette for light/dark modes

### 📦 State Management:
- **React Hooks**: (`useState`, `useEffect`)
- **Custom Hooks**:
  - `useLocalStorage`: Store/retrieve data from localStorage
  - `useToast`: Show toast notifications
- **Theme Management**: via `next-themes` (dark/light theme toggle)

### 🌐 Client-Side Role:
- Handles UI rendering, input collection
- Calls server-side AI flows via **Next.js Server Actions**

---

## 2. 🤖 Backend (AI Functionality - Genkit)

### ⚙️ Genkit (`src/ai/`):
AI framework to define & manage LLM and image generation interactions.

### 🔧 Initialization (`src/ai/genkit.ts`)
- Sets up Genkit with `googleAI` plugin to use models like **Gemini**

### 🔁 AI Flows (`src/ai/flows/`)
- Server-side TypeScript functions marked with `use server` for Server Actions

#### 📌 `enhance-prompt.ts`:
- Enhances raw prompt using LLM
- Returns more vivid/detailed version of the prompt

#### 🖼️ `generate-image.ts`:
- Accepts prompt + number of images
- Calls `googleai/gemini-2.0-flash-exp` for each image
- Returns image data URIs (Base64)

#### 🎥 `generate-video.ts`:
- Accepts prompt
- Uses image generation model to generate a placeholder image as "video"
- (Note: Not true video generation yet)

### ✅ Data Schemas:
- **Zod**: Input/output schemas for type safety and instruction clarity

---

## 3. 🔄 Application Workflow Example (Image Generation)

### ✍️ User Input (Frontend):
1. User enters prompt in `PromptPanel`
2. Clicks "Enhance Prompt" (optional) → enhanced via Genkit flow
3. Chooses "Image" tab + number of variations in `GenerationPanel`
4. Clicks "Generate Image(s)"

### 🧠 Server-Side AI Processing:
1. Calls `generateImage` Server Action
2. Genkit uses Gemini to create images
3. Images returned as Base64 data URIs

### 🖼️ Displaying Results (Frontend):
1. URIs displayed in `GenerationPanel`
2. Each image has a download option
3. Prompt + image URL added to `HistoryPanel`
4. History saved to `localStorage`

---

## 4. 🧰 Key Technologies & Concepts

| Feature | Description |
|--------|-------------|
| `Next.js App Router` | File-system routing with Server Components |
| `React Server Actions` | Secure calls to server functions |
| `ShadCN UI + Tailwind CSS` | Modern and customizable UI |
| `Genkit` | AI orchestration framework |
| `next-themes` | Light/Dark theme toggling |
| `Zod` | Input/output validation |
| `Data URIs` | Embed image data directly without file hosting |
| `localStorage` | Persistent history & preferences in the browser |

---

In essence, **VisiCraft AI** provides a clean, fast, and user-friendly interface built on **Next.js** and **React**, powered by **Genkit** on the backend to enhance prompts and generate stunning media content.
