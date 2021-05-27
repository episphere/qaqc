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
    date = test[4][0]
    site = test[6][0]
    table = test[8][0]
    data_box_file_id = test[10][0]
    save_to_box_folder_id = test[12][0]

    var lengthQC = test[0].length - 1
    for (i = 2; i < test[0].length; i++) {
  
 
        var valid1 = test[3][i]
        var type = test[2][i]

 // check if concept ID starts with a number, if so, add d_
 var str1 = "d_";
 var reg = /^\d+$/;

 if (test[4][i] !== null && reg.test(test[4][i])){
    var conceptID = "d_".concat(test[4][i]);
    str2= test[4][i]
    var conceptID = str1. concat(str2);
} else {
    var conceptID = test[4][i];
}
        if (test[4][i] !== null && reg.test(test[4][i])){
            var conceptID1 = "d_".concat(test[4][i]);
            str2= test[4][i]
            var conceptID = str1. concat(str2);
        }
        if (test[6][i] !== null && reg.test(test[6][i])){
            var conceptID2 = "d_".concat(test[6][i]);
            str2= test[4][i]
            var conceptID = str1. concat(str2);
        }
        if (test[8][i] !== null && reg.test(test[8][i])){
            var conceptID3 = "d_".concat(test[4][i]);
            str2= test[4][i]
            var conceptID = str1. concat(str2);
        }
   
        var conceptID1val = test[5][i]
        var conceptID2val = test[7][i]
        var conceptID3val = test[9][i]
        
        // run loops to append checks to script

         // custom check--------------------------------------------------------------------------------------------------
        if (type == "custom") {
            var valid = `######## QC ${conceptID}\n# missing pin check\n${conceptID}=connectData$"${conceptID}"\r\n
            ${conceptID}_a = ${valid1}

            QCcheck1 =  eval(parse(text=(which("${conceptID1}"))))\n
            QCcheck2 =which(connectData$"${conceptID}"[QCcheck1]%!in%${conceptID}_a)\n
            ${conceptID1}_custom_invalid = addNA(connectData$"${conceptID}"[QCcheck2])\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("pin should be present under condition")\n
            df[${i},4]<-paste0(condition)\n
            df[${i},5]<-paste0(${conceptID}[missing_pin_rows], collapse=", ")\r\n`
        // valid value--------------------------------------------------------------------------------------------------
    } else  if (type == "valid") {
            var valid = `######## QC ${conceptID}\n# valid value check\r\n
            ${conceptID}= c(${valid1})\n
            QCcheck1 =which(connectData$"${conceptID}"%!in%${conceptID})\n
            ${conceptID}_invalid = addNA(connectData$"${conceptID}"[QCcheck1])\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0(toString(${conceptID}))\n
            df[${i},4]<-paste0(toString("${conceptID} != "),toString(${conceptID}),sep=" ")\n
            df[${i},5]<-paste0(${conceptID}_invalid, collapse=", ")
            df[${i},6]<-paste0("not applicable in this QCtype", collapse=", ")\r\n`

       
        // valid equal to or less than character length--------------------------------------------------------------------------------------------------
        } else if (type == "equal to or less than char()") {
            var valid = `######## QC ${conceptID}\n# valid equal to or less than character length check\nvalid_length= ${valid1}
            \nvar.is.integer =suppressWarnings(testInteger(connectData$"${conceptID}"))\nvariable =connectData$"${conceptID}"
            \nlist_lengths = unique(sapply(variable,nchar))
            \n${conceptID}_invalid_char_length = list_lengths[list_lengths > valid_length]
            \ndf[${i},1]<-substr(paste0("${conceptID}"),3,100)
            \ndf[${i},2]<-paste0("${type}",valid_length)
            \ndf[${i},3]<-paste0("char length",${valid1})
            \ndf[${i},4]<-paste0("char length NOT <=",${valid1})
            \ndf[${i},5]<-paste0(${conceptID}_invalid_char_length, collapse=", ")
            df[${i},6]<-paste0("not applicable in this QCtype", collapse=", ")\r\n`

            // valid equal to character length--------------------------------------------------------------------------------------------------
        } else if (type == "equal to char() ") {
            var valid = `######## QC ${conceptID}\n# valid equal to character length check\nvalid_length= ${valid1}
            \nvar.is.integer =suppressWarnings(testInteger(connectData$"${conceptID}"))\nvariable =connectData$"${conceptID}"
            \nlist_lengths = unique(sapply(variable,nchar))
            \n${conceptID}_invalid_char_length = list_lengths[list_lengths != valid_length]
            \ndf[${i},1]<-substr(paste0("${conceptID}"),3,100)
            \ndf[${i},2]<-paste0("${type} ",valid_length)
            \ndf[${i},3]<-paste0("char length",${valid1})
            \ndf[${i},4]<-paste0("char length NOT =",${valid1})
            \ndf[${i},5]<-paste0(${conceptID}_invalid_char_length, collapse=", ")
            df[${i},6]<-paste0("not applicable in this QCtype", collapse=", ")\r\n`
            
            // valid numeric length--------------------------------------------------------------------------------------------------
        } else if (type == "equal to num()") {
            var valid = `######## QC ${conceptID}\n# valid numeric length check\r\n
            variable =connectData$"${conceptID}"
            valid_length= ${valid1}
            list_lengths = unique(sapply(variable ,nchar))
            ${conceptID}_invalid_num_length = list_lengths[list_lengths > valid_length]
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)
            df[${i},2]<-paste0("${type}",${valid1} )
            df[${i},3]<-paste0("Valid length = ",valid_length," Integer = TRUE")
            df[${i},4]<-paste0("Valid length != ",valid_length," | Integer = FALSE")
            if (!is.null(variable)){
                var.is.integer =suppressWarnings(testInteger(connectData$"${conceptID}"))
                df[${i},5]<-paste0("invalid length(s) found:  ",${conceptID}_invalid_num_length)
                df[${i},6]<-paste0("non integer value(s) found:  ",!var.is.integer, collapse=", ")
              }else if (is.null(variable)){ 
                var.is.integer
                df[${i},5]<-NA
                df[${i},6]<-NA}\r\n`

            // valid age check--------------------------------------------------------------------------------------------------
        } else if (type == "age") {
            var valid = `######## QC ${conceptID}\n# valid age check\r\n${conceptID} = connectData$"${conceptID}"\n${conceptID}_date_invalid = which(!grepl("^[0-9]{1}[1-9]{1}$|^[1-9]{1}$", ${conceptID}))\n${conceptID}_age_invalid = levels(addNA(connectData$"${conceptID}"[d_471593703_age_invalid]))\r\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-"numeric age"
            df[${i},4]<-paste0("age !=1-99")\n
            ndf[${i},5]<-paste0("invalid age(s):",${conceptID}_age_invalid, collapse=", ")
            df[${i},6]<-paste0("not applicable in this QCtype", collapse=", ")\r\n`
    
        
        // valid year check--------------------------------------------------------------------------------------------------
        } else if (type == "year") {
            var valid = `######## QC ${conceptID}\n# valid year check\r\n${conceptID} = connectData$"${conceptID}"\n
            ${conceptID}_year_invalid = ${conceptID}[which(!grepl("^[1]{1}[9]{1}[0-9]{1}[0-9]{1}$|^[2]{1}[0]{1}[0-9]{1}[0-9]{1}$", ${conceptID}))]\n
            ${conceptID}_age_invalid = levels(addNA(connectData$"${conceptID}"[d_471593703_age_invalid]))\r\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("valid year format:[1-2][0,9][0:9][0:9]")\n
            df[${i},4]<-paste0("invalid year format found:")\n
            df[${i},5]<-paste0(toString(${conceptID}_year_invalid))
            df[${i},6]<-paste0("not applicable in this QCtype", collapse=", ")\r\n`

            //date--------------------------------------------------------------------------------------------------
        } else if (type == "date") {
            var valid = `######## QC ${conceptID}\n# valid date check\r\n${conceptID} = connectData$"${conceptID}"\n${conceptID}_date_invalid = which(!grepl("[0-9]?[1-9]-[0-9]?[1-9]-[1-2][0,9][0-9]?[1-9]", ${conceptID}))\n${conceptID}_date2_invalid = levels(addNA(connectData$"${conceptID}"[d_471593703_date_invalid]))\r\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("MMDDYYYY")\n
            df[${i},4]<-paste0("date != MMDDYYYY")\n
            ndf[${i},5]<-paste0(${conceptID}_date2_invalid, collapse=", ")
            df[${i},6]<-paste0("not applicable in this QCtype", collapse=", ")\r\n`

            //date time--------------------------------------------------------------------------------------------------
        } else if (type == "dateTime") {
            var valid = `######## QC ${conceptID}\n# valid dateTime check\r\n${conceptID} = connectData$"${conceptID}"\n
            ${conceptID}_dateTime_invalid = which(!grepl("[0-9]?[1-9]-[0-9]?[1-9]-[1-2][0,9][0-9]?[1-9] [0-9]?[1-9]:[0-9]?[1-9]:[0-9]?[1-9]", ${conceptID}))\n
            ${conceptID}_dateTime2_invalid = levels(addNA(connectData$"${conceptID}"[${conceptID}_dateTime_invalid]))\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("MMDDYYYY 00:00:00")\n
            df[${i},4]<-paste0("dateTime != MMDDYYYY 00:00:00")\n
            df[${i},5]<-paste0(${conceptID}_dateTime2_invalid, collapse=", ")
            df[${i},6]<-paste0("not applicable in this QCtype", collapse=", ")\r\n`

            // cross valid year check --------------------------------------------------------------------------------------------------
        } else if (type == "crossValidYear") {
      
            var valid = `######## QC ${conceptID}\n# cross valid year check\n
            year = "^[1]{1}[9]{1}[0-9]{1}[0-9]{1}$|^[2]{1}[0]{1}[0-9]{1}[0-9]{1}$"
            ${conceptID}_a = c(${valid1})\n
            ${conceptID}_b = c(${crossthen})\n
            mylist_a1 =  paste0(rep("connectData$${conceptID2}== "), c(${crossif}), sep =" || ")\n
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
            
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("valid year format:[1-2][0,9][0:9][0:9]")\n
            df[${i},4]<-paste0("invalid year values found in col1 or values found when should be blank in col2:")\n
            df[${i},5]<-paste0(${conceptID}_invalid_year, collapse=", ")\n
            df[${i},6]<-paste0(${conceptID}_invalid_not_year, collapse=", ")\n`
            var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";

            // cross valid equal to or less than char() check --------------------------------------------------------------------------------------------------     
        } else if (type == "crossValid equal to or less than char()") {
            var valid = `######## QC ${conceptID}\n# valid equal to or less than character length check\r\nvalid_length= ${valid1}
         
            ${conceptID}_a = c(${valid1})\n
            ${conceptID}_b = c(${crossthen})\n
            mylist_a1 =  paste0(rep("connectData$${conceptID2}== "), c(${crossif}), sep =" || ")\n
            mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
            mylist_a3 = str_sub(mylist_a2, end =-5) #remove extra " ||" at the end of string\n
            aa = which(eval(parse(text=mylist_a3))) # remove quotes to make logical expression\n
            mylist_b1 =  paste0(rep("connectData$${conceptID2} != "), c(${crossif}), sep =" || ")\n
            mylist_b2 = str_c(mylist_b1, sep = "", collapse ="") # make many or statements\n
            mylist_b3 = str_sub(mylist_b2, end =-5) #remove extra " ||" at the end of string\n
            bb = which(eval(parse(text=mylist_b3))) # remove quotes to make logical expression\n
            
            QCcheck1 =which(connectData$"${conceptID}"[bb]%!in%${conceptID}_a)\n
            ${conceptID}_invalid = addNA(connectData$"${conceptID}"[QCcheck1])\n

            QCcheck2 =connectData$"${conceptID}"[aa])\n
            list_lengths = unique(sapply(QCcheck2,nchar))
            ${conceptID}_invalid_char_length = list_lengths[list_lengths > valid_length]\n
            
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0(${crossthen})\n
            df[${i},4]<-paste0(valid_length)\n
            df[${i},5]<-paste0(${conceptID}_invalid_char_length)\n
            df[${i},6]<-paste0(${conceptID}_invalid)\n`
            var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";
            // cross valid equal to char() check --------------------------------------------------------------------------------------------------  
        } else if (type == "crossValid equal to char()") {
            var valid = `######## QC ${conceptID}\n# cross valid equal to character length check\n
            valid_length= ${valid1}\n
            ${conceptID}_a = c(${valid1})\n
            ${conceptID}_b = c(${crossthen})\n
            mylist_a1 =  paste0(rep("connectData$${conceptID2}== "), c(${crossif}), sep =" || ")\n
            mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
            mylist_a3 = str_sub(mylist_a2, end =-5) #remove extra " ||" at the end of string\n
            aa = which(eval(parse(text=mylist_a3))) # remove quotes to make logical expression\n
            mylist_b1 =  paste0(rep("connectData$${conceptID2} != "), c(${crossif}), sep =" || ")\n
            mylist_b2 = str_c(mylist_b1, sep = "", collapse ="") # make many or statements\n
            mylist_b3 = str_sub(mylist_b2, end =-5) #remove extra " ||" at the end of string\n
            bb = which(eval(parse(text=mylist_b3))) # remove quotes to make logical expression\n
            
            QCcheck1 =which(connectData$"${conceptID}"[bb]%!in%${conceptID}_a)\n
            ${conceptID}_invalid = addNA(connectData$"${conceptID}"[QCcheck1])\n

            QCcheck2 =connectData$"${conceptID}"[aa]\n
            list_lengths = unique(sapply(QCcheck2,nchar))
            ${conceptID}_invalid_char_length = list_lengths[list_lengths == valid_length]\n
            
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0(${crossthen})\n
            df[${i},4]<-paste0(valid_length)\n
            df[${i},5]<-paste0(${conceptID}_invalid_char_length)\n
            df[${i},6]<-paste0(${conceptID}_invalid)\n`
            var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";

             // defaultPassive--------------------------------------------------------------------------------------------------
        } else if (type == "defaultPassive") {
            var valid = `######## QC ${conceptID}\n# default check for passive recruits\n${conceptID}=connectData$"${conceptID}"\r\n
            ${conceptID}_a = c("104430631")\n
            condition1 = "which(connectData$d_230663853=353358909 & connectData$d_512820379=854703046 & connectData$d_919254129=104430631)"
            condition2 =  eval(parse(text=(which(condition))))\n
            ${conceptID}_default_invalid = connectData$"${conceptID}"condition2\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("default is no under condition")\n
            df[${i},4]<-paste0(condition1)\n
            df[${i},5]<-paste0("not applicable in this QCtype", collapse=", ")\r\n`
             // defaultPassive--------------------------------------------------------------------------------------------------
        } else if (type == "defaultActive") {
            var valid = `######## QC ${conceptID}\n# default check for active recruits\n${conceptID}=connectData$"${conceptID}"\r\n
            ${conceptID}_a = c("104430631")\n
            condition1 = "which(!is.na(connectData$studyId) & connectData$d_512820379=486306141 & connectData$d_919254129=104430631)"
            condition2 =  eval(parse(text=(which(condition))))\n
            ${conceptID}_default_invalid = connectData$"${conceptID}"condition\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("default is no under condition")\n
            df[${i},4]<-paste0(condition1)\n
            df[${i},5]<-paste0("not applicable in this QCtype", collapse=", ")\r\n`
    //cross valid1_2 --------------------------------------------------------------------------------------------------
    } else if (type == "crossValid1_2") {
        var valid = `######## QC ${conceptID}\n# cross valid value check - only checks values if condition one is met\n
        ${conceptID}_a = c(${crossthen})\n
        mylist_a1 =  paste0(rep("connectData$${conceptID2} "), c(" ${crossif}"), sep =" || ")\n
        mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
        mylist_a3 = str_sub(mylist_a2, end =-5) #remove extra " ||" at the end of string\n
        aa = which(eval(parse(text=mylist_a3))) # remove quotes to make logical expression\n
        
        QCcheck1 =which(connectData$"${conceptID}"[aa]%!in%${conceptID}_a)\n
        ${conceptID}_invalid_cross_a = addNA(connectData$"${conceptID}"[aa][QCcheck1])\n
        
        df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
        df[${i},2]<-paste0("${type}")\n
        df[${i},3]<-paste0("${crossthen}")\n
        df[${i},4]<-mylist_a3\n
        df[${i},5]<-paste0(${conceptID}_invalid_cross_a, collapse=", ")\n
        df[${i},6]<-paste0("not applicable in this QCtype", collapse=", ")\n`
        var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";

        //cross valid1_3 --------------------------------------------------------------------------------------------------
    } else if (type == "crossValid1_3") {
        var valid = `######## QC ${conceptID}\n# cross valid value check - only checks values if condition one is met\n
            
            ${conceptID}_a = c(${crossthen2})#a: if cid2 is relevant\n
            mylist_a1 =  paste0(rep("connectData$${conceptID2} "), c(${crossif}), sep =" || ")\n
            mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
            mylist_a3 = str_sub(mylist_a2, end =-5) #remove extra " ||" at the end of string\n
            mylist_aa1 =  paste0(rep("connectData$${conceptID3} "), c(${crossif2}), sep =" || ")\n
            mylist_aa2 = str_c(mylist_aa1, sep = "", collapse ="") # make many or statements\n
            mylist_aa3 = str_sub(mylist_aa2, end =-5) #remove extra " ||" at the end of string\n
            mylist_a = paste(mylist_a3, mylist_aa3,sep=" &  ")\n
            aa = which(eval(parse(text=mylist_a))) # remove quotes to make logical expression\n
           
            QCcheck1 =which(connectData$"${conceptID}"[aa]%!in%${conceptID}_a)\n
            ${conceptID}_invalid_cross2_a = addNA(connectData$"${conceptID}"[aa][QCcheck1])\n

            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("${crossthen2}")\n
            df[${i},4]<-mylist_a\n
            df[${i},5]<-paste0(unique(${conceptID}_invalid_cross2_a), collapse=", ")\n
            df[${i},6]<-paste0("not applicable in this QCtype", collapse=", ")\n`
        var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";
            //cross valid --------------------------------------------------------------------------------------------------
        } else if (type == "crossValid") {
            var valid = `######## QC ${conceptID}\n# cross valid value check - checks values if condition one is met and checks values if condition is not met\n
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
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("${crossthen}")\n
            df[${i},4]<-substr(mylist_a3,13,100)\n
            df[${i},5]<-paste0(${conceptID}_invalid_cross_a, collapse=", ")\n
            df[${i},6]<-paste0(${conceptID}_invalid_cross_b, collapse=", ")\n`
            var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";
//cross valid1 --------------------------------------------------------------------------------------------------
} else if (type == "crossValid1") {
    var valid = `######## QC ${conceptID}\n# cross valid value check - checks values if condition one is met and checks values if condition is not met\n
    ${conceptID}_a = c(${valid1})\n

    mylist_a1 =  paste0(rep("connectData$${conceptID2} == "), c(${crossif}), sep =" || ")\n
    mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
    mylist_a3 = str_sub(mylist_a2, end =-5) #remove extra " ||" at the end of string\n
    aa = which(eval(parse(text=mylist_a3))) # remove quotes to make logical expression\n
    
    QCcheck1 =which(connectData$"${conceptID}"[aa]%!in%${conceptID}_a)\n
    ${conceptID}_invalid_cross = addNA(connectData$"${conceptID}"[QCcheck1])\n
   
    df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
    df[${i},2]<-paste0("${type}")\n
    df[${i},3]<-paste0("${valid1}")\n
    df[${i},4]<-substr(mylist_a3,13,100)\n
    df[${i},5]<-paste0(${conceptID}_invalid_cross, collapse=", ")\n`
    var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";

            //cross valid OR--------------------------------------------------------------------------------------------------
        } else if (type == "crossValid_OR") {
            var valid = `######## QC ${conceptID}\n# cross valid value OR check - checks values if condition one is met \n
            ${conceptID}_a = c(${valid1})\n
            mylist_a1 =  paste0(rep("connectData$${conceptID2}"), c("${crossif}"), sep =" || ")\n
            mylist_a2 = paste0(rep("connectData$${conceptID3}"), c("${crossif2}"))\n
            mylist_a3 = paste0(mylist_a1,mylist_a2)
            aa = which(eval(parse(text=mylist_a3))) # remove quotes to make logical expression\n
            
            QCcheck1= which(connectData$"${conceptID}"[aa]%!in%${conceptID}_a)\n
            ${conceptID}_invalid = connectData$"${conceptID2}"[QCcheck1]\n
           
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("${valid1}")\n
            df[${i},4]<-substr(mylist_a3,13,100)\n
            df[${i},5]<-paste0(${conceptID}_invalid, collapse=", ")\n
            df[${i},6]<-paste0("not applicable in this QCtype", collapse=", ")\n`
            var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";

            //cross valid not NA--------------------------------------------------------------------------------------------------
        } else if (type == "crossValidNotNA") {
            var valid = `######## QC ${conceptID}\n# cross valid value check - checks values if condition one is met and checks values if condition is not met\n
            ${conceptID}_a = c(${valid1})\n
            ${conceptID}_b = c(${crossthen})\n
            mylist_a1 =  paste0(rep(c(${crossif}), "(connectData$${conceptID2})"), sep =" || ")\n
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
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("${crossthen}")\n
            df[${i},4]<-substr(mylist_a3,13,100)\n
            df[${i},5]<-paste0(${conceptID}_invalid_cross_a, collapse=", ")\n
            df[${i},6]<-paste0(${conceptID}_invalid_cross_b, collapse=", ")\n`
            var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";

            //cross valid #2 (3 levels deep) ------------------------------------------------------------------------------------
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
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},4]<-mylist_a3\n
            df[${i},5]<-paste0(unique(${conceptID}_invalid_cross2_b), collapse=", ")\n
            df[${i},6]<-paste0(unique(${conceptID}_invalid_cross2_a), collapse=", ")\n`
            var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";
            // valid pin--------------------------------------------------------------------------------------------------
        } else if (type == "missing pin") {
            var valid = `######## QC ${conceptID}\n# missing pin check\n${conceptID}=connectData$"${conceptID}"\r\n
            condition = "is.na(connectData$pin) & !is.na(connectData$studyId) & !is.na(connectData$token) & (connectData$d_512820379==180583933 | connectData$d_512820379==486306141)"
            condition =  eval(parse(text=(which(condition))))\n
            missing_pin_rows = which(is.na(connectData$pin) & !is.na(connectData$studyId) & !is.na(connectData$token) & (connectData$d_512820379==180583933 | connectData$d_512820379==486306141))\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("pin should be present under condition")\n
            df[${i},4]<-paste0(condition)\n
            df[${i},5]<-paste0(${conceptID}[missing_pin_rows], collapse=", ")\r\n`

            // valid token--------------------------------------------------------------------------------------------------
        } else if (type == "missing token") {
            var valid = `######## QC ${conceptID}\n# token check\n${conceptID}=connectData$"${conceptID}"\r\n
            condition = "is.na(connectData$token) & !is.na(connectData$studyId) & (connectData$d_512820379==180583933 | connectData$d_512820379==854703046) | connectData$d_230663853==353358909"
            condition = eval(parse(text=which(condition)))\n
            missing_token_rows = which(is.na(connectData$token) & !is.na(connectData$studyId) & (connectData$d_512820379==180583933 | connectData$d_512820379==854703046) | connectData$d_230663853==353358909)\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("token should be present under condition")\n
            df[${i},4]<-paste0(condition)\n
            df[${i},5]<-paste0(${conceptID}[missing_token_rows], collapse=", ")\r\n`

            // pending --------------------------------------------------------------------------------------------------
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
    # install.packages("boxr")
    # install.packages("dplyr")
    library(boxr)
    library(stringr)
    library(dplyr)
    box_auth(client_id = "627lww8un9twnoa8f9rjvldf7kb56q1m",client_secret =  "gSKdYKLd65aQpZGrq9x4QVUNnn5C8qqm")

# set working directory to read file locally
#setwd("C:/Users/sandovall2/Box/Confluence Project/Confluence Data Platform/R_code_Lorena/Connect Code/BQ_TABLES/pull_site_data")
#connectData = read.csv("HP_Sanford_Kaiser_recruitment_04282021.csv")\n
# or read file from box using the file id number
connectData = box_read(${data_box_file_id})
# filter by site
# HealthPartners = 531629870
# Henry Ford Health System = 548392715
# Kaiser Permanente Colorado = 125001209
# Kaiser Permanente Georgia = 327912200
# Kaiser Permanente Hawaii = 300267574
# Kaiser Permanente Northwest = 452412599
# Marshfiled = 303349821
# Sanford Health = 657167265
# University of Chicago Medicine = 809703864
# National Cancer Institute = 517700004
# Other = 181769837
#connectData = connectData[connectData$d_827220437 == ] 
# function to exclude rows with specified values\r\n"%!in%" <- function(x,y)!("%in%"(x,y))\r\n
# function to check for numeric values\r\n
testInteger <- function(x){test <- all.equal(x, as.integer(x), check.attributes = FALSE)\nif(test == TRUE){ return(TRUE) } else { return(FALSE) }}\r\n`
    var makeDF = `# make qc dataframe\ndf = data.frame(matrix( nrow=${lengthQC}, ncol=6))\n
    names(df) = c("ConceptID","QCtype","valid values","condition", "invalid values found when condition met", "invalid values found when condition not met")\r\n`
    var filterDF = `######## filter df to show QC errors\n
    qc_errors = filter(df, (!is.na(df$"invalid values found when condition met") |!is.na(df$"invalid values found when condition not met")))\n
    qc_errors = filter(qc_errors, (qc_errors$"invalid values found when condition met" != "" | qc_errors$"invalid values found when condition not met" != ""))\n
    qc_errors = filter(qc_errors, ((grepl(pattern="NA",qc_errors$"invalid values found when condition met")| qc_errors$"invalid values found when condition met" != "") & qc_errors$"invalid values found when condition not met" == "not applicable in this QCtype"))\n
    #write.csv(qc_errors,"qc_${table}_errors_${date}_${site}.csv")\r\n`
    var saveToBox = `######## SAVE QC SCRIPT TO BOXFOLDER (123) \r\n#box_write(qc_errors, "${site}_${table}_qc_errors_${date}.csv",dir_id =136441105328)\r\n`
    // END QC SCRIPT

    
        // save qc script as txt
        var full_script = loadData + "\n" +  makeDF + "\n" + script + filterDF + "\n" + saveToBox
        h += qaqc.saveQC(full_script) 
        h += `<p></p>`
        h += `<p style="color:green;font-size: 13px;font-weight:bold" >Saving the QC script above generates code written in R based on the rules specified in the file loaded above.</p>`
        h += `<p style="color:green;font-size: 13px;font-weight:bold" >The R code produced by the the script, checks for errors in the recruitment table.</p>`
       
    return h
}


