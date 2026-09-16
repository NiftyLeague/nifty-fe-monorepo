---
title: Create a Page
sidebar:
  order: 1
---

Add **Markdown or Astro** files to `src/pages` to create a **standalone page**:

- `src/pages/index.astro` → `localhost:4321/`
- `src/pages/foo.md` → `localhost:4321/foo`
- `src/pages/foo/bar.astro` → `localhost:4321/foo/bar`

## Create your first Astro Page

Create a file at `src/pages/my-astro-page.astro`:

```astro title="src/pages/my-astro-page.astro"
---
import Layout from '../layouts/Layout.astro'
---

<Layout>
  <h1>My Astro page</h1>
  <p>This is an Astro page</p>
</Layout>
```

A new page is now available at [http://localhost:4321/my-astro-page](http://localhost:4321/my-astro-page).

## Create your first Markdown Page

Create a file at `src/pages/my-markdown-page.md`:

```mdx title="src/pages/my-markdown-page.md"
# My Markdown page
```
