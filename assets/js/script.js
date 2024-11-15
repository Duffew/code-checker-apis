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

// create a function to return entries in the correct format
function processOptions(form) {
    // create a new array to store the data
    let optArray = [];
    // iterate through the form entries and push entries into new array
    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }
    // delete the word "options" from the string
    form.delete("options");
    // append the optArray array with the data, sepatated by a comma and without the word "options"
    form.append("options", optArray.join());

    return form;

}

// create an asynchornous function to POST code and have it checked
async function postForm(e) {
    const form = processOptions (new FormData(document.getElementById("checksform")));

    // pasted code from JSHint instructions - POST
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        // attach the body of the form as the thing to be chacked
        body: form,
    })

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }

}

// create a displayErrors funcion - called above
function displayErrors(data) {

    let results = "";
    let heading = `JSHints Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No Errors Reported</div>`;      
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}:</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
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
        displayException(data);
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

// create a displayException function which populates the modal with exception information

function displayException(data) {
    let heading = "An Exception Has Occured";
    results = `<div>The API retirned status code ${data.status_code}</div>`;
    results +=`<div>Error Number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error Text: <strong>${data.error}</strong></div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show()
}