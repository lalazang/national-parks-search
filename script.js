'use strict';

const apiKey = 'MmAgZzIOPIvVj0RdI6qkrSpKZqGfL8BrHgWEg1KN'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson, query) {
  console.log(responseJson);
  console.log(responseJson.data.length);

  $('#resultHeader').append(`<h2>Results for search: "${query}"</h2>`)
  
  for (let i=0; i < responseJson.data.length; i++) {
    $('#resultsList').append(
      `<li><p>${responseJson.data[i].fullName}</p>
      <p>${responseJson.data[i].description}</p>
      <a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</li>`
    )
  }

}

function getNationalParks(query, maxResults) {
  const params = {
    api_key: apiKey,
    stateCode: query,
    limit: maxResults
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;
  // const options = {
  //   headers: new Headers({
  //     "X-Api-Key": apiKey})
  // };

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      if (responseJson.total == 0) {
        throw new Error('There are no results for that search. Please try another search.');
      }
      displayResults(responseJson, query);
    })
    .catch(err => {
      $('#errorMessage').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $('#resultHeader').empty();
    $('#resultsList').empty();
    $('#errorMessage').empty();
    let searchTerm = $('#searchArea').val();
    searchTerm = searchTerm.split(' ').join('');
    const maxResults = $('#js-maxResults').val();
    getNationalParks(searchTerm, maxResults);
  });
}

$(watchForm);