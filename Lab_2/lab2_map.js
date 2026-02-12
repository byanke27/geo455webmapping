const map = L.map("map").setView([43.668556, -90.237754], 13);

L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
               '<a href="https://opentopomap.org">OpenTopoMap</a>'
}).addTo(map);

L.marker([43.668556, -90.237754])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>I am Silverwolf LLC.")
  .openPopup();
