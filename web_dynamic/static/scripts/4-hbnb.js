$(document).ready(function() {
	let selectedAmenities = {};

	// Function to update the api status
	$.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
		// Check if the status is "OK"
		if (data.status === 'OK') {
			// add class 'available' to div#api_status
			$('#api_status').addClass('available');
		} else {
			// status is not 'OK', remove class 'available'
			$('#api_status').removeClass('available');
		}
	});

	// Get places from the API and update them dynamicall
	function updatePlaces(amenities) {
		$.ajax({
			url: 'http://0.0.0.0:5001/api/v1/places_search/',
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({ amenities: amenities }),
			success: function(data) {
				// Clear the existing places
				$('.places').empty();

				// Loop through the result and create an article tag representing places
				for (let i = 0; i < data.length; i++) {
					const place = data[i];

					// Create the HTML structure for each place
					const placeHtml = '<article>' +
						'<div class="title_box">' +
						'<h2>' + place.name + '</h2>' +
						'<div class="price_by_night">$' + place.price_by_night + '</div>' +
						'</div>' +
						'<div class="information">' +
						'<div class="max_guest">' + place.max_guest +
						' Guest' + (place.max_guest !== 1 ? 's' : '') + '</div>' +
						'<div class="number_rooms">' + place.number_rooms +
						' Bedroom' + (place.number_rooms !== 1 ? 's' : '') + '</div>' +
						'<div class="number_bathrooms">' +
						place.number_bathrooms +
						' Bathroom' + (place.number_bathrooms !== 1 ?
							's' : '') + '</div>' +
						'</div>' +
						'<div class="description">' + place.description + '</div>' +
						'</article>';
					$('.places').append(placeHtml);
				}
			},
			error: function(error) {
				console.log('Error fetching places:', error);
			}
		});
	}

	// Function to handle click event on search button
	$('#searchButton').click(function() {
		// Create an array to store the id's for checked amenities
		const amenities_arr = Object.keys(selectedAmenities);
		
		// Call updatePlaces with the list of checked amenities
		updatePlaces(amenities_arr);
	});

	updatePlaces([]);

	// Listen for changes on each checkbox input
	$('input[type="checkbox"]').change(function() {
		const amenity_id = $(this).data('id');
		const amenity_name = $(this).data('name');

		if ($(this).is(':checked')) {
			// checkbox is checked, we store amenity ID in the selectedAmenities
			selectedAmenities[amenity_id] = amenity_name;
		} else {
			// checkbox not checked, we remove the amenity ID from the dictionary
			delete selectedAmenities[amenity_id];
		}

		// Update the h4 tag inside the div Amenities with the list of amenities checked
		updateSelectedAmenitiesList();
	});

	// Function to update h4 in div Amenities
	function updateSelectedAmenitiesList() {
		let amenitiesH4 = $('.amenities h4');
		const amenityNames = Object.values(selectedAmenities).join(', ');

		// Pupolate the h4 with the selected amenities
		amenitiesH4.text(amenityNames);
	}
});
