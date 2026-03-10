// Basemaps
// ----------------------
var streets = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// ----------------------
// Create map
// ----------------------
var map = L.map("map", {
    center: [6.794952075439587, 20.91148703911037],
    zoom: 2,
    layers: [streets, Esri_WorldImagery]
});

var homeCenter = map.getCenter();
var homeZoom = map.getZoom();

// ----------------------
// Home Button
// ----------------------
L.easyButton('<img src="images/globe_icon.png" height="60%">', function () {
    map.setView(homeCenter, homeZoom);
}, "Home").addTo(map);

// ----------------------
// Wonders data & popups
// ----------------------
var customOptions = { maxWidth: 150, className: 'custom' };

var wonders = [
    { name: "Petra", coords: [30.3285, 35.4444], popupHtml: "Petra<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/The_Monastery%2C_Petra%2C_Jordan8.jpg/256px-The_Monastery%2C_Petra%2C_Jordan8.jpg' alt='petra' width='150px'/>" },
    { name: "Colosseum", coords: [41.8902, 12.4922], popupHtml: "Colosseum<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Colosseum_in_Rome-April_2007-1-_copie_2B.jpg/256px-Colosseum_in_Rome-April_2007-1-_copie_2B.jpg' alt='colosseum' width='150px'/>" },
    { name: "Great Wall of China", coords: [40.4505, 116.5490], popupHtml: "Great Wall of China<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/20090529_Great_Wall_8185.jpg/256px-20090529_Great_Wall_8185.jpg' alt='great wall' width='150px'/>" },
    { name: "Chichen-Itza", coords: [20.6793, -88.5682], popupHtml: "Chichen Itza<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/003_El_Castillo_o_templo_de_Kukulkan._Chich%C3%A9n_Itz%C3%A1%2C_M%C3%A9xico._MPLC.jpg/256px-003_El_Castillo_o_templo_de_Kukulkan._Chich%C3%A9n_Itz%C3%A1%2C_M%C3%A9xico._MPLC.jpg' alt='chichen-itza' width='150px'/>" },
    { name: "Machu Picchu", coords: [-13.1629, -72.5450], popupHtml: "Machu Picchu<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/256px-Machu_Picchu%2C_Peru.jpg' alt='machu picchu' width='150px'/>" },
    { name: "Christ the Redeemer", coords: [-22.9517, -43.2104], popupHtml: "Christ the Redeemer<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Aerial_view_of_the_Statue_of_Christ_the_Redeemer.jpg/256px-Aerial_view_of_the_Statue_of_Christ_the_Redeemer.jpg' alt='christ' width='150px'/>" },
    { name: "Taj-Mahal", coords: [27.1753, 78.0421], popupHtml: "Taj-Mahal<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Taj-Mahal.jpg/256px-Taj-Mahal.jpg' alt='taj mahal' width='150px'/>" }
];

var iconFiles = [
    "images/icon_1.png",
    "images/icon_2.png",
    "images/icon_3.png",
    "images/icon_4.png",
    "images/icon_5.png",
    "images/icon_6.png",
    "images/icon_7.png",
];

var wonderIcons = iconFiles.map(function(file) {
    return L.icon({
        iconUrl: file,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -28],
    });
});

// ----------------------
// Add markers
// ----------------------
var landmarks = L.layerGroup().addTo(map);

function addWondersToLayer(dataArray, layerGroup, iconsArray) {
    var markers = [];
    for (var i = 0; i < dataArray.length; i++) {
        var feature = dataArray[i];
        var marker = L.marker(feature.coords, { icon: iconsArray[i] })
            .bindPopup(feature.popupHtml, customOptions)
            .bindTooltip(feature.name, { direction: "top", sticky: true, opacity: 0.9 })
            .addTo(layerGroup);
        markers.push(marker);
    }
    return markers;
}

var wonderMarkers = addWondersToLayer(wonders, landmarks, wonderIcons);

// ----------------------
// Sidebar buttons
// ----------------------
var buttonsDiv = document.getElementById("wonder-buttons");
var wonderZoom = 6;

wonders.forEach(function(w, i){
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-outline-secondary btn-sm text-start";
    btn.innerHTML = '<img src="'+iconFiles[i]+'" style="width:18px;height:18px;margin-right:8px;">'+w.name;
    btn.addEventListener("click", function() {
        map.setView(w.coords, wonderZoom);
        wonderMarkers[i].openPopup();
    });
    buttonsDiv.appendChild(btn);
});

// ----------------------
// Layer control
// ----------------------
var baseLayers = {
    'Satellite Imagery': Esri_WorldImagery,
    'Streetmap': streets
};
var overlays = {
    'Wonders': landmarks
};
L.control.layers(baseLayers, overlays, {collapsed: false}).addTo(map);

// ----------------------
// MiniMap
// ----------------------
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

// ----------------------
// Click-to-get-lat/lon
// ----------------------
var clickPopup = L.popup();

function onMapClick(e) {
    var lat = e.latlng.lat;
    var lon = e.latlng.lng;

    clickPopup.setLatLng(e.latlng)
        .setContent("You clicked the map at:<br><b>Lat:</b> "+lat.toFixed(5)+"<br><b>Lon:</b> "+lon.toFixed(5))
        .openOn(map);

    document.getElementById("click-lat").textContent = lat.toFixed(5);
    document.getElementById("click-lon").textContent = lon.toFixed(5);
}

map.on("click", onMapClick);

// ----------------------
// Real-time ISS Marker
// ----------------------
var issIcon = L.icon({
    iconUrl: "images/iss200.png",
    iconSize: [80, 52],
    iconAnchor: [25, 16]
});
var issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);

var api_url = "https://api.wheretheiss.at/v1/satellites/25544";

function formatTime(d) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

async function getISS() {
    try {
        var response = await fetch(api_url);
        if (!response.ok) throw new Error("ISS API error");
        var data = await response.json();

        issMarker.setLatLng([data.latitude, data.longitude]);
        document.getElementById("lat").textContent = data.latitude.toFixed(3);
        document.getElementById("lon").textContent = data.longitude.toFixed(3);
        document.getElementById("iss-time").textContent = formatTime(new Date());
    } catch (err) {
        document.getElementById("iss-time").textContent = "ISS unavailable";
    }
}

getISS();
setInterval(getISS, 1000);

document.getElementById("btn-iss").addEventListener("click", function() {
    var ll = issMarker.getLatLng();
    map.setView([ll.lat, ll.lng], 4);
});