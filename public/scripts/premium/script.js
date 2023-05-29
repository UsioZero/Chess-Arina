document.addEventListener('DOMContentLoaded', async function () {
    const responce = await fetch('/api/user');
    const resData = await responce.json();
    const menuImg = document.querySelector("#btn1-container div img");
    menuImg.src = `img/profiles/${resData._id}/avatar.png`;

    const banner10 = document.getElementById("ib10");

    const banner100 = document.getElementById("ib100");

    banner10.addEventListener('click', () => {
        banner10.classList.add("chosen");
        banner100.classList.remove("chosen");
    });
    banner100.addEventListener('click', () => {
        banner100.classList.add("chosen");
        banner10.classList.remove("chosen");
    });

    onGooglePayLoaded();

    //start game modal
    // Get the modal

    //start game modal
    // Get the modal
    var modal = document.getElementById("modal");

    // Get the button that opens the modal
    var btn = document.getElementById("open-modal");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    btn.onclick = function () {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    let startGameData = [];

    const sideImgs = document.querySelectorAll(".side-img");
    sideImgs.forEach(sideImg => { sideImg.addEventListener('click', () => { sideImgs.forEach(sideImg2 => sideImg2.classList.remove("active-option")); sideImg.classList.add("active-option") }) });
    const startGameButton = document.querySelector(".start-game-button");


    const typeImgs = document.querySelectorAll(".type-img");
    const divs = document.querySelectorAll(".choose-slider-div");
    divs.forEach(div => {
        div.style.height = "0";
        div.style.border = "0px";
        div.style.fontSize = "0px";
    });
    divs[0].style.height = "40px";
    divs[0].style.border = "2px solid #8A4726";
    divs[0].style.fontSize = "30px";
    typeImgs.forEach((typeImg, i) => {
        typeImg.addEventListener('click', () => {
            typeImgs.forEach(typeImg2 => typeImg2.classList.remove("active-option"));
            typeImg.classList.add("active-option");

            divs.forEach(div => {
                div.style.height = "0";
                div.style.border = "0px";
                div.style.fontSize = "0px";
                startGameButton.innerHTML = "Start Game"
            });
            divs[i].style.height = "40px";
            divs[i].style.border = "2px solid #8A4726";
            divs[i].style.fontSize = "30px";
            if (i == 1) { startGameButton.innerHTML = "Get Link" }

        });
    });
    function checkFormat(str) {
        const regex = /^\d+\|\d+$/;
        return regex.test(str);
    }

    const uniqueTimer = document.querySelector(".custom-timer-button");
    const inp = document.querySelector(".hidden-input");
    uniqueTimer.addEventListener('click', () => {
        if (checkFormat(inp.value)) { uniqueTimer.innerHTML = inp.value; } else { uniqueTimer.innerHTML = "Wrong format"; }
    });
    const timers = document.querySelectorAll(".default-timer-button");
    timers.forEach(timer => { timer.addEventListener('click', () => { timers.forEach(timer2 => timer2.classList.remove("active-option")); timer.classList.add("active-option") }) });



    startGameButton.addEventListener('click', async () => {
        const activeButtons = document.querySelectorAll(".active-option");
        activeButtons.forEach((button, index) => {

            if (index == 0) {
                const src = button.getAttribute("src");
                let fileName = src.substring(src.lastIndexOf("/") + 1);
                if (fileName == "computericon.png") {
                    fileName = "AI"
                }
                else {
                    if (fileName == "human.png") {
                        fileName = "hu";
                    }
                    else {
                        fileName = "hs";
                    }

                }
                startGameData.push(fileName);
            }
            if (index == 1) {
                const src = button.getAttribute("src");
                let fileName = src.substring(src.lastIndexOf("/") + 1);
                if (fileName == "K.png") {
                    fileName = "w";
                }
                else {
                    if (fileName == "K2.png") {
                        fileName = "b";
                    }
                    else {
                        fileName = "r";
                    }
                }
                startGameData.push(fileName);
            }
        });
        const thirdButton = activeButtons[2];
        let thirdButtonInnerHTML;
        if (thirdButton.innerHTML != "Wrong format") {
            thirdButtonInnerHTML = thirdButton.innerHTML;
        } else {
            thirdButtonInnerHTML = "15|10";
        }
        startGameData.push(thirdButtonInnerHTML);

        //console.log(startGameData);
        if (startGameData[0] == "hu") {

            fetch("/api/game", {
                method: "POST", body: JSON.stringify({
                    "user1": resData._id,
                    "moveData": {
                        "playerId": resData._id,
                        "dataArray": ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", 255, 1, 1, 1, 1, 1],
                        "legalMovesForPlayer": [
                            [8, 16, 0], [9, 17, 0], [10, 18, 0], [11, 19, 0], [12, 20, 0], [13, 21, 0], [14, 22, 0], [15, 23, 0],
                            [8, 24, 1], [9, 25, 1], [10, 26, 1], [11, 27, 1], [12, 28, 1], [13, 29, 1], [14, 30, 1], [15, 31, 1],
                            [1, 16, 0], [1, 18, 0], [6, 21, 0], [6, 23, 0]
                        ]
                    }
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json()).then(data => {
                let link = `/game/link?id=${data._id}`;
                //console.log(gameData);

                window.location.href = `/game/?link=${link}`;
            })



        }
        else {
            window.location.href = `/game/?type=${startGameData[0]}&side=${startGameData[1]}&timer=${startGameData[2]}`;
        }
    });
    if (resData.roles.Premium == 1984 ?? false) {
        const advimg = document.querySelector("#adv-img");
        advimg.src = "img/frog_premium.png";
        const advbut = document.querySelector("#remove-ads-button");
        advbut.style.display = "none"
    }
});



// <div id="container"></div>
//<script async
// src="https://pay.google.com/gp/p/js/pay.js"
//  onload="onGooglePayLoaded()"></script> 


/**
 * Define the version of the Google Pay API referenced when creating your
 * configuration
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|apiVersion in PaymentDataRequest}
 */
const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0
};

/**
 * Card networks supported by your site and your gateway
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
 * @todo confirm card networks supported by your site and gateway
 */
const allowedCardNetworks = ["MASTERCARD", "VISA"];

/**
 * Card authentication methods supported by your site and your gateway
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
 * @todo confirm your processor supports Android device tokens for your
 * supported card networks
 */
const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

/**
 * Identify your gateway and your site's gateway merchant identifier
 *
 * The Google Pay API response will return an encrypted payment method capable
 * of being charged by a supported gateway after payer authorization
 *
 * @todo check with your gateway on the parameters to pass
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#gateway|PaymentMethodTokenizationSpecification}
 */
const tokenizationSpecification = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
        'gateway': 'example',
        'gatewayMerchantId': 'exampleGatewayMerchantId'
    }
};

/**
 * Describe your site's support for the CARD payment method and its required
 * fields
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
 */
const baseCardPaymentMethod = {
    type: 'CARD',
    parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks
    }
};

