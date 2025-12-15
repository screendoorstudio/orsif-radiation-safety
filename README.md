# ORSIF - Occupational Radiation Safety Information Framework

A web application for navigating radiation safety regulations for healthcare workers in fluoroscopy labs across the United States.

## Quick Start

1. Open `index.html` in a web browser to view the site locally
2. Or deploy to any static web hosting service (GitHub Pages, Netlify, etc.)

## Project Structure

```
orsif-radiation-safety/
├── index.html              # Home page with hierarchy overview
├── states.html             # State regulation finder
├── hierarchy.html          # Interactive regulatory hierarchy
├── resources.html          # PDF library with filters
├── about.html              # About page
├── README.md               # This file
│
├── css/
│   └── styles.css          # All styling
│
├── js/
│   ├── app.js              # Core utilities
│   ├── states.js           # State finder logic
│   ├── hierarchy.js        # Hierarchy page logic
│   └── resources.js        # Resource library logic
│
├── data/                   # EDITABLE DATA FILES
│   ├── states.json         # State information
│   ├── hierarchy.json      # Regulatory hierarchy
│   ├── resources.json      # PDF library metadata
│   └── dose-limits.json    # Dose limits data
│
└── pdfs/                   # PDF documents
    ├── Federal_National/
    ├── State_Regulations/
    ├── Hospital_University_Manuals/
    └── Training_Educational/
```

---

## How to Edit Content (No Coding Required!)

All content is stored in JSON files in the `data/` folder. You can edit these files with any text editor or directly in GitHub.

### Editing State Information (`data/states.json`)

To add or modify state data:

```json
{
  "CA": {
    "name": "California",
    "abbreviation": "CA",
    "agency": "California Department of Public Health, Radiologic Health Branch",
    "agreementState": true,
    "keyFeatures": [
      "Requires physician fluoroscopy certification exam",
      "Specific CME requirements for permit renewal"
    ],
    "contact": {
      "phone": "(916) 327-5106",
      "website": "https://www.cdph.ca.gov/Programs/CEH/DRSEM/Pages/RHB.aspx"
    },
    "links": [
      {"label": "RHB Main Website", "url": "https://..."},
      {"label": "Laws and Regulations", "url": "https://..."}
    ],
    "pdfs": [
      {"name": "Document Title", "file": "CA_Filename.pdf"}
    ]
  }
}
```

**Key fields:**
- `name`: Full state name
- `agreementState`: `true` or `false` (NRC Agreement State status)
- `keyFeatures`: Array of important points about this state
- `links`: Array of `{label, url}` pairs
- `pdfs`: Array of `{name, file}` pairs (file path relative to `pdfs/State_Regulations/`)

### Editing the PDF Library (`data/resources.json`)

To add a new PDF resource:

```json
{
  "id": "unique-id",
  "title": "Document Title",
  "organization": "AAPM",
  "category": "federal",
  "state": "CA",
  "description": "Brief description of the document",
  "file": "Federal_National/filename.pdf",
  "externalUrl": "https://original-source-url.pdf",
  "tags": ["fluoroscopy", "safety", "guidelines"]
}
```

**Categories:**
- `federal` - Federal/National organization documents
- `state` - State regulations
- `hospital` - Hospital/University manuals
- `training` - Training/Educational materials

**Note:** The `file` path is relative to the `pdfs/` folder.

### Editing the Hierarchy (`data/hierarchy.json`)

The hierarchy file is more complex. Each level contains different types of content:

- **Federal level**: Has `agencies` array
- **State level**: Has `content` object
- **Accreditation level**: Has `organizations` array
- **Professional level**: Has `organizations` and `internationalOrganizations`
- **Institutional level**: Has `components` array
- **Individual level**: Has `components` array

See the existing file for examples of each structure.

### Editing Dose Limits (`data/dose-limits.json`)

Contains OSHA, NRC, and ICRP dose limit data. Update values as regulations change.

---

## Adding New PDFs

1. Place the PDF file in the appropriate subfolder under `pdfs/`:
   - `Federal_National/` - Federal agency documents
   - `State_Regulations/` - State-specific regulations
   - `Hospital_University_Manuals/` - Institutional documents
   - `Training_Educational/` - Training materials

2. Add an entry in `data/resources.json` with the file path

3. If it's a state document, also add it to the state's entry in `data/states.json`

---

## Deployment Options

### Option 1: GitHub Pages (Recommended - Free)

1. Create a GitHub repository
2. Push all files to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch" and choose `main` branch
5. Your site will be at: `https://yourusername.github.io/repository-name/`

### Option 2: Netlify (Free)

1. Go to netlify.com and sign up
2. Drag and drop the `orsif-radiation-safety` folder
3. Get your URL immediately

### Option 3: Any Static Web Host

This site is pure HTML/CSS/JavaScript with no build step. It works on any static hosting:
- Vercel
- Cloudflare Pages
- Amazon S3
- Any traditional web server

---

## Editing via GitHub (No Software Needed)

1. Go to your GitHub repository
2. Navigate to `data/states.json` (or any data file)
3. Click the pencil icon to edit
4. Make your changes
5. Click "Commit changes"
6. Changes go live automatically (if using GitHub Pages)

---

## Troubleshooting

### Site doesn't load locally
- Make sure you're opening `index.html` directly in a browser
- Some browsers block local file loading. Try using a local server:
  ```bash
  # Python 3
  python -m http.server 8000

  # Then visit http://localhost:8000
  ```

### JSON syntax errors
- Use a JSON validator: https://jsonlint.com/
- Common issues:
  - Missing commas between items
  - Trailing commas after last item
  - Unescaped quotes in strings

### PDFs not downloading
- Check that the file path in `resources.json` matches the actual file location
- Verify the file exists in the `pdfs/` folder

---

## Technical Details

- **No build step required** - Edit files directly
- **No database** - All data in JSON files
- **No server-side code** - Runs entirely in browser
- **Responsive design** - Works on mobile and desktop
- **No dependencies** - Pure HTML/CSS/JavaScript

---

## Contributing

To suggest changes or report issues:
1. Check the accuracy of information against official sources
2. Note any broken links or outdated content
3. Submit corrections via GitHub issues or pull requests

---

## License

Content compiled from public sources. Individual documents retain their original copyright.

---

*Last Updated: December 2025*
