# TV Show Finder

A small single-page web app that lets you pick a top-rated TV show from a dropdown and see its poster, summary, genres, premiere date, status and rating. All data comes from the free [TVmaze API](https://www.tvmaze.com/api), so no API key is needed.

## How it works

The app is built with plain HTML, CSS and JavaScript (no frameworks) and makes two kinds of request:

1. **On page load**, it fetches `https://api.tvmaze.com/shows?page=0`. The response is sorted by `rating.average` (shows with no rating count as 0), trimmed to the top 25, and used to fill the dropdown. The option `value` is the show's id and the option text is its name.
2. **When a show is selected**, it fetches `https://api.tvmaze.com/shows/{id}` and builds the details card with the DOM: name, poster, summary, genres, premiere date, status and rating.

Both requests use `async`/`await` inside `try`/`catch`/`finally`:

- A **loading message** shows while a request is in flight.
- An **error message** shows if a request fails. A 404 on the details request gets its own message ("The show could not be found.").
- Missing data is handled instead of breaking the page: no poster, no summary, no genres or no rating each show a fallback.
- The TVmaze summary contains HTML tags, which are stripped before it is displayed.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure: heading, dropdown, message area and details container |
| `script.js` | Fetching, sorting, populating the dropdown and rendering show details |
| `style.css` | Layout and visual design |

## Styling

The page uses a dark navy theme with an amber accent, set up through CSS custom properties on `:root`. The content is centered with a 720px maximum width. The details area is a card with a border, shadow, background, padding and rounded corners, and the poster is size-capped so it never overflows the card. Loading and error messages are styled differently: loading is an amber dashed box with a spinner, and error is a red box with a warning marker. The layout has been checked at phone width (360px) with no horizontal overflow.

## Compared to my space launch app

I already knew how to make HTTP requests from building my space launch app, so I wrote the `fetch` calls and response handling here myself. The core idea is the same: request JSON from a public API and render it on the page. This project adds a dropdown that is filled from the first API response and a second request that depends on what the user picks. It also sorts and trims data on the client, and it has visible loading and error states.

## Running it

Open `index.html` in a browser. No build step or install is needed, but you need an internet connection to reach the TVmaze API.

## AI use disclosure

I wrote most of this project myself. I was already comfortable with HTTP requests from my earlier space launch app, so I wrote the `fetch` calls and API handling in `script.js` on my own.

**Local model (Qwen 3.5):** I ran a local model as code autocomplete in my editor. It suggested completions for predictable code, which made writing faster. I reviewed and edited its suggestions as I went.

**Claude (Anthropic):** I used Claude to generate the styling in `style.css`: the layout, colors, card design, dropdown styling, responsive behavior and the loading and error message styles. Claude also made small changes to `index.html` and `script.js` so the loading and error messages could be styled differently, and it fixed a bug where error messages were hidden right after they appeared. Claude also helped write this README and disclosure.
