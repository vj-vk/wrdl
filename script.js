let randomWord = "";
const wordList = [];

async function fetchData() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
        if (!response.ok) {
            throw new Error(`${response.status}`);
        }
        const data = await response.json();
        randomWord = data[0];
    } catch (error) {
        console.error(error);
    }
}

async function listWords() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word?number=10000&length=5&lang=en');
        if (!response.ok) {
            throw new Error(`${response.status}`);
        }
        const data = await response.json();
        wordList.push(...data);
    } catch (error) {
        console.error(error);
    }
}

fetchData();

listWords();

var currentRow = 0;

function writeGuess() {
    var word = document.getElementById("guessBox").value.toLowerCase();
    if (!wordList.flat().includes(word)) {
        word = "";
    }
    else if (word.length === 5 && currentRow < 6) {
        for (let i = 0; i < 5; i++) {
            const tileId = currentRow * 5 + i;
            const tile = document.getElementById(tileId.toString());
            tile.textContent = word[i];
            tile.style.animation = "flip 0.4s ease " + i * 0.1 + "s";
        }
        currentRow++;
    }
}

function countOcc(str, char) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === char) {
            count++;
        }
    }
    return count;
}

function shake() {
    const box = document.getElementById("guessBox");
    box.style.animation = "shake 0.1s linear";
    box.addEventListener("animationend", () => {
        box.style.animation = "";
    })
}

function validate() {
    const word = randomWord;
    const inputWord = document.getElementById("guessBox").value.toLowerCase();
    if (!wordList.flat().includes(inputWord)) {
        document.getElementById("invalid").innerHTML = "not in word list";
        shake();
        document.getElementById("guessBox").addEventListener("change", () => {
            document.getElementById("invalid").innerHTML = "";
        });
    }
    else if (currentRow < 7 && inputWord.length === 5) {
        const temp = currentRow - 1;
        for (let i = 0; i < 5; i++) {
            const tileId = temp * 5 + i;
            const tile = document.getElementById(tileId.toString());
            tile.classList.remove("green", "yellow", "grey");
            if (inputWord[i] === word[i]) {
                tile.classList.add("green");
            } else if (word.includes(inputWord[i])) {
                let wordCount = countOcc(word, inputWord[i]);
                let inputCount = countOcc(inputWord.substring(0, i), inputWord[i]) + 1;
                if (wordCount >= inputCount) {
                    tile.classList.add("yellow");
                } else {
                    tile.classList.add("grey");
                }
            } else {
                tile.classList.add("grey");
            }
        }
        if (inputWord === word) {
            endGame();
            document.getElementById("endMessage").textContent = "you win";
            document.getElementById("refresh").style.display = "inline-block";
        }
        else {
            if (currentRow === 6) {
                endGame();
                document.getElementById("endMessage").textContent = `the correct word was ${word}`;
                document.getElementById("refresh").style.display = "inline-block";
            }
        }
    }
}

function endGame() {
    document.getElementById("guessBox").style.display = "none";
    document.getElementById("guessBtn").style.display = "none";
    document.getElementById("guessLabel").style.display = "none";
}