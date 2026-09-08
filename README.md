# Splitify ✂️

[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()
[![Offline & Private](https://img.shields.io/badge/Privacy-100%25%20Offline-success.svg)]()
[![Lossless](https://img.shields.io/badge/Quality-100%25%20Lossless-orange.svg)]()
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)]()

> **A fast, offline desktop application for splitting videos into clips without quality loss.**

Splitify makes dividing large videos effortless. Unlike standard video editors or web uploaders that take hours to transcode and compress your files, Splitify utilizes FFmpeg's **stream-copy engine** (`-c copy`). Your videos are sliced directly at the bitstream level in **seconds**, retaining the exact original resolution, bitrate, audio tracks, and visual quality — all without ever uploading your files to the cloud.

---

## 🌟 Key Features

- ⚡ **Instant Lossless Splitting**: No CPU/GPU re-encoding bottlenecks. Large gigabyte video files are split in seconds with zero loss in visual or audio quality.
- ⏱️ **Flexible Splitting Modes**:
  - **By Duration**: Split by fixed clip length using quick presets (`30s`, `45s`, `60s`) or specify any custom duration in seconds.
  - **Equal Parts**: Divide any video evenly into a set number of clips (from 2 up to 1,000 equal parts).
- 📁 **Universal Format Support**: Works seamlessly with `MP4`, `MOV`, `MKV`, `AVI`, and `WEBM` video containers.
- 🔒 **100% Offline & Private**: Zero telemetry, zero external network requests. Your files never leave your computer.
- 📊 **Real-Time Progress & Instant Cancel**: Granular progress bar with live clip indicators (`Writing clip 2 of 5`) and immediate cancellation cleanup.
- 🛡️ **Smart Collision Protection**: Automatically detects existing files in your target folder and safely adds numeric suffixes (`Project (2) Part 1.mp4`) so your work is never overwritten.
- 🎨 **Modern, Intuitive Interface**: Clean and accessible design built with React 18, Tailwind CSS, and Lucide icons.

---

## 🚀 How to Run & Use Splitify

> [!IMPORTANT]
> **Can't find the `.exe` or desktop installer?**
> If you clicked the green **Code ➔ Download ZIP** button on GitHub, you downloaded the **raw source code**, not the compiled desktop app. Git repositories only store source code. Choose one of the two options below:

---

### Option 1: Download the Ready-to-Run Desktop App (Easiest — No Setup)

If you simply want to use Splitify without installing Node.js or typing any terminal commands:

1. Go to the **[Releases](https://github.com/Agam348/splitify/releases)** page.
2. Under **Assets**, click to download the installer for your operating system:
   - 🪟 **Windows**: [`Splitify-Windows-0.1.0-Setup.exe`](https://github.com/Agam348/splitify/releases/download/v0.1.0/Splitify-Windows-0.1.0-Setup.exe) (158 MB)
   - 🍎 **macOS (Apple Silicon M1/M2/M3/M4)**: [`Splitify-Mac-0.1.0-arm64-Installer.dmg`](https://github.com/Agam348/splitify/releases/download/v0.1.0/Splitify-Mac-0.1.0-arm64-Installer.dmg) (130 MB)
   - 🍎 **macOS (Intel)**: [`Splitify-Mac-0.1.0-x64-Installer.dmg`](https://github.com/Agam348/splitify/releases/download/v0.1.0/Splitify-Mac-0.1.0-x64-Installer.dmg) (127 MB)
   - 🐧 **Linux**: [`Splitify-Linux-0.1.0.AppImage`](https://github.com/Agam348/splitify/releases/download/v0.1.0/Splitify-Linux-0.1.0.AppImage) (162 MB)
3. Double-click the downloaded file to install and open Splitify immediately!

---

### Option 2: Run or Build from Source (If You Downloaded the ZIP)

If you downloaded the ZIP file or cloned the repository with Git:

#### 1. Requirements
Ensure you have **[Node.js](https://nodejs.org/)** (v18 or higher) installed on your computer.

#### 2. Open the Project Folder
1. Right-click the downloaded ZIP file and click **Extract All...**
2. Open the extracted folder in your terminal / Command Prompt:
   - On Windows: Open the folder, type `cmd` or `powershell` in the address bar at the top, and press **Enter**.

#### 3. Install Dependencies
```bash
npm install
```

#### 4. Launch or Create the Desktop App
- **To open the desktop app directly:**
  ```bash
  npm run dev
  ```
  *The desktop window will open immediately.*

- **To create your own standalone installer:**
  ```bash
  npm run build
  ```
  *Once the build finishes, open the newly created `release/0.1.0/` folder on your computer. Your installer will be right there ready to install!*

---

### 🎬 Simple Step-by-Step Usage Guide

```
[1. Select Video] ➔ [2. Set Name & Method] ➔ [3. Choose Output Folder] ➔ [4. Split!]
```

1. **Select or Drop Your Video**:
   - Click **"Browse Video"** or drop any video file (`MP4`, `MOV`, `MKV`, `AVI`, or `WEBM`) into the dropzone.
   - The app will automatically inspect and display the video's duration, resolution, frame rate, file size, and container.
2. **Enter Project Name**:
   - Type a project name (e.g., `Travel Vlog` or `Product Demo`). Your generated clips will be saved as `Travel Vlog Part 1.mp4`, `Travel Vlog Part 2.mp4`, etc.
3. **Choose Your Split Method**:
   - **By Duration**: Select a quick preset (`30s`, `45s`, `60s`) or click **Custom** to enter any number of seconds.
   - **Equal Parts**: Select "Equal parts" and enter the total number of parts you desire (e.g., `4`).
4. **Choose Destination Folder**:
   - Click **"Choose"** to pick the folder where your clips should be saved. Splitify remembers your last selected output folder automatically.
5. **Click "Split Video"**:
   - Track live splitting progress on the animated progress bar.
   - Once completed, Splitify displays a success summary with the total clip count and elapsed time. Click or open your destination folder to view your newly split clips!

---

## 🛠️ How to Run This Code (For Developers)

If you are a developer and want to inspect the source code, contribute, or build Splitify from scratch:

### 📋 Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher (or `pnpm` / `yarn`)
- **Git**: Installed and configured on your system

### 🔧 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Agam348/splitify.git

# Navigate to the project directory
cd splitify

# Install dependencies
npm install
```

### 💻 2. Start Development Mode

To launch the Vite development server with Hot Module Replacement (HMR) and run the Electron desktop shell concurrently:

```bash
npm run dev
```

*The Vite dev server will start, and the Electron desktop window will open automatically.*

### 🔍 3. Code Quality & Type Checking

Ensure that TypeScript types and ESLint checks pass cleanly:

```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Run ESLint validation
npm run lint
```

### 📦 4. Build & Package Desktop Installers

To create production binaries and OS-specific installers:

```bash
npm run build
```

This script will:
1. Validate TypeScript types via `tsc`.
2. Bundle the React renderer and Electron main/preload scripts using `vite build`.
3. Package the native application and static FFmpeg/FFprobe binaries using `electron-builder`.
4. Output ready-to-distribute setup files into the `release/0.1.0/` directory.

---

## 📂 Project Structure

```
Split_Video/
├── .github/
│   └── workflows/
│       └── build.yml             # Automated multi-platform CI/CD matrix (Win, Mac, Linux)
├── electron/                     # Electron main process & Node.js backend
│   ├── electron-env.d.ts         # Environment declarations for Vite Electron
│   ├── ipc/                      # Strongly typed IPC channel handlers
│   │   ├── dialog.ipc.ts         # Native file and folder picker dialogs
│   │   ├── ipc-security.ts       # IPC sender validation & webFrame guards
│   │   ├── media.ipc.ts          # Video metadata extraction handlers
│   │   ├── processing.ipc.ts     # Splitting execution & progress event streaming
│   │   ├── settings.ipc.ts       # Configuration persistence (electron-store)
│   │   └── validation.ipc.ts     # Asynchronous filesystem inspection IPC
│   ├── main.ts                   # BrowserWindow manager, CSP security & app lifecycle
│   ├── preload.ts                # Context-isolated secure IPC bridge (window.splitify)
│   └── services/                 # Backend services & media engines
│       ├── ffmpeg/               # FFmpeg stream-copy process management
│       │   ├── ffmpeg-errors.ts  # Error categorization & exit code mapping
│       │   ├── ffmpeg-path.ts    # Binary path resolver with POSIX permission enforcement
│       │   ├── ffmpeg-process.ts # Child process spawner, stream parser & cancellation
│       │   ├── ffmpeg.service.ts # High-level duration & equal parts splitting engine
│       │   └── ffmpeg.types.ts   # FFmpeg event and options interfaces
│       ├── media.service.ts      # FFprobe metadata parser
│       ├── output-directory-inspector.ts # Directory access & writeability checker
│       ├── processing.service.ts # Job orchestration, concurrency lock & cancellation
│       └── settings.service.ts   # Safe local settings store
├── shared/                       # Isomorphic TypeScript shared between Main & Renderer
│   ├── ipc/                      # API channel definitions & interface types
│   │   ├── api.ts                # Global SplitifyAPI contract
│   │   ├── dialog.ts             # Dialog request & response models
│   │   ├── media.ts              # Video metadata contracts
│   │   ├── processing.ts         # Progress events & split result interfaces
│   │   ├── settings.ts           # Settings store interfaces
│   │   └── validation.ts         # Directory validation interfaces
│   ├── media/
│   │   └── video-formats.ts      # Supported video containers (mp4, mov, mkv, avi, webm)
│   ├── processing/
│   │   └── processing.types.ts   # Splitting method models ('duration' | 'equal-parts')
│   └── validation/
│       ├── file-name.ts          # Cross-platform safe filename sanitizer
│       ├── validation.service.ts # Pure business validation logic
│       └── validation.types.ts   # Validation field issues and warning types
├── src/                          # Renderer process (React 18 frontend)
│   ├── assets/                   # React SVGs & static assets
│   ├── components/               # Radix UI + Tailwind design system
│   │   ├── layout/
│   │   │   └── app-header.tsx    # Header with emerald branding and Private & Offline badge
│   │   └── ui/                   # Reusable atomic UI components (Button, Card, Input, Label)
│   ├── features/split-video/     # Splitify main feature domain
│   │   ├── components/           # Feature UI components
│   │   │   ├── output-folder.tsx # Destination folder selector with collision warnings
│   │   │   ├── processing-result.tsx # Post-splitting completion summary card
│   │   │   ├── progress-section.tsx  # Granular progress bar with live clip counter
│   │   │   ├── project-details.tsx   # Project naming input with automatic sanitization
│   │   │   ├── split-method.tsx  # Dual mode selector (duration presets / equal parts)
│   │   │   ├── split-workspace.tsx # Main workspace layout container
│   │   │   ├── video-dropzone.tsx    # Drag-and-drop video upload zone
│   │   │   └── video-information.tsx # Metadata display card (resolution, fps, size, format)
│   │   ├── data/                 # Sample video placeholders
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── use-output-folder.ts
│   │   │   ├── use-split-configuration.ts
│   │   │   ├── use-split-validation.ts
│   │   │   ├── use-video-picker.ts
│   │   │   └── use-video-splitting.ts
│   │   └── utils/                # Metadata formatters (time, bytes)
│   ├── index.css                 # Tailwind CSS directives & emerald design tokens
│   ├── lib/utils.ts              # Tailwind class merge utility (cn)
│   ├── main.tsx                  # React DOM mount point
│   ├── App.tsx                   # Root application component
│   └── vite-env.d.ts             # Vite client types
├── resources/                    # High-res icons (.ico, .icns, .png, .svg)
├── public/                       # Static public web assets
├── electron-builder.json5        # Multi-platform packaging config (NSIS, DMG, AppImage)
├── vite.config.ts                # Vite configuration with electron-vite plugin
└── package.json                  # Project manifest, scripts & dependencies
```

---

## ❓ Frequently Asked Questions (FAQ)

<details>
<summary><b>Why are clips occasionally a fraction of a second different from the requested duration?</b></summary>
<br>
Splitify uses <b>lossless stream copying</b> (<code>-c copy</code>) rather than re-encoding. In video compression, frames are grouped into GOPs (Group of Pictures) bounded by keyframes (I-frames). To avoid slow, quality-degrading re-encoding, cuts must occur at the nearest keyframe. Depending on how the original video was encoded, clips may vary by a fraction of a second while guaranteeing 100% original video quality and instantaneous processing.
</details>

<details>
<summary><b>Do I need to install FFmpeg or FFprobe on my system separately?</b></summary>
<br>
No! Splitify ships with bundled, self-contained FFmpeg and FFprobe binaries. No external dependencies, command-line tools, or codec packs are required.
</details>

<details>
<summary><b>Does Splitify upload my videos anywhere?</b></summary>
<br>
No. Splitify runs entirely locally on your machine. It requires zero internet connection, contains no telemetry, and never transmits your files or metadata.
</details>

---

## 👤 Author & Credits

- **Author**: Agampreet Singh
- **Built With**: [Electron](https://www.electronjs.org/), [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [FFmpeg](https://ffmpeg.org/), [Lucide Icons](https://lucide.dev/).

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
