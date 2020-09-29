const SNO = 'sno';
const PROP_YEAR = 'year';
const PROP_PURCHASED_YEAR = 'prop_purchased_year';
const CASH_FLOW_FUND_PROP = 'cash_flow_fund_prop';
const CUMULATIVE_OWNED_EACH_YEAR = 'cumulative_owned_each_year';
const PERSONAL_INVESTMENT = 'personal_investment';
const PORTFOLIO_CASH_REINVESTMENT = 'portfolio_cash_reinvestment';
const PROJECTED_PORTFOLIO_TOTAL_VALUE = 'projected_portfolio_total_value';
const PROJECTED_TOTAL_EQUITY = 'projected_total_equity';
const PROJECTED_MONTHLY_CASH_FLOW = 'projected_monthly_cash_flow';
const CUMUL_CASH_FLOW_VAC = 'cumul_cash_flow_vac';
const CUMUL_CASH_FLOW_MINUS_REINVEST = 'cumul_cash_flow_minus_reinvest';

const columns = [
    SNO,
    PROP_YEAR,
    PROP_PURCHASED_YEAR,
    CASH_FLOW_FUND_PROP,
    CUMULATIVE_OWNED_EACH_YEAR,
    PERSONAL_INVESTMENT,
    PORTFOLIO_CASH_REINVESTMENT,
    PROJECTED_PORTFOLIO_TOTAL_VALUE,
    PROJECTED_TOTAL_EQUITY,
    PROJECTED_MONTHLY_CASH_FLOW,
    CUMUL_CASH_FLOW_VAC,
    CUMUL_CASH_FLOW_MINUS_REINVEST,
];
let dataStore = {} // array of object to store already calculated value

var data = [
    { x: "White", value: 223553265 },
    { x: "Black or African American", value: 38929319 },
    { x: "American Indian and Alaska Native", value: 2932248 },
    { x: "Asian", value: 14674252 },
    { x: "Native Hawaiian and Other Pacific Islander", value: 540013 },
    { x: "Some Other Race", value: 19107368 },
    { x: "Two or More Races", value: 9009073 }
];

// formatted value function
function getFormattedAmount(amount){
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    return formatter.format(amount);
}

window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};


const rows = 12;
const start_year = 2020;
let monthly_cash_flow = Number($('#monthly_cash').val());
let annual_cash_flow = Number($('#annual_cash_flow').val());
let annual_value_growth = Number($('#annual_value_growth').val());
let property_acquisition_value = Number($('#property_acquisition_value').val());
let property_acquisition_cost = Number($('#property_acquisition_cost').val());


function refreshDataStore() {
    let start_num = 1;
    for (let year = start_year; year < start_year + rows; year++, start_num++) {
        dataStore[year] = dataStore[year] || {};
        for (let column of columns) {
            if (column === SNO) {
                dataStore[year][column] = start_num;
            } else if (column === PROP_YEAR) {
                dataStore[year][column] = year;
            } else if (column === PROP_PURCHASED_YEAR) {
                dataStore[year][column] = dataStore[year][column] || 0;
            } else {
                dataStore[year][column] = 0
            }
        }
    }
}

function setInStore(column, year, value) {
    dataStore[year][column] = value;
}

function getFromStore(column, year) {
    return dataStore[year][column];
}

refreshDataStore();
/** Build the table **/
const table = $('#tabular');
for (let year in dataStore) {
    let tr = $('<tr>').attr('class', year);
    let columns = dataStore[year]
    for (let column in columns) {
        let attrs = {
            id: column + '-' + year,
            class: column,
        };
        let td = $('<td>')
        if (column == PROP_PURCHASED_YEAR) {
            td.html($('<input type="number">').attr(attrs).val(columns[column]))
        } else {
            td.attr(attrs).text(columns[column]);
        }
        tr.append(td);
    }
    table.append(tr);
}

