
const loadButton = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusMessage = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

let users = [];
let usersLoaded = false;

async function loadUsers() {
    loadButton.disabled = true;
    statusMessage.textContent = "Loading users...";
    usersList.replaceChildren();

    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        users = await response.json();
        usersLoaded = true;

        renderUsers(getFilteredUsers());
        statusMessage.textContent = `Successfully loaded ${users.length} users.`;
    } catch (error) {
        users = [];
        usersLoaded = false;
        usersList.replaceChildren();
        statusMessage.textContent =
            "Unable to load users. Please try again.";
        console.error("Error loading users:", error);
    } finally {
        loadButton.disabled = false;
    }
}

function renderUsers(list) {
    usersList.replaceChildren();

    if (list.length === 0) {
        const message = document.createElement("li");
        message.textContent = "No users match your filter.";
        usersList.appendChild(message);
        return;
    }

    list.forEach(user => {
        const listItem = document.createElement("li");

        const name = document.createElement("h2");
        name.textContent = user.name;

        const email = document.createElement("p");
        email.textContent = `Email: ${user.email}`;

        const city = document.createElement("p");
        city.textContent = `City: ${user.address.city}`;

        const company = document.createElement("p");
        company.textContent = `Company: ${user.company.name}`;

        listItem.append(name, email, city, company);
        usersList.appendChild(listItem);
    });
}

function getFilteredUsers() {
    const searchTerm = filterInput.value.trim().toLowerCase();

    return users.filter(user =>
        user.name.toLowerCase().includes(searchTerm)
    );
}

loadButton.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {
    if (usersLoaded) {
        renderUsers(getFilteredUsers());
    }
});
