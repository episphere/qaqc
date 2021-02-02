runQAQC = function(data) {
    console.log(`connect.js ran at ${Date()}`)
  
  
  let h=`<p style= "color:red; font-weight:bold">Successfully uploaded: table with ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
        h += `<p></p>`

h+=
`
<html>
<head>
<script src="https://apis.google.com/js/client.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>

<script>  
function auth() {
  gapi.auth.authorize(config, function() {
      gapi.client.load('bigquery', 'v2');
      $('#client_initiated').html('BigQuery client authorized');
      $('#auth_button').fadeOut();
      $('#dataset_button').fadeIn();
  });
}
   
      var projectNumber = 'bigquery-public-data';
      var clientId = '169492101294-9pbmj5rve44p0s84npesq2m5hifc7qhi.apps.googleusercontent.com';

      var config = {
        'client_id': clientId,
        'scope': 'https://www.googleapis.com/auth/bigquery'
      };

      function listDatasets() {
        var request = gapi.client.bigquery.datasets.list({
          'projectId':projectNumber
        });
        request.execute(function(response) {
            $('#result_box').html(JSON.stringify(response.result.datasets, null));
        });
      }
  </script></head>
  <body>
<button id="auth_button" onclick="auth();">Authorize</button>
<div id="client_initiated"></div>
<button id="dataset_button" style="display:none;" onclick="listDatasets();">Show datasets</button>
<div id="result_box"></div>
</body>
</html>`


          h += '</p>'

          h += qaqc.saveFile(JSON.stringify(qaqc.data))
          //debugger
          // ...
          return h
      }
