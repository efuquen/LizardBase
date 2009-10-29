
function init() {
  loadHome();
  dojo.connect( dojo.byId( "homeButton" ), "onclick", loadHome );
  dojo.connect( dojo.byId( "jbrowseButton" ), "onclick", loadJBrowse );
  dojo.connect( dojo.byId( "gisButton" ), "onclick", loadGis );
}

function hideAll() {
  dojo.query( "#homePage" ).style( "display", "none" );
  dojo.query( "#homeButton" ).style( "background-color", "#46c846" );

  dojo.query( "#gisPage" ).style( "display", "none" );
  dojo.query( "#gisButton" ).style( "background-color", "#46c846" );

  dojo.query( "#jbrowsePage" ).style( "display", "none" );
  dojo.query( "#jbrowseButton" ).style( "background-color", "#46c846" );
}

function loadHome() {
  hideAll();
  dojo.query( "#homePage" ).style( "display", "" );
  dojo.query( "#homeButton" ).style( "background-color", "#469646" );
}

function loadJBrowse() {
  hideAll();
  dojo.query( "#jbrowsePage" ).style( "display", "" );
  dojo.place( "<iframe src='../jbrowse/index.html'></iframe>", "jbrowsePage", "only" );
}

var map;
function loadGis() {
  hideAll();
  dojo.query( "#gisPage" ).style( "display", "" );

  if( map == null ) {
    makeMap();
  } else {
    map.render( 'map' );
  }
}

function makeMap() {
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
       {layers: 'LizardBase:features',
        srs: 'EPSG:4326',
        format: 'image/png',
        transparent: true},
       {isBaseLayer: false});

    map.addLayers([gphy, gmap, ghyb, gsat, lizardBase]);

    info = new OpenLayers.Control.WMSGetFeatureInfo({
        url: 'http://ec2-75-101-223-213.compute-1.amazonaws.com/geoserver/wms?service=wms', 
        title: 'Anole Specimen',
        queryVisible: true,
        eventListeners: {
            getfeatureinfo: function(event) {
                map.addPopup(new OpenLayers.Popup.FramedCloud(
                    "anoleLoc", 
                    map.getLonLatFromPixel(event.xy),
                    null,
                    event.text,
                    null,
                    true
                ));
            }
        }
    });
    map.addControl(info);
    info.activate();

    var usBounds = new OpenLayers.Bounds(
      -10018754, 2504689, -7514066, 5009377
      );

    map.zoomToExtent( usBounds );

}

