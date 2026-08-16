# Quick Start Guide

Get your AI Architecture Hub up and running in minutes!

## Prerequisites

- Node.js 22.12.0 or later
- npm or yarn
- A code editor (VS Code recommended)

## Installation & First Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The site will be available at `http://localhost:3000`

### 3. Make Your First Edit
- Open `src/pages/index.astro` and edit the homepage
- Changes auto-refresh in the browser

## Project Structure Quick Reference

```
src/
├── pages/              # Website pages and routes
├── content/            # Markdown files (patterns, tools, guides, blog)
├── components/         # Reusable UI components
├── layouts/            # Page layouts
└── styles/             # CSS styling

dist/                   # Built site (after npm run build)
```

## Common Tasks

### Add a New Pattern
1. Create file: `src/content/patterns/my-pattern.md`
2. Add frontmatter:
   ```yaml
   ---
   title: "My Pattern"
   description: "Brief description"
   pubDate: 2024-08-16
   tags: ["architecture", "design"]
   ---
   ```
3. Write content in markdown
4. Access at `/patterns/my-pattern/`

### Add a New Tool Review
1. Create file: `src/content/tools/my-tool.md`
2. Add frontmatter:
   ```yaml
   ---
   title: "Tool Name"
   description: "What it does"
   pubDate: 2024-08-16
   category: "frameworks"
   url: "https://tool-website.com"
   tags: ["python"]
   ---
   ```
3. Write review in markdown
4. Access at `/tools/my-tool/`

### Add a New Guide
1. Create file: `src/content/guides/my-guide.md`
2. Add frontmatter (same as patterns)
3. Write step-by-step instructions
4. Access at `/guides/my-guide/`

### Edit Homepage
Open `src/pages/index.astro` and:
- Change hero section text
- Update section descriptions
- Modify key topics grid
- Edit CTA buttons

### Update Navigation
Edit `src/components/Header.astro`:
```astro
<HeaderLink href="/patterns">Patterns</HeaderLink>
```

## Available Commands

```bash
# Development server (with auto-refresh)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run Astro CLI commands
npm run astro -- [command]
```

## Frontmatter Guide

### Required Fields (All Content Types)
```yaml
---
title: "Article Title"
description: "1-2 sentence summary"
pubDate: 2024-08-16
---
```

### Optional Fields (All Content Types)
```yaml
updatedDate: 2024-08-17
heroImage: ./path/to/image.png
tags: ["tag1", "tag2"]
```

### Tools-Only Fields
```yaml
category: "frameworks"  # For grouping
url: "https://website"  # Official site link
```

## Writing Tips

### Markdown Syntax Quick Reference

**Bold**: `**text**`
**Italic**: `*text*`
**Heading 2**: `## Title`
**Heading 3**: `### Subtitle`

**Lists**:
```markdown
- Item 1
- Item 2

1. First
2. Second
```

**Code**:
````markdown
```python
print("Hello")
```
````

**Links**:
```markdown
[Link text](https://url.com)
```

**Images**:
```markdown
![Alt text](./image.png)
```

**Tables**:
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

## Content Ideas to Get Started

### Easy Additions (1-2 hours each):
1. **Tool Review**: OpenAI GPT, Claude, Ollama
2. **Pattern**: Few-Shot Learning, Error Handling
3. **Guide**: Choosing Your First LLM
4. **Blog Post**: Weekly AI Architecture News

### Medium Additions (2-4 hours):
1. **Pattern Deep Dive**: Production RAG Architecture
2. **Comparison**: 10 LLM Models Compared
3. **Guide**: Building a Real RAG System
4. **Resources**: Embedding Model Benchmarks

### Larger Projects (4+ hours):
1. **Case Study**: Your own AI project success story
2. **Matrix**: Comprehensive tool comparison
3. **Framework Guide**: Enterprise AI Architecture
4. **Research Summary**: Recent important papers

See `CONTENT_ROADMAP.md` for 50+ additional content ideas!

## Debugging Tips

