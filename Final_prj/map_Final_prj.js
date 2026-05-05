const map = L.map("map").setView([37.09024, -95.71289], 4);

// ── BASEMAPS ──────────────────────────────────────────────────
// Light (CartoDB) is the default on load
var light = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
});
light.addTo(map);

var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 18
});

var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'Tiles &copy; Esri'
});

// ── HOME BUTTON ───────────────────────────────────────────────
var homeCenter = [37.09024, -95.71289];
var homeZoom = 4;

L.easyButton(
    '<img src="images/globe_icon.png" height="60%">',
    function () { map.setView(homeCenter, homeZoom); },
    "Home"
).addTo(map);

// ── MINI MAP ──────────────────────────────────────────────────
var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    minZoom: 0, maxZoom: 13, attribution: '&copy; OpenStreetMap'
});
new L.Control.MiniMap(miniLayer, {
    toggleDisplay: true, minimized: false, position: "bottomleft"
}).addTo(map);

// ── STADIUM ICON ──────────────────────────────────────────────
var myIcon = L.icon({
    iconUrl: 'images/stadium_clear.png',
    iconSize: [30, 30], iconAnchor: [10, 15], popupAnchor: [1, -24]
});

// ── STADIUM MARKERS (loads by default) ───────────────────────
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

// ── SHARED YEAR STATE ─────────────────────────────────────────
var currentYear = '2024';

// ── HELPER FUNCTIONS ──────────────────────────────────────────
function getSpendingRadius(spending) {
    if (!spending) return 4;
    if (spending >= 100000000) return 28;
    if (spending >= 80000000)  return 24;
    if (spending >= 60000000)  return 20;
    if (spending >= 40000000)  return 16;
    if (spending >= 20000000)  return 11;
    if (spending >= 10000000)  return 7;
    return 4;
}

function getWinColor(pct) {
    if (pct === null || pct === undefined) return '#888888';
    if (pct >= 0.80) return '#1a9850';
    if (pct >= 0.65) return '#a6d96a';
    if (pct >= 0.50) return '#fdae61';
    if (pct >= 0.35) return '#f46d43';
    return '#d73027';
}

function formatMoney(val) {
    if (!val) return 'N/A';
    return '$' + (val / 1000000).toFixed(1) + 'M';
}

// ── PROPORTIONAL CIRCLES ──────────────────────────────────────
// Size = spending | Gold ring = AP Top 25 | Red fill for all
var propcircles = L.layerGroup();

function drawProportionalCircles(year) {
    propcircles.clearLayers();
    L.geoJson(stadiums, {
        onEachFeature: function(feature, featureLayer) {
            var spending = feature.properties['SPENDING_' + year];
            var wins     = feature.properties['WINS_' + year];
            var losses   = feature.properties['LOSSES_' + year];
            var apRank   = feature.properties['AP_RANK_' + year];
            var rankText = apRank ? 'AP Final Rank: <b>#' + apRank + '</b></br>' : '';
            featureLayer.bindPopup(
                '<p>Team: <b>' + feature.properties.TITLE + '</b></br>' +
                rankText +
                year + ' Spending: <b>' + formatMoney(spending) + '</b></br>' +
                year + ' Record: ' + (wins !== null ? wins + '-' + losses : 'N/A') + '</p>'
            );
        },
        pointToLayer: function(feature, latlng) {
            var spending = feature.properties['SPENDING_' + year];
            var apRank   = feature.properties['AP_RANK_' + year];
            var borderColor  = apRank ? '#f0a500' : '#920101';
            var borderWeight = apRank ? 3 : 1;
            return L.circleMarker(latlng, {
                fillColor:   '#920101',
                color:       borderColor,
                weight:      borderWeight,
                radius:      getSpendingRadius(spending),
                fillOpacity: 0.45
            }).on({
                mouseover: function(e) {
                    this.openPopup();
                    this.setStyle({fillOpacity: 0.8});
                },
                mouseout: function(e) {
                    this.closePopup();
                    this.setStyle({fillOpacity: 0.45});
                }
            });
        }
    }).eachLayer(function(layer) { propcircles.addLayer(layer); });
}

drawProportionalCircles(currentYear);

