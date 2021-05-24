let taskListArray = JSON.parse(localStorage.getItem('tasks')) || [];



const deleteAll = document.getElementById('delete-all');
let currentInputValue = '';
const taskInput = document.getElementById('task-make-input');
const addButton = document.getElementById('add-button');


window.onload = function init() {
  
renderList();
}
addButton.addEventListener(`click`, () => addNewTask());

// delete all tasks 
deleteAll.onclick = () => {
	taskListArray = [];
	renderList();
}

taskInput.addEventListener('keyup', () => {
	currentInputValue = taskInput.value;
});


// add to press Enter
taskInput.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') addNewTask();
});

// check is task empty
const isEmpty = (string) => {
	if(typeof string !== 'string') return false;
	string = string.replace(/\s+/gm, ' ').trim();
	return string ? string : false;
}

// add new task
const addNewTask = () => {
	if(isEmpty(currentInputValue)) {
		taskListArray.push({
			taskText : isEmpty(currentInputValue),
			isChecked : false,
			dateTime : new Date()
		});
		localStorage.setItem('tasks', JSON.stringify(taskListArray));
		taskInput.value = '';
		currentInputValue = taskInput;
		taskInput.focus();
		renderList();
	}
}

// click on li's checkbox
const clickOnCheckbox = (index) => {
	taskListArray[index].isChecked = !taskListArray[index].isChecked;
	if (taskListArray[index].isChecked) {
			const elem = taskListArray.splice(index, 1);
			taskListArray.push(...elem);
			localStorage.setItem('tasks', JSON.stringify(taskListArray));
			renderList();
	} else {
			let notDone = taskListArray.filter(item => item.isChecked === false);
			console.log(notDone);
			let done = taskListArray.filter(item => item.isChecked === true);
			quickSortRecursive(notDone, 0, notDone.length - 1);
			taskListArray = [...notDone, ...done];
			
			console.log(done);
			console.log(taskListArray);
			localStorage.setItem('tasks', JSON.stringify(taskListArray));
			renderList();
	}
}

// first part of quick sort
const partition = (array, start, end) => {
	const pivotValue = array[end];
	let pivotIndex = start; 
	for (let i = start; i < end; i++) {
			if (array[i].dateTime < pivotValue.dateTime) {
			[array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
			pivotIndex++;
			}
	}
	[array[pivotIndex], array[end]] = [array[end], array[pivotIndex]] 
	return pivotIndex;
};

// quick sort recursive func
const quickSortRecursive = (arr, start, end) => {
	if (start >= end) {
			return;
	}
	let index = partition(arr, start, end);

	quickSortRecursive(arr, start, index - 1);
	quickSortRecursive(arr, index + 1, end);
}

// these three values are used multiple times,
// so I combined them into one object so that I can use it everywhere 
const elemsOfListItem = (index) => {

	return {
		 elem : taskListArray.find((item, idx) => idx === index),
		 editTask : document.getElementById(`${index}`).querySelector('.edit-task'),
		 task : document.getElementById(`text-${index}`)
		}
	}

// click on the pencil
const editThisTask = (index) => {
	const {elem, editTask, task} = elemsOfListItem(index);
	if (!elem.isChecked){
		editTask.src = 'tick.svg';
		editTask.nextSibling.src = 'arrows-circle.svg'

		task.disabled = false;
		task.focus();

		task.addEventListener('keydown', (event) => {
			if(event.key === 'Enter') saveChangesInInput(index);
		})
		editTask.onclick = () => saveChangesInInput(index);
		editTask.nextSibling.onclick = () => previousInputValue(index);
	}
}

// save changes on edited input
const saveChangesInInput = (index) => {
	const {elem, editTask, task} = elemsOfListItem(index);

	if (!isEmpty(task.value)) {
		if (confirm('There is no value in the input field. Are you sure?')) {
			taskListArray.splice(index, 1);
			renderList();
		} else {
			task.focus();
		}
		return;
	}
		elem.taskText = isEmpty(task.value);
		task.disabled = true;

		editTask.src = 'edit.svg';
		editTask.nextSibling.src = 'close.svg';
		taskInput.focus();
		localStorage.setItem('tasks', JSON.stringify(taskListArray));
		renderList()
	
}

// return the previous value
const previousInputValue = (index) => {
	const {elem, editTask, task} = elemsOfListItem(index);

	task.value = elem.taskText;
	task.disabled = true;

	editTask.src = 'edit.svg';
	editTask.nextSibling.src = 'close.svg';
	taskInput.focus();
	localStorage.setItem('tasks', JSON.stringify(taskListArray));
	renderList()
}



// delete list element
const deleteThisTask = (index) => {
	taskListArray.splice(index, 1);
	localStorage.setItem('tasks', JSON.stringify(taskListArray));
	renderList();
}

// rendering tasks list
const renderList = () => {
	const list = document.getElementById('task-list');
	while (list.firstChild) list.removeChild(list.firstChild);

	taskListArray.map((item, index) => {

		const itemCheckbox = document.createElement('input');
		itemCheckbox.type = 'checkbox';
		itemCheckbox.checked = item.isChecked;
		itemCheckbox.onclick = () => clickOnCheckbox(index);
		
		const itemInput = document.createElement('input');
		itemInput.type = 'text';
		itemInput.id =`text-${index}`;
		itemInput.value = item.taskText;
		itemInput.disabled = true;

		const editTask = document.createElement('img');
		editTask.src = 'edit.svg';
		editTask.className = 'edit-task';
		editTask.onclick = () => editThisTask(index);

		const deleteTask = document.createElement('img');
		deleteTask.src = 'close.svg';
		deleteTask.className = 'delete-task';
		deleteTask.onclick = () => deleteThisTask(index);

		const listItem = document.createElement('li');
		listItem.append(itemCheckbox, itemInput, editTask, deleteTask);
		listItem.className = itemCheckbox.checked ? 'done' : '';
		listItem.id = `${index}`;

		list.append(listItem);
	});
}








