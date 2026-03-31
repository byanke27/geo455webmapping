const map = L.map("map").setView([51.48882027639122, -0.1028811094342392], 11);

L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
               '<a href="https://opentopomap.org">OpenTopoMap</a>'
}).addTo(map);



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

//gives color to buroughs
function getColorDensity(value) {
    return value > 139 ? '#54278f':
           value > 87  ? '#756bb1':
           value > 53  ? '#9e9ac8':
           value > 32  ? '#cbc9e2':
                         '#f2f0f7';
}

function styleDensity(feature){
    return {
        fillColor: getColorDensity(feature.properties.pop_den),   
        weight: 2,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.9
    };
} 

// highlight function
function highlightFeature (e) {
    var layer = e.target;
    
    layer.setStyle({
        weight: 5,
        color: '#666',
        fillOpacity: 0.7
    });
    
    if (!L.Browser.ie && !L.Browser.oprea && !L.Browser.edge)  {
        layer.bringToFront();
    }
}
//reset functions
function resetDensityHighlight(e)  {
    densityLayer.resetStyle(e.target);
    e.target.closePopup();
}
// interaction functions
function onEachDensityFeature(feature, layer)  {
    layer.bindPopup(
    '<strong>' + feature.properties.NAME + '</strong><br>' +
    '<span style="color:purple">' + feature.properties.pop_den + ' people/hectare</span>'
    );
    
    layer.on({
        mouseover: function (e) {
            highlightFeature(e);
            e.target.openPopup();
        },
        mouseout: resetDensityHighlight
    });
}



// burough outlines- "vardensitylayer"
var densitymap = L.geoJson(data, {
    style: styleDensity,
    onEachFeature: onEachDensityFeature
}).addTo(map);

// SECOND CHOROPLETH LAYER

function getColorIncome(value) {
    return value > 80000 ? '#00441b':
           value > 60000 ? '#1b7837':
           value > 40000 ? '#5aae61':
           value > 20000 ? '#a6dba0':
                           '#d9f0d3';
}

function styleIncome(feature){
    return {
        fillColor: getColorIncome(feature.properties.income),   
        weight: 2,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.9
    };
}

function onEachIncomeFeature(feature, layer)  {
    layer.bindPopup(
        '<strong>' + feature.properties.NAME + '</strong><br>' +
        '<span style="color:green">$' + feature.properties.income + '</span>'
    );
    
    layer.on({
        mouseover: function (e) {
            highlightFeature(e);
            e.target.openPopup();
        },
        mouseout: function(e){
            incomemap.resetStyle(e.target);
            e.target.closePopup();
        }
    });
}

var incomemap = L.geoJson(data, {
    style: styleIncome,
    onEachFeature: onEachIncomeFeature
});

// biulding legends in the side panel
function buildLegendHTML(title, grades, colorFunction) {
    var html = '<div class="legend-title">' + title + '</div>';
    
    for (var i = 0; i < grades.length; i++) {
        var from = grades[i];
        var to = grades[i + 1];
        
        html+=
            '<div class="legend-box">' +
            '<span class="legend-color" style="background:' + colorFunction(from + 1) + '">></span>' +
            '<span>' + from + (to ? '&ndash;' + to : '+') + '</span>' +
            '</div>';
    }
    
    return html;
}

// insert denstiy legend into side panel
var densityLegendDiv = document.getElementById('density-legend');
if(densityLegendDiv) {
    densityLegendDiv.innerHTML = buildLegendHTML(
        'Population Density',
        [0, 32, 53, 87, 139],
        getColorDensity
        );
}

// layer control
var baseLayers = {
    'Population Density': densitymap,
};
var overlays = {};

L.control.layers(baseLayers, overlays, {collapsed: false}).addTo(map);

