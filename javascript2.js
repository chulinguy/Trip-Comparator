//default MPG data and car model year before user enters car information
var MPG = 30;  
var year = 2016;
var make = 'Honda';
var model = 'Accord';
var closestGasPrice = 0;
var convertedDistance = 0;

//google Map variables
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
            //<myGasFeed stuff NEW>
            var milesRadius = 4; 
            var MGF = `http://devapi.mygasfeed.com/stations/radius/${startCoordLat}/${startCoordLng}/${milesRadius}/reg/distance/rfej9napna.json`;
            $.ajax({
              url: MGF,
              method: 'get'
            }).done(function(res) {
              // console.log(JSON.parse(res))
              closestGasPrice = JSON.parse(res).stations[0].reg_price;
              convertedDistance = parseInt(travelDistance[0].innerText.slice(0, -3))
              console.log('travelDistance', convertedDistance)
              console.log('closestGasPrice is ', closestGasPrice)
              console.log(`Estimated fuel cost is ${convertedDistance / MPG * closestGasPrice}`)
            })
          });
  }
})

$('#car-submit').on('click', function(e) {
  e.preventDefault();
  //<fuelEconomy.gov>
  // Changes XML to JSON
  function xmlToJson(xml) {
    // Create the return object
    var obj = {};
    if (xml.nodeType == 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
      for(var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof(obj[nodeName]) == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof(obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  };

  //pull user inputs of car info
  model = $('#car-model').val().trim();
  make = $('#car-make').val().trim();
  if ($('#car-year').val()) {
    year = $('#car-year').val().trim();
  }

  var carInfo = [];  
  $.ajax({
    url: `http://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${make}&model=${model}`,
    method: 'get'
  }).done(function (res) {
    var resJSON = xmlToJson(res);
    console.log(resJSON);
    var carArr = resJSON.menuItems.menuItem;
    for (var i = 0; i < carArr.length; i++) {
      var configID = {};
      configID[carArr[i].value['#text']] = carArr[i].text['#text'];
      carInfo.push(configID);
    }
    // console.log(carInfo);
    _.each(carInfo, function (val) {
      // console.log(Object.keys(val))
      $.ajax({
        url:`http://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/${Object.keys(val)[0]}`,
        method: 'get'
      }).done(function(response) {
        // console.log(response)
        var dataJSON = xmlToJson(response)
        // console.log('vehicle info', dataJSON.yourMpgVehicle.avgMpg['#text'])
        console.log(`Config: ${Object.values(val)} gives ${dataJSON.yourMpgVehicle.avgMpg['#text']} combined MPG`);
        MPG = dataJSON.yourMpgVehicle.avgMpg['#text'];
        console.log(`Estimated fuel cost is ${convertedDistance / MPG * closestGasPrice}`);
      })
    })
  })
})
