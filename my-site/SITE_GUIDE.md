# AI Architecture Hub - Site Documentation

## Overview

This is an Astro-based resource site for enterprise software architects focused on AI-native solutions. The site covers patterns, tools, implementation guides, and articles.

## Site Structure

```
src/
├── pages/
│   ├── index.astro              # Homepage
│   ├── patterns/
│   │   ├── index.astro          # Patterns listing page
│   │   └── [...slug].astro      # Dynamic pattern pages
│   ├── tools/
│   │   ├── index.astro          # Tools listing page
│   │   └── [...slug].astro      # Dynamic tool pages
│   ├── guides/
│   │   ├── index.astro          # Guides listing page
│   │   └── [...slug].astro      # Dynamic guide pages
│   └── blog/
│       ├── index.astro          # Blog listing page
│       └── [...slug].astro      # Dynamic blog pages
├── content/
│   ├── patterns/                # Pattern articles (markdown)
│   ├── tools/                   # Tool reviews (markdown)
│   ├── guides/                  # Implementation guides (markdown)
│   └── blog/                    # Blog posts (markdown/mdx)
├── layouts/
│   ├── BlogPost.astro           # Blog post layout
│   └── ContentPage.astro        # Generic content layout
├── components/
│   ├── Header.astro             # Navigation header
│   ├── Footer.astro             # Footer
│   ├── HeaderLink.astro         # Navigation link
│   └── BaseHead.astro           # Head meta tags
├── styles/
│   └── global.css               # Global styles
└── consts.ts                    # Site constants & configuration
```

## Content Collections

The site uses Astro's content collections system for organizing content:

### 1. Patterns Collection
- **Location**: `src/content/patterns/`
- **Purpose**: Architecture patterns and design approaches
- **Examples**: Agentic Architecture, RAG, Prompt Engineering
- **Frontmatter**:
  ```yaml
  ---
  title: "Pattern Title"
  description: "Short description of the pattern"
  pubDate: new Date("2024-08-15")
  updatedDate: new Date("2024-08-16")  # Optional
  heroImage: ./image.png                # Optional
  tags: ["tag1", "tag2"]               # Optional
  ---
  ```

### 2. Tools Collection
- **Location**: `src/content/tools/`
- **Purpose**: Tools, frameworks, and technologies
- **Examples**: LangChain, Vector Databases
- **Frontmatter**:
  ```yaml
  ---
  title: "Tool Name"
  description: "What this tool does"
  pubDate: new Date("2024-08-15")
  category: "frameworks"              # frameworks, databases, platforms, etc.
  url: "https://example.com"         # Optional - link to tool website
  tags: ["tag1", "tag2"]
  ---
  ```

### 3. Guides Collection
- **Location**: `src/content/guides/`
- **Purpose**: Step-by-step implementation guides
- **Examples**: POC to Production, Getting Started with RAG
- **Frontmatter** (same as patterns):
  ```yaml
  ---
  title: "Guide Title"
  description: "What you'll learn"
  pubDate: new Date("2024-08-15")
  tags: ["implementation", "production"]
  ---
  ```

### 4. Blog Collection
- **Location**: `src/content/blog/`
- **Purpose**: Articles, case studies, updates
- **Frontmatter** (same as patterns):
  ```yaml
  ---
  title: "Article Title"
  description: "Article summary"
  pubDate: new Date("2024-08-15")
  tags: ["topic"]
  ---
  ```

## Adding Content

### Creating a New Pattern

1. Create a new file in `src/content/patterns/`:
   ```
   my-pattern.md
   ```

2. Add frontmatter and content:
   ```markdown
   ---
   title: "My Architecture Pattern"
   description: "How to implement this pattern"
   pubDate: new Date("2024-08-16")
   tags: ["architecture", "patterns"]
   ---

   ## Overview
   Explain the pattern...

   ## When to Use
   ...
   ```

3. The page will automatically be available at `/patterns/my-pattern/`

### Creating a Tool Review

1. Create a new file in `src/content/tools/`:
   ```
   my-tool.md
   ```

2. Add frontmatter with category and link:
   ```markdown
   ---
   title: "My Tool"
   description: "What this tool does"
   pubDate: new Date("2024-08-16")
   category: "frameworks"
   url: "https://mytool.io"
   tags: ["python", "orchestration"]
   ---

   ## Overview
   ...
   ```

3. Available at `/tools/my-tool/`, grouped by category on listing page

### Creating an Implementation Guide

1. Create in `src/content/guides/`:
   ```
   my-guide.md
   ```

2. Include step-by-step instructions with code examples
3. Available at `/guides/my-guide/`

## Configuration

### Site Constants
Edit `src/consts.ts`:
```typescript
export const SITE_TITLE = 'AI Architecture Hub';
export const SITE_DESCRIPTION = 'Enterprise patterns and tools for AI systems';
export const SITE_URL = 'https://ai-architecture.dev';

export const NAVIGATION = [
  { href: '/', label: 'Home' },
  { href: '/patterns/', label: 'Patterns' },
  // ... more links
];
```

### Astro Configuration
Edit `astro.config.mjs`:
- Update `site` URL (affects sitemap and RSS)
- Modify integrations
- Configure build settings

