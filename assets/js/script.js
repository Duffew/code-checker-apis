// API key
const API_KEY = "JeY7RLQYkaD40-t4XeZfy1lDQtE";
// define URL as a constant
const API_URL = "https://ci-jshint.herokuapp.com/api";
// define constant for modal
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// wire up the 'Check AIP Key' button
document.getElementById("status").addEventListener("click", e => getStatus(e));
// wire up the 'Run Checks' button
document.getElementById("submit").addEventListener("click", e => postForm(e));

// create an asynchornous function to POST code and have it checked
async function postForm(e) {
    const form = new FormData(document.getElementById("checksform"));

    // pasted code from JSHint instructions - POST
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
                    "Authorization": API_KEY,
                 },
        // attach the body of the form as the thing to be chacked
        body: form,
        })

}


// create an asynchornous function to get API key data and display it a modal
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