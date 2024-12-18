document
  .getElementById("signup-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = event.target.email.value.trim();
    const nickname = event.target.nickname.value.trim();
    const password = event.target.password.value.trim();
    const passwordCheck = event.target.passwordCheck.value.trim();
    const errorMessage = document.getElementById("error-message");

    errorMessage.textContent = "";

    // 비밀번호 확인 검사
    if (password !== passwordCheck) {
      errorMessage.textContent = "비밀번호와 비밀번호 확인이 일치하지 않습니다.";
      return;
    }

    try {
      const response = await fetch(
        "https://food-social.kro.kr/api/v1/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, nickname }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "회원가입 실패");
      }

      alert("회원가입 성공!");
      window.location.href = "login.html";
    } catch (error) {
      console.error("Error during signup:", error);
      errorMessage.textContent = error.message || "서버 통신 중 오류 발생";
    }
  });

// 비밀번호 실시간 확인
document
  .getElementById("passwordCheck")
  .addEventListener("input", function () {
    const password = document.getElementById("password").value;
    const passwordCheck = this.value;
    const passwordMatch = document.getElementById("password-match");

    if (password === passwordCheck && password !== "") {
      passwordMatch.textContent = "비밀번호가 일치합니다.";
      passwordMatch.style.color = "#28a745";
    } else {
      passwordMatch.textContent = "비밀번호가 일치하지 않습니다.";
      passwordMatch.style.color = "red";
    }
  });
