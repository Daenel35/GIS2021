//var map = new ol.Map({
//  target: document.getElementById("map"),
//  layers: [new ol.layer.Tile({ visible: true, source: new ol.source.OSM() })],
//  view: new ol.View({ center: [0, 0], zoom: 2 }),
//});

//general variables:

var url_wms_Aus = 'http://localhost:8080/geoserver/Austoni/wms'

var url_wms = 'http://ec2-3-15-148-89.us-east-2.compute.amazonaws.com:8080/geoserver/wms'

var url_wfs =
  "https://ec2-3-15-148-89.us-east-2.compute.amazonaws.com:8080/geoserver/";

var workspace_name = "gis";
var workspace = "Austoni";

//BASE MAPS:
var osm = new ol.layer.Tile({
  title: "Open Street map",
  type: "base",
  visible: false,
  source: new ol.source.OSM(),
});

var bingRoads = new ol.layer.Tile({
  title: "Bing Maps—Roads",
  type: "base",
  visible: false,
  source: new ol.source.BingMaps({
    key: "AvUPT-mlamS50HlSYOaL5Mz8iZvqbzGrUs1-qRLevsCd8ZjyoRAPcQf1Ab5E2w1u",
    imagerySet: "Road",
  }),
});

var bingAerial = new ol.layer.Tile({
  title: "Bing Maps—Aerial",
  type: "base",
  visible: false,
  source: new ol.source.BingMaps({
    key: "AvUPT-mlamS50HlSYOaL5Mz8iZvqbzGrUs1-qRLevsCd8ZjyoRAPcQf1Ab5E2w1u",
    imagerySet: "Aerial",
  }),
});

var bingAerialWithLabels = new ol.layer.Tile({
  title: "Bing Maps—Aerial with Labels",
  type: "base",
  visible: true,
  source: new ol.source.BingMaps({
    key: "AvUPT-mlamS50HlSYOaL5Mz8iZvqbzGrUs1-qRLevsCd8ZjyoRAPcQf1Ab5E2w1u",
    imagerySet: "AerialWithLabels",
  }),
});

var stamenWatercolor = new ol.layer.Tile({
  title: "Stamen Watercolor",
  type: "base",
  visible: false,
  source: new ol.source.Stamen({ layer: "watercolor" }),
});

var stamenToner = new ol.layer.Tile({
  title: "Stamen Toner",
  type: "base",
  visible: false,
  source: new ol.source.Stamen({ layer: "toner" }),
});

//LAYERS:
var levels4map = new ol.layer.Image({
  title: "Exposure susceptibility map",
  source: new ol.source.ImageWMS({
    url: url_wms_Aus,
    params: { 'LAYERS': workspace + ":" + "sup_map_4levels_obsolete" },
    crossOrigin: "Anonymous",
  }),
});

// var ecuadorProvinces = new ol.layer.Image({
//   title:"Ecuador Provinces",
//   source: new ol.source.ImageWMS({
//     url: "https://ec2-3-15-148-89.us-east-2.compute.amazonaws.com:8080/geoserver/wms",
//     params: {
//       LAYERS: workspace_name+":"+"ECU_adm1"},
//     crossOrigin: "Anonymous",
//   }),
//   opacity: 0.5,
// });

var ecuadorRoads = new ol.layer.Image({
  title: "Roads",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: {
      'LAYERS': workspace_name + ":" + "ECU_roads",
    },
    crossOrigin: "Anonymous",
  }),
  visible: true,
});

 /* var ecuadorRailways = new ol.layer.Image({
   title:"Rails",
   source: new ol.source.ImageWMS({
     url: url_wms,
     params: {
       LAYERS: workspace_name+":"+"ECU_rails"
     },
     serverType:'geoserver',
     crossOrigin: "Anonymous",
   }),
   visible: true,
 }); */

var ecuadorwater = new ol.layer.Image({
  title: "Water areas",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: { 'LAYERS': workspace_name + ":" + "ECU_water_areas" },
    crossOrigin: "Anonymous",
  }),
  visible: true,
});

var ecuadorwaterlines = new ol.layer.Image({
  title: "Water lines",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: { 'LAYERS': workspace_name + ":" + "ECU_water_lines" },
    crossOrigin: "Anonymous",
  }),
  visible: true,
});

