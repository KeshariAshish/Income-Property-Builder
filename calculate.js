let arr = [];
const calculatePavValue = (event, psg) => {
    // console.log(psg);
    psg = Number(psg);
    // console.log(typeof(psg));
    let v4 = psg * 0.24;
    let paca = document.getElementById("paca");
    paca.value = v4.toFixed(2);
};

let pav = document.getElementById("pav");

pav.addEventListener('change', (event) => {
    calculatePavValue(event, pav.value);
});
let mcf = document.getElementById("mcf");
let acfg = document.getElementById("acfg");
let avgp = document.getElementById("avgp");
let ppty = document.getElementById("ppty");
const show = () => {
    let arr1 = [];
    let pptys = Number(ppty.value);
    let purchased = document.getElementById("purchased");
    purchased.innerHTML = pptys;
    purchased.value = pptys;
    arr1.push(purchased.value);
    arr1.push(0);

    let cumulative = document.getElementById("cumulative");
    cumulative.innerHTML = pptys;
    cumulative.value = pptys;
    arr1.push(cumulative.value);
    // console.log(pptys);

    let paca = document.getElementById("paca");

    let personal = document.getElementById("personal");
    personal.innerHTML = pptys * Number(paca.value);
    personal.value = pptys * Number(paca.value).toFixed(2);
    arr1.push(personal.value);
    arr1.push(0);

    let values = document.getElementById("value");
    values.innerHTML = pptys * Number(pav.value);
    values.value = pptys * Number(pav.value).toFixed(2);
    arr1.push(values.value);


    let equity = document.getElementById("equity");
    equity.value = values.value - (cumulative.value * pav.value * 0.8);
    equity.innerHTML = equity.value.toFixed(2);
    arr1.push(equity.value);

    let count_year = document.getElementById("count_year");
    count_year.value = 1;


    let flow = document.getElementById("flow");
    flow.value = cumulative.value * (mcf.value * (1 + (pav.value / 5)) ** (count_year.value - 1));
    flow.innerHTML = (flow.value).toFixed(2);
    arr1.push(flow.value);


    let cumulativeccf = document.getElementById("cumulativeccf");
    cumulativeccf.value = flow.value * 11;
    cumulativeccf.innerHTML = cumulativeccf.value.toFixed(2);
    arr1.push(cumulativeccf.value);

    let purchases = document.getElementById("purchases");
    purchases.value = 0;


    let minus = document.getElementById("minus");
    minus.value = cumulativeccf.value - (purchases.value * paca.value);
    minus.innerHTML = minus.value.toFixed(2);
    arr1.push(minus.value);

    arr.push(arr1);
    // console.log(arr);
    forloop();
    let arr2 = secondLastTable();
    lastTable(arr2);

}

ppty.addEventListener('change', show);


