
document.addEventListener("DOMContentLoaded", function () {
  let csrftoken = getCookie("csrftoken");
  const section_div = document.querySelectorAll(".created-clipboard");
  section_div.forEach((clipboard) => {
    clipboard.addEventListener("click", (event) => {
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
            add_clipboards("section-clipboard", data.clipboards);
            history.pushState(null, null, "/" + section + "/");
            const clipboards_container = document.getElementById(
              "clipboards-container"
            );
            if (clipboards_container) {
              clipboards_container.remove();
            }
            let clipboards = document.querySelectorAll(".created-clipboard");
            clipboards.forEach(clip_div => {
              clip_div.classList.remove("selected")
            })
            clipboard.classList.add("selected")
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
  const clipboards_container = document.createElement("div");
  clipboards_container.id = "clipboards-container";
  for (let i = 0; i < clipboards.length; i++) {
    let clipboard_container = document.createElement("div");
    clipboard_container.classList.add("clipboard-container");
    clipboard_container.dataset.clipboard = clipboards[i].id
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
    delete_button.addEventListener("click", function() {
      delete_clipboard(clipboard_container)
    })
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
  document.getElementById("section-clipboard").appendChild(clipboards_container);
}


function delete_clipboard(clipboard) {
  const clipboard_id = clipboard.dataset.clipboard;
  fetch(`/${clipboard_id}/delete`, {
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