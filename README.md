# Google I/O 2025 Highlights Tracker

![Demo](screenshots/demo.gif)

A real-time dashboard tracking the latest AI-generated announcements and updates from Google I/O 2025, providing a clear overview of the new products, features, and key themes discussed during the event.

## Quick Start

| Step | Command |
|------|---------|
| **1. Clone** | `git clone <repo-url> && cd <repo-dir>` |
| **2. Install** | `npm install` |
| **3. Setup Env** | Add `VITE_GEMINI_API_KEY` to `.env.local` |
| **4. Run** | `npm run dev` |

*Requires Node.js 18+*

## How It Works

This application provides a dynamic dashboard for Google I/O 2025 announcements. 

- **Dynamic Loading:** The application automatically attempts to fetch the initial batch of announcements on load.
- **Categorization:** Announcements are automatically grouped into relevant categories (like "AI & Machine Learning", "Android & Mobile", etc.) and displayed in chronological order.
- **Interactive Fetching:** Users can click the "Refresh/Load More Announcements" button to continuously poll the system for any new updates.
- **Status Indicators:** Each announcement card prominently displays its availability status (e.g., Preview, Beta, Available) via color-coded badges.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS |
| Language | TypeScript |
| API | Google GenAI SDK |
