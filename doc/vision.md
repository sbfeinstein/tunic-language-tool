# Overview
`tunic-language-tool` is a simple web application to aid players of the game [Tunic](https://tunicgame.com/) who are attempting to decode the fictional language that is central to the gameplay.

This is a fan-built, unofficial tool that was made for personal use and is not sanctioned by or related to Finji or any other entity related to the creation and distribution of Tunic.

# 1. Architecture

## 1.1. Frontend
The main frontend framework is [Vue.js](https://vuejs.org/).

Screens, as-described in [3. Screens](#3-screens), are implemented in Vue.  Custom Vue components are used where appropriate.

Most logic should be implemented in the backend and surfaced to the frontend via simple APIs over HTTP.  There is no current need for websocket or more complex integrations.

Frontend-backend communication uses conventional ports (e.g., 8080 for the full app/frontend, 8081 for APIs if separated). Fetch data on load (e.g., via Fetch API).

CSS and vanilla JavaScript are used.

The frontend and backend are built and run together, with Vue.js served from Spring Boot's static resources. Separate files for Vue components are encouraged for readability and debugging; modularity is preferred over a single-file app.

Use vanilla JavaScript and the latest stable Vue.js version (or a version with strong documentation/examples to minimize errors).

### 1.1.1 Frontend dependency management
Presumably npm but the AI is free to choose whatever best practice.

## 1.2. Backend
The main backend framework is [Spring Boot](https://spring.io/projects/spring-boot).

It powers APIs, called by the Frontend as described in this document.

APIs are generally REST-ish but convenience, understandability and maintainability are more important than strict adherence to REST or any other pattern.

Use the latest stable Spring Boot version (or one with strong documentation/examples). Start with in-memory data structures (e.g., HashMaps) for persistence; a separate DB layer can be added later if needed.

All APIs exclusively receive and return JSON.

### 1.2.1. Persistent storage
Only in-memory persistence is used in the current specification of this application.  That may simply mean application code with associated long-lived singleton data structures such as hashmaps, or an in-memory DB such as H2.

### 1.2.2. Backend dependency management
The gradlew wrapper is used;  the host system can be assumed to already have some version of gradle explicitly installed and available.  

### 1.2.3. Backend security
Current spec requires no authentication or authorization.  All APIs are open.  

No encryption is needed.

## 1.3. Runtime architecture
In the current spec, this project simply runs natively.  E.g. no Docker or other containerization or virtualization for now.

Running 'gradle bootRun' should make the full app available on port 8080.

## 1.4. Tests
AI may add tests that it feels will allow it to verify adherence to spec and prevention of regressions while building.  However the current goal is not complete coverage for coverage's sake as many things are expected to change as we iterate.

No tests to start initially.

## 1.5. Dependencies
The project prefers fewer dependencies at every level of architecture.  Built-in / vanilla capabilities should be leveraged where possible.

# 2. Functional overview

## 2.1. The Tunic Language
The language in Tunic is phonetic in nature and based off a gem-like shape ([tunic_language_gem.svg](tunic_language_gem.svg)).
We'll refer to this as the "gem" below.

The gem has 12 edges related to pronunciation, with `id` attribute (in the SVG) of `E1`..`E12`.
The 13th edge (`id` attribute of `E13`) does not impact pronunciation but rather is a symbol indicating letters that are grouped into a word.

### 2.1.1. Sounds
A sound is represented by a symbol consisting of a visual subset of gem pronunciation edges.

Each sound maps to a distinct English phoneme.

Sounds in this application are display to the user in a 7 by 6 grid.

Sounds are referenced by a two-digit number consisting of the row then column of the grid.  The first row and first column are labeled 1 (not 0).

There are 18 "outer" sounds (the first three rows) and 24 "inner" sounds (the last four rows).

#### 2.1.1.1. Table of sound symbols

This is an exhaustive table of the 42 sounds.

In each cell is given the rowcol ID of the symbol and the list of edges (based on the gem SVG linked above and its line id attributes) that are visible in that symbol.

|           | 1                     | 2                  | 3                         | 4                  | 5                   | 6                      |
|:----------|-----------------------|--------------------|---------------------------|--------------------|---------------------|------------------------|
| 1 (Outer) | 11 = E1 E5 E6         | 12 = E5 E6         | 13 = E3 E4                | 14 = E3 E4 E5      | 15 = E4 E5          | 16 = E1 E6             |
| 2 (Outer) | 21 = E3 E4 E5 E6      | 22 = E1 E4 E5 E6   | 23 = E1 E4 E5             | 24 = E1 E3 E5 E6   | 25 = E1 E3 E4 E6    | 26 = E3 E5 E6          |
| 3 (Outer) | 31 = E6               | 32 = E1            | 33 = E4                   | 34 = E3            | 35 = E1 E3 E4 E5 E6 | 36 = E3 E5             |
| 4 (Inner) | 41 = E9 E11           | 42 = E9 E11 E12    | 43 = E7 E8 E9 E10 E11 E12 | 44 = E8 E10        | 45 = E7 E9          | 46 = E8 E10 E12        |
| 5 (Inner) | 51 = E7 E9 E11        | 52 = E7 E8 E9      | 53 = E8 E9 E10            | 54 = E7 E11        | 55 = E10 E12        | 56 = E8 E10 E11        |
| 6 (Inner) | 61 = E7 E9 E12        | 62 = E7 E8 E10 E12 | 63 = E7 E9 E10 E11        | 64 = E7 E8 E10 E11 | 65 = E7 E9 E10 E12  | 66 = E8 E9 E10 E11 E12 |
| 7 (Inner) | 71 = E7 E8 E9 E11 E12 | 72 = E7 E9 E10     | 73 = E7 E8 E10            | 74 = E7 E10 E12    | 75 = E8 E12         | 76 = E9 E10            |

### 2.1.2. Letters

A "letter" consists of either exactly one outer sound, exactly one inner sound or exactly one inner and one outer sound.

A letter is also written / rendered using the tunic language gem by superimposing its constituent sounds.

Any edge that is visible in the constituent sounds is also visible in the letter.

### 2.1.3. Words

A "word" consists of a series of one or more letters, written left to write without any break between them.

All the letters of a word are written / rendered with E13 also visible.
This makes it more visually clear that the letters are grouped together, since E13 is a horizontal line running through the middle of the letter.

### 2.1.4. Sentences

A "sentence" is a series of words, written from left to right. Each word is separated by a space.

Sentences may end in a normal English period, question mark or exclamation point.

A word may also be followed by a normal English comma.
The comma does not have a horizontal line through it.
The comma occurs immediately to the right of the word it follows and is itself always followed by a space and then another word.

# 3. Screens

The web app is generally divided into two panes of equal size to start: the left and the right.
There are further subdivisions and components as indicated.

## 3.1. The Symbol Screen

The Symbol screen is displayed on the left.

The Symbol screen is divided into a top and bottom portion.

The top of the Symbol screen is the Alphabet screen which uses 80% of the Symbol screen height.

The remaining bottom 20% of the Symbol screen is the Letter Editor.

### 3.1.1. The Alphabet Screen

The Alphabet Screen is a 7 row by 6 column grid that fills the available space.

Each cell in the grid displays the corresponding sound symbol per the [Table of sound symbols](#2111-table-of-sound-symbols).

When a cell in the grid is clicked, it affects the Letter Editor as follows: the visible edges in the clicked sound become "selected".

When a cell in the grid is clicked, the visible edges in the clicked sound become cumulatively "selected" in the Letter Editor (only selecting edges that weren't already selected; never deselecting).

The Alphabet Screen cells are powered by a combination of the "Sounds API" and the language gem SVG.
AI should copy the SVG where appropriate in the project.
The information from the Sounds API should be used to copy and render some sort of Vue component wrapping the SVG with the appropriate edges displayed and colored using the "selected edge" style.

Use best practices for SVG handling (e.g., copy to frontend assets, manipulate via Vue components with CSS classes for edge visibility).

### 3.1.2. The Letter Editor

In the center of the Letter Editor a tunic language gem with all lines visible is initially displayed in the "unselected" color.

When an edge on the letter editor gem is clicked, it toggles between the "unselected" and "selected" colors.

Beneath the Letter Editor gem is a button labeled "Insert".

For now, clicking "Insert" does nothing. No other interactions or hover effects.

## 3.2. The Sentence Editor

The right side of the overall app is the Sentence Editor.

Currently, the spec is not defined so it should just display "under construction".

# 4. Frontend Styles
The "unselected edge" color for the letter editor should be a light gray.
The "selected edge" color for the letter editor should be `#050d3a`.

Focus on simplicity and correctness; app accessed from desktop/laptop.

# 5. APIs

## 5.1. Sounds API
This is a GET endpoint with no inputs.
It returns JSON with necessary details for rendering the 42 sound symbols.

The backend data model includes a phoneme field (always '?'). The frontend may ignore the phoneme field for now.

Output format like:
```json
[
  {
    "id": 11,
    "edges": [ "E1", "E5", "E6" ],
    "phoneme": "?"
  }
]
```

Where:
* `id` is rowcol for the sound symbol
* `edges` is a list of selected edges for this sound symbol, where the values are `E1` through `E12` and corresponds to the `id` attribute on lines in the gem SVG
* `phoneme` is a string with the phoneme guess but per the current spec is always a literal question mark