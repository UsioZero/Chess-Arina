document.addEventListener('DOMContentLoaded', async function () {

    const responce = await fetch('/api/user');
    const resData = await responce.json();

    // resData._doc - ce vs'a infa
    // jakso nado usernam - resData._doc.username
    console.log(resData);
})