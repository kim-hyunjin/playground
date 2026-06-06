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

Published posts live in [`blog/content/`](blog/content/) as `.pub.md` or `.pub.ipynb` files. The MkDocs site is configured under [`blog/`](blog/).

```bash
cd blog
uv run mkdocs serve    # local preview
./scripts/build.sh     # build site
./scripts/publish.sh   # deploy to GitHub Pages
```
