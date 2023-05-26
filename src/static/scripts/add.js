document.addEventListener("DOMContentLoaded", function () {
  const add_button = document.querySelectorAll(".add-clipboard");
  const create_button = document.getElementById("create-section");
  create_button.addEventListener("click", () => {
    let section = prompt("")
    if (section !== null) {
    const url = "create/";
    fetch_data(url, "POST", {"section":section})
    }
  })
  add_button.forEach(button => {
    button.addEventListener("click", () => {
      const url = `${button.dataset.section}/add/`
      fetch_data(url, "POST", {"key":"key", "value":"value"})
    })
  })
});

function fetch_data(url, method, data) {
  formdata = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formdata.append(key, value);
  }
  return fetch(url, {
    method: method,
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: formdata,
  });
}

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
