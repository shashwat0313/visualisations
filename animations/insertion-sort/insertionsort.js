// base values, maybe changed later
let N = 40

// array of heights
let heights = []

let iterationinterval = 300
// status
let isRunning = false
let statusMessage = "Not Running"

// colors
const baseColor = 'red'
const animatedColor = 'white'

let i = 1

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
    
    // ******* NEED TO BE REVIEWED IN EVERY FILE/IMPL **********
    // algorithm-related vars
    heights = []
    i = 1

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

    $('#iteration-duration').attr('placeholder', iterationinterval);
    $('#number-of-elements').attr('placeholder', N);

    initialize()
    
    // button configs

    // Start button
    $("#start").click(async function (e) {
        if(!isRunning){
            setRunningStatus(true, "Running").then(()=>{
                
                // TODO ******************
                // ***** CALL THE ALGORITHM *****

                insertionSort()
                
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
        
        if(isNaN(e.target.value)) return;

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

// algorithm

async function insertionSort(){

    // elements to the left of key will be compared against the it.
    // comparison will start from the largest/rightmost element of the
    // sorted subsequence to the smallest/leftmost of the sorted subsequence
    
    // as long as the elements in the sorted subarray are found to be 
    // larger than the key, they will be moved one place forward(rightward)

    // since the element at a[i] can easily(and will) get overwritten
    // so we store it in key so as to conveniently perform comparisons
    // and operations.

    // later, the key element gets written at a[j + 1]
    // this is the position immediately left of the right-shifted portion
    // lowest possible value of j can be -1, so j + 1 would be 0, which
    // is a valid postion
    
    await setRunningStatus(true, "Running")
    
    for(; i < N; i++){

        if(!isRunning) return;

        // store a[x]
        const key = heights[i];
        setBarColor(i-1, "green")
        
        setBarColor(i, "white")
        await delay(iterationinterval/2 )
        // setBarColor(i, "red")

        // init j
        let j = i - 1; 
        
        while( j >= 0 && heights[j] > key ){

            if(!isRunning) return;

            // move to the right
            heights[j + 1] = heights[j];
            
            await delay(iterationinterval/1.5)
            setBarHeight(j + 1, heights[j]);
            setBarColor(j + 1, "blue")
            setArrayValue(j + 1, heights[j])

            j--;
        }
        
        await delay(iterationinterval/2)
        // from j + 1 to i, set the colors back to base
        for(let b = j + 1; b <= i; b++){
            setBarColor(b, "green")
        }

        // write the key again
        heights[j + 1] = key;
        setBarColor(j + 1, "white")
        
        await delay(iterationinterval/2);
        setBarHeight(j + 1, key)
        setArrayValue(j + 1, key)
        
        if(!isRunning) return;
        
        await delay(iterationinterval/2);
        setBarColor(j + 1, "green")
    }
    setBarColor(N - 1, 'green')
    setRunningStatus(false, "Done")
}