/**
 * Token Exporter — Figma Plugin
 *
 * Reads all local variables and text styles from the current Figma file,
 * transforms them into Style Dictionary DTCG format, and displays the
 * JSON for copying into tokens/figma.raw.json in the repo.
 *
 * Variable aliases (e.g. semantic tokens referencing primitives) are
 * output as DTCG reference syntax: {primitives.color.neutral.900}
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Converts a Figma RGBA color (0–1 floats) to a CSS hex string. */
function rgbaToHex(color: RGBA): string {
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, "0");
  const hex = `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  return color.a < 1 ? `${hex}${toHex(color.a)}` : hex;
}

/** Sets a value at a slash-separated path on a nested object. */
function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  const parts = path.split("/");
  let node = obj as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!node[parts[i]]) node[parts[i]] = {};
    node = node[parts[i]] as Record<string, unknown>;
  }
  node[parts[parts.length - 1]] = value;
}

/**
 * Determines the correct DTCG $type for a FLOAT variable by inspecting
 * its Figma scopes. Dimensional scopes (CORNER_RADIUS, FONT_SIZE, etc.)
 * map to "dimension" and will be output with px units. Unitless scopes
 * (FONT_WEIGHT, LINE_HEIGHT, OPACITY) stay as "number".
 */
const DIMENSIONAL_SCOPES: ReadonlyArray<VariableScope> = [
  "CORNER_RADIUS",
  "WIDTH_HEIGHT",
  "GAP",
  "FONT_SIZE",
  "STROKE_FLOAT",
  "PARAGRAPH_SPACING",
];

const UNITLESS_SCOPES: ReadonlyArray<VariableScope> = [
  "FONT_WEIGHT",
  "LINE_HEIGHT",
  "OPACITY",
];

function floatTokenType(variable: Variable): "dimension" | "number" {
  const { scopes } = variable;
  if (scopes.some((s) => UNITLESS_SCOPES.includes(s))) return "number";
  if (scopes.includes("ALL_SCOPES")) return "number"; // ambiguous — stay safe
  if (scopes.some((s) => DIMENSIONAL_SCOPES.includes(s))) return "dimension";
  return "number"; // safe default
}

/**
 * Maps Figma font style strings to numeric CSS font-weight values.
 * Handles composite style names like "Bold Italic" by substring match.
 */
const FONT_WEIGHT_MAP: Record<string, number> = {
  "Thin": 100,
  "ExtraLight": 200, "Extra Light": 200,
  "Light": 300,
  "Regular": 400, "Normal": 400,
  "Medium": 500,
  "SemiBold": 600, "Semi Bold": 600,
  "Bold": 700,
  "ExtraBold": 800, "Extra Bold": 800,
  "Black": 900, "Heavy": 900,
};

function fontStyleToWeight(style: string): number {
  for (const [key, value] of Object.entries(FONT_WEIGHT_MAP)) {
    if (style.includes(key)) return value;
  }
  return 400;
}

/** Converts a Figma LineHeight to a CSS-ready value. */
function lineHeightToCss(lh: LineHeight): string | number {
  if (lh.unit === "AUTO") return "normal";
  if (lh.unit === "PIXELS") return `${lh.value}px`;
  return lh.value / 100; // PERCENT → unitless ratio (e.g. 150% → 1.5)
}

/** Converts a Figma LetterSpacing to a CSS-ready value. */
function letterSpacingToCss(ls: LetterSpacing): string {
  if (ls.unit === "PIXELS") return ls.value === 0 ? "0" : `${ls.value}px`;
  return ls.value === 0 ? "0" : `${ls.value / 100}em`; // PERCENT → em
}

// ---------------------------------------------------------------------------
// Variable tokens
// ---------------------------------------------------------------------------

function buildVariableTokens(): Record<string, unknown> {
  const variables = figma.variables.getLocalVariables();
  const collections = figma.variables.getLocalVariableCollections();
  const collectionMap = new Map(collections.map((c) => [c.id, c]));
  const variableMap = new Map(variables.map((v) => [v.id, v]));

  const tokens: Record<string, unknown> = {};

  for (const variable of variables) {
    const collection = collectionMap.get(variable.variableCollectionId);
    if (!collection) continue;

    const isMultiMode = collection.modes.length > 1;

    for (const mode of collection.modes) {
      const rawValue = variable.valuesByMode[mode.modeId];

      // Build the top-level key: single-mode uses collection name,
      // multi-mode uses "{collectionName}-{modeName}" to separate themes.
      const collectionKey = isMultiMode
        ? `${collection.name}-${mode.name}`
        : collection.name;

      const tokenPath = `${collectionKey.toLowerCase()}/${variable.name}`
        .replace(/\s+/g, "-");

      // Alias reference: translate to DTCG {collection.path.to.token} syntax.
      // For multi-mode referenced collections, append the current mode name so
      // the reference resolves to the correct themed key in the JSON output
      // (e.g. {semantic-light.color.alert.error-text} instead of {semantic.…}).
      if (
        typeof rawValue === "object" &&
        rawValue !== null &&
        "type" in rawValue &&
        (rawValue as VariableAlias).type === "VARIABLE_ALIAS"
      ) {
        const alias = rawValue as VariableAlias;
        const referencedVar = variableMap.get(alias.id);
        if (!referencedVar) continue;

        const referencedCollection = collectionMap.get(
          referencedVar.variableCollectionId
        );
        if (!referencedCollection) continue;

        const refIsMultiMode = referencedCollection.modes.length > 1;
        const sanitizedModeName = mode.name.toLowerCase().replace(/\s+/g, "-");
        const refCollectionKey = refIsMultiMode
          ? `${referencedCollection.name.toLowerCase().replace(/\s+/g, "-")}-${sanitizedModeName}`
          : referencedCollection.name.toLowerCase().replace(/\s+/g, "-");

        const refVarName = referencedVar.name.replace(/\s+/g, "-");
        const refPath = `${refCollectionKey}/${refVarName}`;
        const $value = `{${refPath.replace(/\//g, ".")}}`;
        const $type =
          referencedVar.resolvedType === "COLOR" ? "color" :
          referencedVar.resolvedType === "FLOAT" ? floatTokenType(referencedVar) : "string";

        setNestedValue(tokens, tokenPath, { $value, $type });
        continue;
      }

      // Direct value
      let $value: unknown;
      let $type: string;

      switch (variable.resolvedType) {
        case "COLOR":
          $value = rgbaToHex(rawValue as RGBA);
          $type = "color";
          break;
        case "FLOAT": {
          const floatType = floatTokenType(variable);
          $type = floatType;
          $value = floatType === "dimension"
            ? `${rawValue as number}px`
            : rawValue as number;
          break;
        }
        case "STRING":
          $value = rawValue as string;
          $type = "string";
          break;
        case "BOOLEAN":
          $value = rawValue as boolean;
          $type = "boolean";
          break;
        default:
          continue;
      }

      setNestedValue(tokens, tokenPath, { $value, $type });
    }
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// Typography tokens (from Figma Text Styles)
// ---------------------------------------------------------------------------

function buildTypographyTokens(): Record<string, unknown> {
  const textStyles = figma.getLocalTextStyles();
  const tokens: Record<string, unknown> = {};

  for (const style of textStyles) {
    // Sanitize: lowercase, spaces → hyphens, preserve slashes as path separators
    const sanitizedName = style.name
      .toLowerCase()
      .replace(/\s+/g, "-");

    const tokenPath = `typography/${sanitizedName}`;

    const $value = {
      fontFamily: style.fontName.family,
      fontWeight: fontStyleToWeight(style.fontName.style),
      fontSize: `${style.fontSize}px`,
      lineHeight: lineHeightToCss(style.lineHeight),
      letterSpacing: letterSpacingToCss(style.letterSpacing),
    };

    setNestedValue(tokens, tokenPath, { $value, $type: "typography" });
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

const UI_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: Inter, -apple-system, sans-serif;
      font-size: 12px;
      background: #1e1e1e;
      color: #e0e0e0;
      padding: 16px;
      height: 100vh;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    h1 {
      font-size: 13px;
      font-weight: 600;
      color: #ffffff;
    }

    .settings {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .settings label {
      font-size: 11px;
      color: #999;
      white-space: nowrap;
    }

    .settings input {
      flex: 1;
      background: #2c2c2c;
      border: 1px solid #3a3a3a;
      border-radius: 4px;
      color: #e0e0e0;
      font-size: 11px;
      padding: 5px 8px;
      outline: none;
    }

    .settings input:focus { border-color: #0d99ff; }

    textarea {
      flex: 1;
      width: 100%;
      background: #2c2c2c;
      border: 1px solid #3a3a3a;
      border-radius: 4px;
      color: #cde;
      font-family: "Fira Mono", "Courier New", monospace;
      font-size: 11px;
      line-height: 1.5;
      padding: 10px;
      resize: none;
      outline: none;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    button {
      background: #0d99ff;
      border: none;
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      padding: 8px 16px;
      white-space: nowrap;
    }

    button:hover { background: #0a7fd4; }
    button:disabled { background: #444; color: #777; cursor: not-allowed; }

    button.secondary {
      background: #2c2c2c;
      border: 1px solid #3a3a3a;
      color: #e0e0e0;
    }

    button.secondary:hover { background: #383838; }

    .status {
      font-size: 11px;
      opacity: 0;
      transition: opacity 0.2s;
      flex: 1;
    }

    .status.visible { opacity: 1; }
    .status.ok { color: #5dba7d; }
    .status.err { color: #e06c75; }
  </style>
</head>
<body>
  <h1>Token Exporter</h1>

  <div class="settings">
    <label for="gh-token">GitHub token</label>
    <input type="password" id="gh-token" placeholder="ghp_…" autocomplete="off" />
    <button class="secondary" id="save-token">Save</button>
  </div>

  <textarea id="output" readonly placeholder="Loading tokens…"></textarea>

  <div class="actions">
    <button id="copy" class="secondary">Copy</button>
    <button id="commit" disabled>Commit to GitHub</button>
    <span class="status" id="status"></span>
  </div>

  <script>
    const output    = document.getElementById('output');
    const copyBtn   = document.getElementById('copy');
    const commitBtn = document.getElementById('commit');
    const tokenInput = document.getElementById('gh-token');
    const saveBtn   = document.getElementById('save-token');
    const status    = document.getElementById('status');

    const OWNER  = 'james-bearings-ux';
    const REPO   = 'personal-site';
    const PATH   = 'tokens/figma.raw.json';
    const BRANCH = 'main';

    function showStatus(msg, isError) {
      status.textContent = msg;
      status.className = 'status visible ' + (isError ? 'err' : 'ok');
      setTimeout(function() { status.className = 'status'; }, 3000);
    }

    // Receive messages from the plugin main thread
    window.onmessage = function(event) {
      var msg = event.data.pluginMessage;
      if (!msg) return;

      if (msg.type === 'TOKENS') {
        output.value = msg.payload;
      }

      if (msg.type === 'GITHUB_TOKEN') {
        if (msg.token) {
          tokenInput.value = msg.token;
          commitBtn.disabled = false;
        }
      }

      if (msg.type === 'TOKEN_SAVED') {
        showStatus('Token saved.', false);
        commitBtn.disabled = !tokenInput.value;
      }
    };

    // Copy to clipboard
    copyBtn.onclick = function() {
      output.select();
      document.execCommand('copy');
      showStatus('Copied!', false);
    };

    // Save GitHub token via plugin storage
    saveBtn.onclick = function() {
      parent.postMessage({ pluginMessage: { type: 'SAVE_TOKEN', token: tokenInput.value.trim() } }, '*');
    };

    tokenInput.addEventListener('input', function() {
      commitBtn.disabled = !tokenInput.value.trim();
    });

    // Commit to GitHub via Contents API
    commitBtn.onclick = async function() {
      var token = tokenInput.value.trim();
      var content = output.value;
      if (!token || !content) return;

      commitBtn.disabled = true;
      showStatus('Committing…', false);

      try {
        // 1. Get current file SHA
        var getRes = await fetch(
          'https://api.github.com/repos/' + OWNER + '/' + REPO + '/contents/' + PATH + '?ref=' + BRANCH,
          { headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' } }
        );
        if (!getRes.ok) throw new Error('Could not read current file (' + getRes.status + ')');
        var fileData = await getRes.json();

        // 2. Base64-encode the new content (UTF-8 safe)
        var bytes = new TextEncoder().encode(content);
        var binary = Array.from(bytes).map(function(b) { return String.fromCharCode(b); }).join('');
        var encoded = btoa(binary);

        // 3. PUT the updated file
        var putRes = await fetch(
          'https://api.github.com/repos/' + OWNER + '/' + REPO + '/contents/' + PATH,
          {
            method: 'PUT',
            headers: {
              Authorization: 'Bearer ' + token,
              Accept: 'application/vnd.github+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: 'Update tokens from Figma',
              content: encoded,
              sha: fileData.sha,
              branch: BRANCH,
            }),
          }
        );
        if (!putRes.ok) {
          var err = await putRes.json();
          throw new Error(err.message || 'Commit failed (' + putRes.status + ')');
        }

        showStatus('Committed to ' + BRANCH + ' ✓', false);
      } catch(e) {
        showStatus(e.message, true);
      } finally {
        commitBtn.disabled = false;
      }
    };

    // Request stored token on load
    parent.postMessage({ pluginMessage: { type: 'GET_TOKEN' } }, '*');
  </script>
</body>
</html>
`;

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

figma.showUI(UI_HTML, { width: 480, height: 560, title: "Token Exporter" });

const tokens = {
  ...buildVariableTokens(),
  ...buildTypographyTokens(),
};

figma.ui.postMessage({
  type: "TOKENS",
  payload: JSON.stringify(tokens, null, 2),
});

// Handle token storage requests from the UI iframe.
// figma.clientStorage is only accessible from the main plugin thread.
figma.ui.onmessage = async (msg: { type: string; token?: string }) => {
  if (msg.type === "GET_TOKEN") {
    const token = await figma.clientStorage.getAsync("github-token");
    figma.ui.postMessage({ type: "GITHUB_TOKEN", token: token ?? "" });
  }
  if (msg.type === "SAVE_TOKEN") {
    await figma.clientStorage.setAsync("github-token", msg.token ?? "");
    figma.ui.postMessage({ type: "TOKEN_SAVED" });
  }
};
