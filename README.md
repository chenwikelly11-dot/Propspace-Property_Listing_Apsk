# PropSpace — Property Listing and Management Portal

PropSpace is a modern, full-stack, real-time property listing application that allows users to seamlessly discover, post, and manage residential and commercial properties. Featuring a responsive, user-centric interface and durable backend state persistence, the platform serves as a powerful bridge between property owners, agents, and prospective buyers.

---

## 🌟 Key Features

- **🔐 Secure User Authentication**
  - Instant login, registration, and logout flows with client/server credential checking.
  - User-specific dashboard filters ensuring data isolation so users only modify their own listed properties.

- **🔍 Advanced Search & Real-Time Filtering**
  - Find properties instantly using interactive search terms for locations, names, or descriptions.
  - Fine-grained multi-filter controls including property type (sale/rent), pricing ranges, bedroom count, and key amenities (e.g., parking, pool, gym, pet-friendliness).

- **📊 Comprehensive Property Management Dashboard**
  - Personal space for listing owners to track their current active offerings.
  - Interactive tools to add new properties, edit existing listings, and delete deprecated ones with instantaneous client updates.

- **🧮 Interactive Financial Calculator**
  - Built-in mortgage and payment calculator that helps buyers estimate monthly costs based on interest rates, loan terms, and down payments.

- **💾 Full-Stack Architecture with Persistence**
  - An Express-based backend server handles API proxy requests and handles local JSON persistence.
  - React (Vite) client with tailored Tailwind CSS design, smooth layout transitions, and high-contrast typography.

---

## 🛠️ Technology Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Lucide React (Icons), Motion (Animations)
- **Backend:** Express, TypeScript, Local JSON database adapter
- **Build Tooling:** Vite, esbuild (for server-side bundle production), tsx (development runner)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine (version 18+ is recommended).

### 1. Installation

Clone or download the project files, navigate to the project directory, and run the dependency installation:

```bash
npm install
```

### 2. Environment Configuration

Create a local `.env` file at the root of the project using the structure documented in `.env.example`:

```bash
cp .env.example .env
```

### 3. Development Server

Start the development server (which handles both Express backend API routes and hot-reloaded React assets):

```bash
npm run dev
```

The application will run locally and be accessible at:
👉 **`http://localhost:3000`**

### 4. Production Build & Execution

To bundle both the frontend static assets and build the Node.js production server:

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```text
├── database_store.json     # Local JSON state persistent file
├── metadata.json           # Platform application metadata configuration
├── server.ts               # Full-stack Express server entrypoint
├── src/
│   ├── main.tsx            # Main React entrypoint
│   ├── App.tsx             # Main routing and tab control hub
│   ├── types.ts            # Centralized TypeScript interfaces (Property, User, Filter)
│   ├── index.css           # Global stylesheets integrating Tailwind CSS imports
│   ├── components/         # Modular user interface components
│   │   ├── AuthForm.tsx         # Sign-in/Sign-up modals and credentials
│   │   ├── Dashboard.tsx        # Personal listing management area
│   │   ├── FilterSidebar.tsx    # Responsive side-panel filter control
│   │   ├── FinanceCalculator.jsx# Custom interest & mortgage calculator
│   │   ├── Navbar.tsx           # Persistent head navigation and brand logo
│   │   ├── PropertyCard.tsx     # Clean, detailed listing card
│   │   └── PropertyForm.tsx     # Dynamic multi-attribute creation/edit form
│   ├── services/
│   │   └── api.ts               # Axios-like custom client fetch configurations
│   ├── db/
│   │   └── jsonDb.ts            # Node-based server-side database adapter
│   └── utils/
│       ├── currency.ts          # Localization helpers for prices and formatting
│       └── propertyHelper.js    # Auxiliary calculation and property attributes
└── vite.config.ts          # Client-side bundler configuration
```

---

## 📄 License

This project is open-source and available under the MIT License.
