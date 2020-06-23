console.log(`lorena.js ran at ${Date()}`)

runQAQC = function (data) {
  console.log(`lorena.js runQAQC function ran at ${Date()}`)

  let h = `<p style= "color:darkblue;font-size:12px;font-weight:bold">File: table with ${Object.keys(data).length} columns x ${data[Object.keys(data)[0]].length} rows corresponding to subjects</p>`
  h += `<p></p>`

  //check which variables have not been uploaded
  //https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
  const data1 = data

  let upCol = [] //columns uploaded
  // for (var [key, value] of Object.entries(qaqc.data)) {
  //   var key="/"+key+"/gi"
  //   upCol.push(key)
  // }
  const allCol = ["uniqueID", "personID", "study", "contrType", "status", "DNA_source", "DNA_sourceOt", "matchId", "subStudy", "studyType", "studyTypeOt", "exclusion", "ageInt", "intDate", "intDate_known", "intDay", "intMonth", "intYear", "refMonth", "refYear", "AgeDiagIndex", "sex", "ethnicityClass", "ethnicitySubClass", "ethnOt", "raceM", "raceF", "famHist", "fhnumber", "fhscore", "ER_statusIndex"]
  for (var [key, value] of Object.entries(data)) {
    upCol.push(key)
  }

  // check if column names match the data dictionary
  let acceptedCol = upCol.filter(x => allCol.includes(x)) // accepted columns with proper names, need to loop through these for checks - Lorena
  //https://stackoverflow.com/questions/47008384/es6-filter-an-array-with-regex
  //https://stackoverflow.com/questions/42035717/js-filter-object-array-for-partial-matches
  //https://stackoverflow.com/questions/46771410/javascript-regex-how-to-filter-characters-that-are-not-part-of-regex
  //regex  

  //try this*******************use .match? true false
  //let regexp1=(new RegExp(('^Status'+'{0,5}$'), 'gi'));
  // upCol.filter(x =>console.log(x,regexp1, regexp1.test(x)))


  //console.log(str.match(/[^a-z0-9\-_.&\s]/gi))
  // const matchedSites = Object.keys(data1).filter((x) => x.match(/Status/gi));
  // console.log(matchedSites);
  // let stat= allCol.forEach(variable=> {
  //           let regexp1=(new RegExp(variable,'i'))
  //           upCol.filter(x => regexp1.test(x))

  //rename keys to run QCs*******************
  // function renameKeys(obj, newKeys) {
  //   const keyValues = Object.keys(obj).map(key => {
  //     const newKey = newKeys[key] || key;
  //     return { [newKey]: obj[key] };
  //   });
  //   return Object.assign({}, ...keyValues);
  // }
  // const obj = { a: "1", b: "2" };
  // const newKeys = { a: "A", c: "C" };
  // const renamedObj = renameKeys(obj, newKeys);
  // console.log(renamedObj);
  // {A:"1", b:"2"}

  // Object.keys(data1).forEach(key =>{
  //   if (key.match(/^Status{0,5}$/gi)!= null){
  //     console.log(key.match(/^Status{0,5}$/gi))
  //   }
  // })
  //tryfor study**********
  //define variables from input column names////////////////////////////
  let uniqueID = String(Object.keys(data1).map(key =>
    key.match(/^UniqueID$/gi)).filter(key =>
    key != undefined))
  let personID = String(Object.keys(data1).map(key =>
    key.match(/^PersonID$/gi)).filter(key =>
    key != undefined))
  let study = String(Object.keys(data1).map(key =>
    key.match(/^study$/gi)).filter(key =>
    key != undefined))
  let contrType = String(Object.keys(data1).map(key =>
    key.match(/^contrType$/gi)).filter(key =>
    key != undefined))
  let status = String(Object.keys(data1).map(key =>
    key.match(/^status$/gi)).filter(key =>
    key != undefined))
  let DNA_source = String(Object.keys(data1).map(key =>
    key.match(/^DNA_source$/gi)).filter(key =>
    key != undefined))
  let DNA_sourceOt = String(Object.keys(data1).map(key =>
    key.match(/^DNA_sourceOt$/gi)).filter(key =>
    key != undefined))
  let matchId = String(Object.keys(data1).map(key =>
    key.match(/^matchId$/gi)).filter(key =>
    key != undefined))
  let subStudy = String(Object.keys(data1).map(key =>
    key.match(/^subStudy$/gi)).filter(key =>
    key != undefined))
  let studyType = String(Object.keys(data1).map(key =>
    key.match(/^studyType$/gi)).filter(key =>
    key != undefined))
  let studyTypeOt = String(Object.keys(data1).map(key =>
    key.match(/^studyTypeOt$/gi)).filter(key =>
    key != undefined))
  let exclusion = String(Object.keys(data1).map(key =>
    key.match(/^exclusion$/gi)).filter(key =>
    key != undefined))
  let ageInt = String(Object.keys(data1).map(key =>
    key.match(/^ageInt$/gi)).filter(key =>
    key != undefined))
  let intDate = String(Object.keys(data1).map(key =>
    key.match(/^intDate$/gi)).filter(key =>
    key != undefined))
  let intDate_known = String(Object.keys(data1).map(key =>
    key.match(/^intDate_known$/gi)).filter(key =>
    key != undefined))
  let intDay = String(Object.keys(data1).map(key =>
    key.match(/^intDay$/gi)).filter(key =>
    key != undefined))
  let intMonth = String(Object.keys(data1).map(key =>
    key.match(/^intMonth$/gi)).filter(key =>
    key != undefined))
  let intYear = String(Object.keys(data1).map(key =>
    key.match(/^intYear$/gi)).filter(key =>
    key != undefined))
  let refMonth = String(Object.keys(data1).map(key =>
    key.match(/^refMonth$/gi)).filter(key =>
    key != undefined))
  let refYear = String(Object.keys(data1).map(key =>
    key.match(/^refYear$/gi)).filter(key =>
    key != undefined))
  let AgeDiagIndex = String(Object.keys(data1).map(key =>
    key.match(/^AgeDiagIndex$/gi)).filter(key =>
    key != undefined))
  let sex = String(Object.keys(data1).map(key =>
    key.match(/^sex$/gi)).filter(key =>
    key != undefined))
  let ethnicityClass = String(Object.keys(data1).map(key =>
    key.match(/^ethnicityClass$/gi)).filter(key =>
    key != undefined))
  let ethnicitySubClass = String(Object.keys(data1).map(key =>
    key.match(/^ethnicitySubClass$/gi)).filter(key =>
    key != undefined))
  let ethnOt = String(Object.keys(data1).map(key =>
    key.match(/^ethnOt$/gi)).filter(key =>
    key != undefined))
  let raceM = String(Object.keys(data1).map(key =>
    key.match(/^raceM$/gi)).filter(key =>
    key != undefined))
  let raceF = String(Object.keys(data1).map(key =>
    key.match(/^raceF$/gi)).filter(key =>
    key != undefined))
  let famHist = String(Object.keys(data1).map(key =>
    key.match(/^famHist$/gi)).filter(key =>
    key != undefined))
  let fhnumber = String(Object.keys(data1).map(key =>
    key.match(/^fhnumber$/gi)).filter(key =>
    key != undefined))
  let fhscore = String(Object.keys(data1).map(key =>
    key.match(/^fhscore$/gi)).filter(key =>
    key != undefined))
  let ER_statusIndex = String(Object.keys(data1).map(key =>
    key.match(/^ER_statusIndex$/gi)).filter(key => //add space regex***?
    key != undefined))
  //////////////////////////////////////////////////////////
  function difference(a1, a2) {
    let a2Set = new Set(a2);
    return a1.filter(function (x) {
      return !a2Set.has(x);
    })
  }
  console.log(upCol.length, "columns processed")
  //All uploaded columns with rewritten names   (allcol= valid names)                                                
  let allCol2 = [uniqueID, personID, study, contrType, status, DNA_source, DNA_sourceOt, matchId,
    subStudy, studyType, studyTypeOt, exclusion, ageInt, intDate, intDate_known, intDay,
    intMonth, intYear, refMonth, refYear, AgeDiagIndex, sex, ethnicityClass,
    ethnicitySubClass, ethnOt, raceM, raceF, famHist, fhnumber, fhscore, ER_statusIndex
  ]


  let extraCol = difference(upCol, allCol2)
  let upColMinusExtraCol = difference(upCol, extraCol) //part one of extra
  let misspelledCol = difference(upColMinusExtraCol, allCol) //part two of extra

  let missing = []
  upCol.forEach(uploadedCol => {
    var regex = new RegExp("^" + uploadedCol + "$", 'gi');
    let filt = allCol.filter(key => key.match(regex))
    if (filt.length > 0) {
      missing.push(String(filt))
    }
  })
  console.log(allCol)
  console.log(missing)

  let missingCol = difference(allCol, missing)
  console.log(missingCol) //let failedUpCol = difference(upCol, acceptedCol)


  if (missingCol.length > 0) {
    h += `<p style= "color:darkblue;font-size: 12px">Column warning: Expected variable not found! Please confirm your submitted data includes a 
    column for all of the requested variables. The following ${missingCol.length} variable(s) was/were not found:</p>`
    h += `<ul style= "color:darkblue;font-size: 12px"> ${missingCol.join(", ")}</ul>`
    h += `<ul style= "color:darkblue;font-size: 12px">Variable options should include: <br>${allCol.join(", ")}</ul>`
  }

  if (extraCol.length > 0) {
    h += `<p style= "color:darkblue;font-size: 12px">Column warning: Unrequested variable(s) found! Please confirm your submitted data does not include variables 
    that have not been requested. The following ${extraCol.length} unrequested variable(s) was/were not found:</p>`
    h += `<ul style= "color:darkblue;font-size: 12px"> ${extraCol.join(", ")}</ul>`
    h += `<ul style= "color:darkblue;font-size: 12px">Variable options should include: <br>${allCol.join(", ")}</ul>`
  }
  if (misspelledCol.length > 0) {
    h += `<p style= "color:darkblue;font-size: 12px">Column warning: Case-sensitive! ${misspelledCol.length} variable names found that do not match variable casing (lower case / upper case)
     in the Confluence data dictionary. No action is required from the data submitter.</p>` 
    h += `<ul style= "color:darkblue;font-size: 12px"> ${misspelledCol.join(", ")}</ul>`
    h += `<ul style= "color:darkblue;font-size: 12px">Variable options should include: <br>${allCol.join(", ")}</ul>`
  }

  ////////for age use this function
  //https://stackoverflow.com/questions/36507932/how-to-evaluate-if-statements-with-a-lot-of-and-conditions
  function isNumberBetween(value, min, max) {
    return value >= min && value <= max
  }
  ///\s/g.test("M ") test for blank spaces
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
    let badSet = Array.from(new Set(badCount))
    if (badSet.length > 0) {
      return h += `<p style="color:darkblue;font-size: 12px">Validity error! ${len_bad} invalid value(s) found in "${variable}" column.</p>
     <ul style="color:darkblue;font-size: 12px">Invalid value(s) : ${badSet}</ul>`
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
          } else if ((data1[k][i] != num) && (/\d/.test(data1[k][i]) == false)) {
            badCount.push(" " + (data1[k][i]) + " ")
            badPosition.push(" " + (Number(i) + 2) + " ")
          } else {}
        }
      }
    })
    let len_bad = badCount.length
    let badSet = Array.from(new Set(badCount))
    if (badSet.length > 0 && badSet.length < 5) {
      return h += `<p style="color:darkblue;font-size: 12px">Validity error! ${len_bad} invalid value(s) found in "${variable}" column.</p>
     <ul style="color:darkblue;font-size: 12px">Invalid value(s) : ${badSet}</ul>`
    } 
    else {
      return false
    }
  }

  function checkColumnsTxt(variable) {
    badCount = []
    badPosition = []
    Object.keys(data1).forEach(k => {
      if (k == variable) {
        for (i = 0; i < data1[k].length; i++) {
          if (!/[a-z]/gi.test(data1[k][i]) === true && isEmpty(data1[k][i]) === false) {
            badCount.push(" " + (data1[k][i]) + " ")
            badPosition.push(" " + (Number(i) + 2) + " ")
          }
        }
      }
    })
    let len_bad = badCount.length
    let badSet = Array.from(new Set(badCount))
    if (badSet.length > 0) {
      return h += `<p style="color:darkblue;font-size: 12px">Validity error! ${len_bad} invalid value(s) found in "${variable}" column.</p>
     <ul style="color:darkblue;font-size: 12px">Invalid value(s) : ${badSet}</ul>`
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
      return h += `<p style="color:darkblue;font-size: 12px">Validity error! ${len_bad} invalid value(s) found in "${variable}" column.</p>
    <ul style="color:darkblue;font-size: 12px">Invalid value(s) : ${badSet} </ul>`
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

          } else if (!(isValueOneOf(data1[k][i], validValuesList)) && (/\s/g.test(data1[k][i]) == true)) {
            badCount.push(" " + (data1[k][i]) + "(+whitespace) ");
            badPosition.push(" " + (Number(i) + 2) + " ");

          } else if ((isValueOneOf(value = (data1[k][i]), validValues = validValuesList)) === false) {
            badCount.push(" " + (data1[k][i]) + " ");
            badPosition.push(" " + (Number(i) + 2) + " ");
          }
        }
      }
    })
    let len_bad = badCount.length
    let badSet = Array.from(new Set(badCount))
    if (badSet.length > 0 ) {
      return h += `<p style="color:darkblue;font-size: 12px">Validity error! ${len_bad} invalid value(s) found in "${variable}" column.</p>
       <ul style="color:darkblue;font-size: 12px">Invalid value(s) : ${badSet}</ul>`
    } else {
      return false
    }
  }

  //////////////check each column for invalid values ////////////////////////////////////////////////////////
  //QC_01_01 check uniqueID for unique values
  // console.log("QC 01 uniqueID")
  // let uniqueIDCheckColumns=[]
  // if (data1[uniqueID] != undefined) {  //also gets the duplicate blank rows. Should be filled in by confluence data managers
  //   uniqueIDCheckColumns.push(data1[uniqueID].filter((e, i, a) => a.indexOf(e) !== i))
  // }
  //   if (uniqueIDCheckColumns.length > 0) {
  //     h += `<p style="color:darkblue;font-size: 12px">QC_01_01. Duplicate(s) found: ${uniqueIDCheckColumns}.
  //           <br>Check whether uniqueID is unique within each study.
  //     UniqueID should be  a concatenation of Study Acronym, "-", and PersonID, a few studies have created a new UniqueID, which is also ok.</p>`
  //   }

  //QC_02_01 check personID for unique values
  console.log("QC 02 personID")
  let personIDCheckColumns = []
  if (data1[personID] != undefined) {
    personIDCheckColumns.push(data1[personID].filter((e, i, a) => a.indexOf(e) !== i))
  }
  if (personIDCheckColumns.length > 0) {
    h += `<p style="color:darkblue;font-size: 12px">Duplicates error! Duplicate(s) found in "${personID} column: ${personIDCheckColumns}.
      <br>Check whether PersonID is unique within each study. Blank values are not allowed in this variable.</p>`
  }

  //QC_03_01 check study for empty rows
  console.log("QC 03 study")
  let studyCheckColumns = checkColumnsEmpty(study)
  if (data1[study] != undefined) {
    if (studyCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px">Blank values are not allowed in "study" variable.</ul>`
    }
  }
  //QC_04_01 start contrType
  console.log("QC 04 contrType")
  let contrTypeCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 6, 777, 888, "1", "2", "3", "4", "5", "6", "777", "888"], variable = contrType)
  //(04_valid_values)
  if (data1[contrType] != undefined) {
    if (contrTypeCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> 
     Valid "contrType" values include
     1=population-based, 2=hospital-based, 3=family-based, 4=blood donor, 
     5 =nested case-control, 6=BRCA1/2 carrier without bc, 
     777=NA=not applicable (for cases), 888=DK=don't know. Blank values are not allowed in this variable.</ul>`
    }
  }
  //QC_04_01 contrType
  if (data1.status != undefined && data1.contrType != undefined) {
    for(let [idx,k] of data1[status].entries()) {
      if ((k == 0) && (data1[contrType][idx] == 777)) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${contrType}" column : </p>`
        h += `<ul style="color:darkblue;font-size: 12px">If contrType = 777, then status should NOT be 0.</ul>`
      }break;
    }
  }
  //QC_04_02 contrType
  //(2) if contrType ≠ 777 or 888, then status should be 0 or 9
  if (data1.contrType != undefined && data1.status != undefined) {
    for(let [idx,k] of data1[contrType].entries()) {
      if ((k != 777) && (k != 888) && (data1[status][idx] != 0) || (data1[status][idx] != 9)){
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${contrType}" column : </p>`
        h += `<ul style="color:darkblue;font-size: 12px">If contrType ≠ 777 or 888, then status should be 0 or 9.</ul>`
      }break;
    }
}
  //QC_04_04 contrType  (03 deleted in rules version 2)?
  if (data1.contrType != undefined && data1.status != undefined) {
      for(let [idx,k] of data1[contrType].entries()) {
        if ((k == undefined) && (data1[status][idx] == 0)){
        h += `<p style="color:darkblue;font-size: 12px"Consistency error! Check "${contrType}" column : </p>`
        h += `<ul style="color:darkblue;font-size: 12px">If status = 0 and contrtype is missing, update contrType with 888 or the correct contrtype.</ul>`
      }break;
    }
  }
  //QC_04_05 contrType
  if (data1.contrType != undefined && data1.status != undefined) {
    for(let [idx,k] of data1[contrType].entries()) {
      if ((k == undefined || k == 888) &&
        (data1[status][idx] == 1 || data1[status][idx] == 2 || data1[status][idx] == 3)) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${contrType}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">if contrType is missing or 888 and status = 1, 2, or 3, update contrType with 777.</ul>`
      }break;
    }
  }
  //QC_04_06 contrType ?? check in qc rules.
  if (data1.contrType != undefined) {
    for(let [idx,k] of data1[contrType].entries()) {
      if (k == undefined) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${contrType}" column : </p>`
        h += `<ul style="color:darkblue;font-size: 12px">ContrType should not be left blank, highlight those records to centre 
                  if both controlType and status are missing.</ul>`
      }break;
    }
  }
  //QC_05 status
  console.log("QC 05 status")
  let statusCheckColumns = checkColumns(validValuesList = [0, 1, 2, 3, 9, "0", "1", "2", "3", "9"], variable = status)
  //QC_05 status valid values
  if (data1.status != undefined) {
    if (statusCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> Valid "status" values include 
      0=control, 1=invasive case, 2=in-situ case, 3=case unknown invasiveness, 9=excluded sample. 
      <br>Blank, 777 and 888 values are not allowed in this variable.</ul>`
    }
  }
  //QC_06 matchId
  console.log("QC 06 matchId")
  let matchIdCheckColumns = checkColumns(validValuesList = [777, 888, "777", "888"], variable = matchId)
  //QC_06 matchId valid values
  if (data1.matchId != undefined) {
    if (matchIdCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px">Valid "matchId" values include 777=NA, 888=DK. 
      <br>Blank values are not allowed in this variable.</ul>`
    }
  }
  //QC_06_02 matchId 
  if (data1.matchId != undefined) {
    for(let [idx,k] of data1[matchId].entries()) {
      if (k === undefined) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${matchId}" column : </p>
        <ul style="color:darkblue;font-size: 12px">If matchId is missing (not an individually matched study), 
        update matchId with 777.</ul>`
      }break;
    }
  }
  //QC_07 subStudy
  console.log("QC 07 subStudy")
  let subStudyCheckColumns = checkColumns(validValuesList = [777, 888], variable = subStudy)
  //QC_07 subStudy valid values
  if (data1.subStudy != undefined ) {
    if (subStudyCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> Valid "subStudy" values include 777=NA, 888=don't know. Blank values are not allowed in this variable.</ul>`
    }
  }
  //QC_07_01 subStudy 
  if (data1.subStudy != undefined) {
    for(let [idx,k] of data1[subStudy].entries()) {
      if (k === undefined) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${subStudy}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If substudy is missing (no substudy) update with 777.</ul>`
      }break;
    }
  }
  //QC_07_02 subStudy? add function for these 2
  //QC_07_03 subStudy ?

  //QC_08 studyType    (new else row added? in case all valid)
  console.log("QC 08 studyType")
  let studyTypeCheckColumns = checkColumns(validValuesList = [0, 1, 2, 777, 888, "0", "1", "2", "777", "888"], variable = studyType)
  //QC_08 studyType valid values
  if (data1.studyType != undefined) {
    if (studyTypeCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> Valid "studyType" values include 
    0='sporadic' (population or hospital based), 1='familial' (clinical genetic centre based), 
    2=other,777=NA (controls), and 888=don't know. Blank values are not allowed in this variable.</ul>`
    }
  }
  //QC_08_01 studyType 
  if (data1.studyType != undefined && data1.status != undefined) {
    for(let [idx,k] of data1[studyType].entries()) {
      if (k != 777 && data1[status][idx] == 0) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${studyType}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If status=0 then StudyType should be 777.</ul>`
      }break;
    }
  }
  //QC_09 exclusion
  console.log("QC 09 exclusion")
  let exclusionCheckColumns = checkColumns(validValuesList = [0, 5, 6, 7, 8, 888, "0", "5", "6", "7", "8", "777", "888"], variable = exclusion)
  //QC_09 exclusion valid values
  if (data1[exclusion] != undefined) {
    if (exclusionCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> Valid values include 
      0=include, 5=no phenotypic data, 6=other, 7=non-breast carcinoma (e.g. sarcoma), 8=duplicate sample, 888=don't know
      <br>Blank values are not allowed in this variable</ul>`
    }
  }
  //QC_09_01 exclusion 
  if (data1.exclusion != undefined) {
    for(let [idx,k] of data1[exclusion].entries()) {
      if (k == 0 && data1[status][idx] == 9) {
        h += `<p style="color:darkblue;font-size: 12px">
        Consistency error! Check "${exclusion}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px"> 
          If exclusion=0, status should NOT be 9.</p>`
      }break;
    }
  }
  //QC_09_02 exclusion 
  if (data1.exclusion != undefined) {
    for(let [idx,k] of data1[exclusion].entries()) {
      if ((k == 5 || k == 6 || k == 7 || k == 8 || k == 888) && data1[status][idx] != 9) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${exclusion}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If exclusion≠0, status should be 9.</p>`
      }break;
    }
  }
  //QC_09_03 exclusion 
  if (data1.exclusion != undefined) {
    for(let [idx,k] of data1[exclusion].entries()) {
      if ((data1[status][idx] == 0 || data1[status][idx] == 1 || data1[status][idx] == 2 ||
          data1[status][idx] == 3) && k === undefined) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check row "${exclusion}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px"> 
        If status=(0,1,2,3) and exclusion is missing, update exclusion with 0.</p>`
      }break;
    }
  }
  //QC_09_04 exclusion 
  if (data1.exclusion != undefined && data1.status != undefined) {
    for(let [idx,k] of data1[exclusion].entries()) {
      if (data1[status][idx] == 9 && k === undefined) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${exclusion}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">
          If status=9 and exclusion is missing, update with 888.</p>`
      }break;
    }
  }
  //QC_11 ageInt 
  console.log("QC 11 ageInt")
  let ageCheckColumnsNum = checkColumnsNum(variable = ageInt, min = 12, max = 100)
  if (data1.ageInt != undefined) {
    if (ageCheckColumnsNum != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> Valid "ageInt" values 
      should be between 10 and 100.</ul>`
    }
  }
  //QC_11_01 ageInt 
  if (data1.ageInt != undefined) {
    for(let [idx,k] of data1[ageInt].entries()) {
      if (k == 777) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ageInt}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">AgeInt should be between 10 and 100 (excluding 888); 
            777 is not a valid code. Blank values are not allowed in this variable.</ul>`
      }break;
    }
  }
  //QC_11_02 ageInt 
  if (data1.ageInt != undefined) {
    for(let [idx,k] of data1[ageInt].entries()) {
      if (k == undefined && (data1[AgeDiagIndex][idx] == 888 || data1[AgeDiagIndex][idx] == undefined)) { //agediag== 888 or null, is null blank?
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ageInt}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">When AgeInt is missing, if AgeDiagIndex = null or 888, update AgeInt with 888.</ul>`
      }break;
    }
  }
  //QC_11_03 ageInt 
  if (data1.ageInt != undefined) {
    for(let [idx,k] of data1[ageInt].entries()) {
      if (k == undefined && (data1[AgeDiagIndex][idx] != undefined)) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ageInt}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If AgeInt is missing and AgeDiagIndex is not null, update AgeInt with AgeDiagIndex.</ul>`
      }break;
    }
  }
  //QC_11_04 ageInt 
  if (data1.ageInt != undefined &&  data1.AgeDiagIndex != undefined) {
    for(let [idx,k] of data1[ageInt].entries()) {
      if ((data1[AgeDiagIndex][idx] != 777) && (data1[AgeDiagIndex][idx] != undefined) && (data1[status] == 0)) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ageInt}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If there are AgeDiagIndex data for controls, check with study if this is meant to be ageInt data.</ul>`
      }break;
    }
  }
  //QC_11_05 ageInt 
  if (data1.ageInt != undefined) {
    for(let [idx,k] of data1[ageInt].entries()) {
      if (k == undefined) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ageInt}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px"> AgeInt should not be null.</ul>`
      }break;
    }
  }
  //QC_11_06 ageInt 
  if (data1.ageInt != undefined) {
    for(let [idx,k] of data1[ageInt].entries()) {
      if (k < 18) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ageInt}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">AgeInt should not be < 18.</ul>`
      }break;
    }
  }
  //QC_13_01 refMonth 
  console.log("QC 13 refMonth")
  if (data1.refMonth != undefined) {
    for(let [idx,k] of data1[refMonth].entries()) {
      if ((k > 12 || k < 1) && k != 888) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${refMonth}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">Month should be between 1 and 12 or 888.</ul>`
      }break;
    }
  }
  //QC_13_02 refMonth 
  if (data1.refMonth != undefined  && data1.status != undefined && data1.AgeDiagIndex != undefined) {
    for(let [idx,k] of data1[refMonth].entries()) {
      if ((k == undefined) && (data1[status][idx] == 1) && (data1[AgeDiagIndex][idx] != undefined)) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check row ${idx+2} in "${refMonth}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If refmonth is missing and dateDiag in case is available, update refmonth with mont(dateDiag).</ul>`
      }break;
    }
  }
  //QC_13_03 refMonth 
  if (data1.refMonth != undefined && data1.intDate != undefined && data1.status != undefined) {
    for(let [idx,k] of data1[refMonth].entries()) {
      if ((k == undefined) && (data1[intDate][idx] != undefined) && data1[status][idx] == 0) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check row ${idx+2} in "${refMonth}" column : </p>`
        h+=`<ul style="color:darkblue;font-size: 12px">For controls, if refMonth is missing but intDate is available, update refMonth with month(intDate).</ul>`
      }break;
    }
  }
  //QC_13_04 refMonth 
  if (data1.refMonth != undefined) {
    for(let [idx,k] of data1[refMonth].entries()) {
      if ((k > 12 || k < 1) && k != 888) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check row ${idx+2} in "${refMonth}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If refmonth is missing, update with 888.</ul>`
      }break;
    }
  }
  //QC_14_01 refYear 
  console.log("QC 14 refYear")
  if (data1.refYear != undefined) {
    for(let [idx,k] of data1[refYear].entries()) {
      if (/^(19[8-9]\d|20[0-4]\d|2014)$/.test(k) == false) {
        console.log(k)
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${refYear}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">refYear should be between 1980 and 2014.</ul>`
      }break;
    }
  }
  //QC_14_03 refYear 
  if (data1.refYear != undefined && data1.status != undefined && data1.intDate != undefined) {
    for(let [idx,k] of data1[refMonth].entries()) {
      if (k == undefined && data1[status][idx] == 0 && data1[intDate][idx] != undefined) {
        console.log(k)
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${refYear}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">For controls, if refYear is missing but intDate is avaialbe, update refYear with year(intDate).</ul>`
      }break;
    }
  }
  //QC_14_05 refYear 
  if (data1.refYear != undefined) {
    for(let [idx,k] of data1[refYear].entries()) {
      if (k == undefined) {
        console.log(k)
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${refYear}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If refyear is missing, update with 888.</ul>`
      }break;
    }
  }
  // QC_16 sex (M, F, U)
  console.log("QC 16 sex")
  let sexCheckColumns = checkColumns(validValuesList = ["M", "F", "U"], variable = sex)
  if (data1[sex] != undefined) {
    if (sexCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> Valid "sex" values include 
    M = male, F = female, and U = unknown. Blank values are not allowed in this variable.</ul>`
    }
  }
  // QC_16_01 sex 
  if (data1[sex] != undefined) {
    for(let [idx,k] of data1[sex].entries()) {
      if (k === undefined || k.length == 0) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${sex}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If sex is missing, please provide sex code for this person, or if completely not
         known update with U.</ul>`
      }break;
    }
  }
  //QC_17 ethnicityClass
  console.log("QC 17 ethnicityClass")
  let ethnicityClassCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 6, 888, "1", "2", "3", "4", "5", "6", "888"], variable = ethnicityClass)
  if (data1.ethnicityClass != undefined) {
    if (ethnicityClassCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> Valid "ethnicityClass" values include 
    1=European, 2=Hispanic American, 3=African, 4=Asian Subcontinent, 5=Sout-East Asian, 6=Other (including 'mixed race'), 888 = don't know.
       <br>Blank values are not allowed in this variable.</ul>`
    }
  }
  //  QC_17_01 ethnicityClass
  if (data1.ethnicityClass != undefined & data1.ethnicitySubClass != undefined) {
    for(let [idx,k] of data1[ethnicityClass].entries()) {
      if (k == 1 && (data1[ethnicitySubClass][idx] != 1 &&
          data1[ethnicitySubClass][idx] != 2 &&
          data1[ethnicitySubClass][idx] != 3 &&
          data1[ethnicitySubClass][idx] != 4 &&
          data1[ethnicitySubClass][idx] != 5 &&
          data1[ethnicitySubClass][idx] != 888
        )) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ethnicityClass}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If ethnicityClass=1, then EthnicitySubClass should be 1, 2, 3, 4, 5, or 888.</ul>`
      }break;
    }
  }
  //  QC_17_02 ethnicityClass
  if (data1.ethnicityClass != undefined) {
    for(let [idx,k] of data1[ethnicityClass].entries()) {
      if (k === 2 && (data1[ethnicitySubClass][idx] != 6)) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ethnicityClass}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If ethnicityClass=2, then EthnicitySubClass=6 ADD 888.</ul>`
      }break;
    }
  }
  //  QC_17_03 ethnicityClass
  if (data1.ethnicityClass != undefined) {
    for(let [idx,k] of data1[ethnicityClass].entries()) {
      if (k === 3 && (data1[ethnicitySubClass][idx] != 7) &&
        (data1[ethnicitySubClass][idx] != 8) &&
        (data1[ethnicitySubClass][idx] != 9) &&
        (data1[ethnicitySubClass][idx] != 888)
      ) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ethnicityClass}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If ethnicityClass=3, check whether EthnicitySubClass=7, 8, 9, or 888.</ul>`
      }
    }
  }
  //  QC_17_04 ethnicityClass
  if (data1.ethnicityClass != undefined) {
    for(let [idx,k] of data1[ethnicityClass].entries()) {
      if (k === 4 && (data1[ethnicitySubClass][idx] != 10) &&
        (data1[ethnicitySubClass][idx] != 11) &&
        (data1[ethnicitySubClass][idx] != 12) &&
        (data1[ethnicitySubClass][idx] != 888)
      ) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ethnicityClass}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If ethnicityClass=4, then EthnicitySubClass=10, 11, 12, or 888.</ul>`
      }break;
    }
  }
  //  QC_17_05 ethnicityClass
  if (data1.ethnicityClass != undefined) {
    for(let [idx,k] of data1[ethnicityClass].entries()) {
      if (k === 5 && (data1[ethnicitySubClass][idx] != 13) &&
        (data1[ethnicitySubClass][idx] != 14) &&
        (data1[ethnicitySubClass][idx] != 15) &&
        (data1[ethnicitySubClass][idx] != 888)
      ) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ethnicityClass}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If ethnicityClass=5, then EthnicitySubClass=13, 14, 15, or 888.</ul>`
      }break;
    }
  }
  //  QC_17_06 ethnicityClass
  if (data1.ethnicityClass != undefined) {
    for(let [idx,k] of data1[ethnicityClass].entries()) {
      if (k === 6 && ((data1[ethnicitySubClass][idx] != 16) ||
          (data1[ethnOt][idx] != 777))) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ethnicityClass}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If ethnicityClass=6, then EthnicitySubClass=16, ethnOt≠777.</ul>`
      }break;
    }
  }
  //  QC_17_07 ethnicityClass
  if (data1.ethnicityClass != undefined) {
    for(let [idx,k] of data1[ethnicityClass].entries()) {
      if (k === 888 && ((data1[ethnicitySubClass][idx] != 888) ||
          (data1[ethnOt][idx] != 888))) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ethnicityClass}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If ethnicityClass=888, then EthnicitySubClass=888 and ethnOt=888.</ul>`
      }break;
    }
  }
  //  QC_17_08 ethnicityClass
  if (data1.ethnicityClass != undefined && data1.ethnicitySubClass != undefined) {
    for(let [idx,k] of data1[ethnicityClass].entries()) {
      if (k != 6 && k != 888 &&
        data1[ethnicitySubClass][idx] != 16 &&
        ((data1[ethnOt][idx] == 888) ||
          (data1[ethnOt][idx] == undefined))
      ) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ethnicityClass}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If ethnicityClass ≠ 6 and ethnicityClass ≠ 888 and ethnicithSubClass ≠ 16 
        and ethnot = 888 or missing, then update ethnot with 777.</ul>`
      }break;
    }
  }
  //  QC_17_09 ethnicityClass
  if (data1.ethnicityClass != undefined) {
    for(let [idx,k] of data1[ethnicityClass].entries()) {
      if (k == undefined &&
        data1[ethnicitySubClass][idx] != 777 &&
        data1[ethnicitySubClass][idx] != 888
      ) {
        let k = "(blank value)"
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ethnicityClass}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If ethnicityClass is missing and ethnicitySubClass is not 777 or 888, 
        work out ethnicityClass based on ethnicitySubClass.</ul>`
      }break;
    }
  }
  //  QC_17_11 ethnicityClass (10 deleted in this version)
  if (data1.ethnicityClass != undefined) {
    for(let [idx,k] of data1[ethnicityClass].entries()) {
      if (k == 6 &&
        data1[ethnOt][idx] != undefined &&
        data1[ethnOt][idx] != 888
      ) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ethnicityClass}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If ethnicityClass = 6, details should be put in ethnot; 
        if details not known, ethnOt = 888.</ul>`
      }break;
    }
  }
  //  QC_17_13 ethnicityClass (12 deleted or missing in this version)
  if (data1.ethnicityClass != undefined) {
    for(let [idx,k] of data1[ethnicityClass].entries()) {
      if (k == 888 &&
        (data1[ethnicitySubClass][idx] != 888 ||
          data1[ethnOt][idx] != 888)
      ) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ethnicityClass}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If ethnicityClass is 888= don't know, update ethnicitySubClass and ethOt with 888.</ul>`
      }break;
    }
  }
  //  QC_17_14 ethnicityClass 
  if (data1.ethnicityClass != undefined) {
    for(let [idx,k] of data1[ethnicityClass].entries()) {
      if (k != 888 && k != 1 && k != 2 && k != 3 && k != 4 &&
        k != 5 && k != 6
      ) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ethnicityClass}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">Check if ethnicityClass is in the range of 1-6 or 888.</ul>`
      }break;
    }
  }
  //QC_18 ethnicitySubClass
  console.log("QC 18 ethnicitySubClass")
  let ethnicitySubClassCheckColumns = checkColumns(
    validValuesList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 888, "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "888"], variable = ethnicitySubClass)
  if (data1.ethnicitySubClass != undefined) {
    if (ethnicitySubClassCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> Valid "ethnicitySubClass" values include 
        1=Northern European, 2=Southern European, 3=Western European, 4=Eastern European, 5=American European, 6=Hispanic American, 7=African (Africa), 8=Carribbean African, 9=American African, 10=Indian, 11=Pakistani, 12=East and West Bengali, 13=Chinese, 14=Malaysian Peninsula, 15=Japanese, 16=Other (including 'mixed race'), 888 = don't know.
         <br>Blank values are not allowed in this variable.</ul>`
    }
  }
  //  QC_18_01 ethnicitySubClass
  if (data1.ethnicitySubClass != undefined) {
    for(let [idx,k] of data1[ethnicitySubClass].entries()) {
      if (k === undefined) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ethnicitySubClass}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If ethnicitySubClass is missing, update ethnicitySubClass with 888.</ul>`
      }break;
    }
  }
  //  QC_18_02 ethnicitySubClass
  if (data1.ethnicitySubClass != undefined) {
    for(let [idx,k] of data1[ethnicitySubClass].entries()) {
      if (k != undefined && data1[ethnicityClass][idx] === undefined) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ethnicitySubClass}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If ethnicitySubClass is NOT null and ethnicityClass is null, update 
              ethnicityClass based on the EthnicitySubClass.</ul>`
      }break;
    }
  }
  //  QC_18_03 ethnicitySubClass
  if (data1.ethnicitySubClass != undefined) {
    for(let [idx,k] of data1[ethnicitySubClass].entries()) {
      if (k == 16 && data1[ethnOt][idx] != 888) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ethnicitySubClass}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If ethnicitySubClass = 16, details should be given in ethnOt, 
        if details not known, ethnOt = 888.</ul>`
      }break;
    }
  }
  //  QC_18_03 ethnicitySubClass check 04 and 05 as duplicates
  //QC_19 ethnOt
  console.log("QC 19 ethnOt")
  let ethnOtCheckColumns = checkColumnsEmpty(ethnOt)
  //(QC_19 ethnOt_valid_values)
  if (data1[ethnOt] != undefined) {
    if (ethnOtCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> Valid "ethnOt" values include text, 777= NA and 888=DK. Other numeric data
       are not allowed.<br>Blank values are not allowed in this variable.</ul>`
    }
  }
  //  QC_19_01 ethnOt
  if (data1.ethnOt != undefined) {
    for(let [idx,k] of data1[ethnOt].entries()) {
      if (k != 888 && data1[ethnicityClass][idx] == 888) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ethnOt}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If ethnicityClass = 888 then ethnOt should be 888.</ul>`
      }break;
    }
  }
  //  QC_19_02 ethnOt
  if (data1.ethnicitySubClass != undefined) {
    for(let [idx,k] of data1[ethnOt].entries()) {
      if (k != 888 && k != 777 && k != undefined && isNaN(k) == false) { //nan false checks for num? add a way to check for non text
        //isNaN(num)         // returns true if the variable does NOT contain a valid number
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${ethnOt}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">ethnOt vlaues should be text, 777= NA or 888=DK. Other numeric data not allowed.</ul>`
      }break;
    }
  }
  //QC_22 raceM (covers QC_02_02)
  console.log("QC 22 raceM")
  let raceMCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 6, 888, "1", "2", "3", "4", "5", "6", "888"], variable = raceM)
  if (data1[raceM] != undefined) {
    if (raceMCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> Valid "raceM" values 
    should be between 1 and 6 or 888.</ul>`
    }
  }
  //QC_22_01
  if (data1[raceM] != undefined) {
    for(let [idx,k] of data1[raceM].entries()) {
      //badCount= []
      if (k === undefined) {
        //badCount.push(k)
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${raceM}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If raceM is missing, update it with 888. Blanks are not allowed in this column.</ul>`
      }break;
      } 
  }
  //for above, list range of inconsitent values, https://stackoverflow.com/questions/29738535/catch-foreach-last-iteration
  //QC_23 raceF
  console.log("QC 23 raceF")
  let raceFCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 6, 888, "1", "2", "3", "4", "5", "6", "888"], variable = raceF)
  if (data1[raceF] != undefined) {
    if (raceFCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> Valid "raceF" values should be between 1 and 6 or 888.</ul>`
    }
  }
  //QC_23_01
  if (data1.raceF != undefined) {
    for(let [idx,k] of data1[raceF].entries()) {
      if (k === undefined) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${raceF}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If raceF is missing, update it with 888. Blanks are not allowed in this column.</ul>`
      }break;
    }
  }
  //QC_25 famHist
  console.log("QC 25 famHist")
  let famHistCheckColumns = checkColumns(validValuesList = [0, 1, 888, "0", "1", "888"], variable = famHist)
  if (data1[famHist] != undefined) {
    if (famHistCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> Valid "famHist" values include 
      family history of  breast cancer in a first degree relative (0=no, 1=yes), 888 = don't know.
       <br>Blank values are not allowed in this variable.</ul>`
    }
  }
  //QC_27 fhnumber
  console.log("QC 27 fhnumber")
  let fhnumberCheckColumns = checkColumnsInt(variable = fhnumber, num = 888) // add way to read str like checkcolumns
  if (data1[fhnumber] != undefined) {
    if (fhnumberCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> Valid "fhnumber" values include 
         integer = number of affected (breast cancer) first degree relatives, 888 = don't know.
        <br>Blank values are not allowed in this variable.</ul>`
    }
  }
  //QC_27 fhscore
  let fhscoreCheckColumns = checkColumnsInt(variable = fhscore, num = 888) // add way to read str like checkcolumns
  if (data1[fhscore] != undefined) {
    if (fhscoreCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> Valid "fhscore" values include 
    1 for each first degree affected relative, 0.5 for second degree, 
    0.25 for third degree (not ovarian for any relative), and 888 = don't know.
       <br>Blank values are not allowed in this variable.</ul>`
    }
  }
  //QC_28 ER_statusIndex
  console.log("QC 28 ER_statusIndex")
  let erCheckColumns = checkColumns(validValuesList = [undefined, 0, 1, 888, "0", "1", "888"], variable = ER_statusIndex)
  //(28_valid_values)
  if (data1[ER_statusIndex] != undefined) {
    if (erCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> Valid "ER_statusIndex" values include 
        0=negative, 1=positive, 888=DK.
        <br>Blank values are allowed for controls in this variable.</ul>` //add AC_26_01 check fro this
    }
  }
  //QC_29 DNA_source
  console.log("QC 29 DNA_source")
  let DNA_sourceCheckColumns = checkColumns(validValuesList = [1, 2, 3, 4, 5, 888, "1", "2", "3", "4", "5", "888"], variable = DNA_source)
  //(29_valid_values)
  if (data1[DNA_source] != undefined) {
    if (DNA_sourceCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> Valid "DNA_source" values include 
      1=whole blood, 2=buccal cell, 3=mouthwash/saliva, 4=other, 5=no DNA, 888=DK.
       <br>Blank values are not allowed in this variable.</ul>`
    }
  }
  //QC_30 DNA_sourceOt
  console.log("QC 30 DNA_sourceOt")
  //(30_valid_values)
  let DNA_sourceOtCheckColumns = checkColumnsTxt(variable = DNA_sourceOt)
  if (data1[DNA_sourceOt] != undefined) {
    if (DNA_sourceOtCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px"> Valid "DNA_sourceOt" values include text. details of how DNA is collected if DNA_source = 4 ('other').
       <br>Blank values are allowed in this variable.</ul>`
    }
  }
  //QC_30_01 DNA_sourceOt
  if (data1.DNA_sourceOt != undefined) {
    for(let [idx,k] of data1[DNA_sourceOt].entries()) {
      if ((k === undefined || /[a-z]/g.test(k) == false) && (data1[DNA_source][idx] == 4)) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${DNA_sourceOt}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If DNA_source = 4 ('other'), provide details of how DNA is collected.</ul>`
      }break;
    }
  }
  //QC 31 (valid_values) StudyTypeOt
  console.log("QC 31 studyTypeOt")
  let studyTypeOtCheckColumns = checkColumnsTxt(variable = studyTypeOt)
  if (data1[studyTypeOt] != undefined) {
    if (studyTypeOtCheckColumns != false) {
      h += `<ul style="color:darkblue;font-size: 12px">Valid "studyTypeOt" values include text. details of studyType.
         <br>Blank values are allowed in this variable.</ul>`
    }
  }
  //QC_31_01 StudyTypeOt
  if (data1.studyTypeOt != undefined) {
    for(let [idx,k] of data1[studyTypeOt].entries()) {
      if ((k === undefined || /[a-z]/g.test(k) == false) && (data1[studyType][idx] == 2)) {
        h += `<p style="color:darkblue;font-size: 12px">Consistency error! Check "${studyTypeOt}" column : </p>` 
        h+=`<ul style="color:darkblue;font-size: 12px">If DNA_source = 2 ('other'), provide details of study type.</ul>`
      }break;
    }
  }
  const checkColumnsList = [studyCheckColumns, statusCheckColumns, erCheckColumns,
    DNA_sourceCheckColumns, DNA_sourceOtCheckColumns, studyTypeOt,
    contrTypeCheckColumns, matchIdCheckColumns, subStudyCheckColumns, studyTypeCheckColumns,
    exclusionCheckColumns, ethnicityClassCheckColumns, raceMCheckColumns, raceFCheckColumns,
    famHistCheckColumns, ageCheckColumnsNum
  ]

  for (i = 0; i < checkColumnsList.length; i++) {
    if (checkColumnsList[i] != false || extraCol.length > 0) {
      alert("Invalid columns or rows found! Please see error report for details.");
      break;
    }
  }
  return h
}