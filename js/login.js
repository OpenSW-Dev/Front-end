document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;
    const errorMessage = document.getElementById("error-message");

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

      const loginResponse = await response.json();

      if (loginResponse && loginResponse.data) {
        localStorage.setItem("authToken", loginResponse.data);

        const authToken = localStorage.getItem("authToken");

        try {
          const userResponse = await fetch(
            "https://food-social.kro.kr/api/v1/members/me",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log("User data:", userData);

            if (userData && userData.data) {
              localStorage.setItem("id", userData.data.id);
              localStorage.setItem("email", userData.data.email);
              localStorage.setItem("nickname", userData.data.nickname);
              localStorage.setItem("following", userData.data.following);
            } else {
              console.error("Unexpected response format:", userData);
            }
          } else {
            console.error(
              "Failed to fetch user data:",
              userResponse.status,
              userResponse.statusText
            );
            alert("사용자 정보 불러오기에 실패했습니다.");
          }
        } catch (error) {
          console.error("Error occurred while fetching user data:", error);
          alert("사용자 정보 불러오기에 실패했습니다.");
        }

        alert("로그인 성공!");
        window.location.href = "index.html";
      } else {
        errorMessage.textContent = "다시 시도해주세요.";
      }
    } catch (error) {
      console.error("Error during login:", error);
      errorMessage.textContent = "서버와 통신 중 문제가 발생했습니다.";
    }
  });
