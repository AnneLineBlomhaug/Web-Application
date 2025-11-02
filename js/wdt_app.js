// Path: Web%20Application/js/wdt_app.js

class StaffMember {
    constructor(name, surname, email, picture) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.picture = picture;
        this.status = "In";
        this.out_time = "__:__:__";
        this.duration = "__:__:__";
        this.expected_return_time = "__:__:__";
        this.staffMemberIslate = false;
    }

    set_status(status) {
        this.status = status;
    }

    set_out_time(out_time) {
        this.out_time = out_time;
    }

    set_duration(duration) {
        this.duration = duration;
    }

    set_expected_return_time(expected_return_time) {
        this.expected_return_time = expected_return_time;
    }

    set_staffMemberIslate(staffMemberIslate) {
        this.staffMemberIslate = staffMemberIslate;
    }
}

class DeliveryDriver {
    constructor(vehicle, name, surname, telephone, delivery_address, return_time) {
        this.vehicle = vehicle;
        this.name = name;
        this.surname = surname;
        this.telephone = telephone;
        this.delivery_address = delivery_address;
        this.return_time = return_time;
        this.deliveryDriverIslate = false;
    }
    
    set_deliveryDriverIslate(deliveryDriverIslate) {
        this.deliveryDriverIslate = deliveryDriverIslate;
    }
}

// store all the staff members and delivery drivers in an array
const staffMembersArray = [];
const deliveryDriversArray = [];

function staffUserGet(callback) {
    const staff = [];
    $.ajax({
        url: "https://randomuser.me/api/?inc=picture,name,email,id&results=5",
        dataType: "json",
        success: function (data) {
            for (let i = 0; i < data.results.length; i++) {
                const staffmember = {
                    'name': data.results[i].name.first + " " + data.results[i].name.last,
                    'surname': data.results[i].name.last,
                    'email': data.results[i].email,
                    'picture': data.results[i].picture.thumbnail,
                    'id': data.results[i].id,
                }
                staff.push(staffmember);
            }
            callback(staff); // Call the callback function with the staff data
        }
    })
}

function validateDelivery(vehicle, name, surname, telephone, address, return_time) {
    if (vehicle === "" || name === "" || surname === "" || telephone === "" || address === "" || return_time === "") {
        return false;
    } else {
        // check if the return time is in the correct format
        if (!return_time.includes(":")) {
            alert("Please enter the return time in the correct format");
            return false;
        } else {
            // check if the return time is valid
            let time = return_time.split(":");
            if (time.length !== 2) {
                alert("Please enter the return time in the correct format");
                return false;
            } else {
                // check if the time is valid
                let hours = parseInt(time[0]);
                let minutes = parseInt(time[1]);
                if (hours > 23 || minutes > 59) {
                    alert("Please enter a valid return time");
                    return false;
                }
            }
        }

        // check if the telephone number is valid
        if (isNaN(telephone)) {
            alert("Please enter a valid telephone number");
            return false;
        } else {
            if (telephone.length !== 10) {
                alert("Telephone number must be 10 digits long");
                return false;
            }
        }
    }

    return true;
    
}
function addDelivery() {
    // get the input values
    let vehicle = document.getElementById("vehicle").value;
    let name = document.getElementById("name").value;
    let surname = document.getElementById("surname").value;
    let telephone = document.getElementById("telephone").value;
    let address = document.getElementById("address").value;
    let return_time = document.getElementById("return_time").value;

    // check that the input fields are valid using validateDelivery function
    if (!validateDelivery(vehicle, name, surname, telephone, address, return_time)) {
        alert("Please fill in all the fields");
    } else {
        // create a new delivery driver object
        let delivery_driver = new DeliveryDriver(vehicle, name, surname, telephone, address, return_time);
        deliveryDriversArray.push(delivery_driver.name);

        // clear the input fields
        document.getElementById("vehicle").value = "";
        document.getElementById("name").value = "";
        document.getElementById("surname").value = "";
        document.getElementById("telephone").value = "";
        document.getElementById("address").value = "";
        document.getElementById("return_time").value = "";

        return delivery_driver;
    }
}


