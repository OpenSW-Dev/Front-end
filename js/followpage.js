document.addEventListener("DOMContentLoaded", function () {
  // 유저 목록을 표시할 컨테이너
  const container = document.querySelector(".container");

  // 유저 HTML 생성 함수
  function createUserHTML(user) {
    return `
            <div class="user">
                <img src="https://via.placeholder.com/60" alt="User Image">
                <div class="user-info">
                    <div class="user-name">${user.nickname}</div>
                    <div class="user-description">사용자</div>
                </div>
                <div class="user-status">
                    <button class="follow-button following" data-id="${user.id}" onclick="event.stopPropagation()">팔로잉</button>
                </div>
            </div>
        `;
  }

  // 팔로우 버튼 이벤트 설정 함수
  function setupFollowButtons() {
    const followButtons = document.querySelectorAll(".follow-button");

    followButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const isFollowing = this.classList.contains("following");

        const userId = this.dataset.id;
        console.log(userId);

        if (isFollowing) {
          // Unfollow
          this.classList.remove("following");
          this.classList.add("not-following");
          this.textContent = "팔로우";

          toggleFollowStatus(userId, false);
        } else {
          // Follow
          this.classList.remove("not-following");
          this.classList.add("following");
          this.textContent = "팔로잉";

          toggleFollowStatus(userId, true);
        }
      });

      button.addEventListener("mouseenter", function () {
        if (this.classList.contains("following")) {
          this.textContent = "언팔로우";
        }
      });

      button.addEventListener("mouseleave", function () {
        if (this.classList.contains("following")) {
          this.textContent = "팔로잉";
        } else {
          this.textContent = "팔로우";
        }
      });
    });
  }

  function toggleFollowStatus(followingId, isFollowing) {
    const authToken = localStorage.getItem("authToken");
    const headers = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    };

    fetch("https://food-social.kro.kr/api/v1/follow", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        followingId: followingId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          console.error("Error following/unfollowing:", data.message);

          // Revert button state if error occurs
          const button = document.querySelector(
            `button[data-user-id="${followingId}"]`
          );
          if (button) {
            button.classList.remove(
              isFollowing ? "following" : "not-following"
            );
            button.classList.add(isFollowing ? "not-following" : "following");
            button.textContent = isFollowing ? "팔로우" : "팔로잉";
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching follow status:", error);
      });
  }

  async function fetchUsers() {
    try {
      const authToken = localStorage.getItem("authToken");

      const response = await fetch("https://food-social.kro.kr/api/v1/follow", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success && result.data) {
        let usersHTML = "";

        result.data.forEach((user) => {
          usersHTML += createUserHTML(user);
        });

        container.innerHTML = usersHTML;

        setupFollowButtons();
      } else {
        container.innerHTML =
          '<h1 class="title">팔로잉</h1><p>사용자 목록을 불러올 수 없습니다.</p>';
      }
    } catch (error) {
      console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
      container.innerHTML =
        '<h1 class="title">팔로잉</h1><p>오류가 발생했습니다. 나중에 다시 시도해주세요.</p>';
    }
  }

  // 페이지 로드 시 사용자 목록 가져오기
  fetchUsers();
});
