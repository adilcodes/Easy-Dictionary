// DOM Targeting:
let searchLoading = document.querySelector(".searching"),
    placeholderText = document.querySelector("#placeholderText"),
    inputField = document.querySelector("#inputField"),
    definitionArea = document.querySelector(".definition-area"),
    allDetails = document.querySelector(".all-details");

// Variables:
let pronunce;

// Functions
const startFetching = async (word) => {
    allDetails.innerHTML = "";
    
    let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (response.ok) {
        let result = await response.json();
        if (result) {
            setTimeout(() => {
                searchLoading.classList.remove("show");
                let phonetic = result[0].phonetics.filter((phonetic) => {
                    return ((phonetic.hasOwnProperty("text") && phonetic.hasOwnProperty("audio")) && (phonetic.text !== "" && phonetic.audio !== ""))
                });

                // pronunce = new Audio(phonetic[0].audio);

                let wordDetails =
                    `
                        <p class="word-phonetic-pronunce">
                            <span class="word">${result[0].word}</span>
                            <span class="phonetic">${phonetic[0].text}</span>
                            <!-- <span class="pronunce">
                                <span class="material-symbols-outlined" id="pronunceBtn">
                                    volume_up
                                </span>
                            </span> -->
                        </p>
                    `
                allDetails.innerHTML += wordDetails;
                
                result[0].meanings.map((meaning) => {
                    allDetails.innerHTML +=
                        `
                        <div class="meaning">
                            <p class="partOfSpeech">${meaning.partOfSpeech}</p>
                            <div class="defs">
                                ${
                                    meaning.definitions.map((def, index) => {
                                        return (
                                            `
                                            <div class="single-def">
                                                <p class="def">
                                                    <span class="heading">${index + 1}. </span>
                                                    <span class="text">${def.definition}</span>
                                                </p>
                                                ${def.example ? `<p class="example">
                                                    <span class="heading">example: </span>
                                                    <span class="text">${def.example}</span>
                                                </p>` : ""
                                                }
                                            </div>
                                            `
                                        );
                                    }).join("")
                                }
                            </div>
                        </div>
                        `
                });

                /*
                "Audio in API is not working yet"

                let pronunceBtn = document.getElementById("pronunceBtn");
                pronunceBtn.addEventListener("click", () => {
                    pronunce.play();
                });
                */

            }, 1500);
        }
    } else {
        setTimeout(() => {
            searchLoading.classList.remove("show");
            placeholderText.innerText = "Sorry, we couldn't find definitions for the word you were looking for."
            placeholderText.classList.remove("hide");
        }, 1500);
    }
}

// Event Handlers:
function submitHandler(e) {
    e.preventDefault();
    placeholderText.classList.add("hide");
    searchLoading.classList.add("show");
    startFetching(inputField.value);
}