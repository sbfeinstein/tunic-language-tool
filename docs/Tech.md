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

TLT is a Single Page Application (SPA) implemented primarily with VueJS.

There are no back-end or server-side components, it runs entirely in the browser.
Cookies and browser-local storage are not used.

Additionally, TLT has **no ads**, **no authentication** and **no tracking**!

TLT *does* support saving your work to a local file on your own computer and opening it again later.
This allows users to work on and keep a library of Tunic-language documents, not to mention solving the language 
translation across multiple sessions.

[GitHub Pages](https://docs.github.com/en/pages) is used for hosting.
