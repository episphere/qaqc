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
console.log(upCol)
  for (var [key, value] of Object.entries(qaqc.data)) {
    upCol.push(key)
  }
  console.log(upCol)

  // check if column names match the data dictionary
  let acceptedCol = upCol.filter(x => allCol.includes(x)) // accepted columns with proper names, need to loop through these for checks - Lorena
  console.log(acceptedCol)

  function difference(a1, a2) {
    let a2Set = new Set(a2);
    return a1.filter(function (x) {
      return !a2Set.has(x);
    })
  }

  let failedUpCol = difference(upCol, acceptedCol)
  console.log(failedUpCol)
  console.log(failedUpCol.length)


  if (failedUpCol.length > 0) {
    var failed_str = " The following " + failedUpCol.length + " column(s) rejected. Please check spelling or remove excess columns."
    h += `<p style= "color:red;font-size: 20px">ERROR! ${failed_str}</p>` //${upCol.join(", ")}
    h += `<ul style= "color:red;font-size: 20px"> ${failedUpCol.join(", ")}</ul>`
    h += `<ul style= "color:red;font-size: 15px">Please choose from the following variable options: <br>${allCol.join(", ")}</ul>`
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

//check for empty values function
//https://stackoverflow.com/questions/154059/how-can-i-check-for-an-empty-undefined-null-string-in-javascript
  
  function isEmpty(str) {
  return (!str || 0 === str.length);
}

//use isEmpty function from above in checkColumnEmpty function 
function checkColumnsEmpty(variable) {
  badCount = []
  badPosition=[]
  Object.keys(data1).forEach(k => {
    if (k == variable) {
      for (i = 0; i < data1[k].length; i++) {
        if (isEmpty(data1[k][i])==true) {
          badCount.push(" blank ")
          badPosition.push(" "+i+1+"")

        } else { }
      }
    }
  })
  let len_bad = badCount.length
  let badSetStatus = new Set(badCount)
  let arrBadCount = Array.from(badSetStatus)
  if (arrBadCount.length > 0) {
     return h += `<p style="color:red;font-size: 20px">ERROR! ${len_bad} invalid value(s) found in ${variable} column.</p>
     <ul style="color:red;font-size: 15px">Value(s): ${badCount}<br> Row position(s): ${badPosition}</ul>`
    } else {
    return false
  }
}

//use isNum function from above in checkCol function 
function checkColumnsNum(variable,min, max) {
  badCount = []
  badPosition = []
  Object.keys(data1).forEach(k => {
    if (k == variable) {
      for (i = 0; i < data1[k].length; i++) {
        if (isNumberBetween(data1[k][i],min, max)) {} else {
           badCount.push(" "+data1[k][i]+" ")
          badPosition.push(" "+i+1+" ")
        }
      }
    }
  })
  let len_bad = badCount.length
  let badSetStatus = new Set(badCount)
  let arrBadCount = Array.from(badSetStatus)
  if (arrBadCount.length > 0) {
    return h += `<p style="color:red;font-size: 20px">ERROR! ${len_bad} invalid value(s) found in ${variable} column.</p>
    <ul style="color:red;font-size: 15px">Values: ${badCount} <br> Row position(s): ${badPosition}</ul>`  
  } else {
    return false
  }
}
 /////use is Val and function from above in checkCol function 
   function checkColumns(validValuesList, variable) {
     badCount = []
     badPosition = []
     Object.keys(data1).forEach(k => {
       if (k == variable) {
        for (i = 0; i < data1[k].length; i++) {
        if ((!(isValueOneOf(data1[k][i], validValuesList)))  && isEmpty(data1[k][i])) {
          badCount.push(" blank ")
          badPosition.push(" "+i+1+" ")
        } 
          else if(isValueOneOf(data1[k][i], validValuesList)) {}
            else {badCount.push(" "+data1[k][i]+" ");
              badPosition.push(" "+i+1+" ");
          } 
        }
       }
     })
     let len_bad = badCount.length
     let badSet = Array.from(new Set(badCount))
     if (badSet.length > 0) {
       return h += `<p style="color:red;font-size: 20px">ERROR! ${len_bad} invalid value(s) found in ${variable} column.</p>
       <ul style="color:red;font-size: 15px">Values: ${badCount} <br> Row position(s): ${badPosition}</ul>`
     } else {
       return false
     }
   }

  //check each column for invalid values 
  //QC_03_01 start check study for empty rows
  let studyCheckColumns = checkColumnsEmpty("study")

  //QC_03_01 end
  //QC_04_01 start
  let contrTypeCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 6, 777, 888], variable = "contrType")
  //(1)
//   if (data1.status!= undefined){
//   data1["status"].forEach((QC4,idx4) => {
//     if (QC4== 0 && data1["contrType"][idx4]==777 ){
//       h += `<ul style="color:red;font-size: 15px">Row ${idx4}: If contrType = 777, then status should NOT be 0.</ul>`
//     } 
//   })
// }
  //QC_04_01 end
  //QC_05_01 start
   let statusCheckColumns = checkColumns(validValuesList = [0, 1, 2, 3, 9], variable = "status")
    if (statusCheckColumns != false){h += `<ul style="color:red;font-size: 15px"> Values 777, 888 or blank are not allowed in the status column.</ul>`}
  // //QC_05_01 end
  let erCheckColumns = checkColumns(validValuesList = [undefined, 0, 1, 888], variable = "ER_statusIndex")
  
  let matchIDCheckColumns = checkColumns(validValuesList = [777, 888], variable = "matchid")
  let subStudyCheckColumns = checkColumns(validValuesList = [777, 888], variable = "subStudy")
  let studyTypeCheckColumns = checkColumns(validValuesList = [0, 1, 2, 777, 888], variable = "studyType")
  let exclusionCheckColumns = checkColumns(validValuesList = [0, 1, 3, 4, 5, 6, 7, 8, 888], variable = "exclusion")
  let ethnicityClassCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 6, 888], variable = "ethnicityClass")
  let raceMCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 6, 888], variable = "raceM")
  let raceFCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 6, 888], variable = "raceF")
  let famHistCheckColumns = checkColumns(validValuesList = [0, 1, 888], variable = "famHist")
  let ageCheckColumnsNum=checkColumnsNum(variable="ageInt",min=12, max=100)
// console.log("ageInt", ageCheckColumnsNum)

const checkColumnsList = [studyCheckColumns,statusCheckColumns, erCheckColumns,
                   contrTypeCheckColumns,matchIDCheckColumns, subStudyCheckColumns, studyTypeCheckColumns, 
                   exclusionCheckColumns, ethnicityClassCheckColumns, raceMCheckColumns, raceFCheckColumns, 
                   famHistCheckColumns, ageCheckColumnsNum]
   console.log(checkColumnsList)
  

for (i=0; i<checkColumnsList.length; i++){
    if (checkColumnsList[i] != false || failedUpCol.length > 0){
        alert("Invalid columns or rows found! Please see error report for details.");
        break;
    }
  }
    
  h += qaqc.saveFile(JSON.stringify(data1))
  return h
}