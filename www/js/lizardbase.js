
function init() {
  loadHome();
  dojo.connect( dojo.byId( "homeButton" ), "onclick", loadHome );
  dojo.connect( dojo.byId( "jbrowseButton" ), "onclick", loadJBrowse );
  dojo.connect( dojo.byId( "gisButton" ), "onclick", loadGis );
  dojo.connect( dojo.byId( "whatsNewLink" ), "onclick", loadWhatsNew );
  dojo.connect( dojo.byId( "dataMappingLink" ), "onclick", loadDataMappingPortal );

	dojo.connect( dojo.byId( "gisFilterSubmit" ), "onclick", reloadGis );
}

function hideAll() {
  dojo.query( "#homePage" ).style( "display", "none" );
  //dojo.query( "#homeButton" ).style( "background-color", "#46c846" );

  dojo.query( "#gisPage" ).style( "display", "none" );
  //dojo.query( "#gisButton" ).style( "background-color", "#46c846" );

  dojo.query( "#jbrowsePage" ).style( "display", "none" );
  //dojo.query( "#jbrowseButton" ).style( "background-color", "#46c846" );

  dojo.query( "#whatsNewPage" ).style( "display", "none" );

  dojo.query( "#dataMappingPortal" ).style( "display", "none" );
}

function loadWhatsNew() {
	hideAll();
  dojo.query( "#whatsNewPage" ).style( "display", "" );
}

function loadDataMappingPortal() {
	hideAll();
  dojo.query( "#dataMappingPortal" ).style( "display", "" );
}

function loadHome() {
  hideAll();
  dojo.query( "#homePage" ).style( "display", "" );
  //dojo.query( "#homeButton" ).style( "background-color", "#469646" );
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
    map.render( 'map' );
  } else {
    map.render( 'map' );
  }
}

function reloadGis() {
	map.destroy();
	map = null;
	dojo.empty( "map" );

	makeMap();
  map.render( 'map' );
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
    //map.addControl(new OpenLayers.Control.LayerSwitcher( {'div': OpenLayers.Util.getElement('layerswitcher') } ));
    //map.addControl(new OpenLayers.Control.MousePosition( {div: "coord"} ));

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

		gisSex = dojo.byId( "gisSexSelect" )
	  currentGisSex = gisSex.options[gisSex.selectedIndex]

    gisYearFrom = dojo.byId( "gisYearFrom" )
    gisYearTo = dojo.byId( "gisYearTo" )

    gisState = dojo.byId( "gisState" )
    gisCounty = dojo.byId( "gisCounty" )
    gisMuseum = dojo.byId( "gisMuseum" )

		var cql_filter_query = "";

		console.log( "Value=" + currentGisSex.value )

		if( currentGisSex.value == "both" ) {
			cql_filter_query = cql_filter_query + "(sex = 'F' OR sex = 'M')"
		} else if( currentGisSex.value == "male" ) {
			cql_filter_query = cql_filter_query + "sex = 'M'"
		} else if( currentGisSex.value == "female" ) {
			cql_filter_query = cql_filter_query + "sex = 'F'"
		}

    if( gisYearFrom.value != null && gisYearFrom.value != "" ) {
			cql_filter_query = cql_filter_query + " AND year > " + gisYearFrom.value 
    }

    if( gisYearTo.value != null && gisYearTo.value != "" ) {
			cql_filter_query = cql_filter_query + " AND year < " + gisYearTo.value
    }

    if( gisState.value != null && gisState.value != "Any" ) {
			cql_filter_query = cql_filter_query + " AND state = '" + gisState.value + "'"
    }

    if( gisCounty.value != null && gisCounty.value != "Any" ) {
			cql_filter_query = cql_filter_query + " AND county = '" + gisCounty.value + "'"
    }

    if( gisMuseum.value != null && gisMuseum.value != "Any" ) {
			cql_filter_query = cql_filter_query + " AND name = '" + gisMuseum.value + "'"
    }

		console.log( "CQLFILTER=" + cql_filter_query )

    var lizardBase = new OpenLayers.Layer.WMS("Anole Lizard Specimens",
       "http://ec2-174-129-239-85.compute-1.amazonaws.com/geoserver/wms?service=wms",
       {layers: 'LizardBase:features',
        srs: 'EPSG:4326',
        format: 'image/png',
				cql_filter: cql_filter_query,
        transparent: true},
       {isBaseLayer: false});

    map.addLayers([gphy, gmap, ghyb, gsat, lizardBase]);

    info = new OpenLayers.Control.WMSGetFeatureInfo({
        url: 'http://ec2-174-129-239-85.compute-1.amazonaws.com/geoserver/wms?service=wms', 
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

