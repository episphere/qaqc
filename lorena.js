console.log(`lorena.js ran at ${Date()}`)

runQAQC = function (data) {
  console.log(`lorena.js runQAQC function ran at ${Date()}`)

  let h = `<p style= "color:red; font-weight:bold">File uploaded: table with ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
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
    var failed_str = " The following " + failedUpCol.length + " column(s) rejected. Please check that spelling or remove excess columns"
    h += `<p style= "color:red;font-size: 20px">ERROR: ${failed_str}</p>` //${upCol.join(", ")}
    h += `<ul style= "color:red"> ${failedUpCol.join(", ")}</ul>`
    h += `<ul style= "color:red;font-size: 10px">Variable options: ${allCol.join(", ")}</ul>`

  } else {
    var failed_str = ""
  }

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

//use is Val and isNum function from above in checkCol function 

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
  let arrBadCount = Array.from(badSetStatus)

  if (arrBadCount.length > 0) {
    h += `<p style="color:red;font-size: 20px">ERROR: ${len_bad} invalid ${variable} value(s) found: ${arrBadCount}</p>`
  } else if (arrBadCount.length == 0) {
    h += `<p style="color:blue;font-size: 20px">Valid ${variable} value(s) found</p>`
  }
}
//check each column for invalid values (not including continuos variables(age,year,etc) and ethOt, studyTypeOt )
checkColumns( validValuesList=[0,1,2,3,9],variable="status" )
checkColumns( validValuesList=[undefined,0,1,888],variable="ER_statusIndex" )
checkColumns( validValuesList=[1,2,3,4,5,6,777,888],variable="contrType" )
checkColumns( validValuesList=[777,888],variable="matchid" )
checkColumns( validValuesList=[777,888],variable="subStudy" )
checkColumns( validValuesList=[0,1,2,777,888],variable="studyType" )
checkColumns( validValuesList=[1,3,4,5,6,7,8,888],variable="exclusion" )
checkColumns( validValuesList=[1,2,3,4,5,6,888],variable="ethnicityClass" )
checkColumns( validValuesList=[1,2,3,4,5,6,888],variable="raceM" )
checkColumns( validValuesList=[1,2,3,4,5,6,888],variable="raceF" )
checkColumns( validValuesList=[0,1,888],variable="famHist" )

  h += qaqc.saveFile(JSON.stringify(data1))
  return h
}