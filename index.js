document.addEventListener('DOMContentLoaded', function () {
    const likeButton = document.getElementById('likeButton');
    const likeCount = document.getElementById('likeCount');

    let count = 0;

    likeButton.addEventListener('click', function () {
        count++;
        likeCount.textContent = count;
    });
});