window.addEventListener('DOMContentLoaded', function () {
    // Define the dataArray with the image URLs
    var dataArray = ["img/avatars/Avatar7.png", "img/bgs/bg1.png"];

    // Get a reference to the img element inside the td element with class "avatar-td"
    const avatarImgs = document.querySelectorAll('.avatar-td img');

    // loop through each img element and set its src attribute to dataArray[0]
    avatarImgs.forEach(img => {
        img.src = dataArray[0];
    });

    // Get a reference to the div element with class "bg-test-image"
    var bgTestImage = document.querySelector('.bg-test-image');

    // Set the background image of the div element to the second URL in the dataArray
    bgTestImage.style.backgroundImage = `url(${dataArray[1]})`;

    const buttonUploadAvatar = document.getElementById("button-upload-avatar");
    const fileUpload = document.getElementById("file-upload");

    buttonUploadAvatar.addEventListener("click", () => {
        fileUpload.click();
    });

    fileUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const avatarImg = document.querySelector(".avatar-td img");
          avatarImg.src = reader.result;
          dataArray[0] = reader.result;
        };
      });
      const buttonUploadBg = document.getElementById("button-upload-bg");
      const fileUploadbg = document.getElementById("file-upload-bg");
  
      buttonUploadBg.addEventListener("click", () => {
          fileUploadbg.click();
      });
  
      fileUploadbg.addEventListener("change", (event) => {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const bgImg = document.querySelector(".bg-test-image");
            bgImg.style.backgroundImage = `url(${reader.result})`;
            dataArray[1] = reader.result;
          };
        });
});
