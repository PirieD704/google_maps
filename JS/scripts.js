var googleMapsApp = angular.module('googleMapsApp', []);
googleMapsApp.controller('googleMapsController', function($scope, $http){


	// Gives our centerpoint for Big Sky, MT (because it's awesome!) and the starting center for our window
    var myLatlng = {lat: 45.2618, lng: -111.3080};
 
    // Again, this is the starting position for our window
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: myLatlng,
        mapTypeId: 'terrain',
        //Styles the map to be on a grey scale
        styles: [
            {
              featureType: 'all',
              stylers: [
                { saturation: -80 }
              ]
            },{
              featureType: 'road.arterial',
              elementType: 'geometry',
              stylers: [
                { hue: '#00ffee' },
                { saturation: 50 }
              ]
            },{
              featureType: 'poi.business',
              elementType: 'labels',
              stylers: [
                { visibility: 'off' }
              ]
            }
          ]
    });

    // This variables acts as the holder for where our createMarker function will store the individual markers of each city
    var markers = []
    //Placing the info window here solves the problem of the infowindows remaining open when you click on multiple ones.  This will update which ones are open currently
    var infoWindow = new google.maps.InfoWindow({});

 	// 
    function createMarker(city){
    	// this allow for the implementation of custom markers on the map (Go Panthers!)
    	var icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2%7CFE7569';
    	if(city.yearRank == 1){
    		icon = 'img/1.png';
    	}else if(city.yearRank == 17){
    		icon = 'img/clt.png';
    	}else if(city.yearRank == 39){
    		icon = 'img/atl.png';
    	}

    	var cityLatlng = {lat: city.lat, lng: city.lon}
		var marker = new google.maps.Marker({
        	position: cityLatlng,
        	map: map,
        	title: city.city,
        	icon: icon

        });

        google.maps.event.addListener(marker, 'click', function(){
        	//everytime this gets clicked on, this updates the info window
        	infoWindow.setContent('<h4>' + city.city + '</h4>')
        	//
        	infoWindow.open(map, marker);
        })
        markers.push(marker);
	}

	$scope.triggerClick = function(index){
		google.maps.event.trigger(markers[index], "click")
	}

	// this make the array placesTypes that is in cityRank.js viewable to window
	$scope.placesTypes = placesTypes;

	// Sets the Point of Interest that user chooses from the dropdown menu
	$scope.setPlace = function(place){
		$scope.userPlace = place;
		console.log($scope.userPlace);
	}

	$scope.cities = cities;
	for (var i = 0; i<$scope.cities.length; i++){
		createMarker($scope.cities[i]);
	}

	$scope.updateMarkers = function(){
		for(var i=0; i < markers.length; i++){
			markers[i].setMap(null);
		}

		for(var i = 0; i<$scope.filteredCities.length; i++){
			createMarker($scope.filteredCities[i]);
		}
	}

	$scope.getDirections = function(lat, lon){

		// when we call the function, we convert this into a google constructor that shows up in the console as _.H{}
		var destination = new google.maps.LatLng(lat, lon);
		console.log(destination);

		// Creates a directions feature for the map
		var directionsService = new google.maps.DirectionsService;
	    var directionsDisplay = new google.maps.DirectionsRenderer;
		directionsDisplay.setMap(map);
		directionsDisplay.setPanel(document.getElementById('list-window'));
	    // Where the origin and destination points are actually set
	    directionsService.route({
	        origin: 'Atlanta, GA',
	        destination: destination,
	        travelMode: 'DRIVING'
	    }, function(response, status) {
	        if (status === 'OK') {
	            directionsDisplay.setDirections(response);
	        } else {
	            window.alert('Directions request failed due to ' + status);
	        }
	    });
	}

	// this is triggered when the zoom to city button in clicked in the table
	$scope.zoomToCity = function(lat, lon){
		// this is a constructor with nothing inside of it that will be called in createPointOfInterest to reset the zoom
		var bounds = new google.maps.LatLngBounds();
		// sets the location that we want to focus on when the zoom button is clicked
		var cityLatLon = new google.maps.LatLng(lat, lon);
		map = new google.maps.Map(document.getElementById('map'),{
			zoom: 14,
			center: cityLatLon
		});
		infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        console.log(cityLatLon);
        service.nearbySearch({
          location: cityLatLon,
          radius: 10000,
          type: [$scope.userPlace]
        }, callback);
        //
    	function callback(results, status) {
    		console.log(results);
        	if (status === google.maps.places.PlacesServiceStatus.OK) {
        		for (var i = 0; i < results.length; i++) {
            		createPointOfInterest(results[i]);
        		}
        	}
      	}

      	// This is the function called to create the markers for the points of interest
    	function createPointOfInterest(place) {
        	var placeLoc = place.geometry.location;
        	var marker = new google.maps.Marker({
        		map: map,
        		position: place.geometry.location
        	});

        	google.maps.event.addListener(marker, 'click', function() {
        		infowindow.setContent(place.name);
        		infowindow.open(map, this);
        	});
        	//this will automatically reset the zoom dynamically
        	bounds.extend(marker.getPosition());
      	}

      	// fitBounds is a feature of the google maps API. it currently does not work.
      	// map.fitBounds(bounds)
	}

})














