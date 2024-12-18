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
      const logoutButton = document.querySelector(".logout-btn");
      const customHeader = document.querySelector(".custom-header");
      const usernameElem = document.querySelector(".username");
      const detailsElem = document.querySelector(".details");

      if (username && followers) {
        // 로그인 상태
        usernameElem.textContent = username;
        detailsElem.textContent = `팔로워 ${followers}명`;

        // 로고 제거
        customHeader.classList.add("logged-in");

        followListBtn.style.display = "inline-block";
        followListBtn.onclick = function () {
          window.location.href = "followpage.html";
        };

        logoutButton.textContent = "로그아웃";
        logoutButton.onclick = function () {
          localStorage.clear();
          window.location.href = "login.html";
        };
      } else {
        // 비로그인 상태
        usernameElem.textContent = "";
        detailsElem.textContent = "";

        customHeader.classList.remove("logged-in");

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