/**
 * Describe your site's support for the CARD payment method including optional
 * fields
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
 */
const cardPaymentMethod = Object.assign(
    {},
    baseCardPaymentMethod,
    {
        tokenizationSpecification: tokenizationSpecification
    }
);

/**
 * An initialized google.payments.api.PaymentsClient object or null if not yet set
 *
 * @see {@link getGooglePaymentsClient}
 */
let paymentsClient = null;

/**
 * Configure your site's support for payment methods supported by the Google Pay
 * API.
 *
 * Each member of allowedPaymentMethods should contain only the required fields,
 * allowing reuse of this base request when determining a viewer's ability
 * to pay and later requesting a supported payment method
 *
 * @returns {object} Google Pay API version, payment methods supported by the site
 */
function getGoogleIsReadyToPayRequest() {
    return Object.assign(
        {},
        baseRequest,
        {
            allowedPaymentMethods: [baseCardPaymentMethod]
        }
    );
}

/**
 * Configure support for the Google Pay API
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|PaymentDataRequest}
 * @returns {object} PaymentDataRequest fields
 */
function getGooglePaymentDataRequest() {
    const paymentDataRequest = Object.assign({}, baseRequest);
    paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
    paymentDataRequest.merchantInfo = {
        // @todo a merchant ID is available for a production environment after approval by Google
        // See {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist|Integration checklist}
        // merchantId: '01234567890123456789',
        merchantName: 'Example Merchant'
    };

    paymentDataRequest.callbackIntents = ["PAYMENT_AUTHORIZATION"];

    return paymentDataRequest;
}

