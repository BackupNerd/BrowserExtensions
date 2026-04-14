# Cove Error Search Links

A Chrome/Edge browser extension that turns **N-able Cove Data Protection** error messages into one-click search links — opening Google AI Mode, the N-able documentation, or the N-able Knowledge Base instantly.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome) ![Manifest V3](https://img.shields.io/badge/Manifest-V3-green) ![Version](https://img.shields.io/badge/version-2.2-purple)

---

## What It Does

- Monitors the **Errors** tab in the Cove Data Protection device properties panel (`backup.management`)
- Injects **[AI] [Docs] [KB]** buttons next to every error message (or styles errors as clickable links — configurable)
- **[AI]** opens a Google AI Mode search pre-filled with troubleshooting context
- **[Docs]** opens the N-able documentation page for that error (or searches docs if no specific page exists)
- **[KB]** opens the N-able Knowledge Base filtered to Cove Data Protection
- Works on both `backup.management` and `*.cloudbackup.management` portals
- Uses `MutationObserver` to handle virtualized lists — buttons appear as you scroll

---

## Screenshots

| Device Properties — Errors Tab |
|---|
| Error rows get **[AI] [Docs] [KB]** action buttons injected inline |

---

## Installation

### Option A — Load Unpacked (Developer Mode)

1. Download and extract the ZIP from [Releases](../../releases)
2. Open Chrome → `chrome://extensions/` → enable **Developer mode**
3. Click **Load unpacked** → select the extracted `CoveErrorLinks-Extension` folder
4. The extension appears in your toolbar — navigate to `backup.management` and open any device's Errors tab

### Option B — Clone This Repo

```bash
git clone https://github.com/BackupNerd/CoveErrorLinks-Extension.git
```

Then load unpacked from the cloned folder (same steps 2–4 above).

> ⚠️ **Do not delete or move the folder after installing** — Chrome loads from it live.

---

## Updating

1. Replace the folder contents with the new version (or `git pull`)
2. Go to `chrome://extensions/`
3. Click the **🔄 Reload** icon on the "Cove Error Search Links" card

---

## Settings

Click the extension icon → **Options** (or right-click → Manage Extension → Extension options) to configure:

| Setting | Description |
|---|---|
| **Click Behavior** | `Icons` mode: [AI] [Docs] [KB] buttons per row. `Single` mode: click anywhere on error text |
| **AI Search Target** | URL base for AI searches. Default: `https://www.google.com/search?q=` with `&udm=50` appended for Google AI Mode |
| **Prompt Context** | Prefix added before the error text (e.g. *"Troubleshoot Cove Data Protection with the following error."*) |
| **Vendor Context** | Optional suffix to find resolutions from third-party backup products |
| **Exclusions** | Sites to exclude from AI search results (e.g. `withcove.com`) |

### Google AI Mode URL

All Google searches are sent in AI Mode via the `udm=50` parameter:

```
https://www.google.com/search?q=Troubleshoot+Cove+Data+Protection+...&udm=50
```

---

## Compatibility

| Browser | Supported |
|---|---|
| Google Chrome (Windows / macOS) | ✅ |
| Microsoft Edge (Windows / macOS) | ✅ |
| Firefox | ❌ (different extension format) |
| Safari | ❌ |

---

## File Structure

```
CoveErrorLinks-Extension/
├── manifest.json       # Extension manifest (MV3)
├── content.js          # Main content script — error detection & button injection
├── content.css         # Button / link styles
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── options/
    ├── options.html    # Settings page UI
    └── options.js      # Settings load/save logic
```

---

## How It Works

1. A `MutationObserver` watches for new rows in the DevExtreme virtualized grid
2. For each `span.apx-truncate` inside `tr.dx-data-row`, the error text is extracted
3. The text is checked against a built-in error database for known doc/KB links
4. Buttons are injected into the adjacent `span.copy-to-clipboard` container — no existing DOM nodes are moved
5. Clicking a button calls `window.open` with a named target (`CoveSearchWindow`) so repeated clicks reuse the same popup window

---

## Known Errors Database

The extension includes direct documentation links for common errors:

- Access is denied
- The system cannot find the file specified
- Client was restarted during backup
- Failed to send some of the file
- Process cannot access the file because it is being used
- Operation was aborted
- No data available for the backup
- Cannot connect to backup register
- Full disk access is not granted (macOS)
- Operation not permitted (macOS)
- Error while listing directory content

For errors not in the database, the extension falls back to a full-text docs/KB search.

---

## Permissions

| Permission | Reason |
|---|---|
| `storage` | Save/load user settings |
| `host_permissions: backup.management` | Inject content script on the Cove portal |

No data is collected, sent, or stored outside the browser.

---

## Contributing

Pull requests welcome. To add a new known error:

1. Open `content.js`
2. Add an entry to the `ERROR_DB` object:
   ```js
   'your error text (lowercase)': {
     docs: 'https://documentation.n-able.com/...'
   }
   ```
3. Test on `backup.management` device Errors tab

---

*Built for [N-able Cove Data Protection](https://www.n-able.com/products/cove-data-protection) — `backup.management` portal*
