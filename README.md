# payable-docs

Documentation site for [@akira-io/payable](https://github.com/akira-io/payable), built with
[Astro](https://astro.build) + [Starlight](https://starlight.astro.build). The site mirrors the
`docs/` tree of the payable repository.

## How the mirror works

The Markdown under `_docs_src/` is a copy of `docs/` from the payable repo. `scripts/sync-docs.mjs`
transforms it into Starlight content under `src/content/docs/`:

- adds frontmatter (`title` from the first `# ` heading, `sidebar.order` from the numeric prefix),
- removes the original `#` heading (Starlight renders the title) and the manual prev/index/next footers,
- rewrites internal `*.md` links to Starlight routes.

The generated `src/content/docs/` is committed so the site builds without the payable repo present.

## Refreshing the docs

```sh
# replace the raw copy, then regenerate
cp -R /path/to/payable/docs/. _docs_src/
npm run sync
```

To pull from a checkout elsewhere, set `PAYABLE_DOCS`:

```sh
PAYABLE_DOCS=/path/to/payable/docs npm run sync
```

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Deployment

Deployed on Vercel as a static Astro build (`npm run build`, output `dist/`). Pushing to `main`
triggers a redeploy through the Vercel Git integration.
