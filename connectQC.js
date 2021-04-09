const { Console } = require("console")

console.log(`connectQC.js loaded at ${Date()}`)

runQAQC=function(data){
    console.log(`connectQC.js runQAQC function ran at ${Date()}`)
    let h=`<p>Table with ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
    h+='<p style="color:blue">List of variables'
    Object.keys(qaqc.data).forEach(k=>{
        h+=`<li style="color:blue">${k} (${qaqc.data[k].length} x ${typeof(qaqc.data[k][0])=='string' ? 'string' : 'number'})</li>`
    })
    h+='</p>'
    h+=qaqc.saveFile(JSON.stringify(qaqc.data))
    //debugger
    // ...




    // CONVERT qaqc.dataTXT TO ARRAY

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

    test = csvToArray(qaqc.dataTXT)
    console.log(test)


    return h
}