/** Attach events **/
$('#property_acquisition_value').change(function () {
    property_acquisition_value = Number($(this).val() || 0);
    let v4 = property_acquisition_value * 0.24;
    property_acquisition_cost = v4.toFixed(2);
    $('#property_acquisition_cost').val(property_acquisition_cost);
    calculatedInvestment();
});

$('#monthly_cash').change(function () {
    monthly_cash_flow = Number($(this).val() || 0);
    calculatedInvestment();
});


$('#annual_cash_flow').change(function () {
    annual_cash_flow = Number($(this).val() || 0);
    calculatedInvestment();
});

$('#annual_value_growth').change(function () {
    annual_value_growth = Number($(this).val() || 0);
    calculatedInvestment();
});

$(document).on('change', '.' + PROP_PURCHASED_YEAR, function () {
    let props = $(this).attr('id').split('-');
    const column = props[0]
    const year = props[1]
    setInStore(column, year, Number($(this).val()));
    calculatedInvestment();
});

function calculatedInvestment() {
    if (
        !monthly_cash_flow ||
        !annual_cash_flow ||
        !annual_value_growth ||
        !property_acquisition_value ||
        !property_acquisition_cost) {
        return
    }
    refreshDataStore();
    for (let year = start_year; year < start_year + rows; year++) {
        for (let column of columns) {
            let id = column + '-' + year;
            let cell = $('#' + id);
            // const value  = getValue(column, year);

            // const formattedValue = getFormattedValue(value)

            if (cell.is('input')) {
                cell.val(parseInt(getValue(column, year)))
            } else {
                if (column !== 'sno' && column !== 'year' && column !== 'prop_purchased_year'  && column !== 'cash_flow_fund_prop'
                    && column !== 'cumulative_owned_each_year' )
                    // FormattedAmout function call
                    cell.text(getFormattedAmount(parseInt(getValue(column, year))));
                else
                    cell.text(parseInt(getValue(column, year)));

            }
        }
    }

    $('#properties-12').text(get12YearProperties())

    $('#cash-reinvestment-12').text(get12YearReinvestment())
    var amount = document.getElementById('cash-reinvestment-12').innerHTML;
    document.getElementById('cash-reinvestment-12').innerHTML = getFormattedAmount(amount);

    $('#portfolio-value-12').text(get12YearPortfolioValue())
    var amount = document.getElementById('portfolio-value-12').innerHTML;
    document.getElementById('portfolio-value-12').innerHTML = getFormattedAmount(amount);

    $('#projected-total-equity-12').text(get12YearEquity())

    var amount = document.getElementById('projected-total-equity-12').innerHTML;
    document.getElementById('projected-total-equity-12').innerHTML = getFormattedAmount(amount);

    $('#projected-month-cash-12').text(get12YearMonthlyCash())
   
    var amount = document.getElementById('projected-month-cash-12').innerHTML;
    document.getElementById('projected-month-cash-12').innerHTML = getFormattedAmount(amount);

    $('#properties-24').text(get24YearProperties())
    $('#cash-funded-24').text(get24YearCashFundedProperties())
    $('#total-properties-24').text(get24YearTotalProperties())
    $('#total-personal-investment-24').text(get24YearPersonalInvestment())
   
    var amount = document.getElementById('total-personal-investment-24').innerHTML;
    document.getElementById('total-personal-investment-24').innerHTML = getFormattedAmount(amount);

    $('#total-portfolio-investment-24').text(get24YearPortfolioInvestment())

    var amount = document.getElementById('total-portfolio-investment-24').innerHTML;
    document.getElementById('total-portfolio-investment-24').innerHTML = getFormattedAmount(amount);

    $('#total-portfolio-gross-24').text(get24YearPortfolioGross())
  
    var amount = document.getElementById('total-portfolio-gross-24').innerHTML;
    document.getElementById('total-portfolio-gross-24').innerHTML = getFormattedAmount(amount);

    $('#total-portfolio-equity-24').text(get24YearPortfolioEquity())
  
    var amount = document.getElementById('total-portfolio-equity-24').innerHTML;
    document.getElementById('total-portfolio-equity-24').innerHTML = getFormattedAmount(amount);

    $('#total-monthly-cash-24').text(get24YearProjectedMonthlyCash())

    var amount = document.getElementById('total-monthly-cash-24').innerHTML;
    document.getElementById('total-monthly-cash-24').innerHTML = getFormattedAmount(amount);

}

