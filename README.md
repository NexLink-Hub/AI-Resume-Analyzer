# 🚀 Resumind | AI-Powered Resume Analyzer

Resumind is a premium, serverless, AI-powered Resume Analyzer built to optimize resumes for Applicant Tracking Systems (ATS) and job-specific criteria. Running entirely on the client-side utilizing **React Router v7**, **Tailwind CSS v4**, and **Puter.js**, Resumind provides instant, deep, and contextual feedback without requiring a custom backend infrastructure.

[![React Router v7](https://img.shields.io/badge/React%20Router-v7-red?style=flat-square&logo=react)](https://reactrouter.com)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Puter.js](https://img.shields.io/badge/Puter.js-v2-blueviolet?style=flat-square)](https://puter.com)

---

## 🌟 Key Features

* **Instant ATS Scoring:** Get a comprehensive rating based on your resume's overall suitability, tone, content, structure, and skills.
* **Job-Specific Adaptability:** Provide a target company name, job title, and job description to get tailored improvement tips and alignment feedback.
* **Serverless Cloud FS & KV:** Leverages Puter's client-side cloud file system for resume PDF/image storage and KV store for session metadata.
* **Secure Local Execution:** Converts PDF documents to PNGs right in the browser using `pdf.js` for fast rendering and AI image-based analysis.
* **Premium Interactive UI:** Features custom-built score gauges, interactive category accordions, visual scanning indicators, and smooth transitions.

---

## 🛠️ Technology Stack

* **Framework:** React Router v7 (React 19)
* **Styling:** Tailwind CSS v4, custom utility classes, and gradient borders
* **Backend Services:** Puter.js (Hosting, Client Auth, KV Store, Cloud Storage, LLM Chat API)
* **Libraries:**
  * `pdfjs-dist` (local worker rendering page 1 of PDFs into high-quality images)
  * `react-dropzone` (file upload interface with type validation)
  * `zustand` (global state management for Puter session states)

---

## 📁 Project Structure

```
AI-Resume-Analyzer-main
├── app/
│   ├── components/       # Reusable UI components (Gauge, Accordion, Navbar, Card, etc.)
│   ├── lib/              # SDK wrappers & helper libraries (Puter, pdf2img, utilities)
│   ├── routes/           # Pages & Routing (Home, Auth, Upload, Resume, Wipe)
│   ├── app.css           # Global Tailwind v4 entry and custom CSS component layer
│   ├── root.tsx          # Root Layout, CDN SDK injections, and Error Boundary
│   └── routes.ts         # Route configuration map
├── constants/            # Mock data and AI prompt templates
├── public/               # Static icons, loader GIFs, and pdfjs worker source
├── Types/                # TypeScript global type definitions (.d.ts)
├── Dockerfile            # Container configuration
└── vite.config.ts        # Vite compiler plugins (PWA, TS paths, Tailwind)
```

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have **Node.js v20+** installed on your system.

### ⚙️ Installation

1. Clone or navigate to the repository directory:
   ```bash
   cd AI-Resume-Analyzer-main
   ```
2. Install the declared dependencies:
   ```bash
   npm install
   ```

### 💻 Local Development

Launch the Vite local development server:
   ```bash
   npm run dev
   ```
Your application will be available at `http://localhost:5173`.

### 📦 Building for Production

Compile and optimize the build bundle for production:
   ```bash
   npm run build
   ```

---

## 📘 Documentation

To help you understand the architectural flow and recent improvements made to the security/logic of the application, we've provided detailed reference documents:

* **[System Architecture Guide](system_architecture.md):** Deep dive into the serverless client-side flow, database schema, and data lifecycle.
* **[Vulnerability Fixes Log](fixes_made.md):** Detailed descriptions of the security patches and logic fixes implemented (e.g. Open Redirect, race conditions, parser crash mitigations).

---

Built with ❤️ by **Harry Mofoka** using React Router and Puter.js.