function populateStafftable(staffMembers) {
    let table = document.getElementById("staff_table");
    table.setAttribute("class", "table table-bordered table-striped");
    
    let table_body = table.getElementsByTagName("tbody")[0];

    // Clear existing table rows
    table_body.innerHTML = "";

    // Create table header
    let table_head = table.createTHead();
    let table_head_row = table_head.insertRow();
    let table_head_row_cells = ["Picture", "Name", "Surname", "Email", "Status", "Out Time", "Duration", "Expected Return Time"];

    table_head_row.setAttribute("class", "thead-dark");

    for (let cellText of table_head_row_cells) {
        let th = document.createElement("th");
        th.innerHTML = cellText;
        th.setAttribute("scope", "col");
        table_head_row.appendChild(th);
    }

    // Populate table body
    for (let i = 0; i < staffMembers.length; i++) {
        let row = table_body.insertRow(i);
        row.setAttribute("class", "clickable-row");

        for (let j = 0; j < table_head_row_cells.length; j++) {
            let cell = row.insertCell(j);
            let staffMember = new StaffMember(staffMembers[i].name, staffMembers[i].surname, staffMembers[i].email, staffMembers[i].picture);

            if (j === 0) {
                cell.innerHTML = `<img src='${staffMember.picture}' alt='Staff Member Picture' class='staff_member_picture'>`;
            } else {
                let key = table_head_row_cells[j].toLowerCase().replace(/\s/g, '_');
                cell.innerHTML = staffMember[key];
            }
        }

        row.addEventListener("click", function () {
            let rows = document.querySelectorAll(".clickable-row");
            rows.forEach(row => row.classList.remove("selected-row"));
            row.classList.add("selected-row");

            // widen the row and add border shadow
            row.style.width = "100%";
            row.style.boxShadow = "0px 0px 5px 0px #000000";
            row.style.borderRadius = "5px";
            row.style.backgroundColor = "#e9ecef";
            row.style.cursor = "pointer";

        });
    }
}


function populateDeliveryDriver(deliveryDriver) {
    let table = document.getElementById("delivery_table");
    let table_body = table.getElementsByTagName("tbody")[0];

    // Populate table body
    let row = table_body.insertRow(0);
    row.setAttribute("class", "clickable-row");

    row.insertCell(0).innerHTML = deliveryDriver.vehicle;
    row.insertCell(1).innerHTML = deliveryDriver.name;
    row.insertCell(2).innerHTML = deliveryDriver.surname;
    row.insertCell(3).innerHTML = deliveryDriver.telephone;
    row.insertCell(4).innerHTML = deliveryDriver.delivery_address;
    row.insertCell(5).innerHTML = deliveryDriver.return_time;

    row.addEventListener("click", function () {
        let rows = document.querySelectorAll(".clickable-row");
        rows.forEach(row => row.classList.remove("selected-row"));
        row.classList.add("selected-row");

        // Check if buttons are already present and append only if not
        if (!row.nextElementSibling || row.nextElementSibling.className !== "row-buttons-input") {
            // if any other row has the buttons, remove them
            let buttons = document.querySelector(".row-buttons-input");
            if (buttons) {
                buttons.remove();
            }
        }
    });
}

function removeDelivery() {
    let selectedRow = document.querySelector(".selected-row");

    // prompt the user to confirm the removal of the delivery driver
    let confirmation = confirm("Are you sure you want to remove this delivery driver?");
    if (!confirmation) {
        return;
    }

    // remove the row from the table
    selectedRow.remove();

    // remove the delivery driver from the array
    let name = selectedRow.cells[1].innerHTML;
    let surname = selectedRow.cells[2].innerHTML;
    let delivery_driver = name + " " + surname;
    let index = deliveryDriversArray.indexOf(delivery_driver);
    deliveryDriversArray.splice(index, 1);
}

