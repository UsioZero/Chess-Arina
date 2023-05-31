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

            console.log('ok');
            window.location.href = "/";

        } else {
            alert(data.message ?? "Error. Try again later");
        }
    })

  
})