String.prototype.ucwords = function () {
    str = this.toLowerCase();
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function (s) {
        return s.toUpperCase();
    });
};

function getValue(column, year) {
    callback = 'get' + column.replaceAll('_', ' ').ucwords().replaceAll(' ', '');
    if (window[callback]) {
        return window[callback](year);
    }
    return 0
}

function getSno(year) {
    return getFromStore(SNO, year);
}

function getYear(year) {
    return getFromStore(PROP_YEAR, year);
}

// retrieve total cash funded properties till a year
function getTotalCashFundedProperties(year) {
    let total = 0;
    for (let loop_year = start_year; loop_year <= year; loop_year++) {
        total += getFromStore(CASH_FLOW_FUND_PROP, loop_year);
    }
    return total;
}

// retrieve total properties purchased till year
function getTotalPropertiesPurchased(year) {
    let total = 0;
    for (let loop_year = start_year; loop_year <= year; loop_year++) {
        total += getFromStore(PROP_PURCHASED_YEAR, loop_year);
    }
    return total;
}

// retrieve sum of all owned properties till the year
function getTotalPropertiesOwnedTillYear(year) {
    return getTotalCashFundedProperties(year) + getTotalPropertiesPurchased(year);
}

// sum of properties in the current year
function getTotalPropertiesInYear(year) {
    return getPropPurchasedYear(year) + getCashFlowFundProp(year);
}


/** Properties purchased in that year **/
function getPropPurchasedYear(year) {
    return getFromStore(PROP_PURCHASED_YEAR, year)
}

/** Cash Flow-funded purchases **/
function getCashFlowFundProp(year) {
    let value = getFromStore(CASH_FLOW_FUND_PROP, year);
    if (!value) {
        value = (() => {
            if (year === start_year) {
                return 0;
            } else {
                const last_year = year - 1;
                const cashFlowVacancy = getValue(CUMUL_CASH_FLOW_VAC, last_year);
                const cashInHand = cashFlowVacancy - getTotalCashFundedProperties(year) * property_acquisition_cost
                if (cashInHand > property_acquisition_cost) {
                    return Math.floor(cashInHand / property_acquisition_cost);
                } else {
                    return 0;
                }
            }
        })();
        setInStore(CASH_FLOW_FUND_PROP, year, value);
    }
    return value
}


/** Cumulative Properties Owned In Each Year **/
function getCumulativeOwnedEachYear(year) {
    let value = getFromStore(CUMULATIVE_OWNED_EACH_YEAR, year);
    if (!value) {
        value = (() => {
            if (year === start_year) {
                return getPropPurchasedYear(year)
            } else {
                return getTotalPropertiesOwnedTillYear(year)
            }
        })();
        setInStore(CUMULATIVE_OWNED_EACH_YEAR, year, value);
    }
    return value
}

/** Personal Cash Investment (approx) **/
function getPersonalInvestment(year) {
    let value = getFromStore(PERSONAL_INVESTMENT, year);

    if (!value) {
        value = (() => {
            return getPropPurchasedYear(year) * property_acquisition_cost
        })();
        setInStore(PERSONAL_INVESTMENT, year, value);
    }

    return value
}

/** Portfolio Cash Re-Investment **/
function getPortfolioCashReinvestment(year) {
    let value = getFromStore(PORTFOLIO_CASH_REINVESTMENT, year);
    if (!value) {
        value = (() => {
            return getCashFlowFundProp(year) * property_acquisition_cost
        })();
        setInStore(PORTFOLIO_CASH_REINVESTMENT, year, value);
    }
    return value
}

