console.log(`lorena.js ran at ${Date()}`)

runQAQC = function (data) {
  console.log(`lorena.js runQAQC function ran at ${Date()}`)

  let h = `<p style= "color:red; font-weight:bold">Successfully uploaded: table with ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
  h += `<p></p>`

  //check which variables have not been uploaded
  //https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
  const data1 = qaqc.data
  const data2 = qaqc.dataArray
  let upCol = [] //columns uploaded
  const allCol = ["UniqueID", "PersonID", "study", "contrType", "status", "DNA_source", "DNA_sourceOt", "matchid", "subStudy", "studyType", "studyTypeOt", "exclusion", "ageInt", "intDate", "intDate_known", "intDay", "intMonth", "intYear", "refMonth", "refYear", "AgeDiagIndex", "sex", "ethnicityClass", "ethnicitySubClass", "ethnOt", "raceM", "raceF", "famHist", "fhnumber", "fhscore", "ER_statusIndex"]

  for (var [key, value] of Object.entries(qaqc.data)) {
    upCol.push(key)
  }

  // check if column names match the data dictionary
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

  ////////for age use this function
  //https://stackoverflow.com/questions/36507932/how-to-evaluate-if-statements-with-a-lot-of-and-conditions
  function isNumberBetween(value, min, max) {
    return value >= min && value <= max
  }

  function isValueOneOf(value, validValues) {
    for (validIdx = 0; validIdx < validValues.length; validIdx++) {
      if (validValues[validIdx] === value) {
        return true;
      }
    }
    return false;
  }
//use is Val and isNum functions in checkCol function below

function checkColumns(validValuesList, variable){
  badCount=[]
  Object.keys(data1).forEach(k => {
    if (k == variable) {
     
      for (i = 0; i < data1[k].length; i++) {
        if (isValueOneOf(data1[k][i], validValuesList)) {} else {
          badCount.push(data1[k][i])
        }
      }
    }
  })
  console.log(badCount)
  len_bad= badCount.length


  let badSetStatus = new Set(badCount)
  //badSetStatus.add(badCount)
  let arrBadCount = Array.from(badSetStatus)
  if (arrBadCount.length > 0) {
    h += `<p style="color:blue;font-weight:bold;font-size: 20px">${len_bad} invalid ${variable} value(s) found: ${arrBadCount}</p>`
  } else if (arrBadCount.length == 0) {
    h += `<p style="color:blue;font-weight:bold;font-size: 20px">All Valid ${variable} value(s) found</p>`
  }
}
//check each column for invalid values
checkColumns( validStatusValues=[0,1,2,3,9],variable="status" )
checkColumns( validStatusValues=[undefined,0,1,888],variable="ER_statusIndex" )

  h += qaqc.saveFile(JSON.stringify(data1))
  return h
}