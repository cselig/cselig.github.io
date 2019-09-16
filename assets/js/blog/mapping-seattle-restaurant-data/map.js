var map = L.map('map').setView([47.612421, -122.311006], 12);

var geojson;

var metric = 'grades'

for (x in zip_codes['features']) {
    var item = zip_codes.features[x].properties;
    item.rating = ratings[item['GEOID10']];
}

function getColor(id) {
    if (id in ratings[metric]) {
        d = ratings[metric][id].score;
    } else {
        d = null;
    }
	return d > 2 ? '#db7b2b' :
	       d > 1.6666 ? '#e7b416' :
	       d > 1.3333 ? '#99c140' :
	       d >= 1 ? '#2dc937' :
                '#D3D3D3';
}

function style(feature) {
	return {
		fillColor: getColor(feature.properties.GEOID10),
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7
	};
}

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 3,
		color: '#666',
		fillOpacity: 0.7
	});

    layer.bringToFront();
}

function resetHighlight(e) {
	geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
    console.log(e.target.feature.properties.GEOID10)
	map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1IjoiY3NlbGlnIiwiYSI6ImNqenl3Nm0wdTBya3QzY3FkNTd2M3huMGgifQ.I3RGQLGmGTwl5FHoELiAAQ'
}).addTo(map);

geojson = L.geoJson(zip_codes, {style: style, onEachFeature: onEachFeature}).addTo(map);
