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
    - [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm)
- The wonderful [Vue.js](https://vuejs.org/) framework
- [Tiptap](https://tiptap.dev/), an excellent headless editor platform which I customized by adding Tunic rune support
- This static site is built using the powerful and easy-to-use Python-based [Zensical](https://zensical.org/) framework
    - [Python](https://www.python.org/) 
    - [uv](https://astral.sh/uv)

## Architecture

TLT is a Single Page Application (SPA) implemented primarily with VueJS.

Session-local storage is used so that work is not lost when refreshing the browser or if the computer goes to sleep.

The app supports saving work to a local file and re-opening it later.  This allows for the "work" of translation to 
happen over however long a time period the user wants to.

The Tunic language graphics were my interpretation and hand-designed.  Templates and a script are used to generate the
entire set of possible Tunic language characters.

All scripts are visible in the `package.json`.

[GitHub Pages](https://docs.github.com/en/pages) is used for hosting.

GitHub Actions is used for software lifecycle automation; commits to `main` cause the static site and app to
automatically build and deploy.

## Other

TLT does *not* make use of:

- Server-side or back-end components of any sort
- Cookies
- Local storage (across sessions)

TLT does not have automated tests at this time (to my shame as a previously professional software engineer).
