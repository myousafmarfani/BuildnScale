# Third-party notices

BuildnScale's original source code and accompanying documentation are licensed
under the [MIT License](LICENSE). That license does not replace the licenses of
third-party components.

## Bundled fonts

The following font files are distributed in `public/fonts/` and used by the site.
Their copyright statements were checked against the metadata embedded in the
bundled WOFF2 files. Each font remains under the SIL Open Font License, version 1.1.

| Font | Bundled file | Copyright holder | Full license |
| --- | --- | --- | --- |
| DM Sans | `public/fonts/DM_Sans.woff2` | Copyright 2014 The DM Sans Project Authors | [OFL-DM-Sans.txt](public/fonts/OFL-DM-Sans.txt) |
| JetBrains Mono | `public/fonts/JetBrains_Mono.woff2` | Copyright 2020 The JetBrains Mono Project Authors | [OFL-JetBrains-Mono.txt](public/fonts/OFL-JetBrains-Mono.txt) |

Upstream license sources:

- [DM Sans license in Google Fonts](https://github.com/google/fonts/blob/main/ofl/dmsans/OFL.txt)
- [JetBrains Mono license](https://github.com/JetBrains/JetBrainsMono/blob/master/OFL.txt)

The font license texts are supplied unchanged apart from normalized line endings.
Retain them and the font copyright notices when redistributing these files.

## Software dependencies

Runtime and development dependencies are declared in [package.json](package.json)
and resolved in [pnpm-lock.yaml](pnpm-lock.yaml). They remain under their respective
upstream licenses; they are not relicensed by the root MIT license. Preserve the
license and attribution files supplied with those packages when redistributing
their code or a bundled application.

This file documents the bundled fonts and the handling of package-managed
software. It is not a replacement for the license/NOTICE files in individual
packages or a claim of a complete transitive dependency audit.

## EvalPlus benchmark results

`data/benchmarks/upstream/evalplus.json` is an unmodified copy of EvalPlus results
from `evalplus/evalplus.github.io` revision
`87418456d3a8c2bc6265f24ff91d2dd0e7993f4b`, retrieved 26 October 2026.
Copyright remains with the EvalPlus contributors. Distributed under Apache-2.0;
the full license is in `data/benchmarks/licenses/EvalPlus-Apache-2.0.txt`.
The normalized snapshot and displayed rankings are transformations by BuildnScale.
No EvalPlus evaluations were rerun. Model weights, task text, and logos are not included.

Source: https://github.com/evalplus/evalplus.github.io
