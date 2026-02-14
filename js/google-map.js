
function init() {
    // KOMOTRAKS - Beograd koordinate
    var myLatlng = new google.maps.LatLng(44.8176, 20.4633);
    
    var mapOptions = {
        zoom: 12,
        center: myLatlng,
        scrollwheel: false,
        styles: [
            {
                "featureType": "administrative.country",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "simplified"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            }
        ]
    };

    // Get the HTML DOM element that will contain your map 
    var mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Create the Google Map using our element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);
    
    // Marker na Beograd
    new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'KOMOTRAKS - Beograd'
    });
}

// Bezbedno pokretanje - čeka da se Google Maps API učita
if (typeof google !== 'undefined' && google.maps) {
    google.maps.event.addDomListener(window, 'load', init);
} else {
    window.initMap = init;
    window.addEventListener('load', function() {
        if (typeof google !== 'undefined' && google.maps) {
            init();
        }
    });
}