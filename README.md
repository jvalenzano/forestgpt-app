# ForestGPT Application

An AI-powered web application that allows users to interact with environmental and forestry information through a conversational chatbot interface, powered by Replit Agent, NeonDB, Node.js, and React.

---

## Tech Stack Overview

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

## Project Structure

```plaintext
forestgpt-app/
├── client/             # Frontend React app
│   └── src/            # React components and pages
├── server/             # Backend Node.js app
│   └── services/       # API routes and LLM interactions
├── shared/             # Shared TypeScript types/interfaces
├── attached_assets/    # AI outputs, images (ignored by Git)
├── logos/              # Technology logos for documentation
├── README.md           # This file
├── package.json        # Project configuration and dependencies
├── tsconfig.json       # TypeScript compiler options
├── vite.config.ts      # Vite build tool configuration for frontend
├── tailwind.config.ts  # TailwindCSS configuration
├── .gitignore          # Files and folders ignored by Git
├── .replit             # (Optional) Replit run settings
└── .env                # Environment variables (NOT committed)
```
## Getting Started
Clone the repository and install dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/forestgpt-app.git
cd forestgpt-app
npm install
npm run dev
```
✅ Your app will be available locally at http://localhost:3000/ (or as configured).

## License
This project is licensed under the MIT License.

## Contributing
Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (git checkout -b feature/your-feature-name)
3. Commit your changes (git commit -m "Add your feature")
4. Push to the branch (git push origin feature/your-feature-name)
5. Open a Pull Request describing your changes

Thank you for helping improve ForestGPT!