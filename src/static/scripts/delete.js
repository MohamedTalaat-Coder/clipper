document.addEventListener("DOMContentLoaded", function () {
  const delete_buttons = document.querySelectorAll(".delete-button");
  const delete_section = document.getElementById("delete-section");
  console.log(delete_buttons);
  delete_buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      delete_clipboard(button);
    });
  });
  delete_section.addEventListener("click", () => {
    const urlParts = window.location.href.split("/")[3];
    fetch(`/${urlParts}/delete`, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const sectionElement = document.querySelector(`[data-section='${urlParts}']`);
          sectionElement.remove();

          const clipboardContainers = document.getElementsByClassName("clipboard-container");
          while (clipboardContainers.length > 0) {
            clipboardContainers[0].remove();
          }
          
        }
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

function delete_clipboard(button) {
  const clipboard = button.parentElement.parentElement;
  const clipboard_id = clipboard.dataset.clipboard;
    const section = window.location.href.split("/")[3];
  fetch(`/${section}/${clipboard_id}/delete`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify({ clipboard: clipboard.dataset.clipboard_id }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        clipboard.remove();
      }
    });
}
