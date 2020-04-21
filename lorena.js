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
    alert("Invalid column name(s) found!")
    var failed_str = " The following " + failedUpCol.length + " column(s) rejected. Please check spelling or remove excess columns."
    h += `<p style= "color:red;font-size: 20px">ERROR. ${failed_str}</p>` //${upCol.join(", ")}
    h += `<ul style= "color:red"> ${failedUpCol.join(", ")}</ul>`
    h += `<ul style= "color:red;font-size: 15px">Please choose from the folllowing variable options: ${allCol.join(", ")}</ul>`

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


//check studycolumns or strings
//https://stackoverflow.com/questions/154059/how-can-i-check-for-an-empty-undefined-null-string-in-javascript
  
  function isEmpty(str) {
  return (!str || 0 === str.length);
}

//use isEmpty function from above in checkColumnEmpty function 
function checkColumnsEmpty(variable) {
  badCount = []
  Object.keys(data1).forEach(k => {
    if (k == variable) {

      for (i = 0; i < data1[k].length; i++) {
        if (isEmpty(data1[k][i])) {
          badCount.push(data1[k][i])
        } else { }
      }
    }
  })
  let len_bad = badCount.length
  let badSetStatus = new Set(badCount)
  let arrBadCount = Array.from(badSetStatus)
  if (arrBadCount.length > 0) {
    return h += `<p style="color:red;font-size: 20px">ERROR. ${len_bad} invalid empty value(s) found in ${variable} column.</p>`
  } else {
    return false
  }
}


//use isNum function from above in checkCol function 
function checkColumnsNum(variable,min, max) {
  badCount = []
  Object.keys(data1).forEach(k => {
    if (k == variable) {

      for (i = 0; i < data1[k].length; i++) {
        if (isNumberBetween(data1[k][i],min, max)) {} else {
          badCount.push(data1[k][i])
        }
      }
    }
  })
  let len_bad = badCount.length
  let badSetStatus = new Set(badCount)
  let arrBadCount = Array.from(badSetStatus)
  if (arrBadCount.length > 0) {
    return h += `<p style="color:red;font-size: 20px">ERROR. ${len_bad} invalid value(s) found in ageInt column: ${arrBadCount}</p>`
  } else {
    return false
  }
}


//use is Val and function from above in checkCol function 
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
    let len_bad = badCount.length
    let badSetStatus = new Set(badCount)
    let arrBadCount = Array.from(badSetStatus)
    if (arrBadCount.length > 0) {
      return h += `<p style="color:red;font-size: 20px">ERROR. ${len_bad} invalid value(s) found in ${variable} column: ${arrBadCount}</p>`
    } else {
      return false
    }
  }

  // //use is Val and function from above in checkCol function 
  // function checkColumns2(validValuesList, variable) {
  //   badCount1 = []
  //   badPosition1 = []
  //   Object.keys(data1).forEach(k => {
  //     if (k == variable) {
  //       data1[k].forEach((row, idx)=>{
  //       //for (i = 0; i < data1[k].length; i++) {
  //         if (isValueOneOf(row, validValuesList)) {} else {
  //           badCount1.push(row)
  //           badPosition1.push(idx)
  //         }
  //       })
  //     }
  //   })
  //   let len_bad1 = badCount1.length
  //   let badSet1 = Array.from(new Set(badCount1))
  //   if (badSet1.length > 0) {
  //     return h += `<p style="color:red;font-size: 20px">TEST.ERROR. ${len_bad1} invalid value(s) found in ${variable} column.</p>
  //     <ul style="color:red;font-size: 15px">Invalid values: ${badCount1} Corresponding positions ${badPosition1}</ul>`
  //   } else {
  //     return false
  //   }
  // }
  //let test = checkColumns2(validValuesList = [0,1], variable = "status")

    //check 2 values from 2 columns 
    function checkColumns2(variable1,variable2) {
    let var1= []
    let var2= []
    Object.keys(data1).forEach(k => {
         if (k == variable1) {
           data1[k].forEach((row, idx)=>{
             var1.push(row)
           })
          } else if(k == variable2) {
            data1[k].forEach((row, idx)=>{
              var2.push(row)
            })             
          }
        })
   
      return h += `<p style="color:red;font-size: 20px">ERROR.${var1}</p>`
     }
    //let test2= checkColumns2("status", "contrType")

  //check each column for invalid values (not including continuos variables(age,year,etc) and ethOt, studyTypeOt )
  //QC_03_01 end
  let studyCheckColumns = checkColumnsEmpty(variable = "study")
  //QC_03_01 end

  //QC_05_01 start
  let statusCheckColumns = checkColumns(validValuesList = [0, 1, 2, 3, 9], variable = "status")
  if (statusCheckColumns != false){h += `<ul style="color:red;font-size: 15px"> Values 777, 888 or blank are not allowed in the status column.</ul>`}
  //QC_05_01 end
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
  let ageCheckColumnsNum=checkColumnsNum(variable="ageInt",min=12, max=100)
console.log("ageInt", ageCheckColumnsNum)

  const checkColumnsList = [studyCheckColumns,statusCheckColumns, erCheckColumns,contrTypeCheckColumns,matchIDCheckColumns, subStudyCheckColumns, studyTypeCheckColumns, 
                  exclusionCheckColumns, ethnicityClassCheckColumns, raceMCheckColumns, raceFCheckColumns, famHistCheckColumns,
                  ageCheckColumnsNum]
  console.log(checkColumnsList)
  
  for (i=0;i < checkColumnsList.length; i++) {
    console.log(checkColumnsList[i])

    if (checkColumnsList[i] != false) {
      alert("Invalid row value(s) found!")
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