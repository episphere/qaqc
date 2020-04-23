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
          badPosition.push(" "+(Number(i)+1)+" ")
        } else {
        }
      }
    }
  })
  let len_bad = badCount.length
  let badSetStatus = new Set(badCount)
  let arrBadCount = Array.from(badSetStatus)
  if (arrBadCount.length > 0) {
     return h += `<p style="color:red;font-size: 20px">ERROR! ${len_bad} invalid value(s) found in ${variable} column.</p>
     <ul style="color:red;font-size: 15px">Invalid value(s) : ${badCount}<br> Row position(s) : ${badPosition}</ul>`
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
        if (isNumberBetween(data1[k][i],min, max)) {
        } else {
           badCount.push(" "+data1[k][i]+" ")
          badPosition.push(" "+(Number(i)+1)+" ")
        }
      }
    }
  })
  let len_bad = badCount.length
  let badSetStatus = new Set(badCount)
  let arrBadCount = Array.from(badSetStatus)
  if (arrBadCount.length > 0) {
    return h += `<p style="color:red;font-size: 20px">ERROR! ${len_bad} invalid value(s) found in ${variable} column.</p>
    <ul style="color:red;font-size: 15px">Invalid value(s) : ${badCount} <br> Row position(s) : ${badPosition}</ul>`  
  } else {
    return false
  }
}
 /////use is Val function from above in checkCol function 
   function checkColumns(validValuesList, variable) {
     badCount = []
     badPosition = []
     Object.keys(data1).forEach(k => {
       if (k == variable) {
        for (i = 0; i < data1[k].length; i++) {
        if ((!(isValueOneOf(data1[k][i], validValuesList)))  && isEmpty(data1[k][i])) {
          badCount.push(" blank ")
          badPosition.push(" "+(Number(i)+1)+" ")
        } 
          else if(isValueOneOf(data1[k][i], validValuesList)) {}
            else {badCount.push(" "+data1[k][i]+" ");
              badPosition.push(" "+(Number(i)+1)+" ");
          } 
        }
       }
     })
     let len_bad = badCount.length
     let badSet = Array.from(new Set(badCount))
     if (badSet.length > 0) {
       return h += `<p style="color:red;font-size: 20px">ERROR! ${len_bad} invalid value(s) found in ${variable} column.</p>
       <ul style="color:red;font-size: 15px">Invalid value(s) : ${badCount} <br> Row position(s) : ${badPosition}</ul>`
     } else {
       return false
     }
   }

//////////////check each column for invalid values 
  //QC_03_01 check study for empty rows
  let studyCheckColumns = checkColumnsEmpty("study")
  //QC_04_01 start
  let contrTypeCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 6, 777, 888], variable = "contrType")
  //(04_valid_values)
 if (data1.contrType != undefined){ 
  if (contrTypeCheckColumns != false){
     h += `<ul style="color:red;font-size: 15px"> 
     Valid values include
     1=population-based, 2=hospital-based, 3=family-based, 4=blood donor, 
     5 =nested case-control, 6=BRCA1/2 carrier without bc, 
     777=NA=not applicable (for cases), 888=DK=don't know. 
     <br>Blank values are not allowed in this variable.</ul>`
   }
 }
  //(04_01)
  if (data1.status != undefined){
  data1["status"].forEach((status,idx) => {
    if (status== 0 && data1["contrType"][idx]==777 ){
      h += `<ul style="color:red;font-size: 15px">QC_04_01 check row ${idx} : If contrType = 777, then status should NOT be 0.</ul>`
    } 
  })
}
 
  //(04_02)
  //(2) if contrType ≠ 777 or 888, then status should be 0 or 9
  if (data1.contrType != undefined){
    data1["contrType"].forEach((contrType,idx) => {
      if ((contrType != 777 && contrType != 888) && 
          (data1["status"][idx] !=0 && data1["status"][idx] !=9)){
              console.log("04_02",contrType, data1["status"][idx])
              h += `<ul style="color:red;font-size: 15px">QC_04_02 check row ${idx} : 
              if contrType ≠ 777 or 888, then status should be 0 or 9.</ul>`
      } 
    })
  }
  //(04_04) 04_03 deleted in rules version 2
  if (data1.contrType != undefined){
    data1["contrType"].forEach((contrType,idx) => {
      if ((contrType == undefined) && data1["status"][idx] == 0){
              console.log("04_04",contrType, data1["status"][idx])
              h += `<ul style="color:red;font-size: 15px">QC_04_04 check row ${idx} : 
              if status = 0 and contrtype is missing, update contrType with 888 or the correct contrtype.</ul>`
      } 
    })
  }
  //(04_05) 
  if (data1.contrType != undefined){
    data1["contrType"].forEach((contrType,idx) => {
      if ((contrType == undefined || contrType == 888) && 
          (data1["status"][idx] == 1 || data1["status"][idx] == 2 || data1["status"][idx] == 3)){
              console.log("04_05", contrType, data1["status"][idx])
              h += `<ul style="color:red;font-size: 15px">QC_04_05 check row ${idx} : 
              if contrType is missing or 888 and status = 1, 2, or 3, update contrType with 777.</ul>`
      } 
    })
  }
  //(04_06) 
  if (data1.contrType != undefined){
    data1["contrType"].forEach((contrType,idx) => {
      if (contrType == undefined){
        console.log("04_06", contrType, idx)
              h += `<ul style="color:red;font-size: 15px">QC_04_06 check row ${idx} : 
                  contrType should not be left blank,highlight those records to centre 
                  if both controlType and status are missing.</ul>`
      } 
    })
  }
  //QC_05_01 start
   let statusCheckColumns = checkColumns(validValuesList = [0, 1, 2, 3, 9], variable = "status")
  //(04_valid_values)
   if (data1.status!= undefined){ 
   if (statusCheckColumns != false){
      h += `<ul style="color:red;font-size: 15px"> Valid values include 
      0=control, 1=invasive case, 2=in-situ case, 3=case unknown invasiveness, 9=excluded sample. 
      <br>Blank, 777 and 888 values are not allowed in this variable.</ul>`
    }
  }
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