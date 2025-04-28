# 🌲 ForestGPT Application

An AI-powered web application that allows users to interact with environmental and forestry information through a conversational chatbot interface, powered by Replit Agent, NeonDB, Node.js, and React.

---

## 🚀 Tech Stack Overview

| Technology | Purpose |
|:-----------|:--------|
| **React** | Build the chatbot frontend interface |
| **TypeScript** | Add type safety across frontend and backend |
| **TailwindCSS** | Style the UI with utility-first CSS |
| **Node.js + Express** | Build the backend server and API |
| **Replit Agent** | Manage AI conversations and autonomous chat flow |
| **NeonDB** | Store structured app data serverlessly |
| **Google Cloud** | Host backend and cloud services |
| **Replit** | Online IDE and hosting environment for rapid development |
| **Python** | Used for scripting, prototyping, and AI-related workflows |

---

## 📦 Project Structure

```plaintext
forestgpt-app/
├── client/         # Frontend React app
│   └── src/
├── server/         # Backend Node.js app
│   └── services/   # API services and LLM interaction
├── shared/         # Shared TypeScript types
├── attached_assets/ # AI outputs, images (ignored by Git)
├── logos/          # Technology logos for documentation
├── README.md       # This file
├── package.json    # Project configuration and dependencies
├── tsconfig.json   # TypeScript compiler options
├── vite.config.ts  # Vite bundler configuration
├── tailwind.config.ts # TailwindCSS configuration
├── .gitignore      # Files and folders ignored by Git
└── .env            # Environment variables (NOT committed)
