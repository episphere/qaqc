console.log(`lorena.js ran at ${Date()}`)

runQAQC = function (data) {
  console.log(`lorena.js runQAQC function ran at ${Date()}`)

  let h = `<p style= "color:darkblue; font-weight:bold">File: table with ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
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
    h += `<p style= "color:darkblue;font-size: 20px">ERROR! ${failed_str}</p>` //${upCol.join(", ")}
    h += `<ul style= "color:darkblue;font-size: 20px"> ${failedUpCol.join(", ")}</ul>`
    h += `<ul style= "color:darkblue;font-size: 15px">Please choose from the following variable options: <br>${allCol.join(", ")}</ul>`
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
    // return (!str || 0 === str.length);
    return (str === undefined || 0 === str.length);
  }

  //use isEmpty function from above in checkColumnEmpty function 
  function checkColumnsEmpty(variable) {
    badCount = []
    badPosition = []
    Object.keys(data1).forEach(k => {
      if (k == variable) {
        for (i = 0; i < data1[k].length; i++) {
          if (isEmpty(data1[k][i]) == true) {
            badCount.push(" blank ")
            badPosition.push(" " + (Number(i) + 2) + " ")
          } else {}
        }
      }
    })
    let len_bad = badCount.length
    let badSetStatus = new Set(badCount)
    let arrBadCount = Array.from(badSetStatus)
    if (arrBadCount.length > 0) {
      return h += `<p style="color:darkblue;font-size: 20px">ERROR! ${len_bad} invalid value(s) found in ${variable} column.</p>
     <ul style="color:darkblue;font-size: 15px">Invalid value(s) : ${badCount}<br> Row position(s) : ${badPosition}</ul>`
    } else {
      return false
    }
  }

  //check if number or other integer (888) in fhscore 
  function checkColumnsInt(variable, num) {
    badCount = []
    badPosition = []
    Object.keys(data1).forEach(k => {
      if (k == variable) {
        for (i = 0; i < data1[k].length; i++) {
          if ((isEmpty(data1[k][i])) === true) {
            badCount.push(" blank ")
            badPosition.push(" " + (Number(i) + 2) + " ")
          } else if (!(((data1[k][i]) % 1 === 0) && (num % 1 === 0))) {
            badCount.push(" " + (data1[k][i]) + " ")
            badPosition.push(" " + (Number(i) + 2) + " ")
          } else {}
        }
      }
    })
    let len_bad = badCount.length
    let badSet = Array.from(new Set(badCount))
    if (badSet.length > 0) {
      return h += `<p style="color:darkblue;font-size: 20px">ERROR! ${len_bad} invalid value(s) found in ${variable} column.</p>
     <ul style="color:darkblue;font-size: 15px">Invalid value(s) : ${badCount}<br> Row position(s) : ${badPosition}</ul>`
    } else {
      return false
    }
  }
  //use isNumber between function from above in checkCol function 
  function checkColumnsNum(variable, min, max) {
    badCount = []
    badPosition = []
    Object.keys(data1).forEach(k => {
      if (k == variable) {
        for (i = 0; i < data1[k].length; i++) {
          if (!isNumberBetween(data1[k][i], min, max)) {
            badCount.push(" " + (data1[k][i]) + " ")
            badPosition.push(" " + (Number(i) + 2) + " ")
          } else if (isEmpty(data1[k][i])) {
            badCount.push(" blank ")
            badPosition.push(" " + (Number(i) + 2) + " ")
          }
        }
      }
    })
    let len_bad = badCount.length
    let badSet = Array.from(new Set(badCount))
    if (badSet.length > 0) {
      return h += `<p style="color:darkblue;font-size: 20px">ERROR! ${len_bad} invalid value(s) found in ${variable} column.</p>
    <ul style="color:darkblue;font-size: 15px">Invalid value(s) : ${badCount} <br> Row position(s) : ${badPosition}</ul>`
    } else {
      return false
    }
  }
  /////use is Val function from above in checkCol function--for list use numbers and strings [0,1,888, "0", "1", "888"]
  function checkColumns(validValuesList, variable) {
    badCount = []
    badPosition = []
    Object.keys(data1).forEach(k => {
      if (k == variable) {
        for (i = 0; i < data1[k].length; i++) {
          if (!(isValueOneOf(data1[k][i], validValuesList)) && (isEmpty(data1[k][i]) == true)) {
            badCount.push(" blank ")
            badPosition.push(" " + (Number(i) + 2) + " ")
          } else if ((isValueOneOf(value = (data1[k][i]), validValues = validValuesList)) === false) {
            badCount.push(" " + (data1[k][i]) + " ");
            badPosition.push(" " + (Number(i) + 2) + " ");
          }
        }
      }
    })
    let len_bad = badCount.length
    let badSet = Array.from(new Set(badCount))
    if (badSet.length > 0) {
      return h += `<p style="color:darkblue;font-size: 20px">ERROR! ${len_bad} invalid value(s) found in ${variable} column.</p>
       <ul style="color:darkblue;font-size: 15px">Invalid value(s) : ${badCount} <br> Row position(s) : ${badPosition}</ul>`
    } else {
      return false
    }
  }

  //////////////check each column for invalid values ////////////////////////////////////////////////////////
  //QC_03_01 check study for empty rows
  let studyCheckColumns = checkColumnsEmpty("study")
  if (data1.study != undefined) {
    if (studyCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 15px">Blank values are not allowed in this variable.</ul>`
    }
  }
  //QC_04_01 start contrType
  let contrTypeCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 6, 777, 888], variable = "contrType")
  //(04_valid_values)
  if (data1.contrType != undefined) {
    if (contrTypeCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 15px"> 
     Valid values include
     1=population-based, 2=hospital-based, 3=family-based, 4=blood donor, 
     5 =nested case-control, 6=BRCA1/2 carrier without bc, 
     777=NA=not applicable (for cases), 888=DK=don't know. 
     <br>Blank values are not allowed in this variable.</ul>`
    }
  }
  //QC_04_01 contrType
  if (data1.status != undefined) {
    data1["status"].forEach((status, idx) => {
      if (status == 0 && data1["contrType"][idx] == 777) {
        h += `<ul style="color:darkblue;font-size: 15px">QC_04_01 check row ${idx+2} : If contrType = 777, then status should NOT be 0.</ul>`
      }
    })
  }
  //QC_04_02 contrType
  //(2) if contrType ≠ 777 or 888, then status should be 0 or 9
  if (data1.contrType != undefined) {
    data1["contrType"].forEach((contrType, idx) => {
      if ((contrType != 777 && contrType != 888) &&
        (data1["status"][idx] != 0 && data1["status"][idx] != 9)) {
        console.log("04_02", contrType, data1["status"][idx])
        h += `<ul style="color:darkblue;font-size: 15px">QC_04_02 check row ${idx+2} : 
              if contrType ≠ 777 or 888, then status should be 0 or 9.</ul>`
      }
    })
  }
  //QC_04_04 contrType  (03 deleted in rules version 2)
  if (data1.contrType != undefined) {
    data1["contrType"].forEach((contrType, idx) => {
      if ((contrType == undefined) && data1["status"][idx] == 0) {
        console.log("04_04", contrType, data1["status"][idx])
        h += `<ul style="color:darkblue;font-size: 15px">QC_04_04 check row ${idx+2} : 
              if status = 0 and contrtype is missing, update contrType with 888 or the correct contrtype.</ul>`
      }
    })
  }
  //QC_04_05 contrType
  if (data1.contrType != undefined) {
    data1["contrType"].forEach((contrType, idx) => {
      if ((contrType == undefined || contrType == 888) &&
        (data1["status"][idx] == 1 || data1["status"][idx] == 2 || data1["status"][idx] == 3)) {
        console.log("04_05", contrType, data1["status"][idx])
        h += `<ul style="color:darkblue;font-size: 15px">QC_04_05 check row ${idx+2} : 
              if contrType is missing or 888 and status = 1, 2, or 3, update contrType with 777.</ul>`
      }
    })
  }
  //QC_04_06 contrType
  if (data1.contrType != undefined) {
    data1["contrType"].forEach((contrType, idx) => {
      if (contrType == undefined) {
        console.log("04_06", contrType, idx)
        h += `<ul style="color:darkblue;font-size: 15px">QC_04_06 check row ${idx+2} : 
                  contrType should not be left blank,highlight those records to centre 
                  if both controlType and status are missing.</ul>`
      }
    })
  }

  //QC_05_01 status
  let statusCheckColumns = checkColumns(validValuesList = [0, 1, 2, 3, 9], variable = "status")
  //QC_05_01 status valid values
  if (data1.status != undefined) {
    if (statusCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 15px"> Valid values include 
      0=control, 1=invasive case, 2=in-situ case, 3=case unknown invasiveness, 9=excluded sample. 
      <br>Blank, 777 and 888 values are not allowed in this variable.</ul>`
    }
  }

  let matchIDCheckColumns = checkColumns(validValuesList = [777, 888], variable = "matchid")
  let subStudyCheckColumns = checkColumns(validValuesList = [777, 888], variable = "subStudy")
  let studyTypeCheckColumns = checkColumns(validValuesList = [0, 1, 2, 777, 888], variable = "studyType")
  let exclusionCheckColumns = checkColumns(validValuesList = [0, 1, 3, 4, 5, 6, 7, 8, 888], variable = "exclusion")
  let raceMCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 6, 888], variable = "raceM")
  let raceFCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 6, 888], variable = "raceF")
  //QC_11 ageInt 
  let ageCheckColumnsNum = checkColumnsNum(variable = "ageInt", min = 12, max = 100)
  if (data1.ageInt != undefined) {
    if (ageCheckColumnsNum != false) {
      h += `<ul style="color:darkblue;font-size: 15px"> Valid ageInt values should be between 10 and 100.</ul>`
    }
  }
  //QC_11_01 ageInt 
  if (data1.ageInt != undefined) {
    data1["ageInt"].forEach((k, idx) => {
      if (k == 777) {
        h += `<ul style="color:darkblue;font-size: 15px">QC_11_01 check row ${idx+2} : 
            AgeInt should be between 10 and 100 (excluding 888); 777 is not a valid code.
            <br>Blank values are not allowed in this variable.</ul>`
      }
    })
  }
  //QC_11_02 ageInt 
  if (data1.ageInt != undefined) {
    data1["ageInt"].forEach((k, idx) => {
      if (k == undefined && (data1["ageDiagIndex"] == 888 || data1["ageDiagIndex"] == undefined)) { //agediag== 888 or null, is null blank?
        h += `<ul style="color:red;font-size: 15px">QC_11_01 check row ${idx+2} : 
          When AgeInt is missing, if AgeDiagIndex = null or 888, update AgeInt with 888. (agediag== 888 or null, is null blank?)</ul>`
      }
    })
  }
  // QC_16 sex (M, F, U)
  let sexCheckColumns = checkColumns(validValuesList = ["M", "F", "U"], variable = "sex")
  if (data1.ethnicityClass != undefined) {
    if (sexCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 15px"> Valid values include 
    M = male, F = female, and U = unknown.
       <br>Blank values are not allowed in this variable.</ul>`
    }
  }
  // QC_16_01 sex 
  if (data1.sex != undefined) {
    data1["sex"].forEach((k, idx) => {
      if (k === undefined || k.length == 0) {
        h += `<ul style="color:darkblue;font-size: 15px">QC_16_01 check row ${idx+2} : 
        If missing, please provide sex code for this person, or if completely not known update with U.</ul>`
      }
    })
  }
  //QC_17 ethnicityClass
  let ethnicityClassCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 6, 888], variable = "ethnicityClass")
  if (data1.ethnicityClass != undefined) {
    if (ethnicityClassCheckColumns != false) {
      h += `<ul style="color:red;font-size: 15px"> Valid values include 
    1=European, 2=Hispanic American, 3=African, 4=Asian Subcontinent, 5=Sout-East Asian, 6=Other (including 'mixed race'), 888 = don't know.
       <br>Blank values are not allowed?? blanks not in dict or rules for controls in this variable.</ul>`
    }
  }
  //  QC_17_01 ethnicityClass
  if (data1.ethnicityClass != undefined) {
    data1["ethnicityClass"].forEach((k, idx) => {
      if (k === 1 && (data1["ethnicitySubClass"][idx] != 1 &&
          data1["ethnicitySubClass"][idx] != 2 &&
          data1["ethnicitySubClass"][idx] != 3 &&
          data1["ethnicitySubClass"][idx] != 4 &&
          data1["ethnicitySubClass"][idx] != 5 &&
          data1["ethnicitySubClass"][idx] != 888
        )) {
        h += `<ul style="color:darkblue;font-size: 15px">QC_17_01 check row ${idx+2} : 
        If ethnicityClass=1, then EthnicitySubClass should be 1, 2, 3, 4, 5, or 888.</ul>`
      }
    })
  }
  //  QC_17_02 ethnicityClass
  if (data1.ethnicityClass != undefined) {
    data1["ethnicityClass"].forEach((k, idx) => {
      if (k === 2 && (data1["ethnicitySubClass"][idx] != 6)) {
        h += `<ul style="color:red;font-size: 15px">QC_17_02 check row ${idx+2} : 
        If ethnicityClass=2, then EthnicitySubClass=6 ADD 888?.</ul>`
      }
    })
  }
  //  QC_17_03 ethnicityClass
  if (data1.ethnicityClass != undefined) {
    data1["ethnicityClass"].forEach((k, idx) => {
      if (k === 3 && (data1["ethnicitySubClass"][idx] != 7) &&
        (data1["ethnicitySubClass"][idx] != 8) &&
        (data1["ethnicitySubClass"][idx] != 9) &&
        (data1["ethnicitySubClass"][idx] != 888)
      ) {
        h += `<ul style="color:darkblue;font-size: 15px">QC_17_03 check row ${idx+2} : 
        If ethnicityClass=3, check whether EthnicitySubClass=7, 8, 9, or 888.</ul>`
      }
    })
  }
  //  QC_17_04 ethnicityClass
  if (data1.ethnicityClass != undefined) {
    data1["ethnicityClass"].forEach((k, idx) => {
      if (k === 4 && (data1["ethnicitySubClass"][idx] != 10) &&
        (data1["ethnicitySubClass"][idx] != 11) &&
        (data1["ethnicitySubClass"][idx] != 12) &&
        (data1["ethnicitySubClass"][idx] != 888)
      ) {
        h += `<ul style="color:darkblue;font-size: 15px">QC_17_04 check row ${idx+2} : 
        If ethnicityClass=4, then EthnicitySubClass=10, 11, 12, or 888.</ul>`
      }
    })
  }
  //  QC_17_05 ethnicityClass
  if (data1.ethnicityClass != undefined) {
    data1["ethnicityClass"].forEach((k, idx) => {
      if (k === 5 && (data1["ethnicitySubClass"][idx] != 13) &&
        (data1["ethnicitySubClass"][idx] != 14) &&
        (data1["ethnicitySubClass"][idx] != 15) &&
        (data1["ethnicitySubClass"][idx] != 888)
      ) {
        h += `<ul style="color:darkblue;font-size: 15px">QC_17_05 check row ${idx+2} : 
        If ethnicityClass=5, then EthnicitySubClass=13, 14, 15, or 888.</ul>`
      }
    })
  }
  //  QC_17_06 ethnicityClass
  if (data1.ethnicityClass != undefined) {
    data1["ethnicityClass"].forEach((k, idx) => {
      if (k === 6 && ((data1["ethnicitySubClass"][idx] != 16) ||
          (data1["ethnOt"][idx] != 777))) {
        h += `<ul style="color:darkblue;font-size: 15px">QC_17_06 check row ${idx+2} : 
        If ethnicityClass=6, then EthnicitySubClass=16, ethnOt≠777.</ul>`
      }
    })
  }
  //  QC_17_07 ethnicityClass
  if (data1.ethnicityClass != undefined) {
    data1["ethnicityClass"].forEach((k, idx) => {
      if (k === 888 && ((data1["ethnicitySubClass"][idx] != 888) ||
          (data1["ethnOt"][idx] != 888))) {
        h += `<ul style="color:darkblue;font-size: 15px">QC_17_07 check row ${idx+2} : 
        If ethnicityClass=888, then EthnicitySubClass=888 and ethnOt=888.</ul>`
      }
    })
  }
  //  QC_17_08 ethnicityClass
  if (data1.ethnicityClass != undefined) {
    data1["ethnicityClass"].forEach((k, idx) => {
      if (k != 6 && k != 888 &&
        data1["ethnicitySubClass"][idx] != 16 &&
        ((data1["ethnOt"][idx] == 888) ||
          (data1["ethnOt"][idx] == undefined))
      ) {
        h += `<ul style="color:darkblue;font-size: 15px">QC_17_08 check row ${idx+2} : 
        If ethnicityClass ≠ 6 and ethnicityClass ≠ 888 and ethnicithSubClass ≠ 16 and ethnot = 888 or missing, then update ethnot with 777.</ul>`
      }
    })
  }
  //  QC_17_09 ethnicityClass
  if (data1.ethnicityClass != undefined) {
    data1["ethnicityClass"].forEach((k, idx) => {
      if (k == undefined &&
        data1["ethnicitySubClass"][idx] != 777 &&
        data1["ethnicitySubClass"][idx] != 888
      ) {
        let k = "(blank value)"
        h += `<ul style="color:darkblue;font-size: 15px">QC_17_09 check row ${idx+2} ${k} : 
        If ethnicityClass is missing and ethnicitySubClass is not 777 or 888, work out ethnicityClass based on ethnicitySubClass.</ul>`
      }
    })
  }
  //  QC_17_11 ethnicityClass (10 deleted in this version)
  if (data1.ethnicityClass != undefined) {
    data1["ethnicityClass"].forEach((k, idx) => {
      if (k == 6 &&
        data1["ethnOt"][idx] != undefined &&
        data1["ethnOt"][idx] != 888
      ) {
        h += `<ul style="color:darkblue;font-size: 15px">QC_17_11 check row ${idx+2} : 
        If ethnicityClass = 6, details should be put in ethnot; if details not known, ethnOt = 888.</ul>`
      }
    })
  }
  //  QC_17_13 ethnicityClass (12 deleted or missing in this version)
  if (data1.ethnicityClass != undefined) {
    data1["ethnicityClass"].forEach((k, idx) => {
      if (k == 888 &&
        (data1["ethnicitySubClass"][idx] != 888 ||
          data1["ethnOt"][idx] != 888)
      ) {
        h += `<ul style="color:darkblue;font-size: 15px">QC_17_13 check row ${idx+2} : 
      If ethnicityClass is 888= don't know, update ethnicitySubClass and ethOt with 888.</ul>`
      }
    })
  }
  //  QC_17_14 ethnicityClass 
  if (data1.ethnicityClass != undefined) {
    data1["ethnicityClass"].forEach((k, idx) => {
      if (k != 888 && k != 1 && k != 2 && k != 3 && k != 4 &&
        k != 5 && k != 6
      ) {
        h += `<ul style="color:darkblue;font-size: 15px">QC_17_14 check row ${idx+2} : 
      Check if ethnicityClass is in the range of 1-6 or 888.</ul>`
      }
    })
  }
  //1=Northern European, 2=Southern European, 3=Western European, 4=Eastern European, 5=American European, 6=Hispanic American, 7=African (Africa), 8=Carribbean African, 9=American African, 10=Indian, 11=Pakistani, 12=East and West Bengali, 13=Chinese, 14=Malaysian Peninsula, 15=Japanese, 16=Other (including 'mixed race'), 888=DK
  //QC_18 ethnicitySubClass
  let ethnicitySubClassCheckColumns = checkColumns(
    validValuesList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 888], variable = "ethnicitySubClass")
  if (data1.ethnicitySubClass != undefined) {
    if (ethnicitySubClassCheckColumns != false) {
      h += `<ul style="color:red;font-size: 15px"> Valid values include 
        1=Northern European, 2=Southern European, 3=Western European, 4=Eastern European, 5=American European, 6=Hispanic American, 7=African (Africa), 8=Carribbean African, 9=American African, 10=Indian, 11=Pakistani, 12=East and West Bengali, 13=Chinese, 14=Malaysian Peninsula, 15=Japanese, 16=Other (including 'mixed race'), 888 = don't know.
         <br>Blank values are not allowed?? blanks not in dict or rules for controls in this variable.</ul>`
    }
  }
  //  QC_18_01 ethnicitySubClass
  if (data1.ethnicitySubClass != undefined) {
    data1["ethnicitySubClass"].forEach((k, idx) => {
      if (k === undefined) {
        h += `<ul style="color:darkblue;font-size: 15px">QC_18_01 check row ${idx+2} : 
          If ethnicitySubClass is missing, update ethnicitySubClass with 888.</ul>`
      }
    })
  }
  //  QC_18_02 ethnicitySubClass
  if (data1.ethnicitySubClass != undefined) {
    data1["ethnicitySubClass"].forEach((k, idx) => {
      if (k != undefined && data1["ethnicityClass"][idx] === undefined) {
        h += `<ul style="color:darkblue;font-size: 15px">QC_18_02 check row ${idx+2} : 
              If ethnicitySubClass is NOT null and ethnicityClass is null, update ethnicityClass based on the EthnicitySubClass.</ul>`
      }
    })
  }
   //  QC_18_03 ethnicitySubClass
   if (data1.ethnicitySubClass != undefined) {
    data1["ethnicitySubClass"].forEach((k, idx) => {
      if (k == 16 && data1["ethnOt"][idx] != 888) {
        h += `<ul style="color:darkblue;font-size: 15px">QC_18_03 check row ${idx+2} : 
              If ethnicitySubClass = 16, details should be given in ethnOt, if details not known, ethnOt = 888.</ul>`
      }
    })
  }
     //  QC_18_03 ethnicitySubClass check 04 and 05 as duplicates
  //QC_25 famHist
  let famHistCheckColumns = checkColumns(validValuesList = [0, 1, 888, "0", "1", "888"], variable = "famHist")
  if (data1.famHist != undefined) {
    if (famHistCheckColumns != false) {
      h += `<ul style="color:red;font-size: 15px"> Valid values include 
    family history of  breast cancer in a first degree relative (0=no, 1=yes), 888 = don't know.
       <br>Blank values are not allowed?? blanks not in dict or rules for controls in this variable.</ul>`
    }
  }
  //QC_27 fhnumber
  let fhnumberCheckColumns = checkColumnsInt(variable = "fhnumber", num = 888) // add way to read str like checkcolumns
  if (data1["fhnumber"] != undefined) {
    if (fhnumberCheckColumns != false) {
      h += `<ul style="color:red;font-size: 15px"> Valid values include 
         integer = number of affected (breast cancer) first degree relatives, 888 = don't know.
        <br>Blank values are not allowed?? blanks not in dict or rules for controls in this variable.</ul>`
    }
  }
  //QC_27 fhscore
  let fhscoreCheckColumns = checkColumnsInt(variable = "fhscore", num = 888) // add way to read str like checkcolumns
  if (data1["fhscore"] != undefined) {
    if (fhscoreCheckColumns != false) {
      h += `<ul style="color:red;font-size: 15px"> Valid values include 
    1 for each first degree affected relative, 0.5 for second degree, 0.25 for third degree (not ovarian for any relative), 888 = don't know.
       <br>Blank values are not allowed?? blanks not in dict or rules for controls in this variable.</ul>`
    }
  }
  //QC_28 ER_status
  let erCheckColumns = checkColumns(validValuesList = [undefined, 0, 1, 888], variable = "ER_statusIndex")
  //(28_valid_values)
  if (data1["ER_statusIndex"] != undefined) {
    if (statusCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 15px"> Valid values include 
        0=negative, 1=positive, 888=DK.
        <br>Blank values are allowed for controls in this variable.</ul>` //add AC_26_01 check fro this
    }
  }
  //QC_29 DNA_source
  let DNA_sourceClassCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 888], variable = "DNA_source")
  //(29_valid_values)
  if (data1.DNA_source != undefined) {
    if (DNA_sourceClassCheckColumns != false) {
      h += `<ul style="color:red;font-size: 15px"> Valid values include 
      1=whole blood, 2=buccal cell, 3=mouthwash/saliva, 4=other, 5=no DNA, 888=DK.
       <br>Blank values are not allowed?? blanks not in dict or rules in this variable.</ul>`
    }
  }
  //  QC_29_01 DNA_source
  // if (data1.DNA_source != undefined) {
  //   data1["DNA_source"].forEach((k, idx) => {
  //     if (k === 1 && (data1["DNA_source"][idx] != 1 &&
  //         data1["DNA_source"][idx] != 2 &&
  //         data1["DNA_source"][idx] != 888
  //       )) {
  //       h += `<ul style="color:darkblue;font-size: 15px">QC_29_01 check row ${idx+2} : 
  //       If ethnicityClass=1, then EthnicitySubClass should be 1, 2, 3, 4, 5, or 888.</ul>`
  //     }
  //   })
  // }
  // Check for errors (return false) from checkcolumns function, if true.. alert ERROR!
  const checkColumnsList = [studyCheckColumns, statusCheckColumns, erCheckColumns,
    contrTypeCheckColumns, matchIDCheckColumns, subStudyCheckColumns, studyTypeCheckColumns,
    exclusionCheckColumns, ethnicityClassCheckColumns, raceMCheckColumns, raceFCheckColumns,
    famHistCheckColumns, ageCheckColumnsNum
  ]

  for (i = 0; i < checkColumnsList.length; i++) {
    if (checkColumnsList[i] != false || failedUpCol.length > 0) {
      alert("Invalid columns or rows found! Please see error report for details.");
      break;
    }
  }

  h += qaqc.saveFile(JSON.stringify(data1))
  return h
}
