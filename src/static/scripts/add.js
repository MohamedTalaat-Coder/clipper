document.addEventListener("DOMContentLoaded", function () {
  const add_button = document.querySelectorAll(".add-clipboard");
  const create_button = document.getElementById("create-section");
  const add_current_clipboard_button = document.getElementById(
    "add-clipboard-button"
  );
  create_button.addEventListener("click", () => {
    let section = prompt("");
    if (section !== null) {
      const url = "/create/";
      fetch_data(url, "POST", { section: section })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            append_new_section(data.section, data.section_id);
          }
        });
    }
  });

  add_button.forEach((button) => {
    button.addEventListener("click", () => {
      const url = `${button.dataset.section}/add/`;
    });
  });

  add_current_clipboard_button.addEventListener("click", () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        let key = prompt("key:");
        if (key !== null) {
          let value = text;
          let section_id = window.location.href.split("/")[3];
          fetch(`/${section_id}/add/`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({
              section: section_id,
              key: key,
              value: value,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                append_new_clipboard(data);
              } else {
                alert("No data in clipboard");
              }
            });
        }
      })
      .catch((err) => {
        console.error("Failed to read clipboard contents: ", err);
      });
  });
});

const section_div = document.querySelectorAll(".created-clipboard");

section_div.forEach((clipboard) => {
  clipboard.addEventListener("click", (event) => {
    get_section_clipboards(event);
    // let delete_buttons = document.querySelectorAll(".delete-button");
    // delete_buttons.forEach(button => {
    //   button.addEventListener("click", () => {
    //     button.addEventListener(delete_clipboard(button))
    //   })
    // })
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

function append_new_section(section, id) {
  const parent = document.getElementById("sections-container");
  const container = document.createElement("div");
  container.classList.add("created-clipboard", "clipboard");
  container.addEventListener("click", get_section_clipboards, false);
  container.innerHTML = `
  <div class="header">
      <button data-section="${id}">${section}</button>
    </div>
  `;
  parent.appendChild(container);
}

function append_new_clipboard(data) {
  const container = document.createElement("div");
  container.classList.add("clipboard-container");
  console.log(data)
  container.dataset.clipboard = data.id;
  const header = document.createElement("div");
  header.className = "header";
  header.textContent = data.key;

  const body = document.createElement("pre");
  body.className = "body";
  body.textContent = data.value;

  container.appendChild(header);
  container.appendChild(body);

  document.getElementById("clipboards-container").appendChild(container);
  const actions = document.createElement("div");
  actions.className = "clipboard-actions";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function() {
    delete_clipboard(container);
  })

  const copyButton = document.createElement("button");
  copyButton.className = "copy-button";
  copyButton.textContent = "Copy";

  actions.appendChild(deleteButton);
  actions.appendChild(copyButton);

  container.appendChild(actions);
}

function remove_current_clipboar() {
  document.getElementById("section-clipboard").remove();
}

function add_clipboard_section() {
  const container = document.createElement("div");
  container.innerHTML = `
  
  `;
}

function get_section_clipboards(event) {
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
        append_new_clipboard(data);
      }
    });
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