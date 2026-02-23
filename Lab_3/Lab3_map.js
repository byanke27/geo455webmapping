const map = L.map("map").setView([43.533147, -89.961500], 10);

L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
               '<a href="https://opentopomap.org">OpenTopoMap</a>'
}).addTo(map);

var myIcon1 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon2 = L.icon({
    iconUrl: 'images/icon_2.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon3 = L.icon({
    iconUrl: 'images/icon_3.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon4 = L.icon({
    iconUrl: 'images/icon_4.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon5 = L.icon({
    iconUrl: 'images/icon_5.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon6 = L.icon({
    iconUrl: 'images/icon_6.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon7 = L.icon({
    iconUrl: 'images/icon_7.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon8 = L.icon({
    iconUrl: 'images/icon_8.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon9 = L.icon({
    iconUrl: 'images/icon_9.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon10 = L.icon({
    iconUrl: 'images/icon_10.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});


L.marker([43.544147, -89.961509])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>Reedsburg Country Club.")
  .openPopup();
L.marker([43.448991, -89.737789])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>Baraboo Country Club.")
  .openPopup();
L.marker([43.605147, -89.815414])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>Spring Brook Golf Course.")
  .openPopup();
L.marker([43.633057, -89.79783])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>Trappers Turn Golf Club.")
  .openPopup();
L.marker([43.663433, -89.781316])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>Cold Water Canyon Golf Course.")
  .openPopup();
L.marker([43.3132, -89.71759])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>Lake Wisconsin Country Club.")
  .openPopup();
L.marker([43.2773, -90.041462])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>West Brook Hills Golf Course.")
  .openPopup();
L.marker([43.416873, -89.625607])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>Devil's Head Golf Resort.")
  .openPopup();
L.marker([43.681661, -90.267069])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>Rockin' 9 Golf Course.")
  .openPopup();
L.marker([43.170103, -90.066962])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>Spring Green Golf Course.")
  .openPopup();
