import React from "react";
import { connect } from "react-redux";

class PhotoMap extends React.Component {
  render() {
    return <div id="map" className="container-map" />;
  }
  componentDidMount() {
    map();
  }
}
function map() {
  var apiBaseUrl = process.env.PHOTO_GARDEN_GATEWAY_BASE_URL;
  var tiles = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 18,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
      }
    ),
    etimoOfficePosition = L.latLng(59.33417790000001, 18.0582636);

  var iconMap = L.icon({
    iconUrl: require("./../../../public/img/icon4.png"),
    shadowUrl: "",
    iconSize: [30, 30] // size of the icon
    // Here is information about how to customize the icon:
    // shadowSize:   [0, 0], // size of the shadow
    //iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    //shadowAnchor: [0, 0],  // the same for the shadow
    //popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
  });
  var map = L.map("map", {
    center: etimoOfficePosition,
    zoom: 2.5,
    attributionControl: false,
    minZoom: 2.5,
    maxZoom: 16,
    layers: [tiles]
  });
  L.control.scale().addTo(map);
  // Here is information of themes for the Map.
  //var stamenLayer = new L.StamenTileLayer("terrain");
  //var stamenLayer = new L.StamenTileLayer("toner");
  var stamenLayer = new L.StamenTileLayer("watercolor");
  // The default URL is HTTP, so force the HTTPS equivalent
  stamenLayer.setUrl(
    "https://stamen-tiles-{s}a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
  );
  map.addLayer(stamenLayer);
  var markers = L.markerClusterGroup();

  getCoordinates().then(function(photos) {
    photos.forEach(function(element) {
      var title = `<a href="${element.webViewLink}"> <img src=${
        element.thumbnailLink
      } style="width:90px;height:90px;" alt="${element.name}"> </a>`;
      var marker = L.marker(new L.LatLng(element.lat, element.long), {
        title: element.name,
        icon: iconMap
      });
      marker.bindPopup(title);
      markers.addLayer(marker);
    }, this);
  });

  map.addLayer(markers);
  map.flyTo(etimoOfficePosition, 2.5);

  function getCoordinates() {
    return fetch(apiBaseUrl + "/user/me/photos", {
      method: "GET",
      credentials: "include"
    })
      .then(response => {
        return response.json();
      })
      .catch(err => console.log(err));
  }
}
export default PhotoMap;
