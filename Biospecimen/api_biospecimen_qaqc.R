library(plumber)
    library(lubridate)
    library(bigrquery)
    library(jsonlite)
    library(stringr)
    library(dplyr)
    library(withr)
    library(tibble)
    library(rio)
    
    
    
    #* heartbeat...
    #* @get /
    #* @post /
    function(){
      return("alive")
    }
    

    #* Runs STAGE qa_qc
    #* @get /qaqc
    #* @post /qaqc
    #* @serializer json
    function() {
          #  read dictionary from Github
          dictionary = rio::import("https://episphere.github.io/conceptGithubActions/aggregate.json",format = "json")          
 
          # BigQuery table where QC report will be saved---------------
          QC_report_location = "nih-nci-dceg-connect-stg-5519.Biospecimens.QC_report"
          
          # 2 part definition for querying the data sitting in BigQuery
          project = "nih-nci-dceg-connect-stg-5519"
          sql = "SELECT * FROM `nih-nci-dceg-connect-stg-5519.Connect.Biospecimens.flatBoxes_WL`"
          
          runQC = function(project, sql, QC_report_location)
    }

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
              ab = paste0("dict$",""",row2,""", collapse=NULL)
              na_str = ", NA"
              #----------------------------------------- else if row is number list
            }else if( testInteger(row2) & !is.na(row2) & !is.na(row) & row !=""){
              ab = paste0("dict$",""",row2,""", collapse=NULL)
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
    
    # function to check that it does not match any non-number 
    numbers_only <- function(x) !grepl("\\D", x)
    
    # function to exclude rows with certain values in QC (ie. "d" not in list "a,b,c")
    "%!in%" <- function(x,y)!("%in%"(x,y)

    # function to run QC -----------------------------------------------------
    runQC = function(project, sql, QC_report_location){
    
    #GET RECRUITMENT TABLES FROM BIGQUERY IN  PROJECT
    # set project
    project <- project
    
    # set query
    sql <- sql
    tb <- bq_project_query(project, sql)
    connectData = bq_table_download(tb, bigint = c("character"))
    # filter data by site
    
    #connectData = connectData %>% mutate(across(everything(), as.character)) # added 0527 to change int64 to string, but using newer version below 
    
    # changed int64 to string and leave dates as date type to prevent missing data. Integer blanks are NA, charater blanks are "".
    connectData = as_tibble(connectData) %>% mutate_if(~!is.POSIXct(.x), as.character)  
    
    # make qc dataframe
    df = data.frame(matrix( nrow=3, ncol=8))
    
    names(df) = c("ConceptID","QCtype","valid_values","condition", "invalid_values_found", "row_number", "token", "ConnectID")

    #-------------------------------------------------------------------------------------------
# valid function
# valid value check
valid <- function(data,df,cid1,cid1_values,df_row) {
    QCcheck1 =which(data[[cid1]]%!in%cid1_values)
    # gather data for error report
    rowNum<-QCcheck1
    token<- data$"token"[QCcheck1]
    ID = data$Connect_ID[QCcheck1]
    invalid_values = addNA(data[[cid1]][QCcheck1])
    
    # populate error report 
    df[df_row,1]<-substr(paste0(cid1),3,100)
    df[df_row,2]<-paste0("VALID")
    df[df_row,3]<-str_c(cid1_values,collapse=",")
    
    df[df_row,5]<-str_c(invalid_values, collapse=", ")
    df[df_row,6]<-paste0(rowNum, collapse=", ")
    df[df_row,7]<-paste0(token, collapse=", ")
    df[df_row,8]<-paste0(ID, collapse=", ")
    return(df)
  }
#-------------------------------------------------------------------------------------------
#crossValid1 function
# cross valid value check - checks values if condition one is met and checks values if condition is not met
crossValid1 <- function(data,df,cid1, cid1_values,cid2,cid2_values,df_row) {
    # make many "OR" statements if multiple values in cid2_values
    mylist_a =  paste0(("data$"),cid2,(" == "), cid2_values, sep =" | ")
    mylist_b = str_c(mylist_a, sep = "", collapse ="") 
    mylist = paste0("(",str_sub(mylist_b, end =-4),")") #remove extra " |" at the end of string
    
    idx = which(eval(parse(text=mylist))) # remove quotes to make logical expression
    QCcheck1 =which(data[[cid1]][idx]%!in%cid1_values)
    
    # gather data for error report
    rowNum<-QCcheck1
    token<- data$"token"[QCcheck1]
    ID = data$Connect_ID[QCcheck1]
    invalid_values = addNA(data[[cid1]][idx][QCcheck1])
    
    # populate error report 
    df[df_row,1]<-substr(paste0(cid1),3,100)
    df[df_row,2]<-paste0("CROSSVALID1")
    df[df_row,3]<-str_c(cid1_values,collapse=",")
    df[df_row,4]<-str_sub(mylist, end =-1)
    df[df_row,5]<-str_c(invalid_values, collapse=", ")
    df[df_row,6]<-paste0(rowNum, collapse=", ")
    df[df_row,7]<-paste0(token, collapse=", ")
    df[df_row,8]<-paste0(ID, collapse=", ")
    return(df)
  }
#-------------------------------------------------------------------------------------------
#crossValid2 function
# cross valid value check - checks values if condition one is met and checks values if condition is not met
crossValid2 <- function(data,df,cid1,cid1_values,cid2,cid2_values,cid3,cid3_values,df_row) {
    # make many "OR" statements if multiple values in cid2_values
    mylist_a =  paste0(("data$"),cid2,(" == "), cid2_values, sep =" | ")
    mylist_b = str_c(mylist_a, sep = "", collapse ="") 
    mylist_c = paste0("(",str_sub(mylist_b, end =-3),")") #remove extra " |" at the end of string
    mylist_a1 =  paste0(("data$"),cid3,(" == "), cid3_values, sep =" | ")
    mylist_b1 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements
    mylist_c1 = paste0("(",str_sub(mylist_b1, end =-3),")") #remove extra " |" at the end of string
    mylist = paste(mylist_c, mylist_c1,sep=" &  ")
    
    idx = which(eval(parse(text=mylist))) # remove quotes to make logical expression
    QCcheck1 =which(data[[cid1]][idx]%!in%cid1_values)
    
    # gather data for error report
    rowNum<-QCcheck1
    token<- data$"token"[QCcheck1]
    ID = data$Connect_ID[QCcheck1]
    invalid_values = addNA(data[[cid1]][QCcheck1])
    
    # populate error report 
    df[df_row,1]<-substr(paste0(cid1),3,100)
    df[df_row,2]<-paste0("CROSSVALID2")
    df[df_row,3]<-str_c(cid1_values,collapse=",")
    df[df_row,4]<-str_sub(mylist)   #, end =-1)
    df[df_row,5]<-str_c(invalid_values, collapse=", ")
    df[df_row,6]<-paste0(rowNum, collapse=", ")
    df[df_row,7]<-paste0(token, collapse=", ")
    df[df_row,8]<-paste0(ID, collapse=", ")
    return(df)
  }
#-------------------------------------------------------------------------------------------
#crossValid3 function
# cross valid value check - checks values if condition one is met and checks values if condition is not met
crossValid3 <- function(data,df,cid1,cid1_values,cid2,cid2_values,cid3,cid3_values,cid4,cid4_values,df_row) {
  
    # make many "OR" statements if multiple values in cid2_values
    mylist_a =  paste0(("data$"),cid2,(" == "), cid2_values, sep =" | ")
    mylist_b = str_c(mylist_a, sep = "", collapse ="") 
    mylist_c = paste0("(",str_sub(mylist_b, end =-3),")") #remove extra " |" at the end of string
    mylist_a1 =  paste0(("data$"),cid3,(" == "), cid3_values, sep =" | ")
    mylist_b1 = str_c(mylist_a1, sep = "", collapse ="") # make many or statements
    mylist_c1 = paste0("(",str_sub(mylist_b1, end =-3),")") #remove extra " |" at the end of string
    mylist_a2 =  paste0(("data$"),cid4,(" == "), cid4_values, sep =" | ")
    mylist_b2 = str_c(mylist_a2, sep = "", collapse ="") # make many or statements
    mylist_c2 = paste0("(",str_sub(mylist_b2, end =-3),")") #remove extra " |" at the end of string
    mylist = paste(mylist_c, mylist_c1,mylist_c2,sep=" &  ")
    
    idx = which(eval(parse(text=mylist))) # remove quotes to make logical expression
    QCcheck1 =which(data[[cid1]][idx]%!in%cid1_values)
    
    # gather data for error report
    rowNum<-QCcheck1
    token<- data$"token"[QCcheck1]
    ID = data$Connect_ID[QCcheck1]
    invalid_values = addNA(data[[cid1]][QCcheck1])
    
    # populate error report 
    df[df_row,1]<-substr(paste0(cid1),3,100)
    df[df_row,2]<-paste0("CROSSVALID3")
    df[df_row,3]<-str_c(cid1_values,collapse=",")
    df[df_row,4]<-str_sub(mylist)   #, end =-1)
    df[df_row,5]<-str_c(invalid_values, collapse=", ")
    df[df_row,6]<-paste0(rowNum, collapse=", ")
    df[df_row,7]<-paste0(token, collapse=", ")
    df[df_row,8]<-paste0(ID, collapse=", ")
    return(df)
  }
  #-------------------------------------------------------------------------------------------
  #NA_valid_length function
  # equal to or less than character length or NA
  
  NA_length <- function(data,df,cid1,length,df_row) {
    
    list_lengths = sapply(data[[cid1]],nchar)
    invalid_length = list_lengths[list_lengths > length & !is.na(list_lengths)]
    QCcheck1 = which(list_lengths > length & !is.na(list_lengths))
    invalid_values = data[[cid1]][QCcheck1]
    rowNum<-QCcheck1
    token<- data$"token"[QCcheck1]
    ID = data$Connect_ID[QCcheck1]
    
    # populate error report 
    df[df_row,1]<-substr(paste0(cid1),3,100)
    df[df_row,2]<-paste0("LENGTH")
    df[df_row,3]<-paste0("char length = ",length)
    df[df_row,4]<-paste0("char length NOT <= or NA",length)
    df[df_row,5]<-paste0(invalid_values, collapse=", ")
    df[df_row,6]<-paste0(rowNum, collapse=", ")
    df[df_row,7]<-paste0(token, collapse=", ")
    df[df_row,8]<-paste0(ID, collapse=", ")
    return(df)
  }
#-------------------------------------------------------------------------------------------
#NA_range function
# equal to or less than character length or NA

NA_range <- function(data,df,cid1,range,df_row) {
       valid_length= strsplit(range, "-")
       valid_length_min = as.numeric(valid_length[[1]][1])
       valid_length_max = as.numeric(valid_length[[1]][2])
       variable = data[[cid1]]
       list_lengths = unique(sapply(variable,nchar))
       invalid_values = list_lengths[list_lengths < valid_length_min | list_lengths > valid_length_max & !is.na(list_lengths)]
       
       QCcheck1 = which(list_lengths < valid_length_min | list_lengths > valid_length_max & !is.na(list_lengths))
       rowNum<-QCcheck1
       token<- data$"token"[QCcheck1]
       ID = data$Connect_ID[QCcheck1]
       
       df[df_row,1]<-substr(paste0(cid1),3,100)
       df[df_row,2]<-paste0("NA_RANGE")
       df[df_row,3]<-paste0("range: ",range)
       df[df_row,4]<-paste0("range NOT =",range)
       df[df_row,5]<-paste0(invalid_values, collapse=", ")
       df[df_row,6]<-paste0(rowNum, collapse=", ")
       df[df_row,7]<-paste0(token, collapse=", ")
       df[df_row,8]<-paste0(ID, collapse=", ")
       return(df)
}

######## QC d_827220437
# cross valid 1 check

              df  = crossValid1(connectData,df,d_827220437,c(531629870, 548392715, 125001209, 327912200, 300267574, 452412599, 303349821, 657167265, 809703864, 517700004, 181769837, 13),d_512820379,c(854703046),1)
######## QC d_827220437
# valid value check

            df  = valid(connectData,df,d_827220437,c(531629870, 548392715, 125001209, 327912200, 300267574, 452412599, 303349821, 657167265, 809703864, 517700004, 181769837, 13),2)


#-------------------------------------------------------------------------------------------
# filter df to show QC errors only

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
    
    # add site column
    qc_errors = add_column(qc_errors, site = as.character(site) , .before=1)
    # add date column
    qc_errors = add_column(qc_errors, date = Sys.Date() , .before=1)
    
    ######## upload report to bigquery ##############################
    
    #Append data to an existing table or create a table if if doesnt exist
    bq_table_upload(x=QC_report_location,
                    values=qc_errors,
                    fields = qc_errors,
                    create_disposition="CREATE_IF_NEEDED",
                    write_disposition="WRITE_APPEND")

}}
