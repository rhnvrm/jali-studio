# Jali Studio

A terracotta jali wall designer with an editable elevation, real dimensions, a 3D rooftop preview and a solar light study.

**Website:** https://rhnvrm.github.io/jali-studio/

- 21 block forms and 53 reusable combinations, including four-block strips and a 4 × 4 Quadra bloom.
- Paint, multi-select, rotate, cut/copy/paste and move blocks with undo/redo.
- Global feet/metres display, block quantities and SVG/PNG/JSON exports.
- Latitude, longitude, date, time and wall orientation for a qualitative sun/shadow study.
- Shareable design snapshots: recipients open the link and edit an independent copy.
- Mobile controls and a keyboard guide (`?`).
- WebMCP actions for supported browser agents, with no AI API key required.

Designs and preferences are stored in the current browser. Share links contain the design in the URL fragment. This is a static app with no backend.

## Run locally

Serve `dist/` over HTTP; no build is required:

```sh
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080/.

For checks and tests, use Node.js 24:

```sh
npm ci
npm run check
npm test
```

## GitHub Pages

The workflow in `.github/workflows/pages.yml` checks the source and runs tests, then deploys the contents of `dist/` on every push to `main`. Pull requests run checks without deployment. It can also run manually from Actions.

Enable **Settings → Pages → Build and deployment → Source → GitHub Actions** once for the repository. The workflow uses GitHub's built-in token; no custom deployment secrets are required. The resulting URL is https://rhnvrm.github.io/jali-studio/.

Asset and module paths are relative, and shared links retain the `/jali-studio/` prefix. Browser storage belongs to the new GitHub Pages origin. To transfer an existing design from another host, open its shared fragment on this site or export/import its design JSON.

## Design references and limitations

Block profiles are visual approximations, not manufacturer CAD. The catalogue includes photo references attributed to [Nuvocotto](https://nuvocotto.com/products/nuvocotto-jaalis/). Photos remain subject to their owners' rights. Confirm product availability, dimensions, structural support and installation with your supplier.

The light study uses [NOAA's approximate solar equations](https://gml.noaa.gov/grad/solcalc/solareqns.PDF). Material response, atmospheric conditions and neighbouring obstructions are not a certified daylight simulation. The surrounding buildings are illustrative. No custom circle-segment blocks are included.

Three.js and OrbitControls are vendored under their MIT license in `dist/vendor/LICENSE`. The app loads Google Fonts when available and falls back to system fonts.
