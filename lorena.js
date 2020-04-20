console.log(`lorena.js ran at ${Date()}`)

runQAQC = function (data) {
  console.log(`lorena.js runQAQC function ran at ${Date()}`)

  let h = `<p style= "color:red; font-weight:bold">File: table with ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
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
    alert("Invalid column name values found!")
    var failed_str = " The following " + failedUpCol.length + " column(s) rejected. Please check spelling or remove excess columns."
    h += `<p style= "color:red;font-size: 20px">ERROR: ${failed_str}</p>` //${upCol.join(", ")}
    h += `<ul style= "color:red"> ${failedUpCol.join(", ")}</ul>`
    h += `<ul style= "color:red;font-size: 10px">Please choose from the folllowing variable options: ${allCol.join(", ")}</ul>`

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

  function checkColumns(validValuesList, variable) {
    badCount = []
    Object.keys(data1).forEach(k => {
      if (k == variable) {

        for (i = 0; i < data1[k].length; i++) {
          if (isValueOneOf(data1[k][i], validValuesList)) {} else {
            badCount.push(data1[k][i])
          }
        }
      }
    })
    len_bad = badCount.length

    let badSetStatus = new Set(badCount)
    let arrBadCount = Array.from(badSetStatus)

    alertRow = []
    if (arrBadCount.length > 0) {
      //alertRow.push(1);
      return h += `<p style="color:red;font-size: 20px">ERROR: ${len_bad} invalid ${variable} value(s) ${arrBadCount} found.</p>`
      //return true
    } else {
      return false
      //   h += `<p style="color:blue;font-size: 20px">Valid ${variable} value(s) found</p>`
    }
    //  console.log(alertRow) 
  }
  //check each column for invalid values (not including continuos variables(age,year,etc) and ethOt, studyTypeOt )
  let statusCheckColumns = checkColumns(validValuesList = [0, 1, 2, 3, 9], variable = "status")
  let erCheckColumns = checkColumns(validValuesList = [undefined, 0, 1, 888], variable = "ER_statusIndex")
  let contrTypeCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 6, 777, 888], variable = "contrType")
  let matchIDCheckColumns = checkColumns(validValuesList = [777, 888], variable = "matchid")
  let subStudyCheckColumns = checkColumns(validValuesList = [777, 888], variable = "subStudy")
  let studyTypeCheckColumns = checkColumns(validValuesList = [0, 1, 2, 777, 888], variable = "studyType")
  let exclusionCheckColumns = checkColumns(validValuesList = [0, 1, 3, 4, 5, 6, 7, 8, 888], variable = "exclusion")
  let ethnicityClassCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 6, 888], variable = "ethnicityClass")
  let raceMCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 6, 888], variable = "raceM")
  let raceFCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 6, 888], variable = "raceF")
  let famHistCheckColumns = checkColumns(validValuesList = [0, 1, 888], variable = "famHist")
  
  const checkColumnsList = [statusCheckColumns, erCheckColumns,contrTypeCheckColumns,matchIDCheckColumns, subStudyCheckColumns, studyTypeCheckColumns, 
                  exclusionCheckColumns, ethnicityClassCheckColumns, raceMCheckColumns, raceFCheckColumns, famHistCheckColumns]
  console.log(checkColumnsList)
  
  for (i=0;i < checkColumnsList.length; i++) {
    console.log(checkColumnsList[i])

    if (checkColumnsList[i] != false) {
      alert("Invalid row values found!")
      checkColumnsList[i] = false
      break
    }
  }
//use number function
  //fix later
  alert("Please see error report for details.")
  h += qaqc.saveFile(JSON.stringify(data1))
  return h
}