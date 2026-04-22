const map = L.map("map").setView([37.09024, -95.71289], 4);

// basemap layers
var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 18
});
satellite.addTo(map);

var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'Tiles &copy; Esri'
});

var light = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
});

// home button/easy button
L.easyButton(
    '<img src="images/globe_icon.png" height="60%">',
    function () {
        map.setView(homeCenter, homeZoom);
    },
    "Home"
).addTo(map);

// code for home button zoom
var homeCenter = [37.09024, -95.71289];
var homeZoom = 4;

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

// stadium icon
var myIcon = L.icon({
    iconUrl: 'images/stadium_icon.png',
    iconSize: [30, 30],
    iconAnchor: [10, 15],
    popupAnchor: [1, -24]
}); 

// stadium markers layer
var peaks = new L.geoJson(stadiums, {
    onEachFeature: function(feature, featureLayer) {
        featureLayer.bindPopup(
            '<p>Team: <b>' + feature.properties.TITLE + '</b></br>' +
            'Stadium: ' + feature.properties.STADIUM + '</br>' +
            'City: ' + feature.properties.CITY + ', ' + feature.properties.STATE + '</br>' +
            'Conference: ' + feature.properties.CONFERENCE + '</br>' +
            'Capacity: ' + feature.properties.CAPACITY.toLocaleString() + '</br>' +
            'Year Built: ' + feature.properties.BUILT + '</p>'
        );
    },
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {icon: myIcon});
    }
}).addTo(map);

// proportional circles — sized by stadium capacity
function getRadius(capacity) {
    var radius = Math.sqrt(capacity / Math.PI);
    return radius * 0.012;  // scale factor to keep circles readable on the map
}

// circle markers layer
var propcircles = new L.geoJson(stadiums, {
    onEachFeature: function(feature, featureLayer) {
        featureLayer.bindPopup(
            '<p>Team: <b>' + feature.properties.TITLE + '</b></br>' +
            'Stadium Capacity: ' + feature.properties.CAPACITY.toLocaleString() + '</p>'
        );
    },
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            fillColor: '#920101',
            color: '#920101',
            weight: 2,
            radius: getRadius(feature.properties.CAPACITY),
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

// heatmap — intensity weighted by stadium capacity
var min = 0;
var max = 0;
var heatMapPoints = [];

stadiums.features.forEach(function(feature) {
    heatMapPoints.push([
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
        feature.properties.CAPACITY
    ]);

    if (feature.properties.CAPACITY < min || min === 0) {
        min = feature.properties.CAPACITY;
    }

    if (feature.properties.CAPACITY > max || max === 0) {
        max = feature.properties.CAPACITY;
    }
});

var heat = L.heatLayer(heatMapPoints, {
    radius: 25,
    minOpacity: 0.5,
    gradient: {0.5: 'blue', 0.75: 'lime', 1: 'red'},
}).addTo(map);

// cluster markers
var clustermarkers = L.markerClusterGroup();
stadiums.features.forEach(function(feature) {
    clustermarkers.addLayer(
        L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])
    );
});

map.addLayer(clustermarkers);

// search box — searches by team name (TITLE field)
var searchControl = new L.Control.Search({
    position: 'topright',
    layer: peaks,
    propertyName: 'TITLE',
    marker: false,
    markeranimate: true,
    delayType: 50,
    collapsed: false,
    textPlaceholder: 'Search by team: e.g. Michigan, Alabama',
    moveToLocation: function(latlng, title, map) {
        map.setView(latlng, 15);
    }
});

map.addControl(searchControl);

// scale bar
L.control.scale({
    position: 'bottomright',
    metric: true,
    imperial: false,
    maxWidth: 100
}).addTo(map);

// layer control
var baseLayers = {
    "🛰️ Satellite": satellite,
    "🗺️ Streets": streets,
    "⬜ Light": light
};

var overlays = {
    "<span title='Team name, stadium, city, conference, capacity'>📍 Stadium Markers</span>": peaks,
    "<span title='Sized by stadium capacity'>⭕ Proportional Circles</span>": propcircles,
    "<span title='Intensity = stadium capacity'>🌡️ Heat Map</span>": heat,
    "<span title='Clustered stadium markers'>🔵 Cluster Markers</span>": clustermarkers
};

L.control.layers(baseLayers, overlays, {
    position: 'topright',
    collapsed: false
}).addTo(map);