/**
 * Return an active PaymentsClient or initialize
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/client#PaymentsClient|PaymentsClient constructor}
 * @returns {google.payments.api.PaymentsClient} Google Pay API client
 */
function getGooglePaymentsClient() {
    if (paymentsClient === null) {
        paymentsClient = new google.payments.api.PaymentsClient({
            environment: 'TEST',
            paymentDataCallbacks: {
                onPaymentAuthorized: onPaymentAuthorized
            }
        });
    }
    return paymentsClient;
}

/**
 * Handles authorize payments callback intents.
 *
 * @param {object} paymentData response from Google Pay API after a payer approves payment through user gesture.
 * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentData object reference}
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentAuthorizationResult}
 * @returns Promise<{object}> Promise of PaymentAuthorizationResult object to acknowledge the payment authorization status.
 */
function onPaymentAuthorized(paymentData) {
    return new Promise(function (resolve, reject) {
        // handle the response
        processPayment(paymentData)
            .then(function () {
                resolve({ transactionState: 'SUCCESS' });
            })
            .catch(function () {
                resolve({
                    transactionState: 'ERROR',
                    error: {
                        intent: 'PAYMENT_AUTHORIZATION',
                        message: 'Insufficient funds, try again. Next attempt should work.',
                        reason: 'PAYMENT_DATA_INVALID'
                    }
                });
            });
    });
}

/**
 * Initialize Google PaymentsClient after Google-hosted JavaScript has loaded
 *
 * Display a Google Pay payment button after confirmation of the viewer's
 * ability to pay.
 */
function onGooglePayLoaded() {
    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
        .then(function (response) {
            if (response.result) {
                addGooglePayButton();
            }
        })
        .catch(function (err) {
            // show error in developer console for debugging
            console.error(err);
        });
}

/**
 * Add a Google Pay purchase button alongside an existing checkout button
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#ButtonOptions|Button options}
 * @see {@link https://developers.google.com/pay/api/web/guides/brand-guidelines|Google Pay brand guidelines}
 */
function addGooglePayButton() {
    const paymentsClient = getGooglePaymentsClient();
    const button =
        paymentsClient.createButton({ onClick: onGooglePaymentButtonClicked });
    document.getElementById('google-container').appendChild(button);
}

/**
 * Provide Google Pay API with a payment amount, currency, and amount status
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo|TransactionInfo}
 * @returns {object} transaction info, suitable for use as transactionInfo property of PaymentDataRequest
 */
function getGoogleTransactionInfo() {
    return {
        displayItems: [
            {
                label: "Subtotal",
                type: "SUBTOTAL",
                price: "9.00",
            },
            {
                label: "Tax",
                type: "TAX",
                price: "1.00",
            }
        ],
        countryCode: 'US',
        currencyCode: "USD",
        totalPriceStatus: "FINAL",
        totalPrice: "10.00",
        totalPriceLabel: "Total"
    };
}


/**
 * Show Google Pay payment sheet when Google Pay payment button is clicked
 */
function onGooglePaymentButtonClicked() {
    const paymentDataRequest = getGooglePaymentDataRequest();
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();

    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.loadPaymentData(paymentDataRequest);
}

let attempts = 0;
/**
 * Process payment data returned by the Google Pay API
 *
 * @param {object} paymentData response from Google Pay API after user approves payment
 * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentData|PaymentData object reference}
 */
function processPayment(paymentData) {
    return new Promise(function (resolve, reject) {
        setTimeout(async function () {
            // @todo pass payment token to your gateway to process payment
            paymentToken = paymentData.paymentMethodData.tokenizationData.token;

            if (attempts++ % 2 == 0) {
                reject(new Error('Every other attempt fails, next one should succeed'));
            } else {

                const gameRes = await fetch("/api/user", {

                    method: "PUT", body: JSON.stringify({
                        "roles": 1984
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                resolve({});
            }
        }, 500);
    });
}

