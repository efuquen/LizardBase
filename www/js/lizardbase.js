function loadHome() {
  dojo.place( "<div id='homeContent'><h1>Home Page Placeholder</h1></div>", "mainPanel", "only" );
}

function loadJBrowse() {
  dojo.place( "<iframe src='../jbrowse/index.html' width='100%' height='500px'></iframe>", "mainPanel", "only" );
}

var map;
function loadGis() {
  dojo.place( "<div id='map'></div><div id='coord'></div>", "mainPanel", "only" );

  if( map == null ) {
    var options = {
      // the "community" epsg code for spherical mercator
          projection: "EPSG:900913",
          // map horizontal units are meters
          units: "m",
          // this resolution displays the globe in one 256x256 pixel tile
          maxResolution: 78271.51695,
          // these are the bounds of the globe in sperical mercator
          maxExtent: new OpenLayers.Bounds(-20037508, -20037508,
                                           20037508, 20037508)
    };

    map = new OpenLayers.Map('map',options);
    map.addControl(new OpenLayers.Control.LayerSwitcher());
    map.addControl(new OpenLayers.Control.MousePosition( {div: "coord"} ));

    var gphy = new OpenLayers.Layer.Google(
        "Google Physical",
        {type: G_PHYSICAL_MAP, sphericalMercator: true}
    );
    var gmap = new OpenLayers.Layer.Google(
        "Google Streets", // the default
        {numZoomLevels: 20, sphericalMercator: true}
    );
    var ghyb = new OpenLayers.Layer.Google(
        "Google Hybrid",
        {type: G_HYBRID_MAP, numZoomLevels: 20, sphericalMercator: true}
    );
    var gsat = new OpenLayers.Layer.Google(
        "Google Satellite",
        {type: G_SATELLITE_MAP, numZoomLevels: 20, sphericalMercator: true}
    );
    var lizardBase = new OpenLayers.Layer.WMS("Anole Lizard Specimens",
       "http://ec2-75-101-223-213.compute-1.amazonaws.com/geoserver/wms?service=wms",
       {layers: 'LizardBase:geom',
        srs: 'EPSG:4326',
        format: 'image/png',
        transparent: true},
       {isBaseLayer: false});

    map.addLayers([gphy, gmap, ghyb, gsat, lizardBase]);

    var usBounds = new OpenLayers.Bounds(
      -10018754, 2504689, -7514066, 5009377
      );

    map.zoomToExtent( usBounds );
  } else {
    map.render( 'map' );
  }
}
