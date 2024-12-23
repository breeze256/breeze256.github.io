---
title: 关于
---

<script>
  fetch('https://raw.githubusercontent.com/breeze256/breeze256/refs/heads/mastar/README.md')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(text => {
      const postContent = document.querySelector(".post-content");
      // Insert.
      if (postContent) {
        postContent.insertAdjacentHTML('beforeend', text);
      }
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
</script>