// ── PERFORMANCE LAYER ─────────────────────────────────────────
// Size = spending | Color = win % (no gold ring — cleaner read)
var performancelayer = L.layerGroup();

function drawPerformanceLayer(year) {
    performancelayer.clearLayers();
    L.geoJson(stadiums, {
        onEachFeature: function(feature, featureLayer) {
            var spending = feature.properties['SPENDING_' + year];
            var wins     = feature.properties['WINS_' + year];
            var losses   = feature.properties['LOSSES_' + year];
            var pct      = feature.properties['PCT_' + year];
            var winPct   = pct !== null ? (pct * 100).toFixed(1) + '%' : 'N/A';
            var record   = (wins !== null && losses !== null) ? wins + '-' + losses : 'N/A';
            featureLayer.bindPopup(
                '<p>Team: <b>' + feature.properties.TITLE + '</b></br>' +
                year + ' Spending: <b>' + formatMoney(spending) + '</b></br>' +
                year + ' Record: ' + record + '</br>' +
                year + ' Win %: ' + winPct + '</p>'
            );
        },
        pointToLayer: function(feature, latlng) {
            var spending = feature.properties['SPENDING_' + year];
            var pct      = feature.properties['PCT_' + year];
            return L.circleMarker(latlng, {
                fillColor:   getWinColor(pct),
                color:       '#ffffff',
                weight:      1,
                radius:      getSpendingRadius(spending),
                fillOpacity: 0.75
            }).on({
                mouseover: function(e) {
                    this.openPopup();
                    this.setStyle({fillOpacity: 1});
                },
                mouseout: function(e) {
                    this.closePopup();
                    this.setStyle({fillOpacity: 0.75});
                }
            });
        }
    }).eachLayer(function(layer) { performancelayer.addLayer(layer); });
}

drawPerformanceLayer(currentYear);

// ── HEATMAP (NOT loaded by default) ──────────────────────────
var heatMapPoints = [];
stadiums.features.forEach(function(feature) {
    heatMapPoints.push([
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
        feature.properties.CAPACITY
    ]);
});

var heat = L.heatLayer(heatMapPoints, {
    radius: 25,
    minOpacity: 0.5,
    gradient: {0.5: 'blue', 0.75: 'lime', 1: 'red'},
});
// note: heat is NOT added to map here — user toggles it on manually

// ── YEAR DROPDOWN in sidebar ──────────────────────────────────
var yearSelectorHTML =
    '<div style="margin-bottom:12px;">' +
    '<label for="year-select" style="font-weight:600;display:block;margin-bottom:4px;">Select Year:</label>' +
    '<select id="year-select" style="width:100%;padding:4px;border-radius:4px;border:1px solid #ccc;">' +
    '<option value="2024" selected>2024</option>' +
    '<option value="2023">2023</option>' +
    '<option value="2022">2022</option>' +
    '</select>' +
    '</div>';

document.getElementById('prop-circle-legend').innerHTML = yearSelectorHTML;

document.getElementById('year-select').addEventListener('change', function() {
    currentYear = this.value;
    drawProportionalCircles(currentYear);
    drawPerformanceLayer(currentYear);
});

// ── SEARCH ────────────────────────────────────────────────────
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

// ── SCALE BAR ─────────────────────────────────────────────────
L.control.scale({
    position: 'bottomright',
    metric: true,
    imperial: false,
    maxWidth: 100
}).addTo(map);

// ── LAYER CONTROL ─────────────────────────────────────────────
var baseLayers = {
    "⬜ Light": light,
    "🛰️ Satellite": satellite,
    "🗺️ Streets": streets
};

var overlays = {
    "<span title='Team name, stadium, city, conference, capacity'>📍 Stadium Markers</span>": peaks,
    "<span title='Size = spending | Gold ring = AP Top 25'>⭕ Proportional Circles (Spending)</span>": propcircles,
    "<span title='Size = spending | Color = win percentage'>🏆 Performance Layer (Win %)</span>": performancelayer,
    "<span title='Intensity = stadium capacity'>🌡️ Heat Map</span>": heat
};

L.control.layers(baseLayers, overlays, {
    position: 'topright',
    collapsed: false
}).addTo(map);
