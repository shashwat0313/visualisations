// base values, maybe changed later
let N = 15
let baseBarHeight = N * 10 + 30

// array of heights
let heights = []

let iterationinterval = 200
let swapInterval = iterationinterval - iterationinterval * 0.1

// setInterval ids
let iteration = null;
let innerIteration = null;
let comparisonDelay = 700;

// status
let isRunning = false
let statusMessage = "Not Running"

// colors
const baseColor = 'red'
const animatedColor = 'white'

let i = N - 1

// FUNCTIONS
function fill() {
    for (let i = 0; i < N; i++) {
        heights.push(i)
    }
}

function initialize() {

    // stop if any existing runs
    clearInterval(iteration)

    // reset status variables
    setRunningStatus(false, "Not Running")


    // empty the DOM
    $("#root").empty();
    $(`#array`).empty();

    // algorithm-related vars
    heights = []
    // make note of these vars
    i = N - 1

    // methods to set the DOM up again
    fill()
    shuffle()
    render()
}

// randomises the array elements
function shuffle() {
    heights.sort(() => Math.random() - 0.5);
}

function render() {
    for (let i = 0; i < N; i++) {
        $('#root').append(`<div style="background-color:${baseColor};" class="bar" id="${i}"></div`)
        $(`#${i}`).height(heights[i] * 25 + 25)
        $(`#array`).append(`<div class="values" id="value-${i}"> ${heights[i] + 1} </div>`)
    }
}

async function setRunningStatus(status, str = "") {
    if (str !== "") {
        isRunning = status
        statusMessage = str
    }
    else {
        if (status) {
            isRunning = true;
            statusMessage = "Running"
        }
        else {
            isRunning = false;
            statusMessage = "Not Running"
        }
    }
    document.getElementById('status').innerHTML = statusMessage;
}

// Filling out of heights array the moment the page loads
$(document).ready(() => {
    initialize()
    
    // button configs

    // Start button
    $("#start").click(async function (e) {

        if (!isRunning) {
            await setRunningStatus(true, "Running").then(()=>{
                bubbleSort()
            })
        }

    });

    // Reset Button
    $("#reset").click(async function (e) {
        setRunningStatus(false, "Not Running").then(()=>{
            initialize()
        })
    });

    // Back button
    $("#back-button").click(function (e) {
        window.location.href = '/'
    });

    // input fields
    // N
    $("#number-of-elements").on('input', async function (e) {
        console.log("N e =", e.target.value);
        if (!isRunning) {
            await setRunningStatus(false, "Size will be updated.")
            setTimeout(() => {
                N = Number(e.target.value)
                initialize()
            }, 2000);
        }
        else {
            await setRunningStatus(true, "Size will be updated after this run finishes")
            
            const thisInterval = setInterval(async () => {
                if(!isRunning){
                    N = Number(e.target.value)

                    await delay(1000)
                    initialize()
                    clearInterval(thisInterval)
                }
            }, 1000);
        }
    });

    // Duration
    $("#comparison-duration").on('input', async function (e) {

        if(isRunning){
            await delay(100);
            comparisonDelay = Number(e.target.value)
        }
        else{
            comparisonDelay = Number(e.target.value)
        }
        console.log("setting iteration interval value to " + comparisonDelay);

    });
})

// algorithm
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
    console.log("called");
    if(!isRunning) return;

    for(; i >= 0; i--){
        if(!isRunning) return;
        await innerLoop(i)
    }

    setRunningStatus(false, "Done")
}

async function innerLoop(i){
    if(!isRunning) return;

    for(let j = 0; j < i; j++){
        if(!isRunning) return;
        await sortStep(j)
    }
}

async function sortStep(j) {

    if(!isRunning) return;

    await delay(comparisonDelay/4)

    // apply colors
    $(`#${j}`).css('background-color', "blue")
    $(`#${j + 1}`).css('background-color', "white")

    // delay
    if (heights[j] > heights[j + 1]) {
        await delay(comparisonDelay/4)
        heights[j] = heights[j] ^ heights[j + 1];
        heights[j + 1] = heights[j] ^ heights[j + 1];
        heights[j] = heights[j] ^ heights[j + 1];

        $(`#value-${j}`).text(heights[j] + 1)
        $(`#value-${j + 1}`).text(heights[j + 1] + 1)

        // apply changes to dom
        $(`#${j}`).height(heights[j] * 25 + 25)
        $(`#${j + 1}`).height(heights[j + 1] * 25 + 25)
    
        // exchange colors
        $(`#${j}`).css('background-color', "white")
        $(`#${j + 1}`).css('background-color', "blue")
    }
    
    await delay(comparisonDelay/4);
    $(`#${j}`).css('background-color', baseColor)
    $(`#${j + 1}`).css('background-color', baseColor)

    await delay(comparisonDelay/4)

    return;
}