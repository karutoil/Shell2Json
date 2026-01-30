# Shell2JSON 🔧📄➡️

**A small developer utility that converts raw shell scripts into JSON-escaped single-line strings (and back).** This is useful when you need to embed installation scripts or multi-line shell commands inside JSON configuration files (for example: cloud-init, container configs, or other automation manifests).

---

## Key Features ✅

- Encode: Convert a multi-line shell script into a JSON-escaped string (ready to paste into JSON files).
- Decode: Convert a JSON-escaped string (or a `"key": "value"` JSON line) back into the original multi-line script.
- Configurable JSON key name and optional trailing comma on encode.
- Instant copy-to-clipboard for the result.
- Small, client-side React app — no backend required.

---

## Quick Demo

- Paste your shell script into the **Input: Raw Shell Script** box.
- Edit the **JSON Key** if desired and toggle **Trailing Comma**.
- The **Output: JSON Line** box will show the encoded single-line JSON entry.
- Use **Switch to Decode** to convert a JSON line back into the raw script.

> Example encoded output:
>
> `"installScript": "#!/bin/sh\nset -e\necho 'Hello'\n" ,`

---

## Install & Run 🔧

**Prerequisites:** Node.js

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the app locally:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

4. Preview the production build:

   ```bash
   npm run preview
   ```

---

## Project Structure 🔍

- `App.tsx` — root layout and page shell
- `components/ShellConverter.tsx` — main encode/decode UI and logic
- `components/Header.tsx`, `components/Footer.tsx` — app chrome
- `package.json` — scripts and dependencies (React + Vite + TypeScript)

This is a small TypeScript React project built with Vite.

---

## Implementation Notes 💡

- Encoding uses `JSON.stringify(script)` to safely escape line breaks and characters.
- Decoding accepts either a plain JSON string (e.g. `"..."`) or a single `"key": "value"` pair and will attempt to parse it back to the original script.
- The UI includes a safe default example script on first load.

---

## Contributing 🤝

Contributions are welcome. Open an issue or submit a PR with a clear description of changes.

---

## License 📜

This project is licensed under the Apache License 2.0. See `LICENSE` for details.

---

## CI/CD & GitHub Pages 🚀

A GitHub Actions workflow has been added at `.github/workflows/deploy.yml` to build the Vite app and publish the `dist/` output to GitHub Pages whenever you push to the `main` branch or manually trigger the workflow.

How it works:
- The workflow runs `npm ci` and `npm run build`.
- During build the `VITE_BASE` environment variable is set automatically:
  - For project pages (e.g. `https://username.github.io/repo-name`) the base is set to `/<repo-name>/`.
  - For user/organization pages (e.g. `https://username.github.io`) the base is set to `/`.
- The built site (`dist/`) is uploaded and deployed via GitHub Pages actions.

What you need to do on GitHub:
1. Push your code to the `main` branch (the workflow runs on pushes to `main`).
2. In the repo, open **Settings → Pages** (or **Settings → Pages and deployments**) and confirm that Pages can be deployed from GitHub Actions. For most repos no extra setup is required — the workflow will create and publish the site.
3. If you need to override the base path (rare), add an Actions repository variable named `VITE_BASE` (via **Settings → Actions → Variables**) with value of `/` or `/<your-repo-name>/`.
4. Watch the Actions tab for the `Deploy to GitHub Pages` workflow; when it completes, the Pages settings will show your site URL.

Troubleshooting tips:
- If the Pages site serves broken asset paths, ensure `VITE_BASE` is set correctly (project pages need `/<repo-name>/`).
- Check the `Build` step logs in Actions and confirm the `dist/` folder is generated.

---

If you'd like, I can also add usage examples to the UI or provide tests for the encode/decode logic. 💬
