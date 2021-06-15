let taskListArray = [];

const deleteAll = document.getElementById("delete-all");
let currentInputValue = "";
const taskInput = document.getElementById("task-make-input");
const addButton = document.getElementById("add-button");

window.onload = async () => {
  // get request for load page
  const response = await fetch("http://localhost:8000/allTasks", {
    method: "GET",
  });

  const jsonResult = await response.json();
  taskListArray = jsonResult.data || [];
  renderList();
};

addButton.addEventListener(`click`, () => addNewTask());

// delete all tasks
deleteAll.onclick = async () => {
  const response = await fetch("http://localhost:8000/deleteAll", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
  const result = await response.json();
  taskListArray = result.data;
  renderList();
};

taskInput.addEventListener("keyup", () => {
  currentInputValue = taskInput.value;
});

// add to press Enter
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addNewTask();
});

// check is task empty
const isEmpty = (string) => {
  if (typeof string !== "string") return false;
  string = string.replace(/\s+/gm, " ").trim();
  return string ? string : false;
};

// add new task
const addNewTask = async () => {
  if (isEmpty(currentInputValue)) {
    const response = await fetch("http://localhost:8000/createTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        text: isEmpty(currentInputValue),
        isCheck: false,
      }),
    });
    let jsonResult = await response.json();
    taskListArray = jsonResult.data;
    taskInput.value = "";
    currentInputValue = taskInput;
    taskInput.focus();
    renderList();
  }
};

// click on li's checkbox
const clickOnCheckbox = async (index) => {
  const { _id, text, isCheck } = taskListArray[index];
  const response = await fetch(
    `http://localhost:8000/updateTask?_id=${taskListArray[index]._id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        text: text,
        isCheck: !isCheck,
        _id: _id,
      }),
    }
  );
  let result = await response.json();
  taskListArray = result.data;
  taskListArray.sort((a, b) => a.isCheck - b.isCheck);
  renderList();
};

// these three values are used multiple times,
// so I combined them into one object so that I can use it everywhere
const elemsOfListItem = (index) => {
  return {
    elem: taskListArray.find((item, idx) => idx === index),
    editTask: document.getElementById(`${index}`).querySelector(".edit-task"),
    input: document.getElementById(`text-${index}`),
  };
};

// click on the pencil
const editThisTask = (index) => {
  const { elem, editTask, input } = elemsOfListItem(index);
  if (!elem.isCheck) {
    editTask.src = "img/tick.svg";
    editTask.nextSibling.src = "img/arrows-circle.svg";

    input.disabled = false;
    input.focus();

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") saveChangesInInput(index);
    });
    editTask.onclick = () => saveChangesInInput(index);
    editTask.nextSibling.onclick = () => previousInputValue(index);
  }
};

// save changes on edited input
const saveChangesInInput = async (index) => {
  const { elem, editTask, input } = elemsOfListItem(index);
  const { _id, text, isCheck } = taskListArray[index];
  if (!isEmpty(input.value)) {
    if (confirm("There is no value in the input field. Are you sure?")) {
      const response = await fetch(
        `http://localhost:8000/deleteTask?_id=${_id}`,
        {
          method: "DELETE",
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      let result = await response.json();
      taskListArray = result.data;
      renderList();
    } else {
      input.focus();
    }
    return;
  }

  const response = await fetch(`http://localhost:8000/updateTask?_id=${_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      text: isEmpty(input.value),
      isCheck: elem.isCheck,
      _id: _id
    }),
  });
  let result = await response.json();
  elem.text = result.data[index].text;
  input.disabled = true;

  editTask.src = "img/edit.svg";
  editTask.nextSibling.src = "img/close.svg";
  taskInput.focus();
  renderList();
};

// return the previous value
const previousInputValue = (index) => {
  const { elem, editTask, input } = elemsOfListItem(index);

  input.value = elem.text;
  input.disabled = true;

  editTask.src = "img/edit.svg";
  editTask.nextSibling.src = "img/close.svg";
  taskInput.focus();
  renderList();
};

// delete list element
const deleteThisTask = async (index) => {
  const { _id, text, isCheck } = taskListArray[index];
  const response = await fetch(
    `http://localhost:8000/deleteTask?_id=${_id}`,
    {
      method: "DELETE",
    }
  );
  let result = await response.json();
  taskListArray = result.data;
  renderList();
};

// rendering tasks list
const renderList = () => {
  const list = document.getElementById("task-list");
  while (list.firstChild) list.removeChild(list.firstChild);

  taskListArray.map((item, index) => {
    const itemCheckbox = document.createElement("input");
    itemCheckbox.type = "checkbox";
    itemCheckbox.checked = item.isCheck;
    itemCheckbox.onclick = () => clickOnCheckbox(index);

    const itemInput = document.createElement("input");
    itemInput.type = "text";
    itemInput.id = `text-${index}`;
    itemInput.value = item.text;
    itemInput.disabled = true;

    const editTask = document.createElement("img");
    editTask.src = "img/edit.svg";
    editTask.className = "edit-task";
    editTask.onclick = () => editThisTask(index);

    const deleteTask = document.createElement("img");
    deleteTask.src = "img/close.svg";
    deleteTask.className = "delete-task";
    deleteTask.onclick = () => deleteThisTask(index);

    const listItem = document.createElement("li");
    listItem.append(itemCheckbox, itemInput, editTask, deleteTask);
    listItem.className = itemCheckbox.checked ? "done" : "";
    listItem.id = `${index}`;

    list.append(listItem);
  });
};
