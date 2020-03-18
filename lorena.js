console.log(`lorena.js ran at ${Date()}`)

runQAQC=function(data){
    console.log(`lorena.js runQAQC function ran at ${Date()}`)


let h=`<p style= "color:red; font-weight:bold">Successfully uploaded: table with ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
      h += `<p></p>`

      //check which variables have not been uploaded
      //https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
      var upCol=[]
      var allCol=["UniqueID", "PersonID", "Study", "contrType", "Status", "DNA_source", "DNA_sourceOt", "matchId", "SubStudy", "Studytype", "StudytypeOt", "Exclusion", "AgeInt", "intDate", "intDate_known", "intDay", "intMonth", "intYear", "refMonth", "refYear", "AgeDiagIndex", "Sex", "EthnicityClass", "EthnicitySubClass", "ethnOt", "raceM", "raceF", "FamHist", "Fhnumber", "Fhscore", "ER_statusIndex"]

      for (var [key, value] of Object.entries(qaqc.data)) {
          upCol.push(key)
        }
        acceptedCol=upCol.filter(x => allCol.includes(x)) // accepted columns with proper names, need to loop through these for checks - Lorena


        function difference(a1, a2) {
          var a2Set = new Set(a2);
          return a1.filter(function(x) { return !a2Set.has(x); })
        }

        var failedUpCol=difference(upCol, acceptedCol)
        if (failedUpCol.length>0){
          alert("Failed to upload! Please see error report for details.")
          var failed_str= " The following "+ failedUpCol.length + " column(s) rejected:"
          h +=`<p style= "color:red">ERROR: ${failed_str}</p>`//${upCol.join(", ")}
          h +=`<ul style= "color:red"> ${failedUpCol.join(", ")}</ul>`
          h +=`<ul style= "color:red;font-size: 10px">Variable options: ${allCol.join(", ")}</ul>`

        } else{
           var failed_str = ""
        }

        //
        // Embedded spaces or special characters are not allowed.
        //
        // Supplementary characters are not allowed.

      //if less collumns accepted than uploaded, indicate why (ie column names not in correct format. rows not in format)
      // if more than 31 columns uploaded, indicate error? (ie 33 columns with 31 of the variables needed

      //https://zellwk.com/blog/looping-through-js-objects/ looping through object
        const keys=Object.keys(qaqc.data)
        const values=[]
        for(var i =0; i<keys.length; i++ ){
            var key = keys[i]
            values[i]= qaqc.data[key]
            for (j=0; j < upCol.length; j++ ){
               if(key==acceptedCol[j]){
                //h +=`<p style= "color:red">${key} : ${qaqc.data[key]}</p>`// accepted columns and rows
                }
                  for (a=0; a< qaqc.data[key].length; a++){
                    //console.log(qaqc.data[key][a])

                    if (qaqc.data[key][a]===undefined && key===acceptedCol[j] ) {
                        h +=`<p style= "color:red">ERROR: Empty value(s) found in ${key} column </p>`
                        h +=`<ul style= "color:red">Missing values should be listed as 777 </ul>`

                  }{ break; }
                }
        }
      }
      //for (const col  of upCol){
      //  values.forEach((row) =>console.log(row))

      // check for missing values in each column


            // https://www.webdeveloper.com/d/77256-strip-double-quotes-of-beginning-and-end-of-string
            // String.prototype.unquoted = function (){return this.replace (/(^")|("$)/g, '')}
              //
                                // for (c=0; c < Object.keys(qaqc.data).length; c++) {
                                //   //(Object.values(qaqc.data)[c]===qaqc.data[Object.keys(data)[0]])
                                //   var oneCol=((Object.values(qaqc.data)[c]))//===qaqc.data[Object.keys(data)[0]]))
                                //   console.log(oneCol.every(el => el === "")) // true
                                //
                                // //https://zellwk.com/blog/looping-through-js-objects/ looping through object
                                //
                                //   }

      //columns will be called by name, not column number, need to list columns not uploaded
      h +=`<p style= "font-weight:bold"> INPUT FILE REQUIREMENTS: 6  data groups consisting of up to 31 columns in the following format</p>`
      h += `<p style="font-size: 10px">Example input files available via the "Download Example Input Files" link on the left panel.<p/>`
                    //Hover to display text? https://codepen.io/Paulie-D/pen/OVRJBx
      h += `<p>ID column names (12):<p/>`
        h += `<li>UniqueID</li>` // unique person identifier (Concatenation of Study Acronym, "-", and PersonID)
        h += `<li>PersonID</li>` //Check whether PersonID is unique within each study: for a few studies this is not the case, for one study this variable was missing; however, since UniqueID is unique for all studies, nothing needs to be changed
        h += `<li>Study</li>` //assigned by study, (1) not null
        h += `<li>contrType</li>` // 1=population-based, 2=hospital-based, 3=family-based, 4=blood donor, 5 =nested case-control, 6=BRCA1/2 carrier without bc, 777=NA=not applicable (for cases), 888=DK=don't know, (1) if contrType = 777, then status should NOT be 0,
                                  //(2) if contrType ≠ 777 or 888, then status should be 0 or 9, (3) if status = 0 and contrtype is missing, update contrType with 888 or the correct contrtype. (4) if contrType is missing or 888 and status = 1, 2, or 3, update contrType with 777
                                  //(5) ContrType should not be left blank, highlight those records to centre if both controlType and status are missing

        h += `<li>Status</li>` //**ADD SPECIFIC CHECKS**  0=control, 1=invasive case, 2=in-situ case, 3=case unknown invasiveness, 9=excluded sample
        h += `<li>DNA_source</li>` //1=whole blood, 2=buccal cell, 3=mouthwash/saliva, 4=other, 5=no DNA, 888=DK
        h += `<li>DNA_sourceOt</li>` // (1)if DNA_source = 888 then DNA_sourceOt = 888, (2) if DNA_source = 4 ('other'), DNA_sourceOt = text details of how DNA is collected (numberic data are not allowed)
        h += `<li>matchId</li>` //**ADD SPECIFIC CHECKS**  777=NA, 888=DK
        h += `<li>SubStudy</li>` //**ADD SPECIFIC CHECKS** 777=NA, 888=DK
        h += `<li>Studytype</li>` // 0='sporadic' (population or hospital based), 1='familial' (clinical genetic centre based), 2=other, 777=control, 888=DK, (1) if status=0 then StudyType should be 777
        h += `<li>StudytypeOt</li>` // (1)if Studytype = 888 then StudytypeOt = 888, (2) if Studytype = 2 ('other'), StudytypeOt = text details of study type (numberic data are not allowed)
        h += `<li>Exclusion</li>` //**ADD SPECIFIC CHECKS**  0=include, 5=no phenotypic data, 6=other, 7=non-breast carcinoma (e.g. sarcoma), 8=duplicate sample, 888=DK

      h += `<p></p>`
      h += `<p>Age column names (9):<p/>`
        h += `<li>AgeInt</li>` // **ADD SPECIFIC CHECKS**  years, 888=DK
        h += `<li>intDate</li>` // dd/mm/yyyy, 08/08/8000=DK
        h += `<li>intDate_known</li>` //**ADD SPECIFIC CHECKS**
        h += `<li>intDay</li>` //**ADD SPECIFIC CHECKS**
        h += `<li>intMonth</li>` //**ADD SPECIFIC CHECKS**
        h += `<li>intYear</li>` //**ADD SPECIFIC CHECKS**
        h += `<li>refMonth</li>` //**ADD SPECIFIC CHECKS**
        h += `<li>refYear</li>` //**ADD SPECIFIC CHECKS**
        h += `<li>AgeDiagIndex</li>` //**ADD SPECIFIC CHECKS**

      h += `<p></p>`
      h += `<p>Sex column name (1):<p/>`
        h += `<li>sex</li>`//**ADD SPECIFIC CHECKS**

      h += `<p></p>`
      h += `<p>Ethnicity column names (3): <p/>`
        h += `<li>EthnicityClass</li>` //**ADD SPECIFIC CHECKS**
        h += `<li>EthnicitySubClass</li>` //1=Northern European, 2=Southern European, 3=Western European, 4=Eastern European, 5=American European, 6=Hispanic American, 7=African (Africa), 8=Carribbean African, 9=American African, 10=Indian, 11=Pakistani, 12=East and West Bengali, 13=Chinese, 14=Malaysian Peninsula, 15=Japanese, 16=Other (including 'mixed race'), 888=DK
        h += `<li>ethnOt</li>` //(1) if EthnicityClass = 888 then ethnOt = 888, (2) if Ethnicityclass = 16 ('other'), ethOt= text details of ethnicity (numberic data are not allowed)

      h += `<p></p>`
      h += `<p>Family history column names (3): <p/>`
        h += `<li>FamHist</li>` //**ADD SPECIFIC CHECKS**
        h += `<li>Fhnumber</li>` //**ADD SPECIFIC CHECKS**
        h += `<li>Fhscore</li>` //**ADD SPECIFIC CHECKS**

      h += `<p></p>`
      h += `<p>ER status column name (1): <p/>`
        h += `<li>ER_statusIndex</li>` //**ADD SPECIFIC CHECKS**

    // //Col 2 BCAC_ID array
    // for (i = 0; i < Object.entries(qaqc.data)[1][1].length; i++) {
    //   console.log(Object.entries(qaqc.data)[1][1][i])
    //   if (Object.entries(qaqc.data)[1][1][i] === "") {
    //     alert("Check column BCAC_ID for missing entry")

        h += '</p>'
        // json= qaqc.csvJSON(qaqc.dataTxt)
        // console.log(json)
        // console.log(JSON.stringify(qaqc.data,null,2))
        // // h += qaqc.saveFile(JSON.stringify(json))
        // age= data["ageInt"]
        //
        // var obj = {};
        // age.forEach(function(value, idx) {
        //   obj['ageInt' + ( idx + 1)] = value
        // });
        // arr= []
        // obj1 = arr.push(obj)
        // //json= qaqc.csvJSON(qaqc.dataTxt)
        // console.log(obj)
        // console.log(JSON.stringify(obj,null,2))
        // h += qaqc.saveFile(JSON.stringify(obj))
//https://stackoverflow.com/questions/2693021/how-to-count-javascript-array-objects
        function objectLength(obj) {
          var result = 0;
          for(var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
            // or Object.prototype.hasOwnProperty.call(obj, prop)
              result++;
            }
          }
          return result;
        }
        objectLength(qaqc.data); // for your example, 3 or
        Object.keys(qaqc.data).length;

        for (let [key, value] of Object.entries(qaqc.data)) {
  console.log(`${key}: ${value}`);
}
// https://stackoverflow.com/questions/19260472/use-object-name-in-javascript-loop-of-array
        var data = qaqc.data
        var arr=[]
        var ob = {}
  for (let [k, v] of Object.entries(data)) {

   for (index in v){
            ob[k]= data[k][index]
            console.log(k, ":", data[k][index])
      }
    }
    arr.push(ob)
        console.log(arr)

        // // https://stackoverflow.com/questions/19260472/use-object-name-in-javascript-loop-of-array
        //         var arr=[]
        //         var ob = {}
        //
        //         while(i <17){
        //           for (a=0; a < qaqc.data[i].length; a++){
        //
        //             ob[i]= qaqc.data[i][a]
        //             i= i+1
        //             console.log(i, ":", qaqc.data[i][a])
        //             console.log(ob)
        //             }
        //       }
        //           arr.push(ob)
        //         console.log(arr)
        //console.log(arr)
        //debugger
        // ...
        return h
    }
// }
// for (const col in qaqc.data){
//     if (col.indexOf("") > -1) {
//       missing=""
//       h +=`<p style= "color:red">${col} column has missing data<p>`
// }
