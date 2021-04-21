// Map object
var myMap = L.map("mapid", {
    center: [32.7767, -96.7970],
    zoom: 2
});

// Define greymap layers  
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Store API inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
    console.log("data");
    console.log(data);

    // Once the response is received, send the data.features object to the createFeatures function
    function createFeatures(features) {
        return {
            fillColor: chooseColor(features.geometry.coordinates[2]),
            color: "#0000",
            radius: chosenRadius(features.properties.mag),
            stroke: true,
            weight: 1.0,
            opacity: 1,
            fillOpacity: 1
        };

        // Set the radius of magnitude
        function chosenRadius(magnitude) {
            return magnitude * 2;
        };

        // Set the color according to the depth reported
        function chooseColor(depth) {

            if (depth > 90) {
                return "#ea2c2c";
            } else if (depth > 70) {
                return "#ea822c";
            } else if (depth > 50) {
                return "#ea822c";
            } else if (depth > 30) {
                return "#ee9c00";
            } else if (depth > 10) {
                return "#d4ee00";
            } else {
                return "#98ee00";
            }
        };
    };

    // Add a GeoJSON layer to the map once the file is loaded
    L.geoJson(data, {
        // Turn each feature into a circleMarker on the map
        pointToLayer: function (features, latlng) {
            return L.circleMarker(latlng);
        },
        // Set the style for each circleMarker using the styleInfo function
        style: createFeatures,
        // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
        onEachFeature: function (features, layer) {
            layer.bindPopup(
                "Magnitude: "
                + features.properties.mag
                + "<br>Depth: "
                + features.geometry.coordinates[2]
                + "<br>Location: "
                + features.properties.place
            );
        }
    }).addTo(myMap);

    // Create a legend control object
    var legend = L.control({
        position: "bottomright"
    });

    // Add all the details for the legend
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");

        var grades = [-10, 10, 30, 50, 70, 90];
        var colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];

        // Loop through the intervals to generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
                + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };

    // Add the legend to the map
    legend.addTo(myMap);

});