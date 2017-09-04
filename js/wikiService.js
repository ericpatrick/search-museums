var WikiService = function() {
  this.search = function(term, cbSucess, cbError) {
    let validTerm = term || "";
    let encodedTerm = validTerm.split(" ").join("+");
    fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodedTerm}&format=json&&origin=*`, {
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
      if (cbSucess)
        cbSucess(result);
    })
    .catch(function (error) {
      console.log(error);
      if (cbError)
        cdError(error);
  });
  }
}

var wikiService = new WikiService();