### Content Configuration
Edit `src/content.config.ts`:
- Add/modify content collections
- Update schema validation
- Add new fields to frontmatter

## Styling

### Global Styles
- Located in `src/styles/global.css`
- Tailwind CSS is configured (can use utility classes)

### Component Styles
- Use Astro's `<style>` tags
- Scoped per component
- Access CSS variables (e.g., `var(--accent)`)

### Homepage
The homepage uses custom styled sections. Modify colors in:
- `src/pages/index.astro` (gradient colors, card styles)

## Navigation & Menus

### Update Header Links
Edit `src/components/Header.astro`:
```astro
<HeaderLink href="/patterns">Patterns</HeaderLink>
<HeaderLink href="/tools">Tools</HeaderLink>
```

### Update Homepage Links
Edit `src/pages/index.astro`:
- Update CTA button links
- Modify section card descriptions
- Change feature grid items

## Building & Deployment

### Local Development
```bash
npm run dev
```
Server runs at `http://localhost:3000`

### Build for Production
```bash
npm run build
```
Creates optimized static site in `dist/`

### Preview Production Build
```bash
npm run preview
```

## Content Best Practices

### Writing Patterns
- Start with problem statement
- Explain the solution
- Provide implementation examples
- Discuss trade-offs and when to use
- Include "When NOT to use" section
- Link to related resources

### Writing Tool Reviews
- Start with overview and use case
- List key features
- Include comparison table with alternatives
- Discuss integration points
- Provide getting started example
- Note pros and cons

### Writing Guides
- Number or name your steps clearly
- Include code examples where helpful
- Use diagrams or ASCII art for flows
- Provide before/after scenarios
- Include troubleshooting section
- Add links to related guides

## Adding More Sections

To add a new section (e.g., "Case Studies"):

1. Create content directory:
   ```
   src/content/case-studies/
   ```

2. Update `src/content.config.ts`:
   ```typescript
   const caseStudies = defineCollection({
     loader: glob({ base: './src/content/case-studies', pattern: '**/*.{md,mdx}' }),
     schema: contentSchema,
   });
   
   export const collections = { blog, patterns, tools, guides, caseStudies };
   ```

3. Create pages:
   ```
   src/pages/case-studies/index.astro
   src/pages/case-studies/[...slug].astro
   ```

4. Update navigation in `Header.astro` and `consts.ts`

## Frontmatter Schema

All content types support:

```yaml
title: string              # Required - article title
description: string       # Required - short description
pubDate: Date             # Required - publication date
updatedDate: Date         # Optional - last update date
heroImage: Image file     # Optional - featured image
tags: array of strings    # Optional - topic tags
```

Tools collection also supports:
```yaml
category: string          # Tool category (for grouping)
url: string              # Link to official website/docs
```

## SEO & Performance

### Automatic Features
- ✅ Sitemap generation (via `@astrojs/sitemap`)
- ✅ RSS feeds (via `@astrojs/rss`)
- ✅ Image optimization
- ✅ Meta tags (title, description, Open Graph)
- ✅ 100/100 Lighthouse performance target

### Customize Metadata
Edit `src/components/BaseHead.astro`:
- Update meta tags
- Modify Open Graph settings
- Change favicon

## Markdown & MDX Features

Content supports:
- Standard markdown
- MDX (embed React components)
- Syntax highlighting
- Tables
- Lists
- Code blocks
- Images with optimization

### Code Blocks
````markdown
```python
# Python code example
def example():
    pass
```
````

### Embedding Images
```markdown
![Alt text](./path/to/image.png)
```

## Performance Tips

1. **Compress images** before adding them
2. **Use semantic HTML** in content
3. **Limit content size** - very long posts may need splitting
4. **Optimize code examples** - keep them readable
5. **Use appropriate heading hierarchy** (h2, h3, etc.)

## Monitoring & Analytics

To add analytics:

1. Choose provider (Google Analytics, Plausible, etc.)
2. Add tracking code to `BaseHead.astro`
3. Or use Astro integration

## Troubleshooting

### Content not appearing
- Check frontmatter is valid YAML
- Verify file is in correct collection directory
- Rebuild site: `npm run build`

### Build errors
- Check TypeScript errors: `npm run build`
- Validate markdown syntax
- Check image paths are correct

### Styling issues
- Clear `.astro` cache: `rm -rf .astro`
- Check CSS variable names
- Verify Tailwind classes are valid

## Future Enhancements

Potential additions:
- [ ] Search functionality (Pagefind)
- [ ] Comments system (Giscus)
- [ ] Dark mode toggle
- [ ] Content versioning
- [ ] Author profiles
- [ ] Related content suggestions
- [ ] Newsletter signup
- [ ] Event listings
- [ ] Community contributions
- [ ] API documentation

## Resources

- [Astro Documentation](https://docs.astro.build/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Deployment

### Deploy to Vercel
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
Configure in `astro.config.mjs`:
```javascript
export default defineConfig({
  site: 'https://yourusername.github.io/repo-name',
});
```

## Support

For issues or questions:
1. Check Astro documentation
2. Review content collection examples in this site
3. Check markdown syntax
4. Review frontmatter validation in `content.config.ts`
