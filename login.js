document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const email = event.target.email.value;
    const password = event.target.password.value;
    const errorMessage = document.getElementById("error-message");

    // Clear previous error messages
    errorMessage.textContent = "";

    try {
      const response = await fetch(
        "https://food-social.kro.kr/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        errorMessage.textContent =
          errorResponse.message || "로그인 중 오류가 발생했습니다.";
        return;
      }

      const data = await response.json();

      // const token = data.token;

      if (data) {
        localStorage.setItem("authToken", data);
        alert("로그인 성공!");
        window.location.href = "recipes.html";
      } else {
        errorMessage.textContent = "Unexpected response from the server.";
      }
    } catch (error) {
      console.error("Error during login:", error);
      errorMessage.textContent = "서버와 통신 중 문제가 발생했습니다.";
    }
  });