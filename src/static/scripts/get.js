document.addEventListener("DOMContentLoaded", function () {
  let csrftoken = getCookie("csrftoken");
  const section_div = document.querySelectorAll(".created-clipboard");
  section_div.forEach((clipboard) => {
    clipboard.addEventListener("click", (event) => {
      const section = event.target.dataset.section;
      fetch(`${section}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({ section }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.success)
          if (data.success) {
            add_clipboards('1', data.clipboards)
            history.pushState(null, null, section)
          }
        });
    });
  });
});

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function add_clipboards(parent, clipboards) {
  const container = document.createElement("div");
  container.id = "clipboards-container";
  for (let i = 0; i < clipboards.length; i++) {
    let clipboard = document.createElement("div");
    console.log(clipboards)
  }
}