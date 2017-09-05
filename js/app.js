var Place = function (data) {
  this.id = ko.observable(data.place_id);
  this.name = ko.observable(data.name);
  this.location = ko.observable(data.geometry.location);
};

var ViewModel = function () {
  const self = this;
  this.map = new Map();
  this.searchTerm = ko.observable("");
  this.placesList = ko.observableArray([]);
  this.filteredList = ko.computed(function() {
    return self.placesList().filter(function(item) {
      return item.visible();
    });
  });

  this.init = function() {
    this.map.init();
    this.map.getPlaces(this.searchTerm(), function(places) {
      places.forEach(function(place) {
       self.addPlaces(place); 
      });
    });
  }

  this.addPlaces = function (place) {
    this.placesList.push({visible: ko.observable(true), place:new Place(place)});
  }

  this.showMapInfo = function(item) {
    const infoOffset = new google.maps.Size(0, -40);
    const place = item.place;
    this.map.openInfo(place.name(), infoOffset, place.location());
  }

  this.filterPlaces = function() {
    this.map.filterMarkers(this.searchTerm());
    this.placesList().forEach(function(item) {
      const placeName = item.place.name().toLowerCase();
      const searctTerm = self.searchTerm().toLowerCase(); 
      const visible = (placeName.indexOf(searctTerm) !== -1) ? true : false;
      item.visible(visible);
    });
  }

  this.toggleMenuList = function() {
    $(".museum-nav").toggleClass("is-close");
    $(".content").toggleClass("expanded");
    setTimeout(function(){ google.maps.event.trigger(self.map.instance, 'resize'); }, 400);
  }
};