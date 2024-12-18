document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = event.target.email.value.trim();
    const password = event.target.password.value.trim();
    const errorMessage = document.getElementById("error-message");

    errorMessage.textContent = "";

    try {
      // 로그인 API 호출
      const response = await fetch(
        "https://food-social.kro.kr/api/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "로그인 실패");
      }

      const loginResponse = await response.json();
      localStorage.setItem("authToken", loginResponse.data);

      // 사용자 정보 가져오기
      const userResponse = await fetch(
        "https://food-social.kro.kr/api/v1/members/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!userResponse.ok) throw new Error("사용자 정보를 불러오지 못했습니다.");

      const userData = await userResponse.json();
      const { id, email: userEmail, nickname, following } = userData.data;

      // 사용자 정보 저장
      localStorage.setItem("id", id);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("nickname", nickname);
      localStorage.setItem("following", following);

      alert("로그인 성공!");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Error during login:", error);
      errorMessage.textContent = error.message || "서버와 통신 중 오류 발생";
    }
  });