const cashFlow = () => {
    let vari = 0;
    // console.log(arr[0][8]);
    let ccf = Number(arr[arr.length - 1][8]);
    var k, sum = 0;
    for (k = 0; k < arr.length; k++) {
        sum += Number(arr[k][1]);
    }
    let cffp = sum;
    let paca = document.getElementById("paca");
    paca = Number(paca.value);
    if ((ccf - (cffp * paca)) > paca) {
        vari = Math.round((ccf - (cffp * paca)) / paca, 0).toFixed(2);

    }
    return Number(vari);
}
const cumulativesyear = (i) => {
    let varia = 0;
    var k, sum = 0;
    for (k = 0; k < arr.length; k++) {
        sum += Number(arr[k][0]);
        sum += Number(arr[k][1]);
    }
    sum += i;
    return Number(sum.toFixed(2));

}
const updateCumulativesyear = (cffi, vr, i, j) => {
    console.log(typeof (cffi), typeof (vr), typeof (i), typeof (j));

}
const purcha = (i) => {
    let paca = document.getElementById("paca");
    paca = Number(paca.value);
    return (paca * Number(i)).toFixed(2);
}
const portfo = (i) => {
    let paca = document.getElementById("paca");
    paca = Number(paca.value);
    return (paca * Number(i)).toFixed(2);
}
const projected = (i, j) => {
    let avgp = Number((document.getElementById("avgp")).value) / 100;
    let pav = Number((document.getElementById("pav")).value);
    return Number(arr[arr.length-1][5] * (1+avgp) + (Number(i)+Number(j)) * pav).toFixed(2);
   // return Number(arr[arr.length - 1][5]) * (1 + avgp) + (Number(i) + Number(j)) * pav).toFixed(2);//avgp=pav/5
}
const equit = (i, j) => {
    let pav = Number((document.getElementById("pav")).value);
    return (Number(j) - Number(i) * pav * (0.8)).toFixed(2);//portfolio total value-cumulative prop each year  
}
const monthly = (i, j) => {
    return (Number(arr[arr.length - 1][7]) * (1 + Number(acfg.value) / 100) + (Number(i) + Number(j)) * Number(mcf.value)).toFixed(2);
}
const vacancy = (i) => {
    return (Number(arr[arr.length - 1][8]) + Number(i) * 11).toFixed(2);
}
const minu = (i, j) => {
    let paca = document.getElementById("paca");
    paca = Number(paca.value);
    return Number(j - i * paca).toFixed(2);

    //return (Number(arr[arr.length-1][8])-(Number(arr[arr.length-1][1])+Number(i))*paca).toFixed(2);
}
const changeHandler = (event, i) => {
    console.log("hiiiiii");
    console.log(event.target.innerHTML);
    let vr = event.target.innerHTML;
    let cff = arr[i + 2][1];
    // console.log("hello");
    updateCumulativesyear(cff, vr, i + 1, 2);
}
const lastTable = (arr2) => {
    let end_state = document.getElementById("end_state");
    let personal_cash = document.getElementById("personal_cash");
    let portfolio_cash = document.getElementById("portfolio_cash");
    let portfolio_gross = document.getElementById("portfolio_gross");
    let portfolio_equity = document.getElementById("portfolio_equity");
    let monthly_cash = document.getElementById("monthly_cash");

    let second = arr2[1];
    let third = arr2[2];
    let fourth = arr2[3];
    let fifth = arr2[4];

    let avgp = document.getElementById("avgp");

    var end_state_sum = 0, personal_cash_sum = 0, port_cash_sum = 0;
    for (k = 0; k < arr.length; k++) {
        end_state_sum += Number(arr[k][0]);
        end_state_sum += Number(arr[k][1]);
        personal_cash_sum += Number(arr[k][3]);
        port_cash_sum += Number(arr[k][4]);
    }
    port_cash_sum+=Number(second);
    end_state.innerHTML = Number(end_state_sum).toFixed(2);
    personal_cash.innerHTML = Number(personal_cash_sum).toFixed(2);
    portfolio_cash.innerHTML = Number(port_cash_sum).toFixed(2);
    portfolio_gross.innerHTML = Number(arr[arr.length-1][5] + Number(third))*(Math.pow(1+(Number(avgp.value)/100)),12).toFixed(2);
    portfolio_equity.innerHTML = Number(portfolio_gross.innerHTML-(arr[arr.length-1][5]+ Number(third)-(arr[arr.length-1][6]+Number(fourth))-Number(second))).toFixed(2);
    monthly_cash.innerHTML = Number(Number(fifth) + arr[arr.length-1][7]).toFixed(2);


}
const secondLastTable = () => {
    let first = document.getElementById("first");
    let second = document.getElementById("sec");
    let third = document.getElementById("third");
    let fourth = document.getElementById("fourth");
    let fifth = document.getElementById("fifth");

    let paca = document.getElementById("paca");
    paca = Number(paca.value);
    let pav = document.getElementById("pav");
    pav = Number(pav.value);
    let mcf = document.getElementById("mcf");
    mcf = Number(mcf.value);
    let arr2 = [];
    arr2.push(Number(Math.round(arr[arr.length - 1][5] * 0.71 - (arr[arr.length - 1][5] - arr[arr.length - 1][6])) / paca, 0).toFixed(2));
    arr2.push( Number(arr2[0] * paca).toFixed(2));
    arr2.push(Number(arr2[0] * pav).toFixed(2));
    arr2.push(Number(arr2[2] * 0.2).toFixed(2));
    arr2.push(Number(arr2[0] * mcf).toFixed(2));

    first.innerHTML = arr2[0];
    second.innerHTML =  arr2[1];
    third.innerHTML = arr2[2];
    fourth.innerHTML =  arr2[3];
    fifth.innerHTML =  arr2[4];
    return arr2;
}
const forloop = () => {
    let tabular = document.getElementById("tabular");
    let year = 2021;
    let count = 2;
    for (let i = 0; i < 11; i++) {
        let arr2 = [];
        let row = document.createElement("tr");
        for (let j = 0; j < 12; j++) {
            let column = document.createElement("td");
            column.id = i.toString() + " " + j.toString();
            column.className = "pt-3-half";
            if (j === 2) {
                if (year != 2022) {
                    arr2.push(0);
                    column.innerHTML = 0;
                    // console.log("hellooutside");
                    column.addEventListener("mouseout", (event) => { changeHandler(event, i); });
                    column.setAttribute("contenteditable", true);
                }
            }
            else
                column.setAttribute("contenteditable", false);
            if (j === 2 && year == 2022) {
                arr2.push(1);
                column.innerHTML = 1;
                // console.log("hellooutside");
                column.addEventListener("mouseout", (event) => { changeHandler(event, i); });
                column.setAttribute("contenteditable", true);
            }

            if (j === 0) {
                column.innerHTML = count++;
            }
            if (j === 1) {
                column.innerHTML = year++;
            }
            if (j == 3) {
                let cash = cashFlow();
                column.innerHTML = cash;
                arr2.push(cash);

            }
            if (j == 4) {
                let cumulatives = cumulativesyear(Number(arr2[0] + arr2[1]));
                column.innerHTML = cumulatives;
                arr2.push(cumulatives);
            }
            if (j === 5) {
                let purch = purcha(arr2[0]);
                column.innerHTML = purch;
                arr2.push(Number(purch));
            }
            if (j === 6) {
                let port = portfo(arr2[1]);
                column.innerHTML = port;
                arr2.push(Number(port));
            }
            if (j === 7) { 
                let project = projected(arr2[0], arr2[1]);
                column.innerHTML = project;
                arr2.push(Number(project));
            }
            if (j === 8) {
                let equi = equit(arr2[2], arr2[5]);
                column.innerHTML = equi;
                arr2.push(Number(equi));
            }
            if (j === 9) {
                let month = monthly(arr2[0], arr2[1]);
                column.innerHTML = month;
                arr2.push(Number(month));
            }
            if (j === 10) {
                let vacan = vacancy(arr2[7]);
                column.innerHTML = vacan;
                arr2.push(Number(vacan));
            }
            if (j === 11) {
                var k, sum = 0;
                for (k = 0; k < arr.length; k++) {
                    sum += Number(arr[k][1]);
                }
                sum += Number(arr2[1]);
                let mi = minu(sum, arr2[8]);
                column.innerHTML = mi;
                arr2.push(Number(mi));
            }
            row.appendChild(column);

        }
        tabular.appendChild(row);
        arr.push(arr2);

    }
}
