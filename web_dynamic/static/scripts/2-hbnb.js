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

	updateApiStatus();
	
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
