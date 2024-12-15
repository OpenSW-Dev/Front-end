document.addEventListener("DOMContentLoaded", function () {
  fetch("navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar-header").innerHTML = data;
      const username = localStorage.getItem("nickname");
      const followers = localStorage.getItem("following");

      console.log("Username:", username);
      console.log("Followers:", followers);

      const followListBtn = document.querySelector(".follow-list-btn");
      followListBtn.onclick = function () {
        window.location.href = "followpage.html";
      };

      const logoutButton = document.querySelector(".logout-btn");

      if (username && followers) {
        document.querySelector(".username").textContent = username;
        document.querySelector(
          ".details"
        ).textContent = `팔로워 ${followers}명`;

        followListBtn.style.display = "inline-block";

        logoutButton.textContent = "로그아웃";

        logoutButton.onclick = function () {
          localStorage.clear();
          window.location.href = "login.html";
        };
      } else {
        document.querySelector(".username").textContent = "";
        document.querySelector(".details").textContent = "";

        followListBtn.style.display = "none";

        logoutButton.textContent = "로그인";

        logoutButton.onclick = function () {
          window.location.href = "login.html";
        };
      }
    })
    .catch((error) => {
      console.error("Error loading navbar:", error);
    });
});
