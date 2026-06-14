# 🔧 Log of Fixes & Code Improvements

This document lists the security vulnerabilities, usability defects, and code quality issues resolved in this release of **Resumind**.

---

## 🔒 1. Security Vulnerabilities Fixed

### 🔴 SEC-01: Insecure Open Redirect (Mitigated)
* **Path:** `app/routes/auth.tsx`
* **OWASP Category:** A01:2021 - Broken Access Control
* **Problem:** The authentication callback read the `next` redirect query parameter directly from URLSearchParams and forwarded the user to it via React Router's `navigate(next)` without verifying if it was an internal relative path. An attacker could exploit this in phishing campaigns by linking to `/auth?next=https://evil-site.com`.
* **Fix:** Sanitized the path. The application now checks if `next` starts with a single `/` and does not start with `//` (to prevent protocol-relative redirects). If validation fails, it defaults to `/`.

```typescript
// Before
const next = params.get("next") || "/";
navigate(next);

// After (Fixed)
const rawNext = params.get("next") || "/";
const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";
navigate(next);
```

---

## 🐞 2. Critical Logic & Usability Bugs Fixed

### 🟡 BUG-01: Premature Redirect Check on Mount
* **Path:** `app/routes/home.tsx`
* **Problem:** When loading the page, the Puter store starts with `isLoading: true` and `auth.isAuthenticated: false` while it runs session validation background tasks. Because the `useEffect` hook in the home component did not check the `isLoading` flag, it immediately redirected already authenticated users to the login screen on every hard reload.
* **Fix:** Added `!isLoading` to the conditional block. The application now awaits session state completion before deciding whether to redirect.

```typescript
// Before
useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
}, [auth.isAuthenticated]);

// After (Fixed)
useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) navigate("/auth?next=/");
}, [isLoading, auth.isAuthenticated, navigate]);
```

---

### 🟡 BUG-02: Indefinite Client-Side Hang on Malformed AI Response
* **Path:** `app/routes/upload.tsx`
* **Problem:** If the AI model returned text wrapped in Markdown backticks (e.g. ` ```json { ... } ``` `) or failed to complete the JSON payload due to length limits, `JSON.parse(feedbackText)` would throw a syntax error. Since this was not wrapped in a `try...catch` block, execution stopped, leaving the loader screen (`isProcessing = true`) spinning forever.
* **Fix:** Wrapped the parsing logic in a `try...catch` block. Cleaned the AI output using a regex helper to strip code fences, validated the schema, and gracefully handled parsing errors by alerting the user and setting `isProcessing` to `false`.

```typescript
// After (Fixed)
try {
    const feedbackText = typeof feedback.message.content === 'string'
        ? feedback.message.content
        : feedback.message.content[0].text;

    const cleanJson = (str: string) => {
        let cleaned = str.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
        }
        return cleaned.trim();
    };

    const parsedFeedback = JSON.parse(cleanJson(feedbackText));
    data.feedback = parsedFeedback;
    // ... saving and redirecting ...
} catch (err) {
    console.error("AI Analysis parsing failed:", err);
    alert("Failed to parse AI resume feedback. Please try again.");
    setStatusText("Error: Parsing failed");
    setIsProcessing(false);
}
```

---

### 🟡 BUG-03: Deletion Concurrency Race Conditions
* **Path:** `app/routes/wipe.tsx`
* **Problem:** The `handleDelete` function triggered file deletions inside a `files.forEach(async ...)` loop. Because `forEach` executes synchronously, the engine called `kv.flush()` and `loadFiles()` immediately before the network requests to delete the files actually completed, resulting in a desynchronized UI state.
* **Fix:** Replaced `forEach` with a properly awaited `Promise.all` mapping over the array of deletions.

```typescript
// Before
files.forEach(async (file) => {
    await fs.delete(file.path);
});
await kv.flush();
loadFiles();

// After (Fixed)
try {
    await Promise.all(files.map(async (file) => {
        await fs.delete(file.path);
    }));
    await kv.flush();
    await loadFiles();
} catch (err) {
    console.error("Failed to delete files:", err);
}
```

---

### 🟢 BUG-04: Dropzone PDF Extension Typo
* **Path:** `app/components/FileUploader.tsx`
* **Problem:** The `react-dropzone` setup specified `accept: {'application/pdf': [',pdf']}`. Due to the comma instead of a dot (`.pdf`), native file filtering dialogs on specific operating systems (like macOS/iOS) failed to recognize PDFs correctly.
* **Fix:** Corrected `,pdf` to `.pdf`.

```typescript
// Before
accept: {'application/pdf': [',pdf']}

// After (Fixed)
accept: {'application/pdf': ['.pdf']}
```

---

### 🟢 BUG-05: Controlled File State Desync in FileUploader
* **Path:** `app/components/FileUploader.tsx` & `app/routes/upload.tsx`
* **Problem:** The uploader component read the active file directly from the hook's local read-only `acceptedFiles[0]`. When the user clicked the close/clear button, it executed `onFileSelect(null)` which successfully updated the parent component, but it did not clear `acceptedFiles`. Therefore, the file preview remained visible in the uploader component.
* **Fix:** Converted `FileUploader` to a fully controlled component. It now accepts a `file: File | null` prop from the parent and renders visual states based directly on that prop.

```typescript
// In app/components/FileUploader.tsx
interface FileUploaderProps {
    file: File | null; // Passed from parent
    onFileSelect: (file: File | null) => void;
}
// Render uses the `file` prop directly instead of local acceptedFiles[0]
```
