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
    var lengthQC = test[0].length-1 
    for (i = 1; i < test[0].length; i++) {
        var conceptID = test[0][i]
        var conceptID2 = test[3][i]
        var crossif = test[4][i]
        var crossthen = test[5][i]

        // run loops to append checks to script
        console.log(test[1][i])
        if (test[1][i] == "valid") {
            // valid value
            var valid = `######## QC ${conceptID} \r\n# valid value check\n${conceptID}= c(${test[2][i]})\nQCcheck1 =which(connectData$"${conceptID}")%!in%${conceptID} \n${conceptID}_invalid = addNA(connectData$"${conceptID}")[QCcheck1]\r\ndf[${i},1]<-paste0("${conceptID}_invalid")"\r\ndf[${i},2]<-paste0(${conceptID}_invalid, collapse=", ")\r\n`
            //date
        } else if (test[1][i] == "date") {
            var valid = `######## QC ${conceptID} \r\n# valid date check\n${conceptID} = connectData$"${conceptID}" \n${conceptID}_date = !grepl("[0-9]?[1-9]-[0-9]?[1-9]-[1-2][0,9][0-9]?[1-9]", ${conceptID})\r\ndf[${i},1]<-paste0("${conceptID}_date")"\r\ndf[${i},2]<-paste0(${conceptID}_date, collapse=", ")\r\n`
            //date time
        } else if (test[1][i] == "dateTime") {
            var valid = `######## QC ${conceptID} \r\n# valid dateTime check\n${conceptID} = connectData$"${conceptID}" \n${conceptID}_date = !grepl("[0-9]?[1-9]-[0-9]?[1-9]-[1-2][0,9][0-9]?[1-9] [0-9]?[1-9]:[0-9]?[1-9]:[0-9]?[1-9]", ${conceptID})\r\ndf[${i},1]<-paste0("${conceptID}_date")"\r\ndf[${i},2]<-paste0(${conceptID}_date, collapse=", ")\r\n`
            //cross valid
        } else if (test[1][i] == "crossValid") {
            var valid = `######## QC ${conceptID} \r\n# cross valid value check\n${conceptID2}= c(${test[4][i]})\nQCcheck1 =which(connectData$"${conceptID}")%!in%${conceptID2} \n${conceptID}_invalid = addNA(connectData$"${conceptID}")[QCcheck1]\r\ndf[${i},1]<-paste0("${conceptID}_invalid")"\r\ndf[${i},2]<-paste0(${conceptID}_invalid, collapse=", ")\r\n`
                                                // checked for NA only!
                                         //r\n# crossValid check\n${conceptID} = connectData$"${conceptID}" \ncheck15_2 = which(connectData$"${conceptID2}" == "${crossif}"")\r\n${conceptID}_cross_null = which(is.na(connectData$"${conceptID}"[check15_2]))\r\ndf[${i},1]<-paste("${conceptID}_cross_null",check15_2)\r\n`
           // pending 
        } else if (test[1][i] == "pending") {
             var valid = `######## QC ${conceptID} \r\n`// pending value check

        } else {
            valid = ""
        }

        script += valid + "\n"
        l++;
    }
// BUILD THE HEADER, SCRIPT AND FOOTER

    var loadData = `# CONNECT QC RULES
    # PURPOSE: TO CHECK FOR INCONSISTENCIES IN DATA FROM CONNECT SITES
    # VERSION: 1.0
    # LAST UPDATED: APRIL 5TH, 2021
    # AUTHOR: LORENA SANDOVAL 
    # EMAIL: SANDOVALL2@NIH.GOV
                        
# set working directory
setwd("C:/Users/sandovall2/Downloads")\r\nconnectData = read.csv("participants_04132021.csv")\r\n`

    var makeDF = `# make qc dataframe\ndf = data.frame(matrix(, nrow=${lengthQC}, ncol=2))\r\nnames(df) = c("QC checks","values")\r\n`

    var saveToBox = `######## SAVE QC SCRIPT TO BOXFOLDER (123) \r\nbox_auth\nbox_auth(client_id = "xoxo" , client_secret = "xoxo")\nbox_write(qc_script, "qc_script_04122021_,dir_id =134691197438)\r\n`
    
    
    // save qc script as txt
    var full_script = loadData + "\n" +  makeDF + script + saveToBox
    h += qaqc.saveQC(full_script)

    return h
}