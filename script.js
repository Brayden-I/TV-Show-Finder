const showSelect = document.getElementById("show-select");
const showDetails = document.getElementById("show-details");

async function loadShows() {
    const url = "https://api.tvmaze.com/shows?page=0";

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`);
        }

        const shows = await res.json();

        // Sort by rating.average (null → 0), descending
        const sorted = shows
            .map(s => ({
                ...s,
                ratingValue: s.rating && s.rating.average ? s.rating.average : 0
            }))
            .sort((a, b) => b.ratingValue - a.ratingValue)
            .slice(0, 25);   // keep first 25

        fillDropdown(sorted);
    } catch (error) {
        console.error(error);
    }
}

// Clears the <select>, adds a placeholder, then appends one option per show
function fillDropdown(shows) {
    // Clear any existing options
    showSelect.innerHTML = "";

    // Placeholder option
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select a show";
    showSelect.appendChild(placeholder);

    // Add options for each show
    shows.forEach(show => {
        const option = document.createElement("option");
        option.value = show.id;            // option value = show id
        option.textContent = show.name;    // option text = show name
        showSelect.appendChild(option);
    });

    // Add event listener to load show details
    showSelect.addEventListener('change', () => {
        const selectedId = showSelect.value;
        if (selectedId) {
            loadShowDetails(selectedId);
        }
    });
}

// Fetch and display show details
async function loadShowDetails(showId) {
    const url = `https://api.tvmaze.com/shows/${showId}`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`);
        }

        const show = await res.json();
        displayDetails(show);
    } catch (error) {
        console.error(error);
    }
}

// Function to display show details
function displayDetails(show) {
    // Clear previous details
    showDetails.innerHTML = "";

    // Display show name as a heading
    const heading = document.createElement("h2");
    heading.textContent = show.name;
    showDetails.appendChild(heading);

    // Display poster
    const posterWrapper = document.createElement("div");
    if (show.image && show.image.original) {
        const img = document.createElement("img");
        img.src = show.image.original;
        img.alt = `Poster for ${show.name}`;
        posterWrapper.appendChild(img);
    } else {
        const noPosterText = document.createElement("p");
        noPosterText.textContent = "No poster available";
        posterWrapper.appendChild(noPosterText);
    }
    showDetails.appendChild(posterWrapper);

    // Display summary
    const summaryWrapper = document.createElement("div");
    const summary = document.createElement("p");
    summary.innerHTML = show.summary ? show.summary.replace(/<[^>]+>/g, '') : "No summary available";
    summaryWrapper.appendChild(summary);
    showDetails.appendChild(summaryWrapper);

    // Display genres
    const genresWrapper = document.createElement("div");
    const genresText = show.genres.length > 0 ? show.genres.join(", ") : "Not listed";
    const genres = document.createElement("p");
    genres.textContent = `Genres: ${genresText}`;
    genresWrapper.appendChild(genres);
    showDetails.appendChild(genresWrapper);

    // Display premiere date, status, and rating
    const infoWrapper = document.createElement("div");
    const premiereDate = document.createElement("p");
    premiereDate.textContent = `Premiere: ${show.premiered ? show.premiered : "Unknown"}`;
    infoWrapper.appendChild(premiereDate);

    const status = document.createElement("p");
    status.textContent = `Status: ${show.status ? show.status : "Unknown"}`;
    infoWrapper.appendChild(status);

    const rating = document.createElement("p");
    rating.textContent = `Rating: ${show.rating && show.rating.average ? show.rating.average : "Not rated"}`;
    infoWrapper.appendChild(rating);

    showDetails.appendChild(infoWrapper);
}

loadShows();