/** Projected Portfolio Total Value **/
function getProjectedPortfolioTotalValue(year) {
    let value = getFromStore(PROJECTED_PORTFOLIO_TOTAL_VALUE, year);
    if (!value) {
        value = (() => {
            let totalPropertiesInYear = getTotalPropertiesInYear(year);
            if (year === start_year) {
                return (totalPropertiesInYear) * property_acquisition_value;
            } else {
                return (getProjectedPortfolioTotalValue(year - 1) * (1 + annual_value_growth / 100))
                    + (totalPropertiesInYear * property_acquisition_value);
            }
        })();
        setInStore(PROJECTED_PORTFOLIO_TOTAL_VALUE, year, value);
    }
    return value
}

/** Projected Total Equity **/
function getProjectedTotalEquity(year) {
    let value = getFromStore(PROJECTED_TOTAL_EQUITY, year);
    if (!value) {
        value = (() => {
            return getProjectedPortfolioTotalValue(year) - (
                getCumulativeOwnedEachYear(year) * property_acquisition_value * (1 - 0.2)
            )
        })();
        setInStore(PROJECTED_TOTAL_EQUITY, year, value);
    }
    return value
}

/** Projected Monthly Cash Flow **/
function getProjectedMonthlyCashFlow(year) {
    let value = getFromStore(PROJECTED_MONTHLY_CASH_FLOW, year);
    if (!value) {
        value = (() => {
            if (year === start_year) {
                return getCumulativeOwnedEachYear(year) *
                    (monthly_cash_flow * Math.pow(1 + (annual_cash_flow / 100), getSno(year) - 1));
            } else {
                return (getProjectedMonthlyCashFlow(year - 1) *
                    (1 + (annual_cash_flow / 100))) +
                    (getTotalPropertiesInYear(year) * monthly_cash_flow)
            }
        })();
        setInStore(PROJECTED_MONTHLY_CASH_FLOW, year, value);
    }
    return value
}

/** Cumulative Cash Flow (Incl. Vacancy) **/
function getCumulCashFlowVac(year) {
    let value = getFromStore(CUMUL_CASH_FLOW_VAC, year);
    if (!value) {
        value = (() => {
            if (year === start_year) {
                return getProjectedMonthlyCashFlow(year) * 11
            } else {
                return getCumulCashFlowVac(year - 1) + (getProjectedMonthlyCashFlow(year) * 11)
            }
        })();
        setInStore(CUMUL_CASH_FLOW_VAC, year, value);
    }
    return value
}

/** Cumulative Cash Flow (minus reinvestments) **/
function getCumulCashFlowMinusReinvest(year) {
    let value = getFromStore(CUMUL_CASH_FLOW_MINUS_REINVEST, year);
    if (!value) {
        value = (() => {
            if (year === start_year) {
                return getCumulCashFlowVac(year) - (getCashFlowFundProp(year) * property_acquisition_cost)
            } else {
                return getCumulCashFlowVac(year) - (getTotalCashFundedProperties(year) * property_acquisition_cost)
            }
        })();
        setInStore(CUMUL_CASH_FLOW_MINUS_REINVEST, year, value);
    }
    return value
}

function getLastYearOfCalculation() {
    return start_year + rows - 1;
}

/********* 12 year information *******/
function get12YearProperties() {
    let last_year = getLastYearOfCalculation();
    let portfolioTotalValue = getValue(PROJECTED_PORTFOLIO_TOTAL_VALUE, last_year);
    let totalEquity = getValue(PROJECTED_TOTAL_EQUITY, last_year);
    return Math.floor(
        ((portfolioTotalValue * 0.71) - (portfolioTotalValue - totalEquity)) / property_acquisition_cost
    );
}

function get12YearReinvestment() {
    return get12YearProperties() * property_acquisition_cost
}

