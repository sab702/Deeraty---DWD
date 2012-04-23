var map;
var bounds;
var mapLocations = [];
var currMarker;
var currInfoWindow;

var initialize = function() {
    var myOptions = {
      zoom: 15,
      maxZoom:15,
      center: new google.maps.LatLng(26.3420, 50.1106),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);

    
    // now create markers from myLocations
    displayMarkers();
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