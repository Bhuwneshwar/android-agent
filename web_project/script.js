document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    // Function to add a new task
    addTaskBtn.addEventListener("click", function() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <span>${taskText}</span>
                <button class="complete-btn">Complete</button>
                <button class="delete-btn">Delete</button>
            `;
            taskList.appendChild(listItem);
            taskInput.value = ""; // Clear the input field

            // Add event listener for complete button
            listItem.querySelector(".complete-btn").addEventListener("click", function() {
                listItem.classList.toggle("completed");
            });

            // Add event listener for delete button
            listItem.querySelector(".delete-btn").addEventListener("click", function() {
                taskList.removeChild(listItem);
            });
        }
    });

    // Allow adding tasks with Enter key
    taskInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            addTaskBtn.click();
        }
    });
});
