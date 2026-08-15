# Playground

> Learn in public: multi-stack notes, side projects, and published blog posts.

Personal dev archive for experimenting, building, and documenting what I learn. Course exercises and practice projects sit alongside notes; selected articles are published on the [tech blog](https://kim-hyunjin.github.io/playground/).

## Structure

- **ai/** — Deep learning from scratch (NumPy), LangChain projects (vector DBs, PDF apps, React integration)
- **algorithms/** — Problem solving in Java, Python, JS, Go; LeetCode and Grind 75 solutions
- **backend/** — Django, Go, Node.js (GraphQL, WebRTC zoom clone), NestJS (Slack clone), Spring Boot, Rails, MSA with Spring Cloud (9 microservices), performance testing with Artillery
- **blockchain/** — Web3 dApps, Solidity smart contracts, Klaytn integration
- **design-architecture/** — Design patterns, OOAD
- **frontend/** — React (11+ projects), Next.js (7 projects), Vue.js (6 projects), Webpack config
- **language/** — Go, Java (LMS app with 30 versions), JavaScript, TypeScript, Rust, Kotlin, Elixir fundamentals
- **mobile/** — Android (20+ projects), iOS, React Native (10+ projects), Flutter (8 projects)
- **security/** — Security study notes and practice projects
- **toy/** — Small experiments and side projects

## Blog

Published posts live in [`blog/content/`](blog/content/) as `.pub.md`, `.pub.mdx`, or `.pub.ipynb` files. The blog is built as a static Astro site for the `/playground/` GitHub Pages project path.

```bash
cd blog
corepack pnpm install --frozen-lockfile
corepack pnpm dev      # local development
corepack pnpm build    # check, test, build, and index
corepack pnpm preview  # preview the production build
corepack pnpm run deploy  # build and deploy dist/ to the gh-pages branch
```

The build converts published Notebooks without executing cells, validates content metadata, generates the Pagefind search index, and checks generated HTML, internal links, and canonical URLs. Deployment adds `.nojekyll` and publishes `dist/` to the `gh-pages` branch. See [`blog/README.md`](blog/README.md) for authoring and deployment details.
