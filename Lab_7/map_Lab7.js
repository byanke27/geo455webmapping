const map = L.map("map").setView([28.972443641658437, 84.59443216376953], 8);

L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
  attribution: 'Tiles &copy; Esri',
  maxZoom: 18
}).addTo(map);

// home button/easy button
L.easyButton(
    '<img src="images/globe_icon.png" height="60%">',
    function () {
        map.setView(homeCenter, homeZoom);
    },
    "Home"
).addTo(map);

// code for home button zoom
var homeCenter = [28.972443641658437, 84.59443216376953];
var homeZoom = 8;

// mini map layer
var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    minZoom: 0,
    maxZoom: 13,
    attribution: '&copy; OpenStreetMap'
});

new L.Control.MiniMap(miniLayer, {
    toggleDisplay: true,
    minimized: false,
    position: "bottomleft"
}).addTo(map);

// mountain peaks
var myIcon = L.icon({
    iconUrl: 'images/peaks.png',
    iconSize: [20, 20],
    iconAnchor: [10, 15],
    popupAnchor: [1, -24]
}); 

var peaks = new L.geoJson(mtn_peaks, {
    onEachFeature: function(feature, featureLayer) {
        featureLayer.bindPopup(
            '<p>Peak Name: <b>' + feature.properties.TITLE + '</b></br>' +
            'Peak Height: ' + feature.properties.Peak_Heigh + ' m</br>' +
            'Number of Deaths: ' + feature.properties.number_of_ + '</br>' +
            'Number of Expeditions: ' + feature.properties.number_of1 + '</p>'
        );
    },
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {icon: myIcon});
    }
}).addTo(map);

// proportional circles
function getRadius(area) {
    var radius = Math.sqrt(area / Math.PI);
    return radius * 2;
}

// circle markers
var propcircles = new L.geoJson(mtn_peaks, {
    onEachFeature: function(feature, featureLayer) {
        featureLayer.bindPopup(
            '<p>Peak Name: <b>' + feature.properties.TITLE + '</b></br>' +
            'Number of Expeditions: ' + feature.properties.number_of1 + '</p>'
        );
    },

    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            fillColor: '#920101',
            color: '#920101',
            weight: 2,
            radius: getRadius(feature.properties.number_of1),
            fillOpacity: 0.35
        }).on({
            mouseover: function(e) {
                this.openPopup();
                this.setStyle({fillOpacity: 0.8, fillColor: '#2D8F4E'});
            },
            mouseout: function(e) {
                this.closePopup();
                this.setStyle({fillOpacity: 0.35, fillColor: '#920101'});
            }
        });
    }
});

var min = 0;
var max = 0;
var heatMapPoints = [];

// populating the empty array with lat long
mtn_peaks.features.forEach(function(feature) {

    heatMapPoints.push([
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
        feature.properties.number_of_
    ]);

    if (feature.properties.number_of_ < min || min === 0) {
        min = feature.properties.number_of_;
    }

    if (feature.properties.number_of_ > max || max === 0) {
        max = feature.properties.number_of_;
    }

});

// heat for heatmap
var heat = L.heatLayer(heatMapPoints, {
    radius: 25,
    minOpacity: 0.5,
    gradient:{0.5: 'blue', 0.75: 'lime', 1: 'red'},
}).addTo(map);


// radius for heatmap points
var heat = L.heatLayer(heatMapPoints, {
    radius: 25,
    minOpacity: 0.5,
    gradient:{0.5: 'blue', 0.75: 'lime', 1: 'red'},
}).addTo(map);

// clustermarkers shows cluster of peaks
var clustermarkers = L.markerClusterGroup();
mtn_peaks.features.forEach(function(feature) {
    clustermarkers.addLayer(L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]));
});

map.addLayer(clustermarkers);

// searchbox
var searchControl = new L.Control.Search({
    position:'topright',
    layer: peaks,
    propertyName: 'TITLE',
    marker: false,
    markeranimate: true,
    delayType: 50,
    collapsed: false,
    textPlaceholder: 'Search by Peak Name: e.g. Everest, Lhotse',   
    moveToLocation: function(latlng, title, map) {
        map.setView(latlng, 15);}
});

map.addControl(searchControl); 

L.control.scale({
    position: 'bottomright',   // bottomleft, bottomright, topleft, topright
    metric: true,             // show kilometers/meters
    imperial: false,          // hide miles/feet
    maxWidth: 100             // width of scale bar in pixels
}).addTo(map);

// layer control radio button style in the top right
var baseLayers = {};   // no base-layer swapping needed

var overlays = {
    "<span title='Peak Name, Height, Deaths, Expeditions'>📍 Peak Markers</span>": peaks,
    "<span title='Sized by number of expeditions'>⭕ Proportional Circles</span>": propcircles,
    "<span title='Intensity = number of deaths'>🌡️ Heat Map</span>": heat,
    "<span title='Clustered peak markers'>🔵 Cluster Markers</span>": clustermarkers
};

L.control.layers(baseLayers, overlays, {
    position: 'topright',
    collapsed: false        // keeps the box always open (radio-button style)
}).addTo(map);
