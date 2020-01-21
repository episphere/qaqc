console.log('qaqc.js loaded')
qaqc={}
qaqc.ui=(target='qaqcDiv')=>{
    if(typeof(target)=='string'){
        target=document.getElementById(target)
    }
    let h='<p style="color:navy">Load a <button id="loadFile" onclick="qaqc.load(this)">file</button>, <button id="loadURL" onclick="qaqc.load(this)">URL</button>, <button id="loadBox" onclick="qaqc.load(this)">Box id</button>, or <button id="loadTxt" onclick="qaqc.load(this)">paste data as text</button></p>'
    h +='<div id="loadQAQC" style="color:blue"></div>'
    target.innerHTML=h
}

qaqc.openFile=(ev)=>{ // inspired by https://www.javascripture.com/FileReader
    var input = ev.target;
    fileInfo.innerText=new Date(input.files[0].lastModified)
    var reader = new FileReader();
    reader.onload = function(){
      qaqc.dataTxt = reader.result.trim();  // qaqc.dataTxt is defined here, it will be undefined by default
      qaqc.tabulateTxt()
      qaqc.dataAnalysis()
    };
    reader.readAsText(input.files[0]);
}

qaqc.loadURL=async(url=inputURL.value)=>{
    qaqc.dataTxt = (await (await fetch(url)).text()).trim()
    qaqc.tabulateTxt()
    qaqc.dataAnalysis()
}

qaqc.load=el=>{
    let h=`${el.id} under development`
    switch(el.id){
        case 'loadFile':
            h=`<input type="file" id="readButton" onchange="qaqc.openFile(event)">`
            h+='<pre id="fileInfo">upload file from your hard-disk</pre>'
            loadQAQC.innerHTML=h;
            setTimeout(function(){readButton.click()},100)
        break
        case 'loadURL':
            h=`URL: <input id="inputURL"> <i id="loadFileFromURL" style="font-size:xx-large;color:green;cursor:pointer;vertical-align:bottom" class="fa fa-cloud-download" data-toggle="tooltip" data-placement="left" title="Load file from url" onclick="qaqc.loadURL()"></i> <i style="cursor:pointer" class="fa fa-external-link" data-toggle="tooltip" data-placement="left" title="open file in new tab"
 onclick="window.open(document.getElementById('inputURL').value)"></i>`
        break
        case 'loadBox':
            h=`<pre id="epibox_msg"></pre>
            <button onclick="epibox.checkToken()">Session</button>
            <button onclick="epibox.refreshToken()">Refresh</button>
            <button onclick="(async function(){await epibox.getUser();epibox.msg(JSON.stringify(epibox.oauth.user,null,3))})()">User</button>
            <button onclick="epibox.logout()">Logout</button>
            file id: <input id="boxInput">`
            setTimeout(async _=>{
                let ip=document.getElementById('boxInput')
                ip.focus()
                ip.onkeyup=evt=>{
                    if(evt.keyCode==13){ // if enter, for the iris.csv demo use 602505986610
                        epibox.msg('reading file ...')
                        epibox.getText(`https://api.box.com/2.0/files/${ip.value}/content`).then(txt=>{
                            epibox.msg('... done')
                            qaqc.dataTxt=txt
                            qaqc.tabulateTxt()
                            qaqc.dataAnalysis()
                        })
                        /*
                        fetch(`https://api.box.com/2.0/files/${ip.value}/content`,{
                            method:'GET',
                            headers:{
                                Authorization:"Bearer "+epibox.oauth.token.access_token
                            }
                        }).then(x=>{
                            x.text().then(txt=>{
                                debugger
                            })
                            
                        })
                        */
                    }
                    //debugger
                }
                epibox.checkToken()
            },1000)
        break
        default:
            console.warn(`button with id "${el.id}" not found`)
        break
    }
    loadQAQC.innerHTML=h
}


qaqc.tabulateTxt=(txt=qaqc.dataTxt)=>{
    if(txt.slice(0,1)=='['){txt='{'+txt+'}'}
    if(txt.slice(0,1)=='{'){
        qaqc.data=JSON.parse(txt)
    }else{
        const arr =txt.split(/[\r\n]/g).map(row=>{  // data array
            return row.split(/[,\t]/g) // split csv and tsv alike
        })
        qaqc.data={} // qaqc.data is defined here, it will be undefined by default
        labels= arr[0]
        labels.forEach((label)=>{
            qaqc.data[label]=[]
        }) 
        arr.slice(1).forEach((row,i)=>{
            labels.forEach((label,j)=>{
                qaqc.data[label][i]=row[j]
            })
        })
        labels.forEach(label=>{
            qaqc.data[label]=qaqc.numberType(qaqc.data[label])
        })
    }
        
}

qaqc.numberType=aa=>{ // try to fit numeric typing
    let tp='number'
    aa.forEach(a=>{
        if(!((a==parseFloat(a))||(a=='undefined'))){
            tp='string'
        }
    })
    if(tp=='number'){
        aa=aa.map(a=>{
            if(a=='undefined'){
                a=undefined
            }else{
                a=parseFloat(a)
            }
            return a
        })
    }
    return aa
}

qaqc.saveFile=(txt,fileName)=>{
    if(fileName){
        const bb = new Blob([txt]);
        const url = URL.createObjectURL(bb);
        let a = document.createElement('a');
        a.href=url;
        a.download=fileName;
        a.click(); 
        //return a
    }else{
        let h=`filename:<input><button onclick="qaqc.saveFile(decodeURIComponent('${encodeURIComponent(txt)}'),this.parentElement.querySelector('input').value)" txt="${txt}">save data as JSON</button>`
        return h
    }      
}

qaqc.dataAnalysis=(div="dataAnalysisDiv")=>{
    console.log(`qaqc analysis triggered at ${Date()}`)
    if(typeof(div)=='string'){div=document.getElementById(div)}
    if(qaqc.data){
        if(typeof(runQAQC)!='undefined'){
            div.innerHTML=`<h2>Report</h2>
            <p style="font-size:small;color:green">[${Date()}]</p>
            <div id="qaqcReport">${runQAQC(qaqc.data)}</div>
            <hr>`    
        }else{
            div.innerHTML='<h3 style="color:red">no runQAQC function found ...</h3><p style="color:red">... please chose one from the Script List above</p>'
        }
    }
}

// processing url composition

qaqc.getParms=function(){
    if(localStorage.qaqcParms){
        qaqc.parms=JSON.parse(localStorage.qaqcParms)
    }else{
        qaqc.parms={}
    }
    let pp = location.hash.slice(1)+location.search.slice(1)
    pp.split('&').forEach(av=>{
        av=av.split('=')
        qaqc.parms[av[0]]=av[1]
    })
    
    // actions
    if(qaqc.parms.url){
        setTimeout(_=>{
            loadURL.click()
            inputURL.value=qaqc.parms.url
            loadFileFromURL.click()
        },1000)
    }
    if(qaqc.parms.script){
        setTimeout(_=>{
            document.querySelectorAll('.runScript')[qaqc.parms.script].click()
        },100)
    }


    //debugger
}
qaqc.getParms()