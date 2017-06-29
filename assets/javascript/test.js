//<myGasFeed stuff>
// var MGF = 'http://devapi.mygasfeed.com/stations/radius/37.7749/-122.4194/5/reg/distance/rfej9napna.json';

// var data = $.ajax({
//   url: cors + MGF,
//   method: 'get'
// }).done((res) => {
//   console.log(JSON.parse(res))
//   // console.log(res);

// })

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

var year = 2013;
var make = 'Honda';
var model = 'Fit';

var carInfo = [];  
$.ajax({
  url: `http://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${make}&model=${model}`,
  method: 'get'
}).done(function (res) {
  var resJSON = xmlToJson(res);
  console.log(resJSON);
  var carArr = resJSON.menuItems.menuItem;
  for (var i = 0; i < carArr.length; i++) {
    var configID = {}
    configID[carArr[i].value['#text']] = carArr[i].text['#text'];
    carInfo.push(configID)
  }
  // console.log(carInfo);
  _.each(carInfo, function (val) {
    // console.log(Object.keys(val))
    $.ajax({
      url:`http://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/${Object.keys(val)[0]}`,
      method: 'get'
    }).done((response) => {
      // console.log(response)
      var dataJSON = xmlToJson(response)
      // console.log('vehicle info', dataJSON.yourMpgVehicle.avgMpg['#text'])
      console.log(`Config: ${Object.values(val)} gives ${dataJSON.yourMpgVehicle.avgMpg['#text']} combined MPG`)
    })
  })
})




