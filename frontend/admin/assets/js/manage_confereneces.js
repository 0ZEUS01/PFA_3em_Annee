$(document).ready(function () {
    // Retrieve conference data from the API
    $.ajax({
        url: "http://127.0.0.1:8000/get_conference",
        type: "GET",
        success: function (response) {
            // Handle the successful response

            // Get the table body element
            var table = $("#Conferences_table tbody");

            // Add new data to the table
            var conferences = response.conference;

            for (var i = 0; i < conferences.length; i++) {
                var conf = conferences[i];
                var row = $("<tr>");
                row.append($("<td>").text(conf.title));
                row.append($("<td>").text(conf.country_name));
                row.append($("<td>").text(conf.start_date + ' | ' + conf.end_date));
                row.append($("<td>").text(conf.min_participants + ' | ' + conf.max_participants));

                var stateCell = $("<td>");
                if (conf.state_conference_name === 'SCHEDULED') {
                    var badge = $("<span class='badge bg-label-warning me-1'>").text(conf.state_conference_name);
                    stateCell.append(badge);
                } else if (conf.state_conference_name === 'Completed') {
                    var badge = $("<span class='badge bg-label-success me-1'>").text(conf.state_conference_name);
                    stateCell.append(badge);
                } else if (conf.state_conference_name === 'Ended') {
                    var badge = $("<span class='badge bg-label-danger me-1'>").text(conf.state_conference_name);
                    stateCell.append(badge);
                } else if (conf.state_conference_name === 'CANCELED') {
                    var badge = $("<span class='badge bg-label-secondary me-1'>").text(conf.state_conference_name);
                    stateCell.append(badge);
                }
                row.append(stateCell);

                var editLink = $('<a class="dropdown-item edit-link" data-bs-toggle="modal" data-bs-target="#editConf"><i class="bx bx-edit-alt me-1"></i> Edit</a>');
                editLink.data('conference', conf); // Store the conference data in the link's data attribute
                var dropdownCell = $('<td><div class="dropdown"><button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="bx bx-dots-vertical-rounded"></i></button><div class="dropdown-menu"></div></div></td>');
                dropdownCell.find('.dropdown-menu').append(editLink);

                row.append(dropdownCell);
                table.append(row);
            }

            // Event handler for the edit link
            $('.edit-link').click(function () {
                var conferenceData = $(this).data('conference');
                // Use the conferenceData to populate the form in the modal
                $('#modalCenterTitle').text('Edit Conference: ' + conferenceData.title);
                $('#title').val(conferenceData.title);
                $('#Address').val(conferenceData.Address);
                $('#start_in').val(conferenceData.start_date);
                $('#ends_in').val(conferenceData.end_date);
                $('#MinPNb').val(conferenceData.min_participants);
                $('#MaxPNb').val(conferenceData.max_participants);

                var selectInput = document.getElementById('countryy');
                var options = selectInput.options;

                for (var i = 0; i < options.length; i++) {
                    var optionValue = options[i].text;

                    if (optionValue === conferenceData.country_name) {
                        options[i].selected = true;
                        break;
                    }
                }

                var selectInput = document.getElementById('statee');
                var options = selectInput.options;

                for (var i = 0; i < options.length; i++) {
                    var optionValue = options[i].text;

                    if (optionValue === conferenceData.state_conference_name) {
                        options[i].selected = true;
                        break;
                    }
                }
            });
        },
        error: function (xhr, status, error) {
            // Handle the error response
            console.error(error);
        },
    });
});

const selectElement = document.getElementById('countryy');

const fetchCountries = async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000/country");
        if (response.ok) {
            const data = await response.json();
            updateOptionss(data.country);
        } else {
            console.error('Failed to fetch countries:', response.status);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

const updateOptionss = (countries) => {
    selectElement.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Your Country';
    selectElement.appendChild(defaultOption);

    if (Array.isArray(countries)) {
        countries.forEach((country) => {
            const option = document.createElement('option');
            option.value = country.country_id;
            option.textContent = country.country_name;
            selectElement.appendChild(option);
        });
    } else {
        const loadingOption = document.createElement('option');
        loadingOption.textContent = 'no countries found';
        selectElement.appendChild(loadingOption);
    }
};

fetchCountries();

const selectElementState = document.getElementById('statee');

const fetchStates = async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000/state");
        if (response.ok) {
            const data = await response.json();
            updateOptionsState(data.state);
        } else {
            console.error('Failed to fetch states:', response.status);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
};
const updateOptionsState = (states) => {
    selectElementState.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Your state';
    selectElementState.appendChild(defaultOption);

    if (states && states.length > 0) {
        states.forEach((state) => {
            const option = document.createElement('option');
            option.value = state.state_conference_id;
            option.textContent = state.state_conference_name;
            selectElementState.appendChild(option);
        });
    } else {
        const noStatesOption = document.createElement('option');
        noStatesOption.textContent = 'No states found';
        selectElementState.appendChild(noStatesOption);
    }
};

fetchStates(); 