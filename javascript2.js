$("#submit").on("click", function(event) {

  event.preventDefault(); 

  var startInput = $("#start-address").val().trim();  
    console.log(startInput); 
  var endInput = $("#end-address").val().trim();  
    console.log(endInput); 
  
  
  var CAW = 'https://cors-anywhere.herokuapp.com/';

  var queryURL = CAW + "https://maps.googleapis.com/maps/api/directions/json?origin=" + startInput + "&destination=" + endInput + "&key=AIzaSyA3zxPOYEjaZFkWhGi4WRjUVWXXXF7GRUA"
    console.log(queryURL); 


  $.ajax({
          url: queryURL,
          method: "GET"
        })
        .done(function(response) {
          console.log(response);
          var endCoordLat = response.routes[0].legs[0].end_location.lat;
            console.log(endCoordLat); 
          var endCoordLng = response.routes[0].legs[0].end_location.lng;
            console.log(endCoordLng); 
          var startCoordLat = response.routes[0].legs[0].start_location.lat;
            console.log(startCoordLat); 
          var startCoordLng = response.routes[0].legs[0].start_location.lng;
            console.log(startCoordLng);  
        });
});

//destination parameter not getting into the query corectly 
//No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.





function initMap() {
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var directionsService = new google.maps.DirectionsService;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 37.77, lng: -122.447}
  });
  directionsDisplay.setMap(map);

  calculateAndDisplayRoute(directionsService, directionsDisplay);
  document.getElementById('mode').addEventListener('change', function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  var selectedMode = document.getElementById('mode').value;
  directionsService.route({
    origin: {lat: 37.77, lng: -122.447},  // Haight.
    destination: {lat: 37.768, lng: -122.511},  // Ocean Beach.
    // Note that Javascript allows us to access the constant
    // using square brackets and a string value as its
    // "property."
    travelMode: google.maps.TravelMode[selectedMode]
  }, function(response, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

