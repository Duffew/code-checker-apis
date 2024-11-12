// API key
const API_KEY = "JeY7RLQYkaD40-t4XeZfy1lDQtE";
// define URL as a constant
const API_URL = "https://ci-jshint.herokuapp.com/api";
// define constant for modal
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// wire up the button
document.getElementById("status").addEventListener("click", e => getStatus(e));

// create an asynchornous function to get data and display it a modal
async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    }
    // add an exception
    else {
        throw new Error(data.error);
    }
}

// create the displayStatus function which has been called above
function displayStatus(data) {
    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;

    results += `<div class="key-status">${data.expiry}</div>`

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show()
}