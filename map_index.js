//var map = new ol.Map({
//  target: document.getElementById("map"),
//  layers: [new ol.layer.Tile({ visible: true, source: new ol.source.OSM() })],
//  view: new ol.View({ center: [0, 0], zoom: 2 }),
//});

//general variables:

//var url_wms = 'http://ec2-3-15-148-89.us-east-2.compute.amazonaws.com:8080/geoserver/wms'

var url_wms = 'http://localhost:8080/geoserver/aaa/wms';

var workspace_name = 'aaa';

//BASE MAPS:
var osm = new ol.layer.Tile({
  title: "Open Street map",
  type: "base",
  visible: true,
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
  visible: false,
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

var susc_1K = new ol.layer.Image({
  title: "Susceptibility map 1K",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: { LAYERS: workspace_name + ':susc_map_1K' },
  }),
  crossOrigin: "Anonymous",
});

var susc_5K = new ol.layer.Image({
  title: "Susceptibility map 5K",
  source: new ol.source.ImageWMS({
    url: url_wms,
    params: { LAYERS: workspace_name + ':susc_map_5K' },
  }),
  crossOrigin: "Anonymous",
});

// MAP:
var map = new ol.Map({
  target: document.getElementById("map"),
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
      layers: [susc_1K,susc_5K],
    }),
  ],

  view: new ol.View({
    center: ol.proj.fromLonLat([10.173274, 46.214324]),
    zoom: 11,
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

// add legends

document.getElementById("get-legend").innerHTML =
  "<img src=" + susc_5K.A.source.getLegendUrl() + "></img>";