// var floods = new ol.layer.Image({
//   title:"Floods",
//   source: new ol.source.ImageWMS({
//     url: url_wms,
//     params: { LAYERS: workspace_name+":"+"FloodHazard100y" },
//     crossOrigin: "Anonymous",
//   }),
//   visible: true,
// });

var vectorSource = new ol.source.Vector({
  loader: function (extent, resolution, projection) {
    var url =
      url_wfs +
      "ows?service=WFS&" +
      "version=2.0.0&request=GetFeature&typeName=" +
      workspace_name +
      ":ECU_rails&" +
      "outputFormat=text/javascript&srsname=EPSG:3857&" +
      "format_options=callback:loadFeatures";
    $.ajax({ url: url, dataType: "jsonp" });
  },
});
var geojsonFormat = new ol.format.GeoJSON();
// append features in geojson
function loadFeatures(response) {
  vectorSource.addFeatures(geojsonFormat.readFeatures(response));
}
var ecuadorRailways = new ol.layer.Vector({
  title: "Ecuador railways",
  source: vectorSource,
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({ color: "rgb(80, 190, 120)", width: 4 }),
  }),
});

var ecuadorSrtm = new ol.layer.Image({
  title: "Ecuador DEM (SRTM)",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: { 'LAYERS': workspace_name + ":DEM_Ecuador" },
    crossOrigin: "Anonymous",
  }),
});

var ecuadorTourismMap = new ol.layer.Image({
  title: "Ecuador tourism map",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: { LAYERS: workspace_name + ":Ecuador_tourism_map_georeferenced" },
    crossOrigin: "Anonymous",
  }),
});

var remoteWms = new ol.layer.Image({
  title: "Remote WMS",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: { 'LAYERS': workspace_name + ":FloodHazard100y" },
    crossOrigin: "Anonymous",
  }),
});

// MAP:
var map = new ol.Map({
  target: document.getElementById("map"),
  //layers: [osm, ecuadorBoundary, ecuadorwater, ecuadorwaterlines, ecuadorRoads],
  layers: [
    new ol.layer.Group({
      title: "Base Maps",
      layers: [
        osm,
        bingRoads,
        bingAerial,
        bingAerialWithLabels,
        stamenWatercolor,
        stamenToner,
      ],
    }),
    new ol.layer.Group({
      title: "Overlay Layers",
      layers: [
        levels4map,
        ecuadorwater,
        ecuadorwaterlines,
        ecuadorRoads,
        ecuadorRailways,
        remoteWms,
        ecuadorSrtm,
        ecuadorTourismMap,
      ],
    }),
  ],

  //layers: [osm, ecuadorProvinces, ecuadorwater, ecuadorRoads, floods],
  view: new ol.View({
    center: ol.proj.fromLonLat([10.20, 46.22]),
    zoom: 11.7,
  }),

  controls: ol.control.defaults().extend([
    new ol.control.ScaleLine(),
    new ol.control.FullScreen(),
    new ol.control.OverviewMap({ layers: [osm] }),
    new ol.control.MousePosition({
      coordinateFormat: ol.coordinate.createStringXY(4),
      projection: "EPSG:32632",
    }),
  ]),
});

//add layer switcher:
var layerSwitcher = new ol.control.LayerSwitcher({});
map.addControl(layerSwitcher);

//add popup:
var elementPopup = document.getElementById("popup");

var popup = new ol.Overlay({
  element: elementPopup,
});
map.addOverlay(popup);

// function for popup (click):

map.on("click", function (event) {
  var feature = map.forEachFeatureAtPixel(
    event.pixel,
    function (feature, layer) {
      return feature;
    }
  );

  if (feature != null) {
    var pixel = event.pixel;
    var coord = map.getCoordinateFromPixel(pixel);
    popup.setPosition(coord);
    $(elementPopup).attr("title", "Ecuador railways");
    $(elementPopup).attr(
      "data-bs-content",
      "<b>Id: </b>" +
        feature.get("fid_rail_d") +
        "</br><b>Description: </b>" +
        feature.get("f_code_des")
    );
    $(elementPopup).popover({ placement: "top", html: true });
    $(elementPopup).popover("show");
  }
});

map.on("pointermove", function (event) {
  if (event.dragging) {
    $(elementPopup).popover("dispose");
    return;
  }
  var pixel = map.getEventPixel(event.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? "pointer" : "";
});

// GET LEGEND:
document.getElementById('get-legend').innerHTML = '<img src='+ecuadorSrtm.A.source.getLegendUrl()+'></img >';
