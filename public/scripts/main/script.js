$(document).ready(async function() {
  // Define an array of patterns for text and images
  var patterns = [
    {
      title: "Chess history: Creation of chess",
      img1: "img/main_img/1.png",
      img2: "img/main_img/2.png",
      dialog: "img/dialog/dialog1.png"
    },
    {
      title: "Chess history: Chess in Europe",
      img1: "img/main_img/3.png",
      img2: "img/main_img/4.png",
      dialog: "img/dialog/dialog2.png"
    },
    {
      title: "Chess history: Chess rules change",
      img1: "img/main_img/5.png",
      img2: "img/main_img/6.png",
      dialog: "img/dialog/dialog3.png"
    },
    {
      title: "Chess history: Chess as sport",
      img1: "img/main_img/7.png",
      img2: "img/main_img/8.png",
      dialog: "img/dialog/dialog4.png"
    },
    {
      title: "Chess history: Modern chess",
      img1: "img/main_img/9.png",
      img2: "img/main_img/10.png",
      dialog: "img/dialog/dialog5.png"
    }
  ];

  var currentIndex = 0; // Current pattern index

  // Function to update the text and images based on the current pattern index
  function updatePattern() {
    $("#strip-title").text(patterns[currentIndex].title);
    $("#content-image-1").attr("src", patterns[currentIndex].img1);
    $("#content-image-2").attr("src", patterns[currentIndex].img2);
    $("#content-image-3").attr("src", patterns[currentIndex].dialog);
  }

  // Button click event handler for "Next" button
  $("#btn7").on("click", function() {
    currentIndex = (currentIndex + 1) % patterns.length; // Increment index with wrap-around
    updatePattern();
  });

  // Button click event handler for "Previous" button
  $("#btn6").on("click", function() {
    currentIndex = (currentIndex - 1 + patterns.length) % patterns.length; // Decrement index with wrap-around
    updatePattern();
  });
});
