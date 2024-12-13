document.addEventListener('DOMContentLoaded', function () {
    const likeButton = document.getElementById('likeButton');
    const likeCount = document.getElementById('likeCount');

    let count = 0;

    likeButton.addEventListener('click', function () {
        count++;
        likeCount.textContent = count;
    });
});
const likeButton = document.querySelector('.like-button');
const likeCountElement = document.querySelector('.like-count');

let likeCount = parseInt(likeCountElement.textContent);

likeButton.addEventListener('click', function() {
    if (this.classList.toggle('active')) {
        likeCount++;
    } else {
        likeCount--;
    }
    likeCountElement.textContent = likeCount;
});
