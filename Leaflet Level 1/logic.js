// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    console.log(earthquakeData)
  // Define a function that we want to run once for each feature in the features array.
  function styleInfo(feature) { 
    return {opacity: 1, 
      fillOpacity: 1, 
      fillColor: getColor(feature.geometry.coordinates2), 
      color: "#000000", 
      radius: getRadius(feature.properties.mag), 
      stroke: true, 
      weight: 0.5}; 
  }
  // Popup that Describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p><p>" + feature.properties.mag + "</p>");
  }
  
  //Run onEachFeature - gets called on each feature before adding to GeoJSON layer - for our popups 
  //GeoJSON layer contains the features array on the earthquakeData object
 
  var earthquakes = L.geoJSON(earthquakeData, {
    //style: myStyle,  
    onEachFeature: onEachFeature,
    styleInfo: styleInfo
  });

  // earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
    
  // Create base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // This will hold our overlay
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Display street and earthquake overlay
  var myMap = L.map("map", {
    center: [
      0, 0
    ],
    zoom: 2,
    layers: [street, earthquakes]
  });

  // Create/add a layer control.

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}