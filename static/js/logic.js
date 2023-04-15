// Set up the map
const myMap = L.map("mapid").setView([0, 0], 2);

// Add the tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(myMap);

// Load the earthquake data
fetch(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"
)
  .then((response) => response.json())
  .then((data) => {
    // Create a function to calculate the size of each marker based on earthquake magnitude
    function calculateMarkerSize(magnitude) {
      return magnitude * 4;
    }

    // Create a function to calculate the color of each marker based on earthquake depth
    function calculateMarkerColor(depth) {
      if (depth < 10) {
        return "#ffeda0";
      } else if (depth < 30) {
        return "#feb24c";
      } else if (depth < 50) {
        return "#f03b20";
      } else {
        return "#bd0026";
      }
    }

    // Add markers for each earthquake
    data.features.forEach((feature) => {
      const marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        radius: calculateMarkerSize(feature.properties.mag),
        fillColor: calculateMarkerColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      });

      marker.bindPopup(
        `<b>Location:</b> ${feature.properties.place}<br><b>Magnitude:</b> ${feature.properties.mag}<br><b>Depth:</b> ${feature.geometry.coordinates[2]} km`
      );

      marker.addTo(myMap);
    });

    // Add a legend
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {
      const div = L.DomUtil.create("div", "info legend");
      const depths = [0, 10, 30, 50];
      const labels = [];

      div.innerHTML += "<h4>Depth</h4>";

      for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          calculateMarkerColor(depths[i] + 1) +
          '"></i> ' +
          depths[i] +
          (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
      }

      return div;
    };

    legend.addTo(myMap);
  });
