var Place = function (data) {
  this.id = ko.observable(data.place_id);
  this.name = ko.observable(data.name);
  this.location = ko.observable(data.geometry.location);
};

var ViewModel = function () {
  this.placesList = ko.observableArray([]);

  this.addPlaces = function (place) {
    this.placesList.push(new Place(place));
  }

  this.showMapInfo = function(place) {
    let term = place.name().split(" ").join("+");
    fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${term}&format=json&&origin=*`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (result) {
        console.log(result);
        let moreInfo = (result[1].length > 0) ? `<p><a href="${result[3][0]}" target="_blank">More Info</a></p>`: "<p>No more info was find</p>";
        infoContent = `<p>${place.name()}</p>${moreInfo}`;
        infowindow.setContent(infoContent);
        infowindow.setPosition(place.location());
        infowindow.setOptions({
          pixelOffset: new google.maps.Size(0, -40)
        });
        infowindow.open(map);
    })
    .catch(function (error) {
        console.log(error);
    });
  }
};

var appViewModel = new ViewModel();
ko.applyBindings(appViewModel);