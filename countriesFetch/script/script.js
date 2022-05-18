let cards = document.getElementById("cards");
let detailsButtons = document.getElementsByClassName("details-btn");
let closeButtons = document.getElementsByClassName("close-pop-up");
let regionButtons = document.querySelectorAll(".region-btn");


window.addEventListener("load", function () {
    listenRegionButtons();
    cards.innerHTML = "";
    fetch(`https://restcountries.com/v3.1/region/europe`)
        .then(response => response.json())
        .then(data => getMainData(data));
});

function listenRegionButtons() {
    for (let regionBtn of regionButtons) {
        regionBtn.addEventListener("click", function () {
            let regionId = regionBtn.getAttribute("data-region-id");
            console.log(regionId);
            cards.innerHTML = "";
            fetch(`https://restcountries.com/v3.1/region/${regionId}`)
                .then(response => response.json())
                .then(data => getMainData(data));
        })
    }
}



function getMainData(data) {

    data.forEach(country => {
        let countryFlag = country.flags.svg;
        let countryName = country.name.common;
        let cardInnerHTML = `<div class="card" data-country-name="${countryName}">
        <img src="${countryFlag}" alt="">
        <div class="card-body">
            <h3>${countryName}</h3>
            <button class="details-btn">Details</button>
        </div>
    </div>`
        cards.innerHTML += cardInnerHTML;

    }
    )
    getAllData(data);
}

let popUpOverlay = document.createElement("div");
popUpOverlay.className = "card-pop-up";

function getAllData(data) {
    for (let detailsBtn of detailsButtons) {
        detailsBtn.addEventListener("click", function (event) {
            let dataId = event.target.parentNode.parentNode.getAttribute("data-country-name");
            data.forEach(country => {
                let countryFlag = country.flags.svg;
                let countryName = country.name.common;
                let countryCapital = country.capital;
                let countryPopulation = country.population;
                let countryTimezone = country.timezones;
                let countryCurrencies = country.currencies;
                let countryCurrency = [];
                for (let currency in countryCurrencies) {
                    countryCurrency.push(countryCurrencies[currency].name);
                    if (countryCurrencies[currency].symbol != undefined) {
                        countryCurrency.push(" Symbol: " + countryCurrencies[currency].symbol)
                    }
                }
                let countryLanguages = country.languages;
                let countryLanguage = [];
                for (const language in countryLanguages) {
                    countryLanguage.push(countryLanguages[language])
                }
                if (countryName == dataId) {
                    let popUpInnerHTML = `
                    <button class="close-pop-up"><i class="fa-solid fa-xmark"></i></button>
                    <div class="country-details">
                        <img src="${countryFlag}">
                        <div class="country-details-body">
                            <div class="country-name-capital-population">
                                <div class="country-detail country-name">
                                    <h3>${countryName}</h3>
                                </div>
                                <div class="country-detail country-capital">
                                    <span><i class="fa-solid fa-landmark-flag"></i></span>
                                    <span>${countryCapital}</span>
                                </div>
                                <div class="country-detail country-population">
                                    <span><i class="fa-solid fa-people-group"></i></span>
                                    <span>${countryPopulation}</span>
                                </div>
                            </div>

                            <div class="country-detail country-currency">
                                <span><i class="fa-solid fa-coins"></i> ${(countryCurrency.length > 2) ? "Currencies" : "Currency"}</span>
                                <i class="fa-solid fa-minus separator"></i>
                                <span>${countryCurrency}</span>
                            </div>

                            <div class="country-detail country-language">
                                <span><i class="fa-solid fa-language"></i> ${(countryLanguage.length > 1) ? "Languages" : "Language"}</span>
                                <i class="fa-solid fa-minus separator"></i>
                                <span>${countryLanguage}</span>
                            </div>

                            <div class="country-detail country-timezone">
                                <span><i class="fa-solid fa-globe"></i> ${(countryTimezone.length > 1) ? "Timezones" : "Timezone"}</span>
                                <i class="fa-solid fa-minus separator"></i>
                                <span>${countryTimezone}</span>
                            </div>
                        </div>
                    </div>`
                    popUpOverlay.innerHTML = popUpInnerHTML;
                    document.body.appendChild(popUpOverlay);
                }
            });
            for (const closeBtn of closeButtons) {
                closeBtn.addEventListener("click", function () {
                    let popUp = document.getElementsByClassName("card-pop-up");
                    document.body.removeChild(popUp[0]);
                    getAllData(data);
                    listenRegionButtons();
                });
            }
        })
    }
}