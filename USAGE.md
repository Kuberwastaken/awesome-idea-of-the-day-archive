# Idea of the Day Archive Tool

This tool automatically captures full-page screenshots from https://www.ideabrowser.com/ and saves them to an organized archive folder structure.

## How it works

- **Target**: Captures full-page screenshots from ideabrowser.com
- **Archive Structure**: Saves screenshots in `archives/YYYY/Month/` folders
- **Filename Format**: `DD Month YYYY.png` (e.g., "14 July 2025.png")
- **Simple & Reliable**: Takes clean full-page screenshots without complex detection
- **Schedule**: Runs automatically every 24 hours via GitHub Actions

## Usage

### Running the script manually

```bash
# Method 1: Direct node command
node screenshot.js

# Method 2: Using npm scripts
npm run capture
# or
npm run daily-idea
```

### Login-required pages

If Ideabrowser requires a login, set the following environment variables before running the script:

- `IDEABROWSER_EMAIL`
- `IDEABROWSER_PASSWORD`

Optional selectors (use these when the default selector guesses fail):

- `IDEABROWSER_LOGIN_URL` (defaults to `https://www.ideabrowser.com/login`)
- `IDEABROWSER_LOGIN_TRIGGER_SELECTOR`
- `IDEABROWSER_EMAIL_SELECTOR`
- `IDEABROWSER_PASSWORD_SELECTOR`
- `IDEABROWSER_SUBMIT_SELECTOR`
- `IDEABROWSER_POST_LOGIN_SELECTOR`
- `IDEABROWSER_IDEA_SELECTOR`

The script also uses `IDEABROWSER_USER_DATA_DIR` to store a stable browser profile directory. This prevents Windows temp cleanup errors when Chrome still has files locked.

### Example output structure

```
archives/
├── 2025/
│   ├── January/
│   │   ├── 15 January 2025.png
│   │   ├── 16 January 2025.png
│   │   └── 31 January 2025.png
│   ├── February/
│   │   ├── 1 February 2025.png
│   │   └── 28 February 2025.png
│   └── July/
│       └── 14 July 2025.png
```

## Automation

### GitHub Actions (Recommended)
The repository is configured to run automatically every 24 hours via GitHub Actions:
- **Schedule**: Daily at midnight UTC (`cron: '0 0 * * *'`)
- **Action**: Captures the daily page and commits it to the repository
- **Location**: `.github/workflows/update_images.yml`
- **Secrets**: Set `IDEABROWSER_EMAIL` and `IDEABROWSER_PASSWORD` in your repo settings
- **Selectors**: You can set selector env vars in the workflow file if the defaults do not match the login form

### Windows Task Scheduler (Local)
You can also set up local automation:
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (e.g., daily at specific time)
4. Set action to run: `node "C:\path\to\your\project\screenshot.js"`

## Features

- **Full Page Capture**: Takes complete screenshots of the entire ideabrowser.com page
- **Date Organization**: Automatically creates folder structure by year/month
- **Human-readable Filenames**: Uses format like "14 July 2025.png" for easy browsing
- **Reliable Operation**: Simple screenshot approach without complex page parsing
- **Automatic Commit**: GitHub Actions automatically commits new screenshots to the repository
- **High Quality**: 2x device scale factor for crisp, detailed images

## Dependencies

- Node.js
- Puppeteer (automatically installs Chrome browser)

## Troubleshooting

### Common Issues

- **File already exists**: If you run the script multiple times on the same day, it will overwrite the existing file
- **Permission errors**: Ensure the script has write permissions to create the archives folder
- **Network timeout**: The script includes a 30-second timeout for loading the page
- **Memory issues**: Full-page screenshots require more memory; ensure adequate system resources

### Script Behavior

The script follows this simple process:
1. Navigate to ideabrowser.com
2. Wait 3 seconds for the page to fully load
3. Take a full-page screenshot
4. Save to the organized folder structure

If any step fails, the script will display an error message and exit. 