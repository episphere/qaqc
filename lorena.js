///////////////////////////////////
console.log(`lorena.js ran at ${Date()}`)
//
runQAQC = function (data) {
  console.log(`lorena.js runQAQC function ran at ${Date()}`)

  let h = `<p style= "color:red; font-weight:bold">Successfully uploaded: table with ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
  h += `<p></p>`

  //check which variables have not been uploaded
  //https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
  const datArray = qaqc.data
  const dat = qaqc.dataArray
  let upCol = []   //columns uploaded
  const allCol = ["UniqueID", "PersonID", "study", "contrType", "status", "DNA_source", "DNA_sourceOt", "matchid", "subStudy", "studyType", "studyTypeOt", "exclusion", "ageInt", "intDate", "intDate_known", "intDay", "intMonth", "intYear", "refMonth", "refYear", "AgeDiagIndex", "sex", "ethnicityClass", "ethnicitySubClass", "ethnOt", "raceM", "raceF", "famHist", "fhnumber", "fhscore", "ER_statusIndex"]

  for (var [key, value] of Object.entries(qaqc.data)) {
    upCol.push(key)
  }
 
  // check if column names match the data dictionary--------------------------------------------------------------------------
  let acceptedCol = upCol.filter(x => allCol.includes(x)) // accepted columns with proper names, need to loop through these for checks - Lorena

  function difference(a1, a2) {
    let a2Set = new Set(a2);
    return a1.filter(function (x) {
      return !a2Set.has(x);
    })
  }

  let failedUpCol = difference(upCol, acceptedCol)
  if (failedUpCol.length > 0) {
    alert("Failed to upload! Please see error report for details.")
    var failed_str = " The following " + failedUpCol.length + " column(s) rejected:"
    h += `<p style= "color:red">ERROR: ${failed_str}</p>` //${upCol.join(", ")}
    h += `<ul style= "color:red"> ${failedUpCol.join(", ")}</ul>`
    h += `<ul style= "color:red;font-size: 10px">Variable options: ${allCol.join(", ")}</ul>`

  } else {
    var failed_str = ""
  }

  //https://zellwk.com/blog/looping-through-js-objects/ looping through object
let status1 = ["control", "invasive case", "in-situ case", "case unknown invasiveness", "excluded sample" ]
let status2 = [0,1,2,3,9]

datArray["status"].forEach(function statusCheck(variable, index){
  for (i in status2){
  if (variable != i){
  console.log("error")} //check status column
  }
})
  h += qaqc.saveFile(JSON.stringify(qaqc.data))
  return h
}