// URL for all earthquakes from the past 7 days
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to determine the color of the circle based on the depth of the earthquake
function circleColor(depth){
    if (depth>=90){
        return "#662506";
    } else if (depth>=70){
        return "#993404";
    } else if (depth>=50){
        return "#cc4c02";
    } else if (depth>=30){
        return "#ec7014";
    } else if (depth>=10){
        return "#fe9929";
    } else {
        return "#fec44f";
    };
};

// Function to determine the size of the circle based on the magnitude of the earthquake
function circleSize(magnitude){
    return 10000*magnitude;
};

// Get earthquake data and map it
d3.json(url).then(function(data){

    // Initializing a map object
    let initialMap = L.map("map").setView([40.7967, -111.5215], 4.5);

    // Adding a tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyight">OpenStreetMap</a> contributors'
    }).addTo(initialMap);

    // Adding earthquake circles to the map
    for (let i=0; i<data.features.length; i++){

        coord = [data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]];
        
        L.circle(coord, {
            fillOpacity: 0.5,
            color: circleColor(data.features[i].geometry.coordinates[2]),
            fillColor: circleColor(data.features[i].geometry.coordinates[2]),
            radius: circleSize(data.features[i].properties.mag)
        })
        .bindPopup(`<h4>Magnitude:</h4> ${data.features[i].properties.mag}
                    <h4>Location:</h4> ${data.features[i].properties.place}
                    <h4>Depth:</h4> ${data.features[i].geometry.coordinates[2]}`)
    
        .addTo(initialMap);
    };

    // Adding color legend to the map
    let legend = L.control({position: "bottomright"});
    
    legend.onAdd = function(){
        let div = L.DomUtil.create("div", "info-legend");

        let labels = [
            '<dt><i style="background-color: #fec44f"></i> -10 to 10</dt>',
            '<dt><i style="background-color: #fe9929"></i> 10 to 30</dt>',
            '<dt><i style="background-color: #ec7014"></i> 30 to 50</dt>',
            '<dt><i style="background-color: #cc4c02"></i> 50 to 70</dt>',
            '<dt><i style="background-color: #993404"></i> 70 to 90</dt>',
            '<dt><i style="background-color: #662506"></i> 90+</dt>'
        ];

        div.innerHTML += '<div class="legend">' + "<dl>" + labels.join("") + "</dl>" + "</div>";
    
        return div;
    };

    legend.addTo(initialMap);

});



