
var endCoordLat = ""; 
var endCoordLng = ""; 
var startCoordLat = ""; 
var startCoordLng = ""; 
var directionsService;
var directionsDisplay;
//we need to establish the directinsService and directionsDisplay as a global variable so that the other functions can read it 
//we establish this variable at initMap --> redefines the value at a global scale and it will stay 
//we have to put his two variable in the initMap() function because this is what the Google Map script from the HTML is reading

function initMap() {
        // Create a map object and specify the DOM element for display.
           directionsService = new google.maps.DirectionsService();
           directionsDisplay = new google.maps.DirectionsRenderer;

            var map = new google.maps.Map(document.getElementById('map'), {
              center: {lat: -34.397, lng: 150.644},
              scrollwheel: false,
              zoom: 8
            });
};

function initMapAgain() {
  // var directionsDisplay = new google.maps.DirectionsRenderer;
  // var directionsService = new google.maps.DirectionsService;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: startCoordLat, lng: startCoordLng}
  });
  directionsDisplay.setMap(map);

  calculateAndDisplayRoute(directionsService, directionsDisplay);
  document.getElementById('mode').addEventListener('change', function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  });
};

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  var selectedMode = document.getElementById('mode').value;
  directionsService.route({
    origin: {lat: startCoordLat, lng: startCoordLng},  // Haight.
    destination: {lat: endCoordLat, lng: endCoordLng},  // Ocean Beach.
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

$("#submit").on("click", function(event) {

  event.preventDefault(); 

 
  var startInput = $("#start-address").val().trim(); 
  startInput = startInput.replace(/ /g,"");
  //RegExp or Regular Expression, the / / means blank spaces, the g means on a global scale, and the "" means replace with no space. 
  //Essentially this takes the string look for all the blank spaces(global) and replace it without a space. 
  //This is not necessary because Google takes the spaces into account when sending queryURL, but this is just a fail safe. 
  console.log(startInput);
  var endInput = $("#end-address").val().trim();  
  endInput = endInput.replace(/ /g,"");
    console.log(endInput); 
  var cors = "https://cors-anywhere.herokuapp.com/"
  var queryURL = cors + "https://maps.googleapis.com/maps/api/directions/json?origin=" + startInput + "&destination=" + endInput + "&key=AIzaSyA3zxPOYEjaZFkWhGi4WRjUVWXXXF7GRUA"
    console.log(queryURL); 
    // debugger;
  var queryTransitURL = cors + "https://maps.googleapis.com/maps/api/directions/json?origin=" + startInput + "&destination=" + endInput + "&mode=transit&key=AIzaSyA3zxPOYEjaZFkWhGi4WRjUVWXXXF7GRUA"

  
  var val = $("#mode option:selected").text();
    console.log(val)


  if (val === "Transit") {

    $.ajax({
          url: queryTransitURL,
          method: "GET"       
        })
        .done(function(response) {
          endCoordLat = response.routes[0].legs[0].end_location.lat;
            console.log(endCoordLat); 
          endCoordLng = response.routes[0].legs[0].end_location.lng;
            console.log(endCoordLng); 
          startCoordLat = response.routes[0].legs[0].start_location.lat;
            console.log(startCoordLat); 
          startCoordLng = response.routes[0].legs[0].start_location.lng;
            console.log(startCoordLng);  
          initMapAgain(); 
          calculateAndDisplayRoute(directionsService, directionsDisplay);

     
        
        var departureTime = $("#departure-time").text(response.routes[0].legs[0].departure_time.text);
          console.log(departureTime)
        var arrivalTime = $("#arrival-time").text(response.routes[0].legs[0].arrival_time.text);
          console.log(arrivalTime)
        var transitTime = $("#transit-time").text(response.routes[0].legs[0].duration.text);
          console.log(transitTime); 
        var farePrice = $("#fare-price").text(response.routes[0].fare.text);
          console.log(farePrice); 

        });

  }

  else {


    $.ajax({
            url: queryURL,
            method: "GET"       
          })
          .done(function(response) {
            endCoordLat = response.routes[0].legs[0].end_location.lat;
              console.log(endCoordLat); 
            endCoordLng = response.routes[0].legs[0].end_location.lng;
              console.log(endCoordLng); 
            startCoordLat = response.routes[0].legs[0].start_location.lat;
              console.log(startCoordLat); 
            startCoordLng = response.routes[0].legs[0].start_location.lng;
              console.log(startCoordLng);  
            initMapAgain(); 
            calculateAndDisplayRoute(directionsService, directionsDisplay);

          var travelDistance = $("#travel-distance").text(response.routes[0].legs[0].distance.text);
            console.log(travelDistance)
          var travelTime = $("#travel-time").text(response.routes[0].legs[0].duration.text);
            console.log(travelTime); 
          });
  }


})

