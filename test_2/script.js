const burgMenu = document.querySelector(".burgMenu");
const mobileTopNav = document.querySelector(".mobileTopNav");
const logoImg = document.querySelector(".logoContainer img")[0];

function slideLeft() {
  burgMenu.style.cssText =
    "opacity:0; transform: translateX(-20px); -webkit-transform: translateX(-20px); -moz-transform: translateX(-20px); -ms-transform: translateX(-20px); -o-transform: translateX(-20px)";
  logoImg.style.cssText =
    "opacity:0; transform: translateX(-20px); -webkit-transform: translateX(-20px); -moz-transform: translateX(-20px); -ms-transform: translateX(-20px); -o-transform: translateX(-20px)";
}

burgMenu.addEventListener("click", function () {
  if (!this.classList.contains("active")) {
    slideLeft();

    logoImg.classList.add("active");

    setTimeout(() => {
      mobileTopNav.style.display = "block";

      this.classList.add("active");
      logoImg.setAttribute("src", "./img/logo-mobile-nav.png");
      logoImg.style.cssText =
        "opacity:1; transform: translateX(0px); -webkit-transform: translateX(0px); -moz-transform: translateX(0px); -ms-transform: translateX(0px); -o-transform: translateX(0px)";

      this.style.cssText =
        "opacity:1; transform: translateX(0px); -webkit-transform: translateX(0px); -moz-transform: translateX(0px); -ms-transform: translateX(0px); -o-transform: translateX(0px)";
    }, 500);
  } else {
    slideLeft();

    setTimeout(() => {
      mobileTopNav.style.display = "none";
      this.classList.remove("active");
      logoImg.classList.remove("active");
      logoImg.setAttribute("src", "./img/invesco-logo.png");
      logoImg.style.cssText =
        "opacity:1; transform: translateX(0px); -webkit-transform: translateX(0px); -moz-transform: translateX(0px); -ms-transform: translateX(0px); -o-transform: translateX(0px)";

      this.style.cssText =
        "opacity:1; transform: translateX(0px); -webkit-transform: translateX(0px); -moz-transform: translateX(0px); -ms-transform: translateX(0px); -o-transform: translateX(0px)";
    }, 500);
  }
});
