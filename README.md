# Splitify ✂️

[![Release](https://img.shields.io/badge/Release-v0.1.0-blue.svg)](https://github.com/Agam348/splitify/releases)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()
[![Offline & Private](https://img.shields.io/badge/Privacy-100%25%20Offline-success.svg)]()
[![Lossless](https://img.shields.io/badge/Quality-100%25%20Lossless-orange.svg)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)]()

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

## 🚀 How to Download & Use This App (For Users)

### 📥 1. Downloading Splitify

Pre-built standalone installers are available on the **[Releases](https://github.com/Agam348/splitify/releases)** page:

| Operating System | Recommended Package | Description |
| :--- | :--- | :--- |
| **Windows** | `Splitify-Windows-0.1.0-Setup.exe` | Standard 64-bit installer (NSIS) |
| **macOS** | `Splitify-Mac-0.1.0-Installer.dmg` | macOS disk image package |
| **Linux** | `Splitify-Linux-0.1.0.AppImage` | Standalone executable AppImage |

### 💻 2. Installation

- **Windows**:
  1. Download `Splitify-Windows-0.1.0-Setup.exe`.
  2. Double-click the installer and choose your preferred installation directory.
  3. Launch **Splitify** from your Desktop shortcut or Start Menu.
- **macOS**:
  1. Download the `.dmg` file.
  2. Drag and drop **Splitify** into your `Applications` folder.
- **Linux**:
  1. Make the `.AppImage` executable (`chmod +x Splitify-Linux-0.1.0.AppImage`).
  2. Run the AppImage directly.

---

### 🎬 3. Simple Step-by-Step Usage Guide

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

If you are a developer and want to inspect the source code, contribute, or build Splitify from scratch, follow these instructions.

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
4. Output ready-to-distribute setup files into the `release/` directory.

---

## 📂 Project Structure

```
Split_Video/
├── electron/                    # Electron main process & Node.js backend
│   ├── main.ts                  # Main process entry point & window manager
│   ├── preload.ts               # Context-isolated IPC bridge (window.splitify)
│   ├── ipc/                     # Strongly typed IPC channel handlers
│   │   ├── dialog.ipc.ts        # Native file and folder dialogs
│   │   ├── media.ipc.ts         # Video metadata extraction handlers
│   │   ├── processing.ipc.ts    # Splitting execution & progress event streaming
│   │   ├── settings.ipc.ts      # Configuration persistence (electron-store)
│   │   └── validation.ipc.ts    # User input and filesystem validation
│   └── services/                # Backend services & media engines
│       ├── ffmpeg/              # FFmpeg process management, stream copy & parsing
│       ├── media.service.ts     # FFprobe metadata parser
│       └── processing.service.ts# Job orchestration, locking & cancellation
├── shared/                      # Contracts, types, and schemas shared between Main & Renderer
│   ├── ipc/                     # API channel definitions & interface types
│   ├── media/                   # Supported video extensions
│   ├── processing/              # Progress events, requests, and result models
│   └── validation/              # Pure validation rules & filename sanitization
├── src/                         # Renderer process (React 18 frontend)
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # Root application component
│   ├── index.css                # Global CSS & Tailwind styling
│   ├── components/              # Shared UI components (Button, Card, Input, Label)
│   └── features/split-video/    # Splitify feature modules
│       ├── components/          # Dropzone, VideoInfo, SplitMethod, Progress, etc.
│       ├── hooks/               # Custom hooks (picker, validation, splitting, settings)
│       └── utils/               # Metadata formatters (time, bytes)
├── resources/                   # Application icons (.ico, .icns, .png)
├── electron-builder.json5       # Desktop packaging & installer configuration
├── vite.config.ts               # Vite configuration with electron-vite plugin
└── package.json                 # Project manifest & scripts
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
