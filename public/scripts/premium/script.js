document.addEventListener('DOMContentLoaded', function () {

    const accessToken = localStorage.getItem('accessToken');
    fetch('/protected-page', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(response => {
        // Handle the response
    }).catch(error => {
        // Handle the error
    });

})