### Content Not Appearing
- Check frontmatter is valid YAML
- Verify file is in correct collection directory
- Rebuild: `npm run build`
- Check browser console for errors

### Build Errors
- Check error message for file path
- Verify date format: `2024-08-16` (not `new Date()`)
- Look for unclosed tags or markdown syntax errors
- Run `npm run build` to see full error

### Styling Issues
- Hard refresh browser (Ctrl+Shift+R)
- Check CSS variable names in `global.css`
- Verify Tailwind classes are valid

### Local Development Issues
- Clear cache: `rm -rf .astro`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node version: `node --version`

## Deploy Your Site

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages
1. Update `site` in `astro.config.mjs`:
   ```javascript
   site: 'https://yourusername.github.io/ai-architecture'
   ```
2. Push to GitHub
3. Enable GitHub Pages in repo settings

## Customize Your Site

### Change Colors
Edit `src/pages/index.astro` and search for:
- `#667eea` (primary color - purple)
- `#764ba2` (secondary color - darker purple)

Replace with your brand colors throughout the file.

### Change Site Name
Edit `src/consts.ts`:
```typescript
export const SITE_TITLE = 'Your Site Name';
export const SITE_DESCRIPTION = 'Your description';
```

### Change Social Links
Edit `src/components/Header.astro` in the `social-links` section

### Modify Footer
Edit `src/components/Footer.astro`

### Update About Page
Edit or create `src/pages/about.astro`

## Performance Optimization

The site is already optimized:
- ✅ 100/100 Lighthouse score potential
- ✅ Automatic image optimization
- ✅ Minimal CSS (Tailwind)
- ✅ Fast static site generation
- ✅ Sitemap and RSS feeds included

Monitor performance with:
```bash
npm run build
npm run preview
# Visit https://pagespeed.web.dev
```

## SEO Best Practices

For each piece of content:
1. **Use descriptive titles** (50-60 characters)
2. **Write compelling descriptions** (150-160 characters)
3. **Include relevant tags** (3-5 per article)
4. **Link to related content** where appropriate
5. **Use clear headings** (h2, h3)
6. **Include code examples** (improves time-on-page)

Metadata is automatically added to:
- `<title>` tags
- Open Graph cards (social sharing)
- Structured data (search engines)
- Sitemap (SEO)

## Next Steps

1. **Customize** the homepage colors and text
2. **Add 1 content piece** (pattern, tool, or guide)
3. **Deploy** to Vercel, Netlify, or GitHub Pages
4. **Share** with your network
5. **Continuously add** content from `CONTENT_ROADMAP.md`

## Need Help?

- **Astro Docs**: https://docs.astro.build
- **Markdown Guide**: https://www.markdownguide.org
- **Content Collections**: https://docs.astro.build/en/guides/content-collections/
- **Tailwind CSS**: https://tailwindcss.com

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/pages/index.astro` | Homepage |
| `src/consts.ts` | Site constants and navigation |
| `astro.config.mjs` | Astro configuration |
| `src/content.config.ts` | Content collection schemas |
| `src/components/Header.astro` | Site navigation |
| `src/styles/global.css` | Global styles |

## Example Content Frontmatter

### Pattern
```yaml
---
title: "Agentic Loops: Building Autonomous Systems"
description: "Learn to build systems with reasoning and action cycles"
pubDate: 2024-08-16
tags: ["patterns", "architecture", "agents"]
---
```

### Tool
```yaml
---
title: "OpenAI GPT-4"
description: "Powerful multi-modal LLM with function calling"
pubDate: 2024-08-16
category: "LLM Providers"
url: "https://openai.com/gpt-4"
tags: ["llm", "multimodal", "function-calling"]
---
```

### Guide
```yaml
---
title: "Building Your First RAG System"
description: "Step-by-step guide to creating a retrieval-augmented generation application"
pubDate: 2024-08-16
tags: ["guide", "implementation", "rag"]
---
```

---

**Ready to go?** Start with:
```bash
npm run dev
# Open http://localhost:3000
# Edit src/pages/index.astro
# Create your first content file!
```

Happy building! 🚀
