var url_wms = 'http://localhost:8080/geoserver/aaa/wms'
var url_wfs = 'http://ec2-3-15-148-89.us-east-2.compute.amazonaws.com:8080/geoserver/ows?service=WFS&'
var workspace = 'aaa' //thisw is the name of your personal workspace, like geoserver_Austoni
var workspace_A = 'Austoni'
var bing_key= "AvUPT-mlamS50HlSYOaL5Mz8iZvqbzGrUs1-qRLevsCd8ZjyoRAPcQf1Ab5E2w1u"

//BASE MAPS
var osm = new ol.layer.Tile({
	title: 'OpenStreetMap', type: 'base',
	visible: false,	//this sets which is the first visible base map when you initially open the page
	source: new ol.source.OSM()
});

var bingRoads = new ol.layer.Tile({
	title: 'Bing Maps—Roads',
	type: 'base',
	visible: false,
	source: new ol.source.BingMaps({
		key: bing_key,
		imagerySet: 'Road' })
});

var bingAerial = new ol.layer.Tile({
	title: 'Bing Maps—Aerial',
	type: 'base',
	visible: false,
	source: new ol.source.BingMaps({
		key: bing_key,
		imagerySet: 'Aerial' })
});

var bingAerialWithLabels = new ol.layer.Tile({
	title: 'Bing Maps—Aerial with Labels', type: 'base',
	visible: true,
	source: new ol.source.BingMaps({
		key: bing_key,
		imagerySet: 'AerialWithLabels' })
});

//those are free stiles so you don't have to put any key
var stamenWatercolor = new ol.layer.Tile({
	title: 'Stamen Watercolor', type: 'base',
	visible: false,
	source: new ol.source.Stamen({
		layer: 'watercolor' 
	})
});

var stamenToner = new ol.layer.Tile({
	title: 'Stamen Toner',
	type: 'base',
	visible: false,
	source: new ol.source.Stamen({
		layer: 'toner' 
	})
});

//OVERLAY LAYERS

var reclassified1k = new ol.layer.Image({
	title:'Reclassified susceptibility map 1K points',
	source: new ol.source.ImageWMS({
	url: url_wms, 
	params: {'LAYERS': workspace +":suscept_map_1K_reclassified_resampled"},
	crossOrigin: 'anonymous'
	}), 
});

var reclassified5k = new ol.layer.Image({
	title:'Reclassified susceptibility map 5K points',
	source: new ol.source.ImageWMS({
	url: url_wms, 
	params: {'LAYERS': workspace +':suscept_map_5K_reclassified_resampled'},
	crossOrigin: 'anonymous'
	}), 
});

var population = new ol.layer.Image({
	title:'Population map',
	source: new ol.source.ImageWMS({
	url: url_wms, 
	params: {'LAYERS': workspace +':pop_reproj'},
	crossOrigin: 'anonymous'
	}), 
});


var geojsonFormat = new ol.format.GeoJSON(); 

function loadFeatures(response) {
	vectorSource.addFeatures(geojsonFormat.readFeatures(response)); }


//OL MAPS
var map = new ol.Map({
	target: document.getElementById('map'), 
	//layers: [osm, ecuadorBoundary,ecuadorWaterLines, ecuadorRoads, ecuadorWaterArea],
	layers: [
		new ol.layer.Group({ title: 'Base Maps', 
			layers: [osm,bingRoads,bingAerial,stamenWatercolor,stamenToner,bingAerialWithLabels]
		}),
		new ol.layer.Group({
			title: 'Overlay Layers',
			layers: [population,reclassified1k,reclassified5k] 
		}),
	],

	view: new ol.View({
		center: ol.proj.fromLonLat([10.20, 46.22]),
		zoom: 11.7 
	}),
	controls: ol.control.defaults().extend([
		new ol.control.ScaleLine(),
		new ol.control.FullScreen(),
		new ol.control.OverviewMap({layers: [osm]}), new ol.control.MousePosition({
			oordinateFormat: ol.coordinate.createStringXY(4),
			projection: "EPSG:32632" 
		})
	])
});

var layerSwitcher = new ol.control.LayerSwitcher({}); 
map.addControl(layerSwitcher);

//add popup
var elementPopup = document.getElementById('popup');

var popup = new ol.Overlay({ 
	element: elementPopup
}); 
map.addOverlay(popup);

map.on('click', function(event) {
	var feature = map.forEachFeatureAtPixel(event.pixel, function(feature, layer) {
		return feature; 
	});

	if (feature != null) {
		var pixel = event.pixel;
		var coord = map.getCoordinateFromPixel(pixel);
		popup.setPosition(coord);
		$(elementPopup).attr('title', 'Ecuador railways'); 
		$(elementPopup).attr('data-bs-content', '<b>Id: </b>' + feature.get('fid_rail_d') + 
		'</br><b>Description: </b>' + feature.get('f_code_des')); 
		$(elementPopup).popover({'placement': 'top', 'html': true}); 
		$(elementPopup).popover('show');
} 
});

map.on('pointermove', function(event) {
	if (event.dragging) { 
		$(elementPopup).popover('dispose'); return;
}
	var pixel = map.getEventPixel(event.originalEvent); 
	var hit = map.hasFeatureAtPixel(pixel); 
	map.getTarget().style.cursor = hit ? 'pointer' : '';
});

document.getElementById('get-susc-legend').innerHTML = '<img src='+reclassified1k.A.source.getLegendUrl()+'></img >' ;
document.getElementById('get-pop-legend').innerHTML = '<img src='+population.A.source.getLegendUrl()+'></img >' ;