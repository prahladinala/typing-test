// Random Quotes Api URL
const quoteApiUrl = 'https://api.quotable.io/random?minLength=100&maxLength=140';

const quoteSection = document.querySelector('#quote');
const userInput = document.querySelector('#quote-input');

// console.log(quoteSection, userInput)

let quote = "";
let time = 60;
let timer = "";

// Display Random Quote 
const renderNewQuote = async () => {
    // Fetch contents from URL
    const response = await fetch(quoteApiUrl);

    // Store response in a variable
    const data = await response.json();

    // Access Quote
    quote = data.content;

    // Display Quote
    // quoteSection.innerHTML = quote;

    // Array of characters in the quote
    let arr = quote.split('').map(value => {
        // wrap the chaaacters in span tags
        return "<span class='quote-char'>" + value + "</span>"
    })

    // Join the array of characters in the quote
    quoteSection.innerHTML = arr.join('');

    // console.log(arr)

}



// Logic for comparing user input to quote
userInput.addEventListener('input', () => {
    // console.log(userInput.value)
    let quoteChars = document.querySelectorAll('.quote-char');
    // console.log(quoteChars)

    // Create an array from received span tags
    quoteChars = Array.from(quoteChars);
    // console.log(quoteChars)

    // array of user input characters
    let userInputChars = userInput.value.split('');

    // loop through the quote characters in quote
    quoteChars.forEach((char, index) => {

        // Check if char(quote Character) = useqInputChar[index] (input character)

        // if the quote character is equal to the user input character
        if (char.innerText == userInputChars[index]) {
            // change the color of the quote character to green
            char.classList.add("success")
        } else if (userInputChars[index] == null) {
            // if user haven't enterend anything or backspaced
            // Remove class if any
            if (char.classList.contains("success")) {
                char.classList.remove("success")
            } else {
                char.classList.remove("fail");
            }
        } else {
            // If user enter wrong character
            if (!char.classList.contains("fail")) {
                // increase the mistakes and display it
                mistakes += 1;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }

        // Returns true if all the characters are entered correctly
        let check = quoteChars.every(element => {
            return element.classList.contains("success");
        })
        // End test if all characters are entered correctly
        if (check) {
            // console.log("test ended")
            displayResult();
        }
    })

})

// Update Timer on scree
function updateTimer() {
    if (time == 0) {
        // End test if time is 0
        displayResult();
    } else {
        document.getElementById("timer").innerText = --time + "s";
    }
}

// Sets Timer
const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
}

// End Test
const displayResult = () => {
    // Display result div
    document.querySelector(".result").style.display = "block";
    clearInterval(timer)
    document.getElementById("stop-test").style.display = "none";

    userInput.disabled = true;
    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 100;
    }

    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm";
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";
}

// Start Test
const startTest = () => {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
}

window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";

    userInput.disabled = true;
    renderNewQuote();
}