function get12YearPortfolioValue() {
    return get12YearProperties() * property_acquisition_value
}

function get12YearEquity() {
    return Math.round(get12YearPortfolioValue() * 0.2)
}

function get12YearMonthlyCash() {
    return get12YearProperties() * monthly_cash_flow
}


/********* 24 year information *******/

function get24YearProperties() {
    let last_year = getLastYearOfCalculation();
    return getTotalPropertiesPurchased(last_year) + get12YearProperties();
}

function get24YearCashFundedProperties() {
    let last_year = getLastYearOfCalculation();
    return getTotalCashFundedProperties(last_year)
}

function get24YearTotalProperties() {
    return get24YearProperties() + get24YearCashFundedProperties();
}

function get24YearPersonalInvestment() {
    let personalInvestment = 0
    for (let year = start_year; year < start_year + rows; year++) {
        personalInvestment += getValue(PERSONAL_INVESTMENT, year);
    }
    return personalInvestment
}

function get24YearPortfolioInvestment() {
    let portfolioInvestment = 0
    for (let year = start_year; year < start_year + rows; year++) {
        portfolioInvestment += getValue(PORTFOLIO_CASH_REINVESTMENT, year);
    }
    return portfolioInvestment + get12YearReinvestment()
}

function get24YearPortfolioGross() {
    let last_year = getLastYearOfCalculation();
    return Math.floor((getValue(PROJECTED_PORTFOLIO_TOTAL_VALUE, last_year) + get12YearPortfolioValue())
        * Math.pow(1 + (annual_value_growth / 100), 12));
}

function get24YearPortfolioEquity() {
    let last_year = getLastYearOfCalculation();
    return Math.floor(get24YearPortfolioGross() -
        (
            (getValue(PROJECTED_PORTFOLIO_TOTAL_VALUE, last_year) + get12YearPortfolioValue())
            -
            (getValue(PROJECTED_TOTAL_EQUITY, last_year) + get12YearEquity() - get12YearReinvestment())
        ))
}

function get24YearProjectedMonthlyCash() {
    let last_year = getLastYearOfCalculation();
    createBarChart();
    createLineChart();
    return Math.floor(getValue(PROJECTED_MONTHLY_CASH_FLOW, last_year) + get12YearMonthlyCash());
}
function createBarChart() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'pie',

        // The data for our dataset
        data: {
            labels: ['Properties', 'Cash Flow Funded Properties', 'Total End State Properties'],
            datasets: [{
                label: 'My First dataset',
                data: [
                    get24YearProperties(), get24YearCashFundedProperties(), get24YearTotalProperties()
                ],
                backgroundColor: [
                    window.chartColors.red,
                    window.chartColors.blue,
                    window.chartColors.yellow
                ]
            }]
        },

        // Configuration options go here
        options: {}
    });
}
function createLineChart() {
    var config = {
        type: 'line',
        data: {
            labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031'],
            datasets: [{
                label: 'Portfolio Cash Re-Investment',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: [
                    getPortfolioCashReinvestment(2020),
                    getPortfolioCashReinvestment(2021),
                    getPortfolioCashReinvestment(2022),
                    getPortfolioCashReinvestment(2023),
                    getPortfolioCashReinvestment(2024),
                    getPortfolioCashReinvestment(2025),
                    getPortfolioCashReinvestment(2026),
                    getPortfolioCashReinvestment(2027),
                    getPortfolioCashReinvestment(2028),
                    getPortfolioCashReinvestment(2029),
                    getPortfolioCashReinvestment(2030),
                    getPortfolioCashReinvestment(2031)
                ],
                fill: false,
            }]
        },
        options: {
            responsive: true,
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Year'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Portfolio Cash Re-Investment'
                    }
                }]
            }
        }
    };
    var ctx = document.getElementById('cash-reinvestment-line').getContext('2d');
    window.myLine = new Chart(ctx, config);
}


