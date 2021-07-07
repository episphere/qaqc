console.log(`connectQC.js loaded at ${Date()}`)


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



    //save Site and Date from textbox as variable
    // var dateVar = document.getElementById("date").value;
    // var siteVar = document.getElementById("site").value;
    // var siteDataVar = document.getElementById("siteData").value;
    
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

        if (test[1][i] !== null && reg.test(test[1][i])){
            str= test[1][i]
            var conceptID = str1. concat(str);
        }else {    // only add d_ to numeric variables, and not pin, token and studyId
            var conceptID = test[1][i]}

        if (test[4][i] !== null && reg.test(test[4][i])){
            str4= test[4][i]
            var conceptID1 = str1. concat(str4);
        }else {    // only add d_ to numeric variables, and not pin, token and studyId
            var conceptID1 = test[1][i]}

        if (test[6][i] !== null && reg.test(test[6][i])){
            str6= test[6][i]
            var conceptID2 = str1. concat(str6);
            console.log(conceptID2)
        }else {    // only add d_ to numeric variables, and not pin, token and studyId
            var conceptID2 = test[1][i]}    

        if (test[8][i] !== null && reg.test(test[8][i])){
            str8= test[8][i]
            var conceptID3 = str1. concat(str8);
        }else {    // only add d_ to numeric variables, and not pin, token and studyId
            var conceptID3 = test[1][i]}
   
        var conceptID1val = test[5][i]
        var conceptID2val = test[7][i]
        var conceptID3val = test[9][i]
        
        // run loops to append checks to script

         // custom check--------------------------------------------------------------------------------------------------
        if (type == "custom") {
            var valid = `######## QC ${conceptID}\n# missing pin check\n${conceptID}=connectData$"${conceptID}"\r\n
            ${conceptID}_a = c("${valid1}")\n

            QCcheck1 =  eval(parse(text="${conceptID1val}"))\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("${valid1}")\n
            df[${i},4]<-paste0("${conceptID1}")\n
            df[${i},5]<-paste0(QCcheck1, collapse=", ")\r\n`
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
            \r\n`

       
        // valid equal to or less than character length--------------------------------------------------------------------------------------------------
        } else if (type == "NA or equal to or less than char()") {
            var valid = `######## QC ${conceptID}\n# valid NA or equal to or less than character length check\nvalid_length= ${valid1}
            \nvariable =connectData$"${conceptID}"
            \nlist_lengths = unique(sapply(variable,nchar))
            \n${conceptID}_invalid_char_length = list_lengths[list_lengths > valid_length & !is.na(list_lengths)]
            \ndf[${i},1]<-substr(paste0("${conceptID}"),3,100)
            \ndf[${i},2]<-paste0("${type}",valid_length)
            \ndf[${i},3]<-paste0("char length",${valid1})
            \ndf[${i},4]<-paste0("char length NOT <=",${valid1})
            \ndf[${i},5]<-paste0(${conceptID}_invalid_char_length, collapse=", ")
            \r\n`

            // valid equal to character length--------------------------------------------------------------------------------------------------
        } else if (type == "NA or equal to char()") {
            var valid = `######## QC ${conceptID}\n# valid NA or equal to character length check\nvalid_length= ${valid1}\n
            variable =connectData$"${conceptID}"\n
            list_lengths = unique(sapply(variable,nchar))\n
            ${conceptID}_invalid_char_length = list_lengths[list_lengths != valid_length & !is.na(list_lengths)]\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type} ",valid_length)\n
            df[${i},3]<-paste0("char length",${valid1})\n
            df[${i},4]<-paste0("char length NOT =",${valid1})\n
            df[${i},5]<-paste0(${conceptID}_invalid_char_length, collapse=", ")\r\n`
            
             // valid range character length--------------------------------------------------------------------------------------------------
        } else if (type == "NA or range char()") {
            var valid = `######## QC ${conceptID}\n# valid NA or range length check\n
            valid_length= strsplit(${valid1})\n
            valid_length_min = valid_length[[1]][1]\n
            valid_length_max = valid_length[[1]][2]\n
            variable =connectData$"${conceptID}"\n
            list_lengths = unique(sapply(variable,nchar))\n
            ${conceptID}_invalid_char_length = list_lengths[list_lengths < valid_length_min | list_lengths > valid_length_max & !is.na(list_lengths)]\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type} ",valid_length)\n
            df[${i},3]<-paste0("char length rnage",${valid1})\n
            df[${i},4]<-paste0("char length range NOT =",${valid1})\n
            df[${i},5]<-paste0(${conceptID}_invalid_char_length, collapse=", ")\r\n`
            
            // valid numeric length--------------------------------------------------------------------------------------------------
        } else if (type == "NA or equal to num()") {
            var valid = `######## QC ${conceptID}\n# valid NA or numeric length check\r\n
            variable =connectData$"${conceptID}"\n
            valid_length= ${valid1}\n
            list_lengths = unique(sapply(variable ,nchar))\n
            ${conceptID}_invalid_num_length = list_lengths[list_lengths > valid_length & !is.na(list_lengths)]\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}",${valid1} )\n
            df[${i},3]<-paste0("Valid length = ",valid_length," Integer = TRUE")\n
            df[${i},4]<-paste0("Valid length != ",valid_length," | Integer = FALSE")\n
            if (!is.null(variable)){
                var.is.integer =suppressWarnings(testInteger(connectData$"${conceptID}"))
                df[${i},5]<-paste0("invalid length(s) found:  ",${conceptID}_invalid_num_length,"non integer value(s) found:  ",!var.is.integer, collapse=", ")
              }else if (is.null(variable)){ 
                var.is.integer
                df[${i},5]<-NA\r\n`

            // valid age check--------------------------------------------------------------------------------------------------
        } else if (type == "age") {
            var valid = `######## QC ${conceptID}\n# valid age check\r\n
            ${conceptID} = connectData$"${conceptID}"\n
            ${conceptID}_date_invalid = which(!grepl("^[1-9][0-9]?$|^100$", ${conceptID}) & !is.na(${conceptID}))\n
            ${conceptID}_age_invalid = levels(addNA(connectData$"${conceptID}"[d_471593703_age_invalid]))\r\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-"numeric age"
            df[${i},4]<-paste0("age !=1-99")\n
            ndf[${i},5]<-paste0("invalid age(s):",${conceptID}_age_invalid, collapse=", ")\r\n`
    
        
        // valid year check--------------------------------------------------------------------------------------------------
        } else if (type == "year") {
            var valid = `######## QC ${conceptID}\n# valid year check\r\n${conceptID} = connectData$"${conceptID}"\n
            ${conceptID}_year_invalid = ${conceptID}[which(!grepl("^[1]{1}[9]{1}[0-9]{1}[0-9]{1}$|^[2]{1}[0]{1}[0-9]{1}[0-9]{1}$" & !is.na(${conceptID}), ${conceptID}))]\n
            ${conceptID}_age_invalid = levels(addNA(connectData$"${conceptID}"[d_471593703_age_invalid]))\r\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("valid year format:[1-2][0,9][0:9][0:9]")\n
            df[${i},4]<-paste0("invalid year format found:")\n
            df[${i},5]<-paste0(toString(${conceptID}_year_invalid))\r\n`

        //date--------------------------------------------------------------------------------------------------
        } else if (type == "NA or date") {
            var valid = `######## QC ${conceptID}\n# valid date check\r\n${conceptID} = connectData$"${conceptID}"\n
            ${conceptID}_date_invalid = which(!grepl("[1-2][0,9][0-9]?[1-9][0-9]?[1-9][0-9]?[0-9]", ${conceptID}) & !is.na(connectData$${conceptID}))\n
            ${conceptID}_date2_invalid = connectData$"${conceptID}"[${conceptID}_date_invalid]\r\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("YYYYMMDD")\n
            df[${i},4]<-paste0("date != MMDDYYYY")\n
            df[${i},5]<-paste0(${conceptID}_date2_invalid, collapse=", ")\r\n`

        //date time--------------------------------------------------------------------------------------------------
        } else if (type == "NA or dateTime") {
            var valid = `######## QC ${conceptID}\n# valid dateTime check\r\n${conceptID} = connectData$"${conceptID}"\n
            ${conceptID}_dateTime_invalid = which(!grepl("[1-2][0,9][0-9]?[0-9]-[0-9]?[1-9]-[0-9]?[0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9]", ${conceptID}) & !is.na(connectData$${conceptID}) )\n
            ${conceptID}_dateTime2_invalid = addNA(connectData$"${conceptID}"[${conceptID}_dateTime_invalid])\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("MMDDYYYY 00:00:00")\n
            df[${i},4]<-paste0("dateTime != YYYY-MM-DD 00:00:00")\n
            df[${i},5]<-paste0(${conceptID}_dateTime2_invalid, collapse=", ")\r\n`


        //cross valid1 --------------------------------------------------------------------------------------------------
        } else if (type == "crossValid1") {
            var valid = `######## QC ${conceptID}\n# cross valid value check - checks values if condition one is met and checks values if condition is not met\n
            ${conceptID}_a = c(${valid1})\n

            mylist_a1 =  paste0(rep("connectData$${conceptID1} == "), c(${valid1}), sep =" || ")\n
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
    
    QCcheck1 =which(!grepl(year, connectData$"${conceptID}"[aa]))\n
    ${conceptID}_invalid_year = addNA(connectData$"${conceptID}"[QCcheck1])\n
    
    df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
    df[${i},2]<-paste0("${type}")\n
    df[${i},3]<-paste0("valid year format:1900 to present")\n
    df[${i},4]<-paste0("invalid year values found in col1 or values found when should be blank in col2:")\n
    df[${i},5]<-paste0(${conceptID}_invalid_year, collapse=", ")\n`
    var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";

    // cross valid age check --------------------------------------------------------------------------------------------------
} else if (type == "crossValidAge") {
      
    var valid = `######## QC ${conceptID}\n# cross valid age check\n
    age = "^[1-9][0-9]?$|^100$"
    ${conceptID}_a = c(${valid1})\n
    ${conceptID}_b = c(${crossthen})\n
    mylist_a1 =  paste0(rep("connectData$${conceptID2}== "), c(${crossif}), sep =" || ")\n
    mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
    mylist_a3 = str_sub(mylist_a2, end =-5) #remove extra " ||" at the end of string\n
    aa = which(eval(parse(text=mylist_a3))) # remove quotes to make logical expression\n
    
    QCcheck1 =which(!grepl(age, connectData$"${conceptID}"[aa]))\n
    ${conceptID}_invalid_age = addNA(connectData$"${conceptID}"[QCcheck1])\n
    
    df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
    df[${i},2]<-paste0("${type}")\n
    df[${i},3]<-paste0("ages 1:99")\n
    df[${i},4]<-paste0("invalid ages found")\n
    df[${i},5]<-paste0(${conceptID}_invalid_age, collapse=", ")\n`
    var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";
 // cross valid num check --------------------------------------------------------------------------------------------------
} else if (type == "crossValidNum") {
      
    var valid = `######## QC ${conceptID}\n# cross valid num check for numbers above zero\n
    num = "grepl("[0-9]", data1) & data1>0"
    ${conceptID}_a = c(${valid1})\n
    ${conceptID}_b = c(${crossthen})\n
    mylist_a1 =  paste0(rep("connectData$${conceptID2}== "), c(${crossif}), sep =" || ")\n
    mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
    mylist_a3 = str_sub(mylist_a2, end =-5) #remove extra " ||" at the end of string\n
    aa = which(eval(parse(text=mylist_a3))) # remove quotes to make logical expression\n
    
    QCcheck1 =which(!grepl(num, connectData$"${conceptID}"[aa]))\n
    ${conceptID}_invalid_num = addNA(connectData$"${conceptID}"[QCcheck1])\n
    
    df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
    df[${i},2]<-paste0("${type}")\n
    df[${i},3]<-paste0("numbers above zero")\n
    df[${i},4]<-paste0("invalid values found")\n
    df[${i},5]<-paste0(${conceptID}_invalid_num, collapse=", ")\n`
    var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";

        //cross valid1 equal to char()--------------------------------------------------------------------------------------------------
        } else if (type == "crossValid1 equal to char()") {
            var valid = `######## QC ${conceptID}\n# cross valid equal to char() check - checks values if condition one is met and checks values if condition is not met\n
            ${conceptID}_a = c(${conceptID1val})\n

            mylist_a1 =  paste0(rep("connectData$${conceptID1} == "), c(${conceptID1val}), sep =" || ")\n
            mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
            mylist_a3 = str_sub(mylist_a2, end =-5) #remove extra " ||" at the end of string\n
            aa = which(eval(parse(text=mylist_a3))) # remove quotes to make logical expression\n
            
            valid_length= c(${valid1})\n
                #################var.is.integer =suppressWarnings(testInteger(connectData$"${conceptID}"[aa]))\n
                variable =connectData$"${conceptID}"[aa]\n
                list_lengths = unique(sapply(variable,nchar))\n
                ${conceptID}_invalid_char_length = list_lengths[list_lengths != valid_length]
        
                ${conceptID}_invalid_char_length = list_lengths[list_lengths != valid_length]
                \ndf[${i},1]<-substr(paste0("${conceptID}"),3,100)
                \ndf[${i},2]<-paste0("${type} ",valid_length)
                \ndf[${i},3]<-paste0("char length",${valid1})
                \ndf[${i},4]<-paste0("char length NOT =",${valid1})
                \ndf[${i},5]<-paste0(${conceptID}_invalid_char_length, collapse=", ")\r\n`
            var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";
            //cross valid1 equal to char()--------------------------------------------------------------------------------------------------
        } else if (type == "crossValid1 equal to or less than char()") {
            var valid = `######## QC ${conceptID}\n# cross valid equal to or less than char() check - checks values if condition one is met and checks values if condition is not met\n
            ${conceptID}_a = c(${conceptID1val})\n

            mylist_a1 =  paste0(rep("connectData$${conceptID1} == "), c(${conceptID1val}), sep =" || ")\n
            mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
            mylist_a3 = str_sub(mylist_a2, end =-5) #remove extra " ||" at the end of string\n
            aa = which(eval(parse(text=mylist_a3))) # remove quotes to make logical expression\n
            
            valid_length= c(${valid1})\n
                var.is.integer =suppressWarnings(testInteger(connectData$"${conceptID}"[aa]))\n
                variable =connectData$"${conceptID}[aa]"\n
                list_lengths = sapply(variable,nchar)\n
                ${conceptID}_invalid_char_length = list_lengths[list_lengths > valid_length]
        
                ${conceptID}_invalid_char_length = list_lengths[list_lengths > valid_length]
                \ndf[${i},1]<-substr(paste0("${conceptID}"),3,100)
                \ndf[${i},2]<-paste0("${type} ",valid_length)
                \ndf[${i},3]<-paste0("char length",${valid1})
                \ndf[${i},4]<-paste0("char length NOT =",${valid1})
                \ndf[${i},5]<-paste0(${conceptID}_invalid_char_length, collapse=", ")\r\n`
            var valid = valid.replace(/(\r\n|\r)/gm," ")+ "\r\n";
        }  else {
            var valid = ""}
        script += valid 
        l++;
    }
    console.log("test 273 row")


    // add boxes for date, site name and site data
    let ele = document.getElementById('connQC1');
    ele.innerHTML += '<br>'
    ele.innerHTML += '<form action="/action_page.php">'
    ele.innerHTML += '<label for="date">Date:</label>'
    ele.innerHTML += '<input type="text" id="date" name="date"><br><br>'
    ele.innerHTML += '<label for="site">Site:</label>'
    ele.innerHTML += '<input type="text" id="site" name="site"><br><br>'
    ele.innerHTML += '<label for="siteData">Site data boxid:</label>'
    ele.innerHTML += '<input type="text" id="siteData" name="siteData"><br><br>'
    //ele.innerHTML += '<input type="submit" value="Submit">' don't need a submit button to get textbox data
    ele.innerHTML += '</form>'

    site=document.getElementById("site")
    site.onkeyup=function(ev){console.log(ev)}
    siteVar= site.value
    console.log(siteVar)



    // BUILD THE HEADER, SCRIPT AND FOOTER

    var loadData = `# Connect ${table} QC rules for ${site}
    # PURPOSE: TO CHECK FOR INCONSISTENCIES IN DATA FROM CONNECT SITE(S)
    # VERSION: 1.0
    # LAST UPDATED: ${date}
    # AUTHOR: LORENA SANDOVAL 
    # EMAIL: SANDOVALL2@NIH.GOV
               
    # install.packages("lubridate") 
    # install.packages("stringr")
    # install.packages("boxr")
    # install.packages("dplyr")
    library(lubridate)
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
site= 657167265
connectData = connectData[connectData$d_827220437 == site & !is.na(connectData$d_827220437),]   # choose CID from above to filter by site, Sanford (657167265) used as default
#connectData = connectData %>% mutate(across(everything(), as.character)) # added 0527 to change int64 to string  

connectData = as_tibble(connectData) %>% mutate_if(~!is.POSIXct(.x), as.character)  # added 0528 to change int64 to string and leave dates as date type. Int blanks are NA, charater blanks are "".
# function to exclude rows with specified values\r\n"%!in%" <- function(x,y)!("%in%"(x,y))\r\n
# function to check for numeric values\r\n
testInteger <- function(x){test <- all.equal(x, as.integer(x), check.attributes = FALSE)\nif(test == TRUE){ return(TRUE) } else { return(FALSE) }}\r\n`
console.log("test 314 row")   
var makeDF = `# make qc dataframe\ndf = data.frame(matrix( nrow=${lengthQC}, ncol=7))\n
    names(df) = c("Site", "Date", "ConceptID","QCtype","valid values","condition", "invalid values found when condition met")\r\n`
    var filterDF = `######## filter df to show QC errors\n
    qc_errors = filter(df, (!is.na(df$"invalid values found when condition met") ))\n
    qc_errors = filter(qc_errors, (qc_errors$"invalid values found when condition met" != "" ))\n
    ######## add date column
    qc_errors$Date = Sys.Date()
    ######## add site column
    qc_errors$Site = site
    #write.csv(qc_errors,"qc_${table}_errors_${date}_${site}.csv")\r\n`
    var saveToBox = `######## SAVE QC SCRIPT TO BOXFOLDER (123) \r\n#box_write(qc_errors,paste0("qc_report_",gsub("-","",Sys.Date()),".csv"),dir_id =137677271727)\r\n`
    var saveToBQ = `######## SAVE QC SCRIPT TO BigQuery QR_report table\n
    library(googleAuthR)
library(bigQueryR)
library(jsonlite)
library(httr)
    gar_auth(email="sandovall2@nih.gov",
    scopes = "https://www.googleapis.com/auth/bigquery")
    `
    
    // END QC SCRIPT

    
        // save qc script as txt
        var full_script = loadData + "\n" +  makeDF + "\n" + script + filterDF + "\n" + saveToBox
        h += qaqc.saveQC(full_script) 
 
        h += `<p></p>`
        h += `<p style="color:green;font-size: 13px;font-weight:bold" >Saving the QC script above generates code written in R based on the rules specified in the file loaded above.</p>`
        h += `<p style="color:green;font-size: 13px;font-weight:bold" >The R code produced by the the script, checks for errors in the recruitment table.</p>`
       

console.log("test 335row") 

return h
}