document.addEventListener("DOMContentLoaded", function () {
  addSelectedClassToMatchingSection();
  document.body.addEventListener("click", (event) => {
    if (event.target.matches(".section-button")) {
      document
        .querySelectorAll(".created-clipboard")
        .forEach((div) => div.classList.remove("selected"));
      event.target.parentElement.parentElement.classList.add("selected");
      const section = event.target.dataset.section;
      fetch(`/${section}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({ section }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            remove_current_clipboards();
            if (data.clipboards.length > 0) {
              console.log("wwwqq")
              add_clipboards(data.clipboards);
            }
            history.pushState(null, null, "/" + data.section + "/");
          }
        });
    }
    if (event.target.matches(".copy-button")) {
      const copyToClipboard = () => {
          let clipboard_body = event.target.parentElement.parentElement.children[1].textContent;
          navigator.clipboard.writeText(clipboard_body);
          let popup = document.createElement("div");
          popup.textContent = "Copied";
          popup.classList.add("copied-popup");
          document.body.appendChild(popup);
          setTimeout(() => {
              popup.remove();
          }, 1000);
      }
      copyToClipboard();
  }
  
  
  
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

function add_clipboards(clipboards) {
  console.log("here")
  const clipboards_container = document.createElement("div");
  clipboards_container.id = "clipboards-container";
  for (let i = 0; i < clipboards.length; i++) {
    let clipboard_container = document.createElement("div");
    clipboard_container.classList.add("clipboard-container");
    clipboard_container.dataset.clipboard = clipboards[i].id;
    let header = document.createElement("div");
    header.classList.add("header");
    header.textContent = clipboards[i].key;
    let body = document.createElement("pre");
    body.classList.add("body");
    body.textContent = clipboards[i].value;
    const clipboard_actions = document.createElement("div");
    clipboard_actions.classList.add("clipboard-actions");
    const delete_button = document.createElement("button");
    delete_button.textContent = "Delete";
    delete_button.classList.add("delete-button");
    delete_button.addEventListener("click", function () {
      delete_clipboard(clipboard_container);
    });
    const copy_button = document.createElement("button");
    copy_button.textContent = "Copy";
    copy_button.classList.add("copy-button");
    clipboard_actions.appendChild(delete_button);
    clipboard_actions.appendChild(copy_button);
    clipboard_container.appendChild(header);
    clipboard_container.appendChild(body);
    clipboards_container.appendChild(clipboard_container);
    clipboard_container.appendChild(clipboard_actions);
  }
  document
    .getElementById("section-clipboard")
    .appendChild(clipboards_container);
}

function delete_clipboard(clipboard) {
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

function select_clipboard(clipboards_container, clipboard) {
  if (clipboards_container) {
    clipboards_container.remove();
  }
  let elements = document.querySelectorAll(".created-clipboard");
  elements.forEach(function (element) {
    element.classList.remove("selected");
  });

  clipboard.classList.add("selected");
}

function remove_current_clipboards() {
  document.querySelectorAll(".clipboard-container").forEach((clipboard) => {
    console.log(clipboard)
    clipboard.remove();
  });
}

function addSelectedClassToMatchingSection() {
  const section_div = document.querySelectorAll(".created-clipboard");

  // Get the current URL path
  let currentPath = window.location.href.split("/")[3];

  // Find the matching section_div element
  let matchingDiv = [...section_div].find((div) =>
    div.querySelector(`[data-section="${currentPath}"]`)
  );

  // Add 'selected' class to the matching section_div element
  if (matchingDiv) {
    matchingDiv.classList.add("selected");
  }
}
