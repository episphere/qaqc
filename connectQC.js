console.log(`connectQC.js loaded at ${Date()}`)

runQAQC = function (data) {
    console.log(`connectQC.js runQAQC function ran at ${Date()}`)
    let h = `<p>Table with ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
    h += '<p style="color:blue">List of variables'
    Object.keys(qaqc.data).forEach(k => {
        h += `<li style="color:blue">${k} (${qaqc.data[k].length} x ${typeof(qaqc.data[k][0])=='string' ? 'string' : 'number'})</li>`
    })
    h += '</p>'




    //  function to convert input text to output array
    'use strict';

    function csvToArray(text) {
        let p = '',
            row = [''],
            ret = [row],
            i = 0,
            r = 0,
            s = !0,
            l;
        for (l of text) {
            if ('"' === l) {
                if (s && l === p) row[i] += l;
                s = !s;
            } else if (',' === l && s) l = row[++i] = '';
            else if ('\n' === l && s) {
                if ('\r' === p) row[i] = row[i].slice(0, -1);
                row = ret[++r] = [l = ''];
                i = 0;
            } else row[i] += l;
            p = l;
        }
        return ret;
    };
    txt = (csvToArray(qaqc.dataTxt));
    test = txt[0].map((_, colIndex) => txt.map(row => row[colIndex]));
    console.log("data", test)

    // define checks - date, valid, pending, etc //////////////////////////////////
    var l = 0
    script = ""
    var i;
    for (i = 1; i < test[0].length; i++) {
        var conceptID = test[0][i]

        // run loops to append checks to script
        console.log(test[1][i])
        if (test[1][i] == "valid") {
            var valid = `######## QC ${conceptID} \r\n# valid value check\n${conceptID}= c(${test[2][i]})\nQCcheck1 =levels(factor(connectData$"${conceptID}"))%!in%${conceptID} \nSite_invalid = levels(factor(connectData$"${conceptID}"))[check1]\r\n`

        } else if (test[1][i] == "date") {
            var valid = `######## QC ${conceptID} \r\n# date value check\n${conceptID} = connectData$"${conceptID}" \ncheck2 = !grepl("[0-9]?[1-9]-[0-9]?[1-9]-[1-2][0,9][0-9]?[1-9]", ${conceptID})\r\n`

        } else {
            valid = "######## other QCtype\n"
        }

        script += valid + "\n"
        l++;
    }


    //var script = loop(test[0].length-1)
    console.log("script", script);

    var saveToBox = `######## SAVE QC SCRIPT TO BOXFOLDER (123) \r\nbox_auth(client_id = "627lww8un9twnoa8f9rjvldf7kb56q1m" , client_secret = "gSKdYKLd65aQpZGrq9x4QVUNnn5C8qqm")\nbox_write(106289683820, file=combined, pb = options()$boxr.progress,description = NULL)\r\n`
    // save qc script as txt
    var full_script = script + saveToBox
    h += qaqc.saveQC(full_script)



    return h
}