document
  .getElementById("signup-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;
    const passwordConfirm = event.target.passwordCheck.value;
    const nickname = event.target.nickname.value;
    const errorMessage = document.getElementById("error-message");

    errorMessage.textContent = "";

    if (password !== passwordConfirm) {
      errorMessage.textContent =
        "비밀번호와 비밀번호 확인이 일치하지 않습니다.";
      return;
    }

    try {
      const response = await fetch(
        "https://food-social.kro.kr/api/v1/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            nickname,
          }),
        }
      );

      if (!response.ok) {
        // Handle error if response is not successful
        const errorResponse = await response.json();
        errorMessage.textContent =
          errorResponse.message || "회원가입 중 오류가 발생했습니다.";
        return;
      }

      // Handle successful signup
      const successResponse = await response.json();
      alert("회원가입 성공!"); // Notify user
      window.location.href = "/login.html"; // Redirect to login page after signup
    } catch (error) {
      console.error("Error occurred during signup:", error);
      errorMessage.textContent = "서버와의 통신 중 문제가 발생했습니다.";
    }
  });