// fill the tables with data on page load
window.addEventListener("load", function () {
    staffUserGet(populateStafftable);
});


// handle clocking staff members in and out
function staffIn() {
    // get the selected row
    let selectedRow = document.querySelector(".selected-row");
    let staffMember = new StaffMember(selectedRow.cells[3].innerHTML, selectedRow.cells[0].innerHTML, selectedRow.cells[2].innerHTML);

    // get the current time
    let in_time = new Date();

    // get the expected return time
    let expected_return_time = selectedRow.cells[7].innerHTML.split(":");
    let hours = parseInt(expected_return_time[0]);
    let minutes = parseInt(expected_return_time[1]);
    let return_time = new Date();
    return_time.setHours(hours);
    return_time.setMinutes(minutes);

    // check if the staff member is late
    if (in_time > return_time) {
        staffMember.set_staffMemberIslate(true);
    }

    // set the attributes
    staffMember.set_status("In");
    staffMember.set_out_time("__:__:__");
    staffMember.set_duration("__:__:__");
    staffMember.set_expected_return_time("__:__:__");

    // update the table
    selectedRow.cells[4].innerHTML = staffMember.status;
    selectedRow.cells[5].innerHTML = staffMember.out_time;
    selectedRow.cells[6].innerHTML = staffMember.duration;
    selectedRow.cells[7].innerHTML = staffMember.expected_return_time;

}

function staffOut() {
    let selectedRow = document.querySelector(".selected-row");

    if (!selectedRow) {
        alert("Please select a staff member");
        return;
    }
    // prompt the user to input length of absense in minutes
    let absense = prompt("Please enter the length of absense in minutes");
    let staffMember = new StaffMember(selectedRow.cells[3].innerHTML, selectedRow.cells[0].innerHTML, selectedRow.cells[2].innerHTML);
    staffMembersArray.push(staffMember);

    if (absense === null) {
        return;
    } else {
        // check if the absense is valid
        if (absense < 0) {
            alert("Please enter a valid length of absense");
            return;
        } else {
            // convert the absense to hours and minutes
            let hours = Math.floor(absense / 60);
            let minutes = absense % 60;
            
            // set the out time to the current time
            let out_time = new Date();
            staffMember.set_out_time(String(out_time.getHours()).padStart(2, 0) + ":" + String(out_time.getMinutes()).padStart(2, 0) + ":" + String(out_time.getSeconds()).padStart(2, 0));

            // set the duration
            staffMember.set_duration(hours + " hr " + minutes + " min");

            // calculate the expected return time
            let return_time = new Date();
            return_time.setHours(out_time.getHours() + hours);
            return_time.setMinutes(out_time.getMinutes() + minutes);
            staffMember.set_expected_return_time(return_time.getHours() + ":" + return_time.getMinutes());

            // set the status to out
            staffMember.set_status("Out");
        }
    }

    // update the table
    selectedRow.cells[4].innerHTML = staffMember.status;
    selectedRow.cells[5].innerHTML = staffMember.out_time;
    selectedRow.cells[6].innerHTML = staffMember.duration;
    selectedRow.cells[7].innerHTML = staffMember.expected_return_time;
}


// get the add button and add an event listener
let addButton = document.getElementById("add_button");
addButton.addEventListener("click", function () {
    let deliveryDriver = addDelivery();
    populateDeliveryDriver(deliveryDriver);
});

