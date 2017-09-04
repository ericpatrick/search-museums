var Map = function() {
  const self = this
  this.center = new google.maps.LatLng(40.730610, -73.935242);
  this.infowindow = new google.maps.InfoWindow();
  this.searchService;
  this.instance;
  this.markers = [];

  this.init = function() {
    this.instance = new google.maps.Map(document.getElementById('map'), {
      center: this.center,
      zoom: 12
    });
    this.searchService = new google.maps.places.PlacesService(this.instance);
    // this.getPlaces();
  }

  this.getPlaces = function(term = "", callback) {
    const self = this;
    let params = {
      location: this.center,
      radius: '50000',
      types: ['museum'],
      name: term
    };

    this.searchService.nearbySearch(params, function (results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        let maxItems = 20;
        let length = (results.length <= maxItems) ? results.length : maxItems;
        for (var i = 0; i < length; i++) {
          self.createMarker(results[i]);
        }
        if (callback)
          callback(results.slice(0, maxItems));
      }
    });
  }

  this.createMarker = function (place) {
    const marker = new google.maps.Marker({
      map: this.instance,
      position: place.geometry.location,
      title: place.name
    });
    this.markers.push(marker);
  
    google.maps.event.addListener(marker, 'click', function () {
      const infoOffset = new google.maps.Size(0, 0);
      self.openInfo(place.name, infoOffset, null, this);
    });
  }

  this.openInfo = function(placeName, infoOffset, position, anchor = null) {
    const marker = this.markers.find(function(marker) {
      return placeName === marker.title;
    });
    const callback = function(result) {
      const moreInfo = (result[1].length > 0) ? `<p><a href="${result[3][0]}" target="_blank">More Info</a></p>`: "<p>No more info was find</p>";
      const infoContent = `<p>${placeName}</p>${moreInfo}`;
      self.infowindow.setContent(infoContent);
      self.infowindow.setOptions({
        pixelOffset: infoOffset
      });
      if (position) {
        self.infowindow.setPosition(position);
      }
      self.infowindow.open(self.instance, anchor);
    };

    wikiService.search(placeName, callback);
    if (marker) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ marker.setAnimation(null); }, 1500);
    }
  }

  this.filterMarkers = function(term) {
    this.markers.forEach(function(marker) {
      const markerTitle = marker.title.toLowerCase();
      const searctTerm = term.toLowerCase();
      const markerMap = (markerTitle.indexOf(searctTerm) !== -1) ? self.instance : null;
      marker.setMap(markerMap);
    });
  }
}