// ADD BOTTON TO DISPLAY INSTRUCTIONS, https://codepen.io/davidcochran/full/WbWXoa
// Display high level steps
if(document.getElementById('connQC').checked){

    var T = document.getElementById("btnToggle");
    T.style.display = "block";  // <-- Set it to block
        let ele = document.getElementById('connQC1');
        ele.innerHTML += 'STEP 1: load QC rules file above, STEP 2: dowload QC R script ';
        
// add toggle button to show/hide instructions
const toggleArea = document.getElementById('toggleArea')
const btnToggle = document.getElementById('btnToggle')
btnToggle.addEventListener ("click", function() {
    if (toggleArea.classList.contains('active')) {
        toggleArea.classList.remove("active");
        toggleArea.classList.add("disable");
        /////////////////////////////////
    var ele =document.getElementById('connQCtxt');

    // add boxes for date etc
    ele.innerHTML += '<br>'
    ele.innerHTML += '<form action="/action_page.php">'
    ele.innerHTML += '<label for="date">Date:</label>'
    ele.innerHTML += '<input type="text" id="date" name="date"><br><br>'
    ele.innerHTML += '<label for="site">Site:</label>'
    ele.innerHTML += '<input type="text" id="site" name="site"><br><br>'
    ele.innerHTML += '<input type="submit" value="Submit">'
    ele.innerHTML += '</form>'

    // LIST INSTRUCTIONS FOR USE 
    ele.innerHTML += `<p style="color:darkblue;font-size: 13px;font-weight:bold">Rules File:<br>
    Row 1 should include date in column 4<br>
    site in column 6<br>
    table in column 8<br>
    data box file id in column 10<br>
    box folder id to save QC errors to in column 12 (separated by underscore, if necessary)
    ie. 05042021, Sanford, recruitment, 1234, 5678</p>`

    ele.innerHTML += `<p style="color:darkblue;font-size: 13px;font-weight:bold" >The loaded rules file should contain 9 columns with the following column names in row 2:</p>`
    ele.innerHTML += `<ul style="color:darkblue;font-size: 13px">`

    ele.innerHTML += `<li style="color:darkblue;font-size: 13px">ConceptID1 (which should begin with d_, unless it is a non-numeric conceptID)</li>`
    ele.innerHTML += `<li style="color:darkblue;font-size: 13px">QCtype (which can include char(),num() valid, crossValid equal to or less than char(), crossValid, crossValid1, crossValid2, crossValidYear, crossValidAge, date, dateTime, year, or crossValidDateTime)</li>`
    ele.innerHTML += `<li style="color:darkblue;font-size: 13px">range for ConceptID1 values should equal this</li>`
    ele.innerHTML += `<li style="color:darkblue;font-size: 13px">unless ConceptID2 (begin with d_)</li>`
    ele.innerHTML += `<li style="color:darkblue;font-size: 13px">equals this</li>`
    ele.innerHTML += `<li style="color:darkblue;font-size: 13px">then conceptID1 range should equal</li>`
    ele.innerHTML += `<il style="color:darkblue;font-size: 13px">and ConceptID3 (begin with d_, if not empty, then column f should be empty)</li>`
    ele.innerHTML += `<li style="color:darkblue;font-size: 13px">equals this</li>`
    ele.innerHTML += `<li style="color:darkblue;font-size: 13px">then conceptID1 range should equal</li></ul>`
    ele.innerHTML += `<br>`
        
} else {
    toggleArea.classList.remove("disable");
    toggleArea.classList.add("active");
    document.getElementById('connQCtxt').innerHTML = "";
}
});
}



/* Read 

https://css-tricks.com/use-button-element/
*/
        
