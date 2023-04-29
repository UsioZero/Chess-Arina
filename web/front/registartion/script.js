document.addEventListener('DOMContentLoaded', function () {
    const emails = [
        'example1@gmail.com',
        'example2@gmail.com',
        'example3@gmail.com',
        'example4@gmail.com',
        'example5@gmail.com',
        'example6@gmail.com',
        'example7@gmail.com',
        'example8@gmail.com',
        'example9@gmail.com',
        'example10@gmail.com',
        'example11@gmail.com',
        'example12@gmail.com',
        'example13@gmail.com',
        'example14@gmail.com',
        'example15@gmail.com',
        'example16@gmail.com',
        'example17@gmail.com',
        'example18@gmail.com',
        'example19@gmail.com',
        'example20@gmail.com'
    ];
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

    const inputs = document.querySelectorAll('input');

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.style.color = 'black';
        });
    });

    document.querySelector('.register-btn').addEventListener('click', () => {
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const confirmPassword = document.querySelector('#confirm-password').value;
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        if (password === confirmPassword && !emails.includes(email) && isValidEmail(email)) {
            console.log(email, " ", password, " ", confirmPassword);
        }
        else {
            console.log("false");
        }
    });


});