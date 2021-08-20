console.log(`connectQC.js loaded at ${Date()}`)
console.log(`this program writes a long text string to a txt file using the qaqc.saveQC() function`)

// ADD BOTTON TO DISPLAY INSTRUCTIONS, https://codepen.io/davidcochran/full/WbWXoa
// Display high level steps
if (document.getElementById('connQC').checked) {

    var T = document.getElementById("btnToggle");
    T.style.display = "block"; // <-- Set it to block
    let ele = document.getElementById('connQC1');
    ele.innerHTML += `<p style="color:darkblue;font-size: 15px;font-weight:bold" >Create an R script that will check data sitting in BQ and save a report to BQ</p>`
    ele.innerHTML += 'STEP 1: Fill in the required text boxes<br>';
    ele.innerHTML += 'STEP 2: Load QC rules file<br>';
    ele.innerHTML += 'STEP 3: Download QC R script and save it to the "qc_automation_[dev/stg/prod]" bucket in GCP<br>';


    // add toggle button to show/hide instructions
    const toggleArea = document.getElementById('toggleArea')
    const btnToggle = document.getElementById('btnToggle')
    btnToggle.addEventListener("click", function () {

        if (toggleArea.classList.contains('active')) {
            toggleArea.classList.remove("active");
            toggleArea.classList.add("disable");
            /////////////////////////////////
            var ele = document.getElementById('connQCtxt');


            // LIST INSTRUCTIONS FOR USE 

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

// Input box for ProjectID, used in runQAQC function below
let proj = document.getElementById('connQC1');
proj.innerHTML += '<br>'
proj.innerHTML += '<form action="/action_page.php">'
proj.innerHTML += '<label for="site">ProjectID:</label>'
proj.innerHTML += '<input type="text" id="projectID" name="projectID">(ie. nih-nci-dceg-connect-stg-5519)<br>'
proj.innerHTML += '<label for="site">SQL:</label>'
proj.innerHTML += '<input type="text" id="sql" name="sql">(including "`", ie. SELECT * FROM `nih-nci-dceg-connect-stg-5519.Connect.module1` )<br>'
proj.innerHTML += '<label for="site">GCPbucket:</label>'
proj.innerHTML += '<input type="text" id="GCPbucket" name="GCPbucket">(ie. qc_automation_stg)<br>'
proj.innerHTML += '<label for="site">Email:</label>'
proj.innerHTML += '<input type="text" id="email" name="email">(ie. name@nih.gov)<br>'
//proj.innerHTML += '<input type="submit" value="Submit">' don't need a submit button to get textbox data
proj.innerHTML += '</form>'



runQAQC = function (data) {
    console.log(`connectQC.js runQAQC function ran at ${Date()}`)

      //projectID = document.getElementById("projectID")//show on key lookup in console
      projectID.onkeyup = function (ev) {
        console.log("projectID.onkeyup")
        console.log(ev)
    }
    var projectIDVar= document.getElementById("projectID").value
    console.log("projectIDVar")
    console.log(projectIDVar)
    var sqlVar= sql.value
    console.log("sqlVar")
    console.log(sqlVar)
    var GCPbucketVar= GCPbucket.value
    console.log("GCPbucket")
    console.log(GCPbucket)
    var emailVar= email.value
    console.log("emailVar")
    console.log(emailVar)




    let h = `<p>Table with ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows loaded</p>`
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
    for (i = 1; i < test[0].length; i++) {
        var valid1 = test[3][i]
        var type_str = test[2][i]
        var type = type_str.toUpperCase()

        // check if concept ID starts with a number, if so, add d_
        var str1 = "d_";
        var reg = /^\d+$/;

        if (test[1][i] !== null && reg.test(test[1][i])) {
            str = test[1][i]
            var conceptID = str1.concat(str);
        } else { // only add d_ to numeric variables, and not pin, token and studyId
            var conceptID = test[1][i]
        }

        if (test[4][i] !== null && reg.test(test[4][i])) {
            str4 = test[4][i]
            var conceptID1 = str1.concat(str4);
        } else { // only add d_ to numeric variables, and not pin, token and studyId
            var conceptID1 = test[4][i]
        }

        if (test[6][i] !== null && reg.test(test[6][i])) {
            str6 = test[6][i]
            var conceptID2 = str1.concat(str6);
            console.log(conceptID2)
        } else { // only add d_ to numeric variables, and not pin, token and studyId
            var conceptID2 = test[6][i]
        }

        if (test[8][i] !== null && reg.test(test[8][i])) {
            str8 = test[8][i]
            var conceptID3 = str1.concat(str8);
        } else { // only add d_ to numeric variables, and not pin, token and studyId
            var conceptID3 = test[8][i]
        }

        var conceptID1val = test[5][i]
        var conceptID2val = test[7][i]
        var conceptID3val = test[9][i]

        // run loops to append checks to script

        // custom check--------------------------------------------------------------------------------------------------
        if (type == "custom".toUpperCase()) {
            var valid = `######## QC ${conceptID}\n
            # custom check\n
            ${conceptID}=connectData$"${conceptID}"\n
            QCcheck1 =  which(${conceptID1val})\n
            ${conceptID}_invalid = addNA(connectData$"${conceptID}"[QCcheck1])\n
            rowNum<-QCcheck1
            token<- connectData$"token"[QCcheck1]
            ID = connectData$Connect_ID[QCcheck1]
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("${valid1}")\n
            df[${i},4]<-paste0("${conceptID1}")\n
            df[${i},5]<-paste0(${conceptID}_invalid, collapse=", ")\n
            df[${i},6]<-paste0(rowNum, collapse=", ")\n
            df[${i},7]<-paste0(token, collapse=", ")\n 
            df[${i},8]<-paste0(ID, collapse=", ")\n`
            // valid value--------------------------------------------------------------------------------------------------
        } else if (type == ("valid".toUpperCase())) {
            var valid = `######## QC ${conceptID}\n# valid value check\r\n
            ${conceptID}= c(${valid1})\n
            QCcheck1 =which(connectData$"${conceptID}"%!in%${conceptID})\n
            ${conceptID}_invalid = addNA(connectData$"${conceptID}"[QCcheck1])\n
            rowNum<-QCcheck1
            token<- connectData$"token"[QCcheck1]
            ID = connectData$Connect_ID[QCcheck1]
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0(toString(${conceptID}))\n
            df[${i},4]<-paste0(toString("${conceptID} != "),toString(${conceptID}),sep=" ")\n
            df[${i},5]<-paste0(${conceptID}_invalid, collapse=", ")\n
            df[${i},6]<-paste0(rowNum, collapse=", ")\n
            df[${i},7]<-paste0(token, collapse=", ")\n 
            df[${i},8]<-paste0(ID, collapse=", ")\n`
            //cross valid #2 (2 levels deep) ------------------------------------------------------------------------------------
        } else if (type == ("crossValid2".toUpperCase())) {
            var valid = `######## QC ${conceptID}\n# cross valid 2\n
            
            ${conceptID}_a = c(${valid1})#a: if cid2 is relevant\n
            mylist_a1 =  paste0(rep("connectData$${conceptID1} == "), c(${conceptID1val}), sep =" | ")\n
            mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
            mylist_a3 = paste0("(",str_sub(mylist_a2, end =-4),")") #remove extra " |" at the end of string\n
            mylist_aa1 =  paste0(rep("connectData$${conceptID2} == "), c(${conceptID2val}), sep =" | ")\n
            mylist_aa2 = str_c(mylist_aa1, sep = "", collapse ="") # make many or statements\n
            mylist_aa3 = paste0("(",str_sub(mylist_aa2, end =-3),")") #remove extra " |" at the end of string\n
            mylist_a = paste(mylist_a3, mylist_aa3,sep=" &  ")\n
            aa = which(eval(parse(text=mylist_a))) # remove quotes to make logical expression\n
            
            QCcheck1 =which(connectData$"${conceptID}"[aa]%!in%${conceptID}_a)\n
            ${conceptID}_invalid_cross2_a = addNA(connectData$"${conceptID}"[aa][QCcheck1])\n
            rowNum<-QCcheck1
            token<- connectData$"token"[QCcheck1]
            ID = connectData$Connect_ID[aa][QCcheck1]
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("${valid1}")\n
            df[${i},4]<-str_sub(mylist_a, end =-3)\n
            df[${i},5]<-paste0(${conceptID}_invalid_cross2_a, collapse=", ")\r\n
            df[${i},6]<-paste0(rowNum, collapse=", ")\n
            df[${i},7]<-paste0(token, collapse=", ")\n 
            df[${i},8]<-paste0(ID, collapse=", ")\n`
            //cross valid #3 (3 levels deep) ------------------------------------------------------------------------------------
        } else if (type == ("crossValid3".toUpperCase())) {
            var valid = `######## QC ${conceptID}\n# cross valid 3\n
        
        ${conceptID}_a = c(${valid1})#a: if cid2 is relevant\n
        mylist_a1 =  paste0(rep("connectData$${conceptID1} == "), c(${conceptID1val}), sep =" | ")\n
        mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
        mylist_a3 = paste0("(",str_sub(mylist_a2, end =-4),")") #remove extra " |" at the end of string\n
        mylist_aa1 =  paste0(rep("connectData$${conceptID2} == "), c(${conceptID2val}), sep =" | ")\n
        mylist_aa2 = str_c(mylist_aa1, sep = "", collapse ="") # make many or statements\n
        mylist_aa3 = paste0("(",str_sub(mylist_aa2, end =-3),")") #remove extra " |" at the end of string\n
        mylist_aaa1 =  paste0(rep("connectData$${conceptID3} == "), c(${conceptID3val}), sep =" | ")\n
        mylist_aaa2 = str_c(mylist_aaa1, sep = "", collapse ="") # make many or statements\n
        mylist_aaa3 = paste0("(",str_sub(mylist_aaa2, end =-3),")") #remove extra " |" at the end of string\n
        mylist_a = paste(mylist_a3, mylist_aa3,mylist_aaa3,sep=" &  ")\n
        aa = which(eval(parse(text=mylist_a))) # remove quotes to make logical expression\n
        QCcheck1 =which(connectData$"${conceptID}"[aa]%!in%${conceptID}_a)\n
        ${conceptID}_invalid_cross3_a = addNA(connectData$"${conceptID}"[aa][QCcheck1])\n
        rowNum<-QCcheck1
        token<- connectData$"token"[QCcheck1]
        ID = connectData$Connect_ID[aa][QCcheck1]
        df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
        df[${i},2]<-paste0("${type}")\n
        df[${i},3]<-paste0("${valid1}")\n
        df[${i},4]<-str_sub(mylist_a, end =-1)\n
        df[${i},5]<-paste0(${conceptID}_invalid_cross3_a, collapse=", ")\r\n
        df[${i},6]<-paste0(rowNum, collapse=", ")\n
        df[${i},7]<-paste0(token, collapse=", ")\n 
        df[${i},8]<-paste0(ID, collapse=", ")\n`

            //crossValid2NotNA--------------------------------------------------------------------------------------------------
        } else if (type == ("crossValid2NotNA".toUpperCase())) {
            var valid = `######## QC ${conceptID}\n# present value check\n
            
            mylist_a1 =  paste0(rep("connectData$${conceptID1} == "), c(${conceptID1val}), sep =" | ")\n
            mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
            mylist_a3 = paste0("(",str_sub(mylist_a2, end =-4),")") #remove extra " |" at the end of string\n
            mylist_aa1 =  paste0(rep("connectData$${conceptID2} == "), c(${conceptID2val}), sep =" | ")\n
            mylist_aa2 = str_c(mylist_aa1, sep = "", collapse ="") # make many or statements\n
            mylist_aa3 = paste0("(",str_sub(mylist_aa2, end =-3),")") #remove extra " |" at the end of string\n
            mylist_a = paste(mylist_a3, mylist_aa3,sep=" &  ")\n
            aa = which(eval(parse(text=mylist_a))) # remove quotes to make logical expression\n
            QCcheck1 =which(is.na(connectData$"${conceptID}"[aa]))\n
            ${conceptID}_invalid_cross2_a = addNA(connectData$"${conceptID}"[aa][QCcheck1])\n
            rowNum<-QCcheck1
            token<- connectData$"token"[QCcheck1]
            ID = connectData$Connect_ID[aa][QCcheck1]
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("data must be present")\n
            df[${i},4]<-str_sub(mylist_aaa2, end =-4)\n
            df[${i},5]<-paste0(unique(${conceptID}_invalid_cross2_a), collapse=", ")\n
            df[${i},6]<-paste0(rowNum, collapse=", ")\n
            df[${i},7]<-paste0(token, collapse=", ")\n 
            df[${i},8]<-paste0(ID, collapse=", ")\n`

            // valid equal to or less than character length--------------------------------------------------------------------------------------------------
        } else if (type == ("NA or equal to or less than char()".toUpperCase())) {
            var valid = `######## QC ${conceptID}\n
            # valid NA or equal to or less than character length check\n
            valid_length= ${valid1}\n
            list_lengths = sapply(connectData$${conceptID},nchar)\n
            ${conceptID}_invalid= list_lengths[list_lengths > valid_length & !is.na(list_lengths)]\n
            QCcheck1 = which(sapply(connectData$${conceptID},nchar)== d_749475364_invalid & !is.na(sapply(connectData$${conceptID},nchar)))
            ${conceptID}_invalid_char_length = connectData$${conceptID}[QCcheck1]
            rowNum<-QCcheck1
            token<- connectData$"token"[QCcheck1]
            ID = connectData$Connect_ID[QCcheck1]
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}",valid_length)\n
            df[${i},3]<-paste0("char length",${valid1})\n
            df[${i},4]<-paste0("char length NOT <=",${valid1})\n
            df[${i},5]<-paste0(${conceptID}_invalid_char_length, collapse=", ")\n
            df[${i},6]<-paste0(rowNum, collapse=", ")\n
            df[${i},7]<-paste0(token, collapse=", ")\n 
            df[${i},8]<-paste0(ID, collapse=", ")\n`
            // valid equal to character length--------------------------------------------------------------------------------------------------
        } else if (type == ("NA or equal to char()".toUpperCase())) {
            var valid = `######## QC ${conceptID}\n
            # valid NA or equal to character length check\n
            valid_length= ${valid1}\n
            list_lengths = sapply(connectData$${conceptID},nchar)\n
            ${conceptID}_invalid= list_lengths[list_lengths != valid_length & !is.na(list_lengths)]\n
            QCcheck1 = which(sapply(connectData$${conceptID},nchar)== d_749475364_invalid & !is.na(sapply(connectData$${conceptID},nchar)))
            ${conceptID}_invalid_char_length = connectData$${conceptID}[QCcheck1]
            rowNum<-QCcheck1
            token<- connectData$"token"[QCcheck1]
            ID = connectData$Connect_ID[QCcheck1]
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type} ",valid_length)\n
            df[${i},3]<-paste0("char length",${valid1})\n
            df[${i},4]<-paste0("char length NOT =",${valid1})\n
            df[${i},5]<-paste0(${conceptID}_invalid_char_length, collapse=", ")\n
            df[${i},6]<-paste0(rowNum, collapse=", ")\n
            df[${i},7]<-paste0(token, collapse=", ")\n 
            df[${i},8]<-paste0(ID, collapse=", ")\n`

            // valid range character length----------------------------------------------------------------------------------------todo add row and token column
            // } else if (type ==("NA or range char()".toUpperCase())) {
            //     var valid = `######## QC ${conceptID}\n# valid NA or range length check\n
            //     valid_length= strsplit(${valid1})\n
            //     valid_length_min = valid_length[[1]][1]\n
            //     valid_length_max = valid_length[[1]][2]\n
            //     variable =connectData$"${conceptID}"\n
            //     list_lengths = unique(sapply(variable,nchar))\n
            //     ${conceptID}_invalid_char_length = list_lengths[list_lengths < valid_length_min | list_lengths > valid_length_max & !is.na(list_lengths)]\n
            //     df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            //     df[${i},2]<-paste0("${type} ",valid_length)\n
            //     df[${i},3]<-paste0("char length rnage",${valid1})\n
            //     df[${i},4]<-paste0("char length range NOT =",${valid1})\n
            //     df[${i},5]<-paste0(${conceptID}_invalid_char_length, collapse=", ")\r\n`

            // valid numeric length--------------------------------------------------------------------------------------------------
            // } else if (type ==("NA or equal to num()".toUpperCase())) {
            //     var valid = `######## QC ${conceptID}\n# valid NA or numeric length check\r\n
            //     variable =connectData$"${conceptID}"\n
            //     valid_length= ${valid1}\n
            //     list_lengths = sapply(variable ,nchar)\n
            //     ${conceptID}_invalid_num_length = list_lengths[list_lengths > valid_length & !is.na(list_lengths)]\n
            //     df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            //     df[${i},2]<-paste0("${type}",${valid1} )\n
            //     df[${i},3]<-paste0("Valid length = ",valid_length," Integer = TRUE")\n
            //     df[${i},4]<-paste0("Valid length != ",valid_length," | Integer = FALSE")\n
            //     if (!is.null(variable)){
            //         var.is.integer =suppressWarnings(testInteger(connectData$"${conceptID}"))
            //         df[${i},5]<-paste0("invalid length(s) found:  ",${conceptID}_invalid_num_length,"non integer value(s) found:  ",!var.is.integer, collapse=", ")
            //       }else if (is.null(variable)){ 
            //         var.is.integer
            //         df[${i},5]<-NA\r\n`

            // valid age check--------------------------------------------------------------------------------------------------
        } else if (type == ("age".toUpperCase())) {
            var valid = `######## QC ${conceptID}\n# valid age check\r\n
            QCcheck1 = which(!grepl("^[1-9][0-9]?$|^100$", connectData$${conceptID}) & !is.na(connectData$${conceptID}))\n
            rowNum<-QCcheck1
            token<- connectData$"token"[QCcheck1]
            ID = connectData$Connect_ID[QCcheck1]
            ${conceptID}_age_invalid = levels(addNA(connectData$"${conceptID}"[QCcheck1]))\r\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-"numeric age"
            df[${i},4]<-paste0("age !=1-99")\n
            ndf[${i},5]<-paste0("invalid age(s):",${conceptID}_age_invalid, collapse=", ")\n
            df[${i},6]<-paste0(rowNum, collapse=", ")\n
            df[${i},7]<-paste0(token, collapse=", ")\n 
            df[${i},8]<-paste0(ID, collapse=", ")\n`

            // valid year check--------------------------------------------------------------------------------------------------
        } else if (type == ("year".toUpperCase())) {
            var valid = `######## QC ${conceptID}\n# valid year check\r\n
            QCcheck1 = which(!grepl("^[1]{1}[9]{1}[0-9]{1}[0-9]{1}$|^[2]{1}[0]{1}[0-9]{1}[0-9]{1}$" & !is.na(connectData$${conceptID}), connectData$${conceptID}))\n
            rowNum<-QCcheck1
            token<- connectData$"token"[QCcheck1]
            ID = connectData$Connect_ID[QCcheck1]
            ${conceptID}_year_invalid = levels(addNA(connectData$"${conceptID}"[QCcheck1))\r\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("valid year format:[1-2][0,9][0:9][0:9]")\n
            df[${i},4]<-paste0("invalid year format found:")\n
            df[${i},5]<-paste0(toString(${conceptID}_year_invalid))\n`

            //date--------------------------------------------------------------------------------------------------
        } else if (type == ("NA or date".toUpperCase())) {
            var valid = `######## QC ${conceptID}\n# valid date check\r\n
            ${conceptID} = connectData$"${conceptID}"\n
            QCcheck1 = which(!grepl("[1-2][0,9][0-9]?[1-9][0-9]?[1-9][0-9]?[0-9]", ${conceptID}) & !is.na(connectData$${conceptID}))\n
            rowNum<-QCcheck1
            token<- connectData$"token"[QCcheck1]
            ID = connectData$Connect_ID[QCcheck1]
            ${conceptID}_date_invalid = connectData$"${conceptID}"[QCcheck1]\r\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("YYYYMMDD")\n
            df[${i},4]<-paste0("date != MMDDYYYY")\n
            df[${i},5]<-paste0(${conceptID}_date_invalid, collapse=", ")\n
            df[${i},6]<-paste0(rowNum, collapse=", ")\n
            df[${i},7]<-paste0(token, collapse=", ")\n 
            df[${i},8]<-paste0(ID, collapse=", ")\n`

            //date time--------------------------------------------------------------------------------------------------
        } else if (type == ("NA or dateTime".toUpperCase())) {
            var valid = `######## QC ${conceptID}\n# valid dateTime check\r\n${conceptID} = connectData$"${conceptID}"\n
            QCcheck1 = which(!grepl("[1-2][0,9][0-9]?[0-9]-[0-9]?[1-9]-[0-9]?[0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9]", ${conceptID}) & !is.na(connectData$${conceptID}) )\n
            rowNum<-QCcheck1
            token<- connectData$"token"[QCcheck1]
            ID = connectData$Connect_ID[QCcheck1]
            ${conceptID}_dateTime_invalid = addNA(connectData$"${conceptID}"[QCcheck1])\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("MMDDYYYY 00:00:00")\n
            df[${i},4]<-paste0("dateTime != YYYY-MM-DD 00:00:00")\n
            df[${i},5]<-paste0(${conceptID}_dateTime_invalid, collapse=", ")\n
            df[${i},6]<-paste0(rowNum, collapse=", ")\n
            df[${i},7]<-paste0(token, collapse=", ")\n 
            df[${i},8]<-paste0(ID, collapse=", ")\n`


            //cross valid1 --------------------------------------------------------------------------------------------------
        } else if (type == ("crossValid1".toUpperCase())) {
            var valid = `######## QC ${conceptID}\n# cross valid value check - checks values if condition one is met and checks values if condition is not met\n
            ${conceptID}_a = c(${valid1})\n

            mylist_a1 =  paste0(rep("connectData$${conceptID1} == "), c(${conceptID1val}), sep =" | ")\n
            mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
            mylist_a3 = paste0("(",str_sub(mylist_a2, end =-4),")") #remove extra " |" at the end of string\n
            aa = which(eval(parse(text=mylist_a3))) # remove quotes to make logical expression\n
            QCcheck1 =which(connectData$"${conceptID}"[aa]%!in%${conceptID}_a)\n
            rowNum<-QCcheck1
            token<- connectData$"token"[QCcheck1]
            ID = connectData$Connect_ID[aa][QCcheck1]
            ${conceptID}_invalid_cross = addNA(connectData$"${conceptID}"[aa][QCcheck1])\n
            df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
            df[${i},2]<-paste0("${type}")\n
            df[${i},3]<-paste0("${valid1}")\n
            df[${i},4]<-str_sub(mylist_a2, end =-4)\n
            df[${i},5]<-paste0(${conceptID}_invalid_cross, collapse=", ")\n
            df[${i},6]<-paste0(rowNum, collapse=", ")\n
            df[${i},7]<-paste0(token, collapse=", ")\n 
            df[${i},8]<-paste0(ID, collapse=", ")\n`
            var valid = valid.replace(/(\r\n|\r)/gm, " ") + "\r\n";
            // cross valid year check --------------------------------------------------------------------------------------------------
        } else if (type == ("crossValidYear".toUpperCase())) {

            var valid = `######## QC ${conceptID}\n# cross valid year check\n
    year = "^[1]{1}[9]{1}[0-9]{1}[0-9]{1}$|^[2]{1}[0]{1}[0-9]{1}[0-9]{1}$"
    ${conceptID}_a = c(${valid1})\n
    mylist_a1 =  paste0(rep("connectData$${conceptID1}== "), c(${conceptID1val}), sep =" | ")\n
    mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
    mylist_a3 = paste0("(",str_sub(mylist_a2, end =-4),")") #remove extra " |" at the end of string\n
    aa = which(eval(parse(text=mylist_a3))) # remove quotes to make logical expression\n
    QCcheck1 =which(!grepl(year, connectData$"${conceptID}"[aa]))\n
    rowNum<-QCcheck1
    token<- connectData$"token"[QCcheck1]
    ID = connectData$Connect_ID[aa][QCcheck1]
    ${conceptID}_invalid_year = addNA(connectData$"${conceptID}"[aa][QCcheck1])\n
    df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
    df[${i},2]<-paste0("${type}")\n
    df[${i},3]<-paste0("valid year format:1900 to present")\n
    df[${i},4]<-paste0("invalid year values found in col1 or values found when should be blank in col2:")\n
    df[${i},5]<-paste0(${conceptID}_invalid_year, collapse=", ")\n
    df[${i},6]<-paste0(rowNum, collapse=", ")\n
    df[${i},7]<-paste0(token, collapse=", ")\n 
    df[${i},8]<-paste0(ID, collapse=", ")\n`
            var valid = valid.replace(/(\r\n|\r)/gm, " ") + "\r\n";

            // cross valid age check --------------------------------------------------------------------------------------------------
        } else if (type == ("crossValidAge".toUpperCase())) {

            var valid = `######## QC ${conceptID}\n# cross valid age check\n
    age = "^[1-9][0-9]?$|^100$"
    ${conceptID}_a = c(${valid1})\n
    mylist_a1 =  paste0(rep("connectData$${conceptID2}== "), c(${conceptID2val}), sep =" | ")\n
    mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
    mylist_a3 = paste0("(",str_sub(mylist_a2, end =-4),")") #remove extra " |" at the end of string\n
    aa = which(eval(parse(text=mylist_a3))) # remove quotes to make logical expression\n
    
    QCcheck1 =which(!grepl(age, connectData$"${conceptID}"[aa]))\n
    rowNum<-QCcheck1
    token<- connectData$"token"[QCcheck1]
    ID = connectData$Connect_ID[aa][QCcheck1]
    ${conceptID}_invalid_age = addNA(connectData$"${conceptID}"[aa][QCcheck1])\n
    
    df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
    df[${i},2]<-paste0("${type}")\n
    df[${i},3]<-paste0("ages 1:99")\n
    df[${i},4]<-paste0("invalid ages found")\n
    df[${i},5]<-paste0(${conceptID}_invalid_age, collapse=", ")\n
    df[${i},6]<-paste0(rowNum, collapse=", ")\n
    df[${i},7]<-paste0(token, collapse=", ")\n 
    df[${i},8]<-paste0(ID, collapse=", ")\n`
            var valid = valid.replace(/(\r\n|\r)/gm, " ") + "\r\n";

            // cross valid num check --------------------------------------------------------------------------------------------------
        } else if (type == ("NA or numeric".toUpperCase())) {

            var valid = `######## QC ${conceptID}\n
    # check for numbers \n
    QCcheck1 =which(!grepl("[0-9]", connectData$${conceptID}) & !is.na(connectData$${conceptID}))\n
    rowNum<-QCcheck1
    token<- connectData$"token"[QCcheck1]
    ID = connectData$Connect_ID[QCcheck1]
    ${conceptID}_invalid_num = addNA(connectData$"${conceptID}"[QCcheck1])\n
    df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
    df[${i},2]<-paste0("${type}")\n
    df[${i},3]<-paste0("numbers or NA)\n
    df[${i},4]<-paste0("invalid values found")\n
    df[${i},5]<-paste0(${conceptID}_invalid_num, collapse=", ")\n
    df[${i},6]<-paste0(rowNum, collapse=", ")\n
    df[${i},7]<-paste0(token, collapse=", ")\n 
    df[${i},8]<-paste0(ID, collapse=", ")\n`
            var valid = valid.replace(/(\r\n|\r)/gm, " ") + "\r\n";
            // cross valid num check --------------------------------------------------------------------------------------------------
        } else if (type == ("crossValidNum".toUpperCase())) {

            var valid = `######## QC ${conceptID}\n# cross valid num check for numbers above zero\n
    mylist_a1 =  paste0(rep("connectData$${conceptID1}== "), c(${conceptID1val}), sep =" | ")\n
    mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
    mylist_a3 = paste0("(",str_sub(mylist_a2, end =-4),")") #remove extra " |" at the end of string\n
    aa = which(eval(parse(text=mylist_a3))) # remove quotes to make logical expression\n
    QCcheck1 =which(!grepl("[0-9]", connectData$"${conceptID}"[aa]) & connectData$"${conceptID}"[aa] > 0)\n
    rowNum<-QCcheck1
    token<- connectData$"token"[QCcheck1]
    ID = connectData$Connect_ID[aa][QCcheck1]
    ${conceptID}_invalid_num = addNA(connectData$"${conceptID}"[aa][QCcheck1])\n
    df[${i},1]<-substr(paste0("${conceptID}"),3,100)\n
    df[${i},2]<-paste0("${type}")\n
    df[${i},3]<-paste0("numbers above zero")\n
    df[${i},4]<-paste0("invalid values found")\n
    df[${i},5]<-paste0(${conceptID}_invalid_num, collapse=", ")\n
    df[${i},6]<-paste0(rowNum, collapse=", ")\n
    df[${i},7]<-paste0(token, collapse=", ")\n
    df[${i},8]<-paste0(ID, collapse=", ")\n`
            var valid = valid.replace(/(\r\n|\r)/gm, " ") + "\r\n";

            //cross valid1 equal to char()-----------------------------------------------------------------------------------todo add row num and token column
        } else if (type == ("crossValid1 equal to char()".toUpperCase())) {
            var valid = `######## QC ${conceptID}\n# cross valid equal to char() check - checks values if condition one is met and checks values if condition is not met\n

            mylist_a1 =  paste0(rep("connectData$${conceptID1} == "), c(${conceptID1val}), sep =" | ")\n
            mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
            mylist_a3 = paste0("(",str_sub(mylist_a2, end =-4),")") #remove extra " |" at the end of string\n
            aa = which(eval(parse(text=mylist_a3))) # remove quotes to make logical expression\n
            
            valid_length= c(${valid1})\n
                #################var.is.integer =suppressWarnings(testInteger(connectData$"${conceptID}"[aa]))\n
                variable =connectData$"${conceptID}"[aa]\n
                list_lengths = sapply(variable,nchar)\n
                ${conceptID}_invalid_char_length = list_lengths[list_lengths != valid_length]
        
                ${conceptID}_invalid_char_length = list_lengths[list_lengths != valid_length]
                \ndf[${i},1]<-substr(paste0("${conceptID}"),3,100)
                \ndf[${i},2]<-paste0("${type} ",valid_length)
                \ndf[${i},3]<-paste0("char length",${valid1})
                \ndf[${i},4]<-paste0("char length NOT =",${valid1})
                \ndf[${i},5]<-paste0(${conceptID}_invalid_char_length, collapse=", ")\r\n`
            var valid = valid.replace(/(\r\n|\r)/gm, " ") + "\r\n";

            //cross valid1 equal to char()------------------------------------------------------------------------------todo add row num and token column-

        } else if (type == ("crossValid1 equal to or less than char()".toUpperCase())) {
            var valid = `######## QC ${conceptID}\n# cross valid equal to or less than char() check - checks values if condition one is met and checks values if condition is not met\n
            ${conceptID}_a = c(${conceptID1val})\n

            mylist_a1 =  paste0(rep("connectData$${conceptID1} == "), c(${conceptID1val}), sep =" | ")\n
            mylist_a2 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements\n
            mylist_a3 = paste0("(",str_sub(mylist_a2, end =-4),")") #remove extra " |" at the end of string\n
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
            var valid = valid.replace(/(\r\n|\r)/gm, " ") + "\r\n";
        } else {
            var valid = ""
        }
        script += valid
        l++;
    }

    // BUILD THE HEADER, SCRIPT AND FOOTER

    var header =
        `# Connect table QC checks
    # PURPOSE: TO CHECK FOR INCONSISTENCIES IN DATA FROM CONNECT SITE(S)
    # VERSION: 1.0
    # LAST UPDATED: 0812021
    # AUTHOR: LORENA SANDOVAL 
    # EMAIL: SANDOVALL2@NIH.GOV
    
    # install.packages("lubridate") 
    # install.packages("stringr")
    # install.packages("boxr")
    # install.packages("dplyr")
    # install.packages("bigrquery")
    # install.packages("googleCloudStorageR")
    # install.packages("googleAuthR")
    # install.packages("googleCloudRunner")
    
    # bq_auth()
    library(lubridate)
    library(boxr)
    library(stringr)
    library(dplyr)
    library(bigrquery)
    library(googleCloudStorageR)
    library(googleAuthR)
    library(googleCloudRunner)#need? not sure
    # translate function libraries
    library(jsonlite)
    library(stringr)
    library(dplyr)
    library(withr)
    library(tibble)
    
    # set auth via gar_auth_service(), service  credentials: --------------------------
    cr_region_set("us-central1") #need? not sure
    cr_bucket_set("${GCPbucketVar}")#need? not sure
    cr_email_set("${emailVar}")#need? not sure
    cr_project_set("${projectIDVar}")#need? not sure
    
    #  authentiicate via auth library using the metadata server 
    googleAuthR::gar_gce_auth()
    
    # set a default Google bucket -----------------------------------------------------
    #gcs_global_bucket("qc_automation") 
    
    #  read dictionary from bucket to an R object (warning, dont run out of RAM if its a big object)
    # the download type is guessed into an appropriate R object
    dictionary <- gcs_get_object("gs://${GCPbucketVar}/Connect_translation_dictionary.json")
    
    # function to translate QC report inside runQC function-----------------------------
    TRANSLATE.COL <- function(report, translate.these.cols, new.col.names, dictionary ){
      
      # read dictionary json
      dict <- dictionary
      new_error_report = report
      # translate 1 or more columns
      for (columnIndex in 1:length(translate.these.cols)){
        translate.this.col = translate.these.cols[columnIndex]
        new.col.name = new.col.names[columnIndex]
        
        # add new translated column
        p1= paste0("add_column(new_error_report", ",")
        p2= new.col.name
        p3= paste0("=NA, .after = translate.this.col)")
        txt=paste0(p1,p2,p3)
        new_error_report <- eval(parse(text=txt))
        ############# initialize row counts for translation loop
        run = 1
        ############ begin translation -----------
        while(run <= length(new_error_report[[translate.this.col]])){
          for(row in new_error_report[[translate.this.col]]){
            if(grepl(pattern=",",row)){
              newRow2 = c()
              row2 = as.numeric(strsplit(row,",")[[1]])
            }else {
              newRow2 = c()
              row2 = as.numeric(row)
            }
            ############# START 1st "ELSE IF" LOGIC TO CHECK ROW FORMAT #############
            #("NA", string, integer list plus an "NA", or integer list,) 
            #----------------------------------------- if row is missing
            if(is.na(row)| row=="") {
              na_str = ""
              ab = ""
              #----------------------------------------- else if row is non number
            }else if (!is.na(row) & is.na(row2)) {
              na_str = ""
              ab= row
              #----------------------------------------- else if row is not blank because it has numbers and an NA!!
            }else if (( testInteger(as.numeric(strsplit(gsub(", NA", "" , row),",")[[1]])) |
                        testInteger(as.numeric(strsplit(gsub(", NA", "" , row),",")[[1]]))) &
                      !is.na(row2) & (grepl( ", NA", row, fixed = TRUE) | grepl( ", NA,", row, fixed = TRUE))) {
              row = gsub(", NA", "" , row)
              row = gsub(", NA,", "" , row) # remove na in row and redefine row2 (numbers)
              row2 = as.numeric(strsplit(row,",")[[1]])
              ab = paste0("dict$","\\"",row2,"\\"", collapse=NULL)
              na_str = ", NA"
              #----------------------------------------- else if row is number list
            }else if( testInteger(row2) & !is.na(row2) & !is.na(row) & row !=""){
              ab = paste0("dict$","\\"",row2,"\\"", collapse=NULL)
              na_str = ""
            }
            ############# START 2nd "ELSE IF" LOGIC TO TRANSLATE INTEGER LIST of 1 or more CIDs OR KEEP BLANK ROWS AND STRING ROWS AS IS ########
            # for list of concept IDs (fixed 0517 Lorena)
            if(length(ab)>1){
              for(cid in ab){
                newRow = paste(eval(parse(text=cid)),sep=",")
                newRow2 = c(newRow2,newRow)
              }
              # for single concept ID
            }else if(numbers_only(row)){
              newRow2 = eval(parse(text=ab))
              # for value other than single concept ID or ConceptID list 
            }else if(length(ab)==1){
              newRow2 = ab
            }          
            ############# BEGIN REPLACING TRANSLATED VALUES INTO NEW COLUMN ##########################
            newRow3 = paste0(toString(newRow2,sep = ", "), na_str)
            new_error_report[[new.col.name]][[run]] = newRow3
            run = run+1
          } }}
    
      return(new_error_report)
    }
    
    # function to test vector for integers
    testInteger <- function(x){test <- all.equal(x, as.integer(x), check.attributes = FALSE)
    if(test == TRUE){ return(TRUE)
    } else { return(FALSE) }
    }
    # function to remove whitespace before and after value
    # # Remove leading or trailing white space from each column using the following "trim function
    # trim <- function (x) gsub("^\s+|\s+$", "", x) 
    
    # function to check that it does not match any non-number
    numbers_only <- function(x) !grepl("\\\D", x)
    
    # function to exclude rows with certain values in QC (ie. "d" not in list "a,b,c")
    "%!in%" <- function(x,y)!("%in%"(x,y))
    
    # function to check list for numeric values in QC
    testInteger <- function(x){test <- all.equal(x, as.integer(x), check.attributes = FALSE)
    if(test == TRUE){ return(TRUE) } else { return(FALSE) }}
    
    
    # function to run QC by site--------------------------------------------
    runQC = function(site,project, sql, QC_report_location ){
    
    #GET RECRUITMENT TABLES FROM BIGQUERY IN ${projectIDVar} PROJECT
    # set project
    project <- project
    
    # set query
    sql <- sql
    tb <- bq_project_query(project, sql)
    connectData = bq_table_download(tb, bigint = c("character"))
    # filter data by site
    
    site= site
    connectData = connectData[connectData$d_827220437 == site & !is.na(connectData$d_827220437),]   
    #connectData = connectData %>% mutate(across(everything(), as.character)) # added 0527 to change int64 to string, but using newer version below 
    
    # changed int64 to string and leave dates as date type to prevent missing data. Integer blanks are NA, charater blanks are "".
    connectData = as_tibble(connectData) %>% mutate_if(~!is.POSIXct(.x), as.character)  
    
    # make qc dataframe
    df = data.frame(matrix( nrow=${lengthQC}, ncol=8))
    
    names(df) = c("ConceptID","QCtype","valid_values","condition", "invalid_values_found", "row_number", "token", "ConnectID")
    `


    var footer =
        `# filter df to show QC errors only

    qc_errors = filter(df, (!is.na(df$"invalid_values_found") ))
    
    qc_errors = filter(qc_errors, (qc_errors$"invalid_values_found" != "" ))
    
    # TRANSLATE REPORT 
    
    qc_errors=TRANSLATE.COL(report= qc_errors , 
                            translate.these.cols = c("ConceptID", "valid_values"),
                            new.col.names = c("ConceptID_translated","valid_values_translated"),
                            dictionary = dictionary)
    
    # add "no errors found" row if no rows found in QC report
    if (nrow(qc_errors)==0){
      qc_errors[1, ] = c("no errors found")
    }
    
    # add site column
    qc_errors = add_column(qc_errors, site = as.character(site) , .before=1)
    # add date column
    qc_errors = add_column(qc_errors, date = Sys.Date() , .before=1)
    ######## SAVE QC SCRIPT TO BIGQUERY QC_report table
    
    
    ######## upload report to bigquery ##############################
    
    #Append data to an existing table or create a table if if doesnt exist
    bq_table_upload(x=QC_report_location,
                    values=qc_errors,
                    fields = qc_errors,
                    create_disposition="CREATE_IF_NEEDED",
                    write_disposition="WRITE_APPEND")
    return(qc_errors)
    }
    
    # BigQuery table where QC report will be saved---------------
    QC_report_location = "${projectIDVar}.Connect.QC_report"
    
    # 2 part definition for querying the data sitting in BigQuery
    project = "${projectIDVar}"
    sql = "${sqlVar}"
    
    # sites:
    # Sanford Health = 657167265
    # HealthPartners = 531629870
    # Henry Ford Health System = 548392715
    # Kaiser Permanente Colorado = 125001209
    # Kaiser Permanente Georgia = 327912200
    # Kaiser Permanente Hawaii = 300267574
    # Kaiser Permanente Northwest = 452412599
    # Marshfiled = 303349821
    # University of Chicago Medicine = 809703864
    # National Cancer Institute = 517700004
    # Other = 181769837
    
    # define site to run QC -----------
    
    # Sanford
    site= 657167265 
    qc=runQC(site= site, project= project, sql= sql, QC_report_location = QC_report_location)
    
    # define site to run QC----------
    
    # HealthPartners
    site= 531629870 
    qc=runQC(site= site, project= project, sql= sql, QC_report_location = QC_report_location)
    
    # define site to run QC----------
    
    # Henry Ford Health System
    site= 548392715 
    qc=runQC(site= site, project= project, sql= sql, QC_report_location = QC_report_location)
    
    # define site to run QC----------
    
    # Kaiser Permanente Colorado
    site= 125001209 
    qc=runQC(site= site, project= project, sql= sql, QC_report_location = QC_report_location)
    
    # define site to run QC----------
    
    # Kaiser Permanente Georgia
    site= 327912200 
    qc=runQC(site= site, project= project, sql= sql, QC_report_location = QC_report_location)
    
    # define site to run QC----------
    
    # Kaiser Permanente Hawaii
    site= 300267574 
    qc=runQC(site= site, project= project, sql= sql, QC_report_location = QC_report_location)
    
    # define site to run QC----------
    
    # Kaiser Permanente Northwest
    site= 452412599 
    qc=runQC(site= site, project= project, sql= sql, QC_report_location = QC_report_location)
    
    # define site to run QC----------
    
    # Marshfiled
    site= 303349821 
    qc=runQC(site= site, project= project, sql= sql, QC_report_location = QC_report_location)
    
    # define site to run QC----------
    
    # University of Chicago Medicine
    site= 809703864 
    qc=runQC(site= site, project= project, sql= sql, QC_report_location = QC_report_location)
    
    # define site to run QC----------
    
    # National Cancer Institute
    site= 517700004 
    qc=runQC(site= site, project= project, sql= sql, QC_report_location = QC_report_location)
    
    # define site to run QC----------
    
    # Other
    site= 181769837 
    qc=runQC(site= site, project= project, sql= sql, QC_report_location = QC_report_location)`

    // END QC SCRIPT


    // save qc script as txt
    //  var full_script = loadData + "\n" +  makeDF + "\n" + script + "\n" + filterDF + "\n" + saveToBox
    var full_script = header + "\n" + script + "\n" + footer
    //var full_script = script


    h += qaqc.saveQC(full_script)

    h += `<p></p>`
    h += `<p style="color:green;font-size: 13px;font-weight:bold" >Saving the QC script above generates code written in R based on the rules specified in the file loaded above.</p>`
    h += `<p style="color:green;font-size: 13px;font-weight:bold" >The R code produced by the the script, checks for errors in the recruitment table.</p>`


    console.log("test 335row")

    return h
}