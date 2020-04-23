// dev http://localhost:8000/qaqc/?script=5&boxid=653087731560

runQAQC=function(data){
    console.log(`upset.js runQAQC function ran at ${Date()}`)
    let h=`<table><tr><td vAlign="bottom">`
    h+=`<p>Raw data: ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
    h+='<p style="color:blue">Studies: <br><span style="color:brown">'
    upset.getStudies()
    upset.data.studies.forEach(s=>{
        h+=`<input type='checkbox' id="${s}_check" onchange="upset.count()" checked=true>${s.slice(6)}; `
    })
    h+='</span></p>'
    // table
    h+='<p style="color:blue">Constraints: <span style="color:green">'
    upset.data.parms.forEach((s,i)=>{
        h+=`<br>${i}.<input type='checkbox' id="${s}_parm" onchange="upset.check('${s}');upset.count()">${s} (<span id="${s}_count" style="color:gray"></span>); `
    })
    h+='</span></p>'
    h+='</td><td vAlign="bottom"><div id="constrainingPlotly"></div></td></tr>'
    h+='<tr><td vAlign="top">'
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
    upset.data.countConstrained=[{total:upset.data.studiesArray.reduce((a,b)=>a+b)}]

    let h = `<p style="color:navy"># individuals in the studies selected: (<span style="color:blue">${upset.data.countConstrained[0].total}</span>)`
    console.log(upset.data.selectedParms)
    upset.data.selectedParms.forEach((p,i)=>{
        upset.data.countAll=upset.data.countAll.map((x,i)=>{
            return x&data[p][i]
        })
        let c = {}
        c[p]=upset.data.countAll.reduce((a,b)=>a+b)
        upset.data.countConstrained.push(c)
        h+=`<br>${i+1}. with ${p}: (<span style="color:blue">${c[p]}</span>)`
    })
    upset.data.countParms={}
    upset.data.parms.forEach(s=>{
        let c = document.getElementById(s+'_count')
        upset.data.countParms[s]=upset.data.countAll.map((x,i)=>{
            return x&data[s][i]
        }).reduce((a,b)=>a+b)
        c.textContent=upset.data.countParms[s]
    })
    h+='</p>'
    div.innerHTML=h
    upset.constrainingPlotly()
    upset.constrainedPlotly()
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

upset.constrainingPlotly=_=>{
    let trace={
        x:[],
        y:[],
        text:[],
        type: 'bar',
        orientation: 'h',
        textposition:"inside",
        width:0.9,
    }
    upset.data.parms.forEach((p,i)=>{
        trace.x.push(upset.data.countParms[p])
        trace.y.push(i+1)
        trace.text.push(p)
    })
    Plotly.newPlot('constrainingPlotly',[trace],{
        height: 35*upset.data.parms.length,
        width: 500,
        yaxis: {autorange: 'reversed'},
        xaxis:{
            title:'cohort size (# individuals)'
        }
    })
}

upset.constrainedPlotly=_=>{
    let trace={
        type:'scatter',
        x:[],
        y:[],
        //text:[],
        //mode: 'lines+markers+text',
        mode: 'lines+markers',
        line:{
            color:'blue'
        }
    }
    let annotations=[]
    upset.data.countConstrained.forEach((x,i)=>{
        let L = Object.keys(upset.data.countConstrained[i])[0]
        trace.x.push(i)
        //trace.text.push(L)
        trace.y.push(x[L])
        annotations.push({
            showarrow: false,
            x: i,
            y: x[L],
            text:`${upset.data.parms.indexOf(L)}. ${L}`,
            textangle:-30,
            font: {
                color: 'green',
                size:14
            }
        })
        annotations[0].text=Object.keys(upset.data.countConstrained[0])[0]
    })
    Plotly.newPlot('constrainedPlotly',[trace],{
        height: 500,
        width: 500,
        yaxis:{
            title:'cohort size (# individuals)'
        },
        annotations:annotations
    })
    
}
