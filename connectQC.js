console.log(`connectQC.js loaded at ${Date()}`)

runQAQC = function (data) {
    console.log(`connectQC.js runQAQC function ran at ${Date()}`)
    let h = `<p>Table with ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows loaded</p>`
    //h += '<p style="color:blue">List of variables'
    //Object.keys(qaqc.data).forEach(k => {
    //    h += `<li style="color:blue">${k} (${qaqc.data[k].length} x ${typeof(qaqc.data[k][0])=='string' ? 'string' : 'number'})</li>`
    //})
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
    date = test[3][0]
    site = test[5][0]
    table = test[7][0]
    var lengthQC = test[0].length - 1
    for (i = 2; i < test[0].length; i++) {
        var conceptID = test[0][i]
        var conceptID2 = test[3][i]
        var conceptID3 = test[6][i]
        var crossif = test[4][i]
        var crossthen = test[5][i]
        var crossif2 = test[7][i]
        var crossthen2 = test[8][i]
        var valid1 = test[2][i]
        var type = test[1][i]
        // run loops to append checks to script

        // valid value
        if (type == "valid") {
            var valid = `######## QC ${conceptID}\n# valid value check\r\n${conceptID}= c(${valid1})\nQCcheck1 =which(connectData$"${conceptID}"%!in%${conceptID})\n${conceptID}_invalid = addNA(connectData$"${conceptID}")[QCcheck1]\r\ndf[${i},1]<-paste0("${conceptID}_invalid")\ndf[${i},2]<-paste0("${valid1}")\ndf[${i},3]<-paste0(${conceptID}_invalid, collapse=", ")\r\n`

       
        // valid character length
        } else if (type == "char()") {
            var valid = `######## QC ${conceptID}\n# valid character length check\r\nvalid_length= ${valid1}
            \nvar.is.integer =suppressWarnings(testInteger(connectData$"${conceptID}"))\nvariable =connectData$"${conceptID}"
            \nlist_lengths = unique(sapply(variable,nchar))
            \n${conceptID}_invalid_char_length = list_lengths[list_lengths > valid_length]
            \ndf[${i},1]<-paste0("${conceptID}_invalid_char_length")
            \ndf[${i},2]<-paste0("invalid length(s) found:",${conceptID}_invalid_char_length,"all integer value(s) found:",var.is.integer, collapse=", ")\r\n`
            
            // valid numeric length
        } else if (type == "num()") {
            var valid = `######## QC ${conceptID}\n# valid numeric length check\r\nvalid_length= ${valid1}
            \nvar.is.integer =suppressWarnings(testInteger(connectData$"${conceptID}"))\nvariable =connectData$"${conceptID}"
            \nlist_lengths = unique(sapply(variable ,nchar))
            \n${conceptID}_invalid_num_length = list_lengths[list_lengths > valid_length]
            \ndf[${i},1]<-paste0("${conceptID}_invalid_char_length")
            \ndf[${i},2]<-paste0("invalid length(s) found:",${conceptID}_invalid_num_length,"non integer value(s) found:",!var.is.integer, collapse=", ")\r\n`

            // valid age check
        } else if (type == "age") {
            var valid = `######## QC ${conceptID}\n# valid age check\r\n${conceptID} = connectData$"${conceptID}"\n${conceptID}_date_invalid = which(!grepl("^[0-9]{1}[1-9]{1}$|^[1-9]{1}$", ${conceptID}))\n${conceptID}_age_invalid = levels(addNA(connectData$"${conceptID}"[d_471593703_age_invalid]))\r\n
            df[${i},1]<-paste0("${conceptID}_age_check")\ndf[${i},2]<-paste0("1-99")\nndf[${i},3]<-paste0("invalid age(s):",${conceptID}_age_invalid, collapse=", ")\r\n`
    
        
        // valid year check
        } else if (type == "year") {
            var valid = `######## QC ${conceptID}\n# valid year check\r\n${conceptID} = connectData$"${conceptID}"\n${conceptID}_year_invalid = which(!grepl("^[1]{1}[9]{1}[0-9]{1}[0-9]{1}$|^[2]{1}[0]{1}[0-9]{1}[0-9]{1}$", ${conceptID}))\n${conceptID}_age_invalid = levels(addNA(connectData$"${conceptID}"[d_471593703_age_invalid]))\r\n
            df[${i},1]<-paste0("${conceptID}_year_check")\ndf[${i},2]<-paste0("valid year format:[1-2][0,9][0:9][0:9]")\nndf[${i},3]<-paste0("invalid year:",${conceptID}_year_invalid, collapse=", ")\r\n`


            //date
        } else if (type == "date") {
            var valid = `######## QC ${conceptID}\n# valid date check\r\n${conceptID} = connectData$"${conceptID}"\n${conceptID}_date_invalid = which(!grepl("[0-9]?[1-9]-[0-9]?[1-9]-[1-2][0,9][0-9]?[1-9]", ${conceptID}))\n${conceptID}_date2_invalid = levels(addNA(connectData$"${conceptID}"[d_471593703_date_invalid]))\r\n
            df[${i},1]<-paste0("${conceptID}_date")\ndf[${i},2]<-paste0("MMDDYYYY")\nndf[${i},3]<-paste0(${conceptID}_date2_invalid, collapse=", ")\r\n`

            //date time
        } else if (type == "dateTime") {
            var valid = `######## QC ${conceptID}\n# valid dateTime check\r\n${conceptID} = connectData$"${conceptID}"\n${conceptID}_dateTime_invalid = which(!grepl("[0-9]?[1-9]-[0-9]?[1-9]-[1-2][0,9][0-9]?[1-9] [0-9]?[1-9]:[0-9]?[1-9]:[0-9]?[1-9]", ${conceptID}))\n${conceptID}_dateTime2_invalid = levels(addNA(connectData$"${conceptID}"[d_471593703_dateTime_invalid]))\n
            df[${i},1]<-paste0("${conceptID}_dateTime_invalid")\ndf[${i},2]<-paste0("MMDDYYYY 00:00:00")\ndf[${i},3]<-paste0(${conceptID}_dateTime2_invalid, collapse=", ")\r\n`


            // cross valid year check
        } else if (type == "crossValidYear") {
            var valid = `######## QC ${conceptID}\n
            # valid year check\r\n${conceptID} = connectData$"${conceptID}"\n
            ${conceptID}_year_invalid = which(!grepl("^[1]{1}[9]{1}[0-9]{1}[0-9]{1}$|^[2]{1}[0]{1}[0-9]{1}[0-9]{1}$", ${conceptID}))\n
            ${conceptID}_age_invalid = levels(addNA(connectData$"${conceptID}"[d_471593703_age_invalid]))\r\n
           df[${i},1]<-paste0("${conceptID}_year_check")\ndf[${i},2]<-paste0("valid year format:[1-2][0,9][0:9][0:9]")\n
           ndf[${i},3]<-paste0("invalid year:",${conceptID}_year_invalid, collapse=", ")\r\n`

        
            var valid = `######## QC ${conceptID}\n# cross valid year check\n
            ${conceptID}_a = c(${valid1})\n
            ${conceptID}_b = c(${crossthen})\n
            year = "^[1]{1}[9]{1}[0-9]{1}[0-9]{1}$|^[2]{1}[0]{1}[0-9]{1}[0-9]{1}$"
            mylist_a1 =  paste0(rep("connectData$${conceptID2} == "), c(${crossif}), sep =" || ")\n
            mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
            mylist_a3 = str_sub(mylist_a2, end =-5) #remove extra " ||" at the end of string\n
            aa = which(eval(parse(text=mylist_a3))) # remove quotes to make logical expression\n
            mylist_b1 =  paste0(rep("connectData$${conceptID2} != "), c(${crossif}), sep =" || ")\n
            mylist_b2 = str_c(mylist_b1, sep = "", collapse ="") # make many or statements\n
            mylist_b3 = str_sub(mylist_b2, end =-5) #remove extra " ||" at the end of string\n
            bb = which(eval(parse(text=mylist_b3))) # remove quotes to make logical expression\n
            
            QCcheck1 =which(!grepl(year, connectData$"${conceptID}"[aa]))\n
            ${conceptID}_invalid_year = addNA(connectData$"${conceptID}"[QCcheck1])\n
            
            QCcheck2 =which(connectData$"${conceptID}"[bb]%!in%${conceptID}_b)\n
            ${conceptID}_invalid_not_year = addNA(connectData$"${conceptID}"[QCcheck2])\n
            
            df[${i},1]<-paste0("${conceptID}_${conceptID2}_crossinvalidyear_values")\n
            df[${i},2]<-paste0("valid year format:[1-2][0,9][0:9][0:9]")\n
            df[${i},3]<-paste0("invalid year values:",${conceptID}_invalid_year, collapse=", ")\n
            df[${i},4]<-paste0("values that should be blank:",${conceptID}_invalid_not_year, collapse=", ")\n`
            var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";


            //cross valid 
        } else if (type == "crossValid") {
            var valid = `######## QC ${conceptID}\n# cross valid value check\n
            ${conceptID}_a = c(${valid1})\n
            ${conceptID}_b = c(${crossthen})\n
            mylist_a1 =  paste0(rep("connectData$${conceptID2} == "), c(${crossif}), sep =" || ")\n
            mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
            mylist_a3 = str_sub(mylist_a2, end =-5) #remove extra " ||" at the end of string\n
            aa = which(eval(parse(text=mylist_a3))) # remove quotes to make logical expression\n
            mylist_b1 =  paste0(rep("connectData$${conceptID2} != "), c(${crossif}), sep =" || ")\n
            mylist_b2 = str_c(mylist_b1, sep = "", collapse ="") # make many or statements\n
            mylist_b3 = str_sub(mylist_b2, end =-5) #remove extra " ||" at the end of string\n
            bb = which(eval(parse(text=mylist_b3))) # remove quotes to make logical expression\n
            QCcheck1 =which(connectData$"${conceptID}"[aa]%!in%${conceptID}_a)\n
            ${conceptID}_invalid_cross_a = addNA(connectData$"${conceptID}"[QCcheck1])\n
            QCcheck2 =which(connectData$"${conceptID}"[bb]%!in%${conceptID}_b)\n
            ${conceptID}_invalid_cross_b = addNA(connectData$"${conceptID}"[QCcheck2])\n
            df[${i},1]<-paste0("${conceptID}_${conceptID2}_crossinvalid_values")\n
            df[${i},2]<-paste0(${conceptID}_b, collapse=", ")\n
            df[${i},3]<-paste0(${conceptID}_invalid_cross_a, collapse=", ")\n
            df[${i},4]<-paste0(${conceptID}_invalid_cross_b, collapse=", ")\n`
            var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";

            //cross valid #2 (3 levels deep)
        } else if (type == "crossValid2") {
            var valid = `######## QC ${conceptID}\n# cross valid value check #2\n
            ${conceptID}_b = c(${valid1})# b:if cid2 is not relevant\n
            ${conceptID}_a = c(${crossthen2})#a: if cid2 is relevant\n
            mylist_a1 =  paste0(rep("connectData$${conceptID2} == "), c(${crossif}), sep =" || ")\n
            mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
            mylist_a3 = str_sub(mylist_a2, end =-5) #remove extra " ||" at the end of string\n
            mylist_aa1 =  paste0(rep("connectData$${conceptID3} == "), c(${crossif2}), sep =" || ")\n
            mylist_aa2 = str_c(mylist_aa1, sep = "", collapse ="") # make many or statements\n
            mylist_aa3 = str_sub(mylist_aa2, end =-5) #remove extra " ||" at the end of string\n
            mylist_a = paste(mylist_a3, mylist_aa3,sep=" &  ")\n
            aa = which(eval(parse(text=mylist_a))) # remove quotes to make logical expression\n
            mylist_b1 =  paste0(rep("connectData$${conceptID2} != "), c(${crossif}), sep =" || ")\n
            mylist_b2 = str_c(mylist_b1, sep = "", collapse ="") # make many or statements\n
            mylist_b3 = str_sub(mylist_b2, end =-5) #remove extra " ||" at the end of string\n
            mylist_bb1 =  paste0(rep("connectData$${conceptID3} != "), c(${crossif2}), sep =" || ")\n
            mylist_bb2 = str_c(mylist_bb1, sep = "", collapse ="") # make many or statements\n
            mylist_bb3 = str_sub(mylist_bb2, end =-5) #remove extra " ||" at the end of string\n
            mylist_b = paste(mylist_b3, mylist_bb3,sep=" &  ")\n
            bb = which(eval(parse(text=mylist_b))) # remove quotes to make logical expression\n
            QCcheck1 =which(connectData$"${conceptID}"[aa]%!in%${conceptID}_a)\n
            ${conceptID}_invalid_cross2_a = addNA(connectData$"${conceptID}"[QCcheck1])\n
            QCcheck2 =which(connectData$"${conceptID}"[bb]%!in%${conceptID}_b)\n
            ${conceptID}_invalid_cross2_b = addNA(connectData$"${conceptID}"[QCcheck2])\n
            df[${i},1]<-paste0("${conceptID}_${conceptID2}_${conceptID3}_crossinvalid_values2")\n
            df[${i},2]<-paste0(${conceptID}_b, collapse=", ")\n
            df[${i},3]<-paste0(unique(${conceptID}_invalid_cross2_b), collapse=", ")\n
            df[${i},4]<-paste0(unique(${conceptID}_invalid_cross2_a), collapse=", ")\n`
            var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";
            // valid length
        } else if (type == "pin") {
            var valid = `######## QC ${conceptID}\n# missing pin check\r\nmissing_pin_rows = which(is.na(connectData$pin) & !is.na(connectData$studyId) & !is.na(connectData$token) & (connectData$d_512820379==180583933 | connectData$d_512820379==486306141))\ndf[${i},1]<-paste0("missing_pin_rows")\ndf[${i},2]<-paste0(missing_pin_rows, collapse=", ")\r\n`

            // valid length
        } else if (type == "token") {
            var valid = `######## QC ${conceptID}\n# token check\r\nmissing_token_rows = which(is.na(connectData$token) & !is.na(connectData$studyId) & (connectData$d_512820379==180583933 | connectData$d_512820379==854703046 | connectData$d_230663853==353358909))\ndf[${i},1]<-paste0("missing_token_rows")\ndf[${i},2]<-paste0(missing_token_rows, collapse=", ")\r\n`

            // pending 
        } else if (type == "pending") {
            var valid = `######## QC ${conceptID} \r\n` // pending value check

        } else {
            valid = ""
        }

        script += valid 
        l++;
    }
    // BUILD THE HEADER, SCRIPT AND FOOTER

    var loadData = `# Connect ${table} QC rules for ${site}
    # PURPOSE: TO CHECK FOR INCONSISTENCIES IN DATA FROM CONNECT SITE(S)
    # VERSION: 1.0
    # LAST UPDATED: ${date}
    # AUTHOR: LORENA SANDOVAL 
    # EMAIL: SANDOVALL2@NIH.GOV
               
# install.packages("stringr")
# install.packages("dplyr")
library(stringr)
library(dplyr)

# set working directory
setwd("C:/Users/sandovall2/Box/Confluence Project/Confluence Data Platform/R_code_Lorena/Connect Code/BQ_TABLES/pull_site_data")\r\nconnectData = read.csv("HP_Sanford_Kaiser_recruitment_04282021.csv")\r\n# function to exclude rows with specified values\r\n"%!in%" <- function(x,y)!("%in%"(x,y))\r\n# function to check for numeric values\r\ntestInteger <- function(x){test <- all.equal(x, as.integer(x), check.attributes = FALSE)\nif(test == TRUE){ return(TRUE) } else { return(FALSE) }}\r\n`
    var makeDF = `# make qc dataframe\ndf = data.frame(matrix( nrow=${lengthQC}, ncol=4))\nnames(df) = c("QC checks","permissible vlaues in CID1", "invalid values in CID1", "invalid values in CID2")\r\n`
    var filterDF = `######## filter df to show QC errors\nqc_errors = filter(df, (!is.na(df$"invalid values in CID1") |!is.na(df$"invalid values in CID2")))\nqc_errors = filter(qc_errors, (qc_errors$"invalid values in CID1" != "" | qc_errors$"invalid values in CID2" != ""))\nwrite.csv(qc_errors,"qc_${table}_errors_${date}_${site}.csv")\r\n`
    var saveToBox = `######## SAVE QC SCRIPT TO BOXFOLDER (123) \r\nbox_auth()\nbox_auth(client_id = "xoxo" , client_secret = "xoxo")\nbox_write(qc_errors, "${site}_${table}_qc_errors_${date},dir_id =134691197438)\r\n`
    // END QC SCRIPT

    // LIST INSTRUCTIONS FOR USE 
    h += `<p style="color:darkblue;font-size: 13px">Row1 should include: date in column 4, site in column 6 and table in column 8(separated by underscore, if necessary) ie. date: 05042021, site: Sanford, table: recruitment</p>`

    h += `<p style="color:darkblue;font-size: 13px;font-weight:bold" >The loaded rules file should contain 9 columns below row one:</p>`
    h += `<ul style="color:darkblue;font-size: 13px">`

    h += `<li style="color:darkblue;font-size: 13px">ConceptID1 (which should begin with d_, unless it is a non-numeric conceptID)</li>`
    h += `<li style="color:darkblue;font-size: 13px">QCtype (which can include char(enter length),num(enter length) valid, crossValid, crossValid2, date, dateTime, or crossValidDateTime)</li>`
    h += `<li style="color:darkblue;font-size: 13px">range for ConceptID1 values should equal this</li>`
    h += `<li style="color:darkblue;font-size: 13px">unless ConceptID2 (begin with d_)</li>`
    h += `<li style="color:darkblue;font-size: 13px">equals this</li>`
    h += `<li style="color:darkblue;font-size: 13px">then conceptID1 range should equal</li>`
    h += `<il style="color:darkblue;font-size: 13px">and ConceptID3 (begin with d_, if not empty, then column f should be empty)</li>`
    h += `<li style="color:darkblue;font-size: 13px">equals this</li>`
    h += `<li style="color:darkblue;font-size: 13px">then conceptID1 range should equal</li></ul>`

        // save qc script as txt
        var full_script = loadData + "\n" +  makeDF + "\n" + script + filterDF + "\n" + saveToBox
        h += qaqc.saveQC(full_script) 
        h += `<p></p>`
        h += `<p style="color:green;font-size: 13px;font-weight:bold" >Saving the QC script above generates code written in R based on the rules specified in the file loaded above.</p>`
        h += `<p style="color:green;font-size: 13px;font-weight:bold" >The R code produced by the the script, checks for errors in the recruitment table.</p>`
       
    return h
}