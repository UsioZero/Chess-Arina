document.addEventListener("DOMContentLoaded", function () {
    let isValidCountry = true;
    let dataArray = ["Іво Бобул", "ibobyl", "Ukraine", "Chernivtsi Oblast", "", ""];
    let inputName = document.getElementById("input-name");
    inputName.value = dataArray[0];
    let inputNick = document.getElementById("input-nick");
    inputNick.value = "@" + dataArray[1];
    let inputCountry = document.getElementById("input-country");
    inputCountry.value = dataArray[2];
    let inputState = document.getElementById("input-state");
    inputState.value = dataArray[3];
    let inputCity = document.getElementById("input-city");
    if (dataArray[4] != "") {
        inputCity.value = dataArray[4];
    }
    else {
        inputCity.value = "(Do not display)"
    }
    let inputPremium = document.getElementById("input-premium");
    if (dataArray[5] != "") {
        inputPremium.value = dataArray[5];
    }
    else {
        inputPremium.value = "(Not owned)";
    }
    // Get a list of all country names using the REST Countries API
    fetch("https://restcountries.com/v2/all")
        .then(response => response.json())
        .then(data => {
            let countryNames = data.map(country => country.name);

            // Add an event listener to the input element with ID "input-country"
            let inputCountry = document.getElementById("input-country");
            inputCountry.addEventListener("input", function () {
                let inputValue = inputCountry.value.trim();

                // Check if the input value is a valid country name
                if (countryNames.includes(inputValue)) {
                    inputCountry.style.color = "black";
                    isValidCountry = true;
                    if (inputValue == "Russian Federation") { inputCountry.value = "Москаль, вийшов нахуй"; isValidCountry = false; }
                } else {
                    inputCountry.style.color = "red";
                    isValidCountry = false;
                }
            });
        })
        .catch(error => console.error(error));


        let saveButton = document.querySelector(".save-button");

        // Add a click event listener to the "Save" button
        saveButton.addEventListener("click", function() {
          // Get the values of the input fields and save them to the dataArray array
            dataArray[0] =  inputName.value;
            if (isValidCountry){
            dataArray[2] =  inputCountry.value;
            }
            else{
                alert("Wrong country, your changes discarded");
            }
            dataArray[3] =  inputState.value;
            if (inputCity.value != "(Do not display)"){
                dataArray[4] =  inputCity.value;
            }
            else
            {
                dataArray[4] =  "";
            }
          // Log the updated dataArray array to the console
          console.log(dataArray);
        });

});