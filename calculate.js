
const calculatePavValue=(event,psg)=>{
    console.log(psg);
    psg=Number(psg);
    console.log(typeof(psg));
    let v4=psg*0.24;
    let paca=document.getElementById("paca");
    paca.value=v4.toFixed(2);
};

let pav=document.getElementById("pav");

pav.addEventListener('change',(event)=>{
    calculatePavValue(event,pav.value);
});
let mcf=document.getElementById("mcf");
let acfg=document.getElementById("acfg");
let avgp=document.getElementById("avgp");
let ppty=document.getElementById("ppty");
const show=()=>{

    let pptys=Number(ppty.value);
    let purchased=document.getElementById("purchased");
    purchased.innerHTML=pptys;
    purchased.value=pptys

    let cumulative=document.getElementById("cumulative");
    cumulative.innerHTML=pptys;
    cumulative.value=pptys;
    // console.log(pptys);

    let paca=document.getElementById("paca");
    
    let personal=document.getElementById("personal");
    personal.innerHTML=pptys*Number(paca.value);
    personal.value=pptys*Number(paca.value).toFixed(2);
    
    let values=document.getElementById("value");
    values.innerHTML=pptys*Number(paca.value);
    values.value=pptys*Number(paca.value).toFixed(2);


    let equity=document.getElementById("equity");
    equity.value=(values.value-cumulative.value)*Number(pav.value)*0.8;
    equity.innerHTML=equity.value.toFixed(2);

    let flow=document.getElementById("flow");
    flow.value=cumulative.value*(Number(mcf.value)*(1+Number(acfg.value)))**(pptys-1);
    flow.innerHTML=(flow.value).toFixed(2);
    

    let cumulativeccf=document.getElementById("cumulativeccf");
    cumulativeccf.value=flow.value*11;
    cumulativeccf.innerHTML=cumulativeccf.value.toFixed(2);
    
    let minus=document.getElementById("minus");
    minus.value=cumulativeccf.value;
    minus.innerHTML=minus.value.toFixed(2);
    
     
}
ppty.addEventListener('change',show);
