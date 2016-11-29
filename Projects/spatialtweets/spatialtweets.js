$(document).ready(function() {
    renderBarChart("#languages-chart", "#tooltip","../data/tweet_languages.csv", "language","frequency");
    renderBarChart("#devices-chart", "#tooltip","../data/tweet_sources.csv", "source","frequency");
    renderBarChart("#times-chart", "#tooltip","../data/tweet_times.csv", "time","frequency");
    renderBarChart("#dates-chart", "#tooltip","../data/tweet_dates.csv", "date","frequency");

    // Bind a popup to the name of each location
    function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.text_) {
            var popup = "<b>Text:</b> " + feature.properties.text_;
            layer.bindPopup(popup);
        }
    }
    function onEachFeatureLang(feature, layer) {
        if (feature.properties && feature.properties.NAME) {
            var popup = "<b>"+feature.properties.NAME + "</b>";
            if (feature.properties.lang){
                popup += ": " + feature.properties.lang;
            }
            layer.bindPopup(popup);
        }
    }
    var CustomIcon = L.Icon.extend({
        options: {
            iconSize: [20, 20],
        }
    });

    var tweetMap = L.map("tweetMap", {
        zoom: 1,
        center: [0, 0]
    });
    var topo = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    });
    var dark = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png',{ attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>' });
    dark.addTo(tweetMap);
    var tweets = null, heat = null, countries =null;
    var layerControl = L.control.layers({
        "Dark": dark,
        "Topo": topo,
    },{},{
        collapsed:false
    }).addTo(tweetMap);
    $.getJSON('../data/tweets_with_text.geojson', function(data) {
        tweets = L.geoJson(data, {
            filter: function(feature, layer) {
                return feature.properties.OBJECTID <=200;
            },
            onEachFeature: onEachFeature,
        });
        var features = data["features"];
        // create array of lat/long arrays
        var latlng = features.map(function(obj){
            return [obj.geometry.coordinates[1],obj.geometry.coordinates[0]] ;
        });
        // create heat map layer
        heat = L.heatLayer(latlng, {
            radius: 35,
            gradient: {0.0: 'yellow', 0.5: 'yellow', 1: 'red'},
            minOpacity: 0.1,
        });
        heat.addTo(tweetMap);
        layerControl.addOverlay(heat, "Heatmap");
        layerControl.addOverlay(tweets, "200 Tweets");
    });
});