// toast notification for late staff
function toastNotification(lateMember) {
    let toastContainer = document.getElementById("toast-container");
    let toast = document.createElement("div");
    toast.setAttribute("class", "toast");
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    let toastHeader = document.createElement("div");
    toastHeader.setAttribute("class", "toast-header");

    let toastTitle = document.createElement("strong");
    toastTitle.setAttribute("class", "mr-auto");
    toastTitle.innerHTML = "Late Staff Member";

    let toastButton = document.createElement("button");
    toastButton.setAttribute("type", "button");
    toastButton.setAttribute("class", "ml-2 mb-1 close");
    toastButton.setAttribute("data-dismiss", "toast");
    toastButton.setAttribute("aria-label", "Close");

    let toastButtonIcon = document.createElement("span");
    toastButtonIcon.setAttribute("aria-hidden", "true");
    toastButtonIcon.innerHTML = "&times;";

    let toastBody = document.createElement("div");
    toastBody.setAttribute("class", "toast-body");
    if (lateMember instanceof StaffMember) {
        let toastImage = document.createElement("img");
        toastImage.setAttribute("src", lateMember.picture);
        toastBody.appendChild(toastImage);
    }
    
    toastBody.innerHTML += "<br>";
    toastBody.innerHTML += lateMember.name + " " + " is late";
    
    toastButton.appendChild(toastButtonIcon);
    toastHeader.appendChild(toastTitle);
    toastHeader.appendChild(toastButton);
    toast.appendChild(toastHeader);
    toast.appendChild(toastBody);
    toastContainer.appendChild(toast);
    
    // show the toast
    $(".toast").toast("show");

}

function digitalClock() {
    const clockElement = document.getElementById("clock_time");
    setInterval(() => {
        let date = new Date();
        let time = date.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
        clockElement.innerHTML = time;
        
    }, 1000);
}

window.addEventListener("load", digitalClock);

// check for late staff members and delivery drivers every minute
let lateStaff = []
let lateDeliveryDrivers = []
setInterval(() => {
    // check if any staff member is late
    let staffTable = document.getElementById("staff_table");
    let staffTableBody = staffTable.getElementsByTagName("tbody")[0];
    let staffRows = staffTableBody.getElementsByTagName("tr");
    staffRows = Array.from(staffRows);

    staffRows.forEach(row => {
        let status = row.cells[4].innerHTML;
        if (status === "Out") {
            return;
        }

        // create a staff member object
        let staffMember = new StaffMember(row.cells[1].innerHTML, row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[0].innerHTML);
        
        // get the expected return time
        if (row.cells[7].innerHTML === "__:__:__") {
            return;
        } else {
            let expected_return_time = row.cells[7].innerHTML.split(":");
            let hours = parseInt(expected_return_time[0]);
            let minutes = parseInt(expected_return_time[1]);
            let return_time = new Date();
            return_time.setHours(hours);
            return_time.setMinutes(minutes);
        }
        
        let date = new Date();
        if (date > return_time) {
            staffMember.set_staffMemberIslate(true);
            
            // check if the toast is already displayed
            if (lateStaff.includes(staffMember.email)) {
                return;
            } else {
                lateStaff.push(staffMember.email);
                toastNotification(staffMember);
            }
        }
    });

    // check if any delivery driver is late
    let deliveryTable = document.getElementById("delivery_table");
    let deliveryTableBody = deliveryTable.getElementsByTagName("tbody")[0];
    let deliveryRows = deliveryTableBody.getElementsByTagName("tr");
    deliveryRows = Array.from(deliveryRows);
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let currentTime = hours + ":" + minutes;

    deliveryRows.forEach(row => {
        if (currentTime > row.cells[5].innerHTML) {
            // create a delivery driver object
            let deliveryDriver = new DeliveryDriver(row.cells[0].innerHTML, row.cells[1].innerHTML, row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML);
            deliveryDriver.set_deliveryDriverIslate(true);

            // check if the toast is already displayed
            if (lateDeliveryDrivers.includes(deliveryDriver.name)) {
                return;
            } else {
                lateDeliveryDrivers.push(deliveryDriver.name);
                toastNotification(deliveryDriver);
            }
            
        }
    });

}, 60000);