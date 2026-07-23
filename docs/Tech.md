---
icon: lucide/code-xml
---

# Technical details

## Source code
TLT's source code is freely available in the [tunic-language-tool](https://github.com/sbfeinstein/tunic-language-tool){:target="_blank"}
GitHub repository.

The repository's `README.md` contains technical instructions for building and running the application yourself.

## Technology

The main technical dependencies are:

- [Node.js](https://nodejs.org/en) and good, old-fashioned JavaScript!
- The wonderful [Vue.js](https://vuejs.org/) framework
- [Tiptap](https://tiptap.dev/), an excellent headless editor platform which I customized by adding Tunic rune support
- This static site is built using the powerful and easy-to-use [Zensical](https://zensical.org/) framework

## Architecture

TLT has no server-side or backend aspect!  It runs entirely in your browser.

Additionally, it does not make use of any ads, authentication or tracking technologies!

To allow users to work on their translations across sessions and preserve Tunic language documents long-term,
TLT allows you to save and open document files (which are fundamentally in the JSON format).

The site and assets are hosted using [GitHub Pages](https://docs.github.com/en/pages).
