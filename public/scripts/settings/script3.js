window.addEventListener("load", function() {
    // Set the base value to 1
    var base = 3;
  
    // Loop through the objects with ids "theme-{i}" and "theme-{i}-button", where i is from 1 to 4
    for (var i = 1; i <= 4; i++) {
      // Get the td element with id "theme-{i}"
      var themeTd = document.getElementById(`theme-${i}`);
      // Get the td element with id "theme-{i}-button"
      var themeButtonTd = document.getElementById(`theme-${i}-button`);
  
      // If i is equal to the base value, set the active class for the td and its img
      if (i === base) {
       // themeTd.classList.add("active-theme");
        themeTd.getElementsByTagName("img")[0].classList.add("active-theme");
        themeButtonTd.getElementsByTagName("div")[0].classList.add("active-checkbox");
      }
    }

    const themes = document.querySelectorAll('[id^="theme-"]');
    //const themeButtons = document.querySelectorAll('[id^="theme-"][id$="-button"]');
    console.log(themes);
    themes.forEach((button) => {
        const index = parseInt(button.id.split("-")[1]);
        button.addEventListener("click", () => {
          var themeTd = document.getElementById(`theme-${base}`);
          var themeButtonTd = document.getElementById(`theme-${base}-button`);
          themeTd.getElementsByTagName("img")[0].classList.remove("active-theme");
          themeButtonTd.getElementsByTagName("div")[0].classList.remove("active-checkbox");
          base = index;
          themeButtonTd = document.getElementById(`theme-${base}-button`);
          themeTd = document.getElementById(`theme-${base}`);
          themeTd.getElementsByTagName("img")[0].classList.add("active-theme");
          themeButtonTd.getElementsByTagName("div")[0].classList.add("active-checkbox");
          console.log(base);
        });
      });


  });