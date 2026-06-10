# Sentiment Analyzer 2.0 📊

A high-performance, local-first sentiment analysis dashboard designed to parse, normalize, and evaluate chat histories exported from platforms like WhatsApp and Instagram. Built with privacy-by-design principles, the application executes all data ingestion, regex parsing, and rule-based token tracking completely inside the browser sandbox using multithreaded Web Workers and fast local persistence.

---

## 🚀 Features

- **Multi-Platform Ingestion Engine:** Dynamically switches parsing pipelines to process raw WhatsApp text exports (`.txt`) and compressed Instagram data archives (`.zip`/`.json`).
- **Multithreaded Text Processing:** Offloads intensive rule-based lexicon token-matching to a dedicated background Web Worker (`sentiment.worker.ts`), keeping the UI rendering thread completely smooth at 60 FPS.
- **Privacy-by-Design Blueprint:** Zero external server dependencies or API calls. Features PII redactors (email, phone numbers), deterministic cryptographic channel hashing (SHA-256), and user-defined local data retention policies.
- **Reactive Local Persistence:** Implements transactional local storage via Dexie.js (IndexedDB) with real-time live queries to sync application states instantly.
- **Granular Dashboard Analytics:** Provides chronological conversational timelines, dominant emotional trend tracking, per-participant breakdown matrices, and metric export utilities.

---

## 🛠️ Tech Stack

- **Frontend Core:** React, TypeScript, Vite
- **Styling:** Tailwind CSS (v3 with custom view-state utilities)
- **Local Database:** Dexie.js (IndexedDB wrapper)
- **Decompression:** fflate (high-speed binary zip parsing)
- **Testing Framework:** Vitest / Jest layout configurations

---

## 📂 Architecture Blueprint

The project follows a highly modular, decoupled layer structure:

```text
Sentiment-Analyzer-2.0/
├── src/
│   ├── types/               # Strict schema contracts (Message, Conversation, Report)
│   ├── storage/             # IndexedDB connections, repositories, and transaction loops
│   ├── features/
│   │   ├── import/          # WhatsApp regex line-splitters and Instagram ZIP extractions
│   │   ├── normalization/   # PII filters, timestamp ISO mapping, and system log purgers
│   │   ├── privacy/         # SHA-256 obfuscation, user consent trackers, and retention sweeps
│   │   └── sentiment/       # Token weights dictionaries, negation logic, and aggregators
│   ├── workers/             # Background Web Worker execution threads
│   ├── components/          # Reusable UI dashboard, summary, and settings components
│   └── routes/              # High-level layouts, dashboard channels, and timeline configurations
└── tests/
    ├── fixtures/            # Mock export samples (whatsapp-export.txt, instagram-messages.json)
    └── unit/                # Isolated validation assertions for parsers and sentiment calculations

```

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have **Node.js** (v18 or higher) and **npm** installed on your machine.

### Installation

1. Clone the repository:
```bash
git clone [https://github.com/ShourjyoXD/Sentiment-Analyzer-2.0.git](https://github.com/ShourjyoXD/Sentiment-Analyzer-2.0.git)
cd Sentiment-Analyzer-2.0

```


2. Install dependencies:
```bash
npm install

```



### Development

Launch the local Vite development server:

```bash
npm run dev

```

Open [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173) in your browser.

### Production Build

Compile and optimize the complete type-safe application bundle:

```bash
npm run build

```

The production-ready bundle will be emitted to the `dist/` directory, validating all assets, styles, and background workers with zero errors.

---

## 🛡️ Privacy & Compliance Specifications

* **Data Isolation:** Uploaded backups are processed locally in an ephemeral stream. Raw string cleartext can be permanently omitted based on user storage preferences.
* **Deterministic Masking:** Primary keys are generated using browser-native WebCrypto SHA-256 hashing to hide structural channel titles on disk.
* **Retention Cascades:** Automated data retention sweeps execute on application boot, cleanly purging expired indexed conversations and cascade-deleting dependent message tables.

---

## 📄 License

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).

```

```