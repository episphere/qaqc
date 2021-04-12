console.log(`connectQC.js loaded at ${Date()}`)

runQAQC=function(data){
    console.log(`connectQC.js runQAQC function ran at ${Date()}`)
    let h=`<p>Table with ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
    h+='<p style="color:blue">List of variables'
    Object.keys(qaqc.data).forEach(k=>{
        h+=`<li style="color:blue">${k} (${qaqc.data[k].length} x ${typeof(qaqc.data[k][0])=='string' ? 'string' : 'number'})</li>`
    })
    h+='</p>'


   

    //  function to convert input text to output array
    'use strict';
    function csvToArray(text) {
        let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
        for (l of text) {
            if ('"' === l) {
                if (s && l === p) row[i] += l;
                s = !s;
            } else if (',' === l && s) l = row[++i] = '';
            else if ('\n' === l && s) {
                if ('\r' === p) row[i] = row[i].slice(0, -1);
                row = ret[++r] = [l = '']; i = 0;
            } else row[i] += l;
            p = l;
        }
        return ret;
    };
    txt = (csvToArray(qaqc.dataTxt));
    test = txt[0].map((_, colIndex) => txt.map(row => row[colIndex]));
    console.log("data", test)

 // define checks - date, valid, pending, etc

 var conceptID = test[0][1]
 var valid= `######## QC ${conceptID} \nQCcheck1 =levels(factor(connectData$"X${conceptID}"))%!in%${conceptID} \nSite_invalid = levels(factor(connectData$"${conceptID}"))[check1]\r\n`
 var date = `######## QC ${conceptID} \n${conceptID} = connectData$"${conceptID}" \n check2 = !grepl("[0-9]?[1-9]-[0-9]?[1-9]-[1-2][0,9][0-9]?[1-9]", ${conceptID})\r\n`

    // run loops
var loop = function(len){   
    var l = 0
        x = valid +"\n" 
    while(l<len){   
        x += valid +"\n"    
        l++;    
      }    
    return x };   

var script = loop(test[0].length-1)
    console.log("script",script);  

 // save qc script as txt
    h+=qaqc.saveQC(script)



    return h
}
   

