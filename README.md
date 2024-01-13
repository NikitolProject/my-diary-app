<!-- ![tauri-ui](https://github.com/agmmnn/tauri-ui/assets/16024979/28295bae-8a36-4eff-8c33-2ed2bda82d84) -->

# My Diary

My Diary is a lightweight daily note-taking application. Customizable UI components using [shadcn/ui](https://github.com/shadcn/ui), lightweight and secure desktop application framework [Tauri 2](https://github.com/tauri-apps/tauri), React-based framework [Next.js 13](https://beta.nextjs.org/docs), utility-oriented CSS framework [Tailwind](https://tailwindcss.com/).

> _You can download pre-built final bundles from the [Releases](https://github.com/agmmnn/tauri-ui/releases) section._

## Getting Started

If you want to change anything in the application code, or build it yourself, first install all frontend dependencies:

```bash
npm i
```

To open the application in dev mode with the console, enter the following:

```bash
npm run tauri dev
```

To fully build the application, enter the following:

```bash
npm run tauri build
```

> Remember, if you want to use a package manager other than npm, you should also make the appropriate changes to `src-tauri/tauri.conf.json`

```json
...
"build": {
    "beforeDevCommand": "npm run dev", // in this line
    "beforeBuildCommand": "npm run build", // and this one
    "devPath": "http://localhost:1420",
    "distDir": "../dist",
    "withGlobalTauri": false
},
...
```

## Features

- Support for dark and light modes
- Components-based UI design
- A draggable titlebar with minimize, maximize, and close buttons
- [Radix UI](https://www.radix-ui.com/) for UI primitives
- [Lucide Icons](https://lucide.dev/)
- [Bundle size optimized](https://github.com/johnthagen/min-sized-rust) [`Cargo.toml`](/src-tauri/Cargo.toml) (.msi 2.2mb, .dmg 1.9mb, .deb 2mb)
- [Tauri GitHub Action](https://github.com/tauri-apps/tauri-action)

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
