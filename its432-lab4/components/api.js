var rootURL = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='
var api_key = '{YOURAPIKEY}'

export default function(code) {
  var url = `${rootURL}${code}&apikey=${api_key}`;
  return fetch (url).then(function(response){
    return response.text();
  }).then(function(text){
    // console.log(text);
    let json = JSON.parse(text);
    // console.log(json);
    return json;
  })
}