// base values, maybe changed later
let N = 40

// array of heights
let heights = []

let iterationinterval = 100

// setInterval ids

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

// randomises the array elements
function shuffle() {
    heights.sort(() => Math.random() - 0.5);
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

function render() {
    for (let i = 0; i < N; i++) {
        $('#root').append(`<div style="background-color:${baseColor};" class="bar" id="${i}"></div`)
        $(`#${i}`).height(heights[i] * 10 + 10)
        $(`#array`).append(`<div class="values" id="value-${i}"> ${heights[i] + 1} </div>`)
    }
}

async function initialize() {

    
    // reset status variables
    setRunningStatus(false, "Not Running")
    
    await delay(iterationinterval)
    
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

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// uses an expression to scale the height of bars in good proportion, favoring presentation
function setBarHeight(id, height){
    $(`#${id}`).height(height * 10 + 10);
}

function setArrayValue(id, height){
    $(`#value-${id}`).text(height + 1)
}

function setBarColor(id, colorValue){
    $(`#${id}`).css('background-color', colorValue)
}


// Filling out of heights array the moment the page loads
$(document).ready(() => {
    initialize()
    
    // button configs

    // Start button
    $("#start").click(async function (e) {
        if(!isRunning){
            setRunningStatus(true, "Running").then(()=>{
                mergeSort()
            })
        }
    });

    // Reset Button
    $("#reset").click(async function (e) {
        setRunningStatus(false, "Not Running").then(()=>{
            initialize()
        })
    });

    // input fields
    // N
    $("#number-of-elements").on('input', async function (e) {
        // console.log("N e =", e.target.value);
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
                    await delay(500)
                    initialize()
                    clearInterval(thisInterval)
                }
            }, 1000);
        }
    });

    // Duration
    $("#iteration-duration").on('input', async function (e) {
        await delay(100)
        iterationinterval = Number(e.target.value)
        // console.log(e.target.value);
    });
})

async function merge(start, end){

    const mid = Math.floor((start + end)/2);
    let r1 = start, r2 = mid + 1, wr = 0

    for(let j = start; j <= end; j++){
        if(!isRunning) return
        setBarColor(j, "#399918")
    }
    
    let tmp = new Array(end - start + 1)
    
    await delay(iterationinterval)
    while(r1 <= mid && r2 <= end){

        if(heights[r1] <= heights[r2]){
            tmp[wr++] = heights[r1++];
        }else{
            tmp[wr++] = heights[r2++];
        }
    }

    // copy remaining to tmp
    while(r1 <= mid){
        tmp[wr++] = heights[r1++];
    }

    while(r2 <= end){
        tmp[wr++] = heights[r2++];
    }

    // copy back
    for(let i = 0; i < tmp.length; i++){

        if(!isRunning) return;

        heights[start + i] = tmp[i];

        await delay(iterationinterval)
        setBarColor(start + i, "white")
        setArrayValue(start + i, heights[start + i])
        setBarHeight(start + i, heights[start + i]);
    }
}

async function mergeSortHelperRecursive(start, end){
    if(!isRunning) return;
    if(start<end){
        const mid = Math.floor((start + end)/2);
        await mergeSortHelperRecursive(start, mid);
        await mergeSortHelperRecursive(mid + 1, end);
        await delay(iterationinterval*4)
        await merge(start, end);
    }

    else return;
}

async function mergeSort() {

    // console.log("heights before->", heights);/
    
    await mergeSortHelperRecursive(0, N - 1)
    // console.log(heights);
    
    setRunningStatus(false, "Done")

    for(let z = 0; z < N; z++){
        await delay(30)
        setBarColor(z, "red");
    }
    return;
}