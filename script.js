const showSelect = document.getElementById("show-select");

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
}

async function loadShowDetails(id) {
    const url = `https://api.tvmaze.com/shows/${id}`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`);
        }

        const show = await res.json();
        console.log(show);
    } catch (error) {
        console.error(error);
    }
}

showSelect.addEventListener("change", function () {
    const id = showSelect.value;

    if (id === "") {
        return;
    }

    loadShowDetails(id);
});

loadShows();