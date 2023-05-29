document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('input');

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.style.color = 'black';
        });
    });

    document.querySelector('.register-btn').addEventListener('click', async () => {
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'pwd': password, 'email': email })
        });

        const data = await response.json();

        if (response.ok) {
            //window.location.href = '/regpage/login';
            console.log('ok');
            window.location.href = "/";
            // const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            // expirationTime = currentTime + 15;
            // localStorage.setItem('expirationTime', expirationTime.toString());
            // refreshToken();
        } else {
            alert(data.message ?? "Error. Try again later");
        }
    })

    // Function to refresh the access token
    // async function refreshToken() {
    //     console.log("refresh");
    //     let expirationTime = localStorage.getItem('expirationTime');
    //     const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    //     console.log(expirationTime);
    //     if (currentTime >= expirationTime) {
    //         // Access token has expired, make a request to refresh it
    //         try {
    //             const response = await fetch('/auth/refresh');

    //             if (response.ok) {
    //                 const data = await response.json()
    //                 expirationTime = currentTime + 15;
    //                 localStorage.setItem('expirationTime', expirationTime.toString());
    //                 setTimeout(refreshToken, 10000);
    //             } else {
    //                 console.error('Failed to refresh access token');
    //             }
    //         } catch (error) {
    //             console.error('Failed to refresh access token', error);
    //         }
    //     } else {
    //         setTimeout(refreshToken, (expirationTime - currentTime - 5) * 1000);
    //     }
    // }

    // Call refreshToken to start the token refresh process
    //refreshToken();
})