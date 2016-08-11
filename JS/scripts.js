var googleMapsApp = angular.module('googleMapsApp', []);
googleMapsApp.controller('googleMapsController', function($scope, $http){


	// Gives our centerpoint for the United States and the starting center for our window
    var myLatlng = {lat: 45.2618, lng: -111.3080};
 
    // Again, this is the starting position for our window
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: myLatlng,
        mapTypeId: 'terrain',
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

 	// 
    function createMarker(city){
    	console.log(city);
    	var cityLatlng = {lat: city.lat, lng: city.lon}
		var marker = new google.maps.Marker({
        	position: cityLatlng,
        	map: map,

        });


		var infoWindow = new google.maps.InfoWindow({
        	content: city.city
        });

        google.maps.event.addListener(marker, 'click', function(){
        	infoWindow.open(map, marker);
        })
        markers.push(marker);
	}

	$scope.triggerClick = function(index){
		google.maps.event.trigger(markers[index], "click")
	}

	$scope.cities = cities;
	for (var i = 0; i<$scope.cities.length; i++){
		createMarker($scope.cities[i]);
	}




})