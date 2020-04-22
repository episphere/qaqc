// dev http://localhost:8000/qaqc/?script=5&boxid=653087731560

runQAQC=function(data){
    console.log(`upset.js runQAQC function ran at ${Date()}`)
    let h=`<table><tr><td>`
    h+=`<p>Raw data: ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
    h+='<p style="color:blue">Studies: <br><span style="color:brown">'
    upset.getStudies()
    upset.data.studies.forEach(s=>{
        h+=`<input type='checkbox' id="${s}_check" onchange="upset.count()" checked=true>${s.slice(6)}; `
    })
    h+='</span></p>'
    // table
    h+='<p style="color:blue">Constraints: <span style="color:green">'
    upset.data.parms.forEach(s=>{
        h+=`<br><input type='checkbox' id="${s}_parm" onchange="upset.check('${s}');upset.count()">${s} (<span id="${s}_count" style="color:gray"></span>); `
    })
    h+='</span></p>'
    h+='</td><td vAlign="bottom"><div id="constrainingPlotly"></div></td></tr>'
    h+='<tr><td>'
    h+='<hr>'
    h+='<div id="upsetCountDiv">'
    h+='</div>'
    h+='</td><td vAlign="top"><div id="constrainedPlotly"></div></td></tr>'
    h+='</table>'
    setTimeout(upset.count,1000)
    return h
}

upset={
    data:{
        studies:[],
        parms:[],
        selectedParms:[]
    }
}

upset.getStudies=_=>{
    Object.keys(qaqc.data).forEach(x=>{
        if(x.match('study_')){
            upset.data.studies.push(x)
        }else{
            upset.data.parms.push(x)
        }
    })
    return upset.data.studies
}

upset.count=function(data=qaqc.data,div='upsetCountDiv'){
    if(typeof(div)=='string'){
        div=document.getElementById(div)
    }
    // count studies
    let n=qaqc.data[upset.data.studies[0]].length
    upset.data.studiesArray=[...Array(n)].map((_,i)=>0)
    upset.data.studies.forEach(s=>{
        let ip = document.getElementById(s+'_check')
        if(ip.checked){
            upset.data.studiesArray=upset.data.studiesArray.map((x,i)=>{
                return x||data[s][i]
            })
        }
        //debugger
    })
    // count with all constraints
    upset.data.countAll=upset.data.studiesArray
    // ... update count so far
    let h = `# individuals in the studies selected: ${upset.data.studiesArray.reduce((a,b)=>a+b)}`
    console.log(upset.data.selectedParms)
    upset.data.selectedParms.forEach(p=>{
        upset.data.countAll=upset.data.countAll.map((x,i)=>{
            return x&data[p][i]
        })
        h+=`<br>with ${p}: ${upset.data.countAll.reduce((a,b)=>a+b)}`
    })
    upset.data.parms.forEach(s=>{
        let c = document.getElementById(s+'_count')
        c.textContent=upset.data.countAll.map((x,i)=>{
            return x&data[s][i]
        }).reduce((a,b)=>a+b)
        //debugger
    })

    div.innerHTML=h
}

upset.check=(s)=>{
    if(upset.data.selectedParms.indexOf(s)==-1){
        upset.data.selectedParms.push(s)
    }else{
        let ind=upset.data.selectedParms.indexOf(s)
        upset.data.selectedParms=upset.data.selectedParms.slice(0,ind).concat(upset.data.selectedParms.slice(ind+1))
        //debugger
    }
    
}
