var map;
var bounds;
var mapLocations = [];
var currMarker;
var currInfoWindow;
var markersArray = [];
var iterator = 0;

var initialize = function() {
    var myOptions = {
      zoom: 15,
      maxZoom:40,
      center: new google.maps.LatLng(26.3420, 50.1106),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
  
  google.maps.event.addListener(map, 'click', function(event) {
          addMarker(event.LatLng);
        });
    // now create markers from myLocations
    displayMarkers();
   // displayAddedMarkers();
}


var displayMarkers = function() {
    
    bounds = new google.maps.LatLngBounds();
    
    for(i = 0; i<myLocations.length; i++) {
        
        currLocation= myLocations[i];
        
        // create info window
        var infowindow = new google.maps.InfoWindow({
                content: "<h3><a href='/location/"+ currLocation.shortname +"'>" + currLocation.title + "</a></h3>"
            });
        
        // create the map marker
        var tmpMarker = new google.maps.Marker({
                position: new google.maps.LatLng( currLocation.position.lat, currLocation.position.lng), 
                map: map,
                title: currLocation.title
            });
        
        // put new marker into the global mapMarkers array
        mapLocation = {
            marker : tmpMarker,
            infowindow : infowindow
        };
        
        // adding current marker to bounds
        bounds.extend(tmpMarker.position);
        
        // attach click event to marker, open info and close any open windows
        setupInfoWindowClick(mapLocation);
        
        // put the whole location into mapLocations - if you need to get them later.
        mapLocations.push(mapLocation);
        
    }
    
    // fit all the markers on the map.
    map.fitBounds(bounds);
    
}

// Pass in a location = {marker, infowindow}
// this will attach a click event to the markers to open their infowindows
function setupInfoWindowClick (location)
{
    // so marker is associated with the closure created for the listenMarker function call
    google.maps.event.addListener(location.marker, 'click', function() {
        if ( currInfoWindow ) {
            currInfoWindow.close(); // close any existing windows
        }
        location.infowindow.open(map, location.marker); //open the infowindow
        currInfoWindow = location.infowindow; //set this infowindow to the currInfoWindow
    });
}

var loadScript = function() {

    // let's load the Google Maps API  into the web page
    // when the API is loaded, trigger the initalize function above
    
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&' +
        'callback=initialize';
    document.body.appendChild(script);
}

///////////////////////// New code ////////////////////


function addMarker (location) {
	marker = new google.maps.Marker({
		position: location,
		map: map,
		draggable: true,
		animation: google.maps.Animation.DROP,
		});
		iterator++;
	markersArray.push(marker);
}

//from Tak -- put new marker into the global mapMarkers array
mapLocation = {
	marker : marker,
	infowindow : infowindow
	};
	
// Sets the map on all markers in the array.
      function setAllMap(map) {
        for (var i = 0; i < markersArray.length; i++) {
          markersArray[i].setMap(map);
        }
      }

// Removes the overlays from the map, but keeps them in the array
function clearOverlays() {
  if (markersArray) {
    for (i in markersArray) {
      markersArray[i].setMap(null);
    }
  }
}

// Shows any overlays currently in the array
function showOverlays() {
  if (markersArray) {
    for (i in markersArray) {
      markersArray[i].setMap(map);
    }
  }
}

// Deletes all markers in the array by removing references to them
function deleteOverlays() {
  if (markersArray) {
    for (i in markersArray) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
  }
}
