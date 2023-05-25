document.addEventListener("DOMContentLoaded", function () {
  const add_button = document.getElementById("add-clipboard");
  add_button.addEventListener("click", () => {
    const url = `create/`;
    fetch_data(url, "POST",{"helo":"hello"})
  });
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
