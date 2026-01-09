const BASE_URL = "http://localhost:5000";

function getAuthHeader() {
  return {
    "Authorization": "Bearer " + localStorage.getItem("token"),
    "Content-Type": "application/json"
  };
}

// Data for different departments
const departmentData = {
    "CSE": {
        percentage: "65%",
        status: "Status: Average Performance",
        students: [
            { name: "Chandler Bing", id: "std101", status: "Present" },
            { name: "Joey Tribbiani", id: "std102", status: "Present" }
        ]
    },
    "ECE": {
        percentage: "82%",
        status: "Status: High Performance",
        students: [
            { name: "Ross Geller", id: "std201", status: "Present" },
            { name: "Rachel Green", id: "std202", status: "Absent" }
        ]
    },
    "MECH": {
        percentage: "45%",
        status: "Status: Low Attendance Alert",
        students: [
            { name: "Monica Geller", id: "std301", status: "Absent" },
            { name: "Phoebe Buffay", id: "std302", status: "Present" }
        ]
    }
};

function updateDepartmentView() {
    const selectedDept = document.getElementById('deptSelect').value;
    const data = departmentData[selectedDept];

    // Update Header and Percentage
    document.getElementById('deptTitle').innerText = selectedDept + " Department";
    document.getElementById('listTitle').innerText = selectedDept;
    document.getElementById('deptPercentage').innerText = data.percentage;
    document.getElementById('deptStatus').innerText = data.status;

    // Update Table
    const tableBody = document.getElementById('studentTableBody');
    tableBody.innerHTML = ""; // Clear current list

    data.students.forEach(student => {
        const row = `
            <tr>
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td><span class="status-badge ${student.status.toLowerCase()}">${student.status}</span></td>
                <td><button class="btn-sm" onclick="toggleAttendance(this)">Toggle</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Attendance toggle logic
function toggleAttendance(button) {
    const row = button.closest('tr');
    const statusSpan = row.querySelector('.status-badge');
    
    if (statusSpan.innerText === "Present") {
        statusSpan.innerText = "Absent";
        statusSpan.className = "status-badge absent";
    } else {
        statusSpan.innerText = "Present";
        statusSpan.className = "status-badge present";
    }
}

// Login logic
function handleLogin() {
    const userId = document.getElementById('userId').value.toLowerCase();
    if (userId.startsWith('prof')) {
        window.location.href = "professor_home.html";
    } else if (userId.startsWith('std')) {
        window.location.href = "student_home.html";
    } else {
        alert("Invalid ID. Use 'std' or 'prof' prefix.");
    }
}
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${BASE_URL}`/api/auth/login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);

    if (data.user.role === "teacher") {
      window.location.href = "professor_home.html";
    } else {
      window.location.href = "student_home.html";
    }
  } else {
    alert(data.message || "Login failed");
  }
}

//add material(teachers only)
async function addMaterial() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const subject = document.getElementById("subject").value;

  try {
    const res = await fetch(`${BASE_URL}`/api/materials, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify({ title, description, subject })
    });

    const data = await res.json();
    alert(data.message);
  } catch (err) {
    console.error(err);
  }
}

//get materials(students and teachers)
async function loadMaterials() {
  try {
    const res = await fetch(`${BASE_URL}`/api/materials, {
      headers: getAuthHeader()
    });

    const data = await res.json();
    const container = document.getElementById("materialsList");
    container.innerHTML = "";

    data.materials.forEach(m => {
      container.innerHTML += `
        <div style="border:1px solid #ccc; padding:10px; margin:10px">
          <h3>${m.title}</h3>
          <p>${m.description}</p>
          <small>${m.subject}</small>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
  }
}


//assign tasks
async function addTask() {
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDesc").value;

  const res = await fetch(`${BASE_URL}`/api/tasks, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({ title, description })
  });

  const data = await res.json();
  alert(data.message);
}

//update tasks
async function updateTaskStatus(taskId, status) {
  const res = await fetch(`${BASE_URL}`/api/tasks/`${taskId}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify({ status })
  });

  const data = await res.json();
  alert(data.message);
}

//mark attendance
async function markAttendance(studentId, percentage) {
  const res = await fetch(`${BASE_URL}`/api/attendance, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({ studentId, percentage })
  });

  const data = await res.json();
  alert(data.message);
}

//view attendance
async function getMyAttendance() {
  const res = await fetch(`${BASE_URL}`/api/attendance/my, {
    headers: getAuthHeader()
  });

  const data = await res.json();
  console.log("Attendance:", data);
}

async function addTask() {
  const title = document.getElementById("taskTitle").value;
  const subject = document.getElementById("taskSubject").value;

  try {
    const res = await fetch(`${BASE_URL}`/api/tasks, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify({ title, subject })
    });

    const data = await res.json();
    alert(data.message);

  } catch (err) {
    console.error(err);
  }
}

async function loadTasks() {
  try {
    const res = await fetch(`${BASE_URL}`/api/tasks, {
      headers: getAuthHeader()
    });

    const tasks = await res.json();
    const container = document.getElementById("taskList");
    container.innerHTML = "";

    tasks.forEach(task => {
      container.innerHTML += `
        <div style="border:1px solid #aaa; padding:10px; margin:10px">
          <h4>${task.title}</h4>
          <p>Status: ${task.status}</p>
          <button onclick="submitTask('${task._id}')">Submit Task</button>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
  }
}

async function updateTaskStatus(taskId, status) {
  try {
    const res = await fetch(`${BASE_URL}`/api/tasks/`${taskId}`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify({ status })
    });

    const data = await res.json();
    alert(data.message);

    // reload tasks
    loadTasks();

  } catch (err) {
    console.error(err);
  }
}

async function markAttendanceUI() {
  const studentId = document.getElementById("studentId").value;
  const percentage = document.getElementById("percentage").value;

  try {
    const res = await fetch(`${BASE_URL}`/api/attendance, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify({
        studentId,
        percentage: Number(percentage)
      })
    });

    const data = await res.json();
    alert(data.message);

  } catch (err) {
    console.error(err);
    alert("Error marking attendance");
  }
}

async function loadAttendance() {
  try {
    const res = await fetch(`${BASE_URL}`/api/attendance, {
      headers: getAuthHeader()
    });

    const data = await res.json();
    const box = document.getElementById("attendanceBox");

    if (!data.record) {
      box.innerHTML = "<p>No attendance record found</p>";
      return;
    }

    box.innerHTML = `
      <h3>Attendance: ${data.record.percentage}%</h3>
    `;

  } catch (err) {
    console.error(err);
  }
}

async function submitTask(taskId) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please login again.");
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/tasks/${taskId}/submit`,
      {
        method: "POST",
        headers: {
          "Authorization": Bearer `${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Error submitting task");
      return;
    }

    alert("Task submitted successfully ✅");
  } catch (error) {
    console.error("Submit Task Error:", error);
    alert("Error submitting task");
  }
}

async function submitTask(taskId) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please login again.");
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/tasks/${taskId}/submit`,
      {
        method: "POST",
        headers: {
          "Authorization": Bearer `${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Error submitting task");
      return;
    }

    alert("Task submitted successfully ✅");
  } catch (error) {
    console.error("Submit Task Error:", error);
    alert("Error submitting task");
  }
}