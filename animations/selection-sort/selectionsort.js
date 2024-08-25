
// base values, maybe changed later
let N = 40
let baseBarHeight = N * 10 + 30

// array of heights
let heights = []

let iterationinterval = 200
let swapInterval = iterationinterval - iterationinterval * 0.1

// setInterval ids
let iteration = null;

// status
let isRunning = false
let statusMessage = "Not Running"

// colors
const baseColor = 'red'
const animatedColor = 'white'

let i = 0

// Filling out of heights array the moment the page loads
$(document).ready(() => {
    initialize()

    // button configs
    // Start button
    $("#start").click(function (e) {
        
        if (!isRunning) {
           setRunningStatus(true, "Running")
            selectionSort(0)
        }
    
    });
    
    // Reset Button
    $("#reset").click(function (e) {
        initialize()
        setRunningStatus(false, "Not Running")
    });
    
    // Back button
    // $("#back-button").click(function (e) {
    //     // window.history.back()
    //     window.location.href = '/index.html'
    // });

    // input fields
    // N
    $("#number-of-elements").on('input', function (e) {         
        console.log("N e =", e.target.value);
        if(!isRunning){
            setRunningStatus(false, "Size will be updated.")
            setTimeout(() => {
                N = Number(e.target.value)
                initialize()
            }, 2000);
        }
        else{
            setRunningStatus(true, "Size will be updated 3 seconds after this run finishes.");
            setTimeout(() => {
                N = Number(e.target.value)
                initialize()
            }, iterationinterval * (N - i ) + 3000);
        }
    });
    
    // Duration
    $("#interval-duration").on('input', function (e) { 
        
        iterationinterval = Number(e.target.value)
        console.log("setting iteration interval value to " + iterationinterval);
        swapInterval = iterationinterval - iterationinterval*0.1
        
        if(isRunning){

            setTimeout(() => {
                clearInterval(iteration)
                selectionSort()
            }, 1000);

        }
    });
})

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
    i = 0
    
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
        $(`#${i}`).height(heights[i] * 10 + 10)
        $(`#array`).append(`<div id="value-${i}" style="color:white; display: inline-block; width: 10px; margin: 5px;"> ${heights[i] + 1} </div>`)
    }
}

function setRunningStatus(status, str="") {
    if(str != ""){
        isRunning = status
        statusMessage = str
    }
    else{
        if(status){
            isRunning = true;
            statusMessage = "Running"
        }
        else{
            isRunning = false;
            statusMessage = "Not Running"
        }
    }
    document.getElementById('status').innerHTML = statusMessage;
}

// Selection sort
function selectionSort() {

    iteration = setInterval(() => {
        OneIterationOfSelectionSort(i)
        i++;

        // important step ---> stop the execution of setinterval
        if (i == N) {
            clearInterval(iteration)
            setRunningStatus(false, "Done");
            i = 0
        }
    }, iterationinterval);
}

function OneIterationOfSelectionSort(i) {
    let _min = Number.MAX_SAFE_INTEGER, minidx = -1;

    for (let j = i; j < N; j++) {
        if (heights[j] < _min) {
            _min = heights[j];
            minidx = j;
        }
    }

    const height_i = heights[i];
    const height_minidx = heights[minidx];

    if(minidx != i){
        heights[i] = heights[i] ^ heights[minidx];
        heights[minidx] = heights[i] ^ heights[minidx];
        heights[i] = heights[i] ^ heights[minidx];
    }

    let intervalId = null

    $(`#${i}`).css('background-color', animatedColor)
    $(`#${minidx}`).css('background-color', "#0000FF")
    isHighlighted = true;

    setTimeout(() => {
        // swap operation
        $(`#${i}`).height(height_minidx * 10 + 10);
        $(`#${minidx}`).height(height_i * 10 + 10);

        $(`#value-${i}`).text(heights[i] + 1)
        $(`#value-${minidx}`).text(heights[minidx] + 1)
        
        $(`#${i}`).css('background-color', "#0000FF")
        $(`#${minidx}`).css('background-color', animatedColor)
    }, swapInterval / 2);

    setTimeout(() => {
        $(`#${i}`).css('background-color', baseColor)
        $(`#${minidx}`).css('background-color', baseColor)
    }, swapInterval);
}