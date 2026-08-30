// ========================================
// STUDYFLOW
// Student Productivity Dashboard
// ========================================


// ========================================
// STORAGE
// ========================================

const savedTasks =
    JSON.parse(localStorage.getItem("studyflowTasks"));

let tasks = savedTasks || [];

let sessions =
    JSON.parse(localStorage.getItem("studyflowSessions")) || [];

let settings =
    JSON.parse(localStorage.getItem("studyflowSettings")) || {
        name: "Student",
        goal: 4,
        dark: false
    };


// ========================================
// SAVE DATA
// ========================================

function saveData() {

    localStorage.setItem(
        "studyflowTasks",
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        "studyflowSessions",
        JSON.stringify(sessions)
    );

    localStorage.setItem(
        "studyflowSettings",
        JSON.stringify(settings)
    );
}


// ========================================
// DOM ELEMENTS
// ========================================

const pages =
    document.querySelectorAll(".page");

const navItems =
    document.querySelectorAll(".nav-item");

const dashboardTasks =
    document.getElementById("dashboardTasks");

const allTasks =
    document.getElementById("allTasks");

const taskModal =
    document.getElementById("taskModal");

const taskForm =
    document.getElementById("taskForm");

const taskInput =
    document.getElementById("taskInput");

const priorityInput =
    document.getElementById("priorityInput");


// ========================================
// TOAST NOTIFICATION
// ========================================

function showToast(message, type = "success") {

    let toast =
        document.getElementById("toast");

    if (!toast) {

        toast =
            document.createElement("div");

        toast.id = "toast";

        document.body.appendChild(toast);

        const style =
            document.createElement("style");

        style.textContent = `
            #toast {
                position: fixed;
                right: 25px;
                bottom: 25px;
                z-index: 9999;
                padding: 13px 17px;
                border-radius: 12px;
                background: var(--card);
                color: var(--text);
                border: 1px solid var(--border);
                box-shadow: 0 15px 35px rgba(0,0,0,.12);
                font-size: 13px;
                font-weight: 600;
                opacity: 0;
                transform: translateY(15px);
                pointer-events: none;
                transition: .3s ease;
            }

            #toast.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;

        document.head.appendChild(style);
    }

    toast.textContent = message;

    toast.className = "show";

    clearTimeout(window.toastTimer);

    window.toastTimer =
        setTimeout(() => {
            toast.className = "";
        }, 2500);
}


// ========================================
// DATE
// ========================================

function updateDate() {

    const now = new Date();

    const dateElement =
        document.getElementById("currentDate");

    if (!dateElement) return;

    dateElement.textContent =
        now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });
}


// ========================================
// GREETING
// ========================================

function updateGreeting() {

    const hour =
        new Date().getHours();

    let greeting =
        "Good morning";

    if (hour >= 12 && hour < 18) {
        greeting = "Good afternoon";
    }

    if (hour >= 18) {
        greeting = "Good evening";
    }

    const title =
        document.getElementById("pageTitle");

    const avatar =
        document.getElementById("avatar");

    if (title) {

        title.textContent =
            `${greeting}, ${settings.name} 👋`;
    }

    if (avatar) {

        avatar.textContent =
            settings.name
                .charAt(0)
                .toUpperCase();
    }
}


// ========================================
// NAVIGATION
// ========================================

navItems.forEach(item => {

    item.addEventListener("click", () => {

        const pageId =
            item.dataset.page;

        if (!pageId) return;

        navItems.forEach(nav =>
            nav.classList.remove("active")
        );

        item.classList.add("active");

        pages.forEach(page =>
            page.classList.remove("active-page")
        );

        const selectedPage =
            document.getElementById(pageId);

        if (selectedPage) {

            selectedPage.classList.add(
                "active-page"
            );
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});


// ========================================
// TASK MODAL
// ========================================

function openTaskModal() {

    taskModal.classList.add("show");

    taskInput.value = "";

    priorityInput.value = "Medium";

    taskInput.focus();
}


function closeTaskModal() {

    taskModal.classList.remove("show");

    taskForm.reset();
}


document
    .getElementById("addTaskBtn")
    .addEventListener(
        "click",
        openTaskModal
    );


document
    .getElementById("addTaskBtn2")
    .addEventListener(
        "click",
        openTaskModal
    );


document
    .getElementById("closeModal")
    .addEventListener(
        "click",
        closeTaskModal
    );


taskModal.addEventListener("click", event => {

    if (event.target === taskModal) {

        closeTaskModal();
    }

});


document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeTaskModal();
    }

});


// ========================================
// ADD TASK
// ========================================

taskForm.addEventListener("submit", event => {

    event.preventDefault();

    const title =
        taskInput.value.trim();

    if (!title) return;

    const newTask = {

        id: Date.now(),

        title,

        priority:
            priorityInput.value,

        completed: false,

        createdAt:
            new Date().toISOString()

    };

    tasks.push(newTask);

    saveData();

    renderTasks();

    closeTaskModal();

    showToast("✓ Task added successfully");

});


// ========================================
// TASK HTML
// ========================================

function createTaskHTML(task) {

    return `
        <div class="task">

            <input
                class="task-checkbox"
                type="checkbox"
                data-id="${task.id}"
                ${task.completed ? "checked" : ""}
            >

            <div class="task-content">

                <div class="task-title ${
                    task.completed
                        ? "completed"
                        : ""
                }">
                    ${escapeHTML(task.title)}
                </div>

                <span class="priority ${
                    task.priority.toLowerCase()
                }">
                    ${escapeHTML(task.priority)}
                </span>

            </div>

            <button
                class="delete-btn edit-btn"
                data-edit="${task.id}"
                title="Edit task"
            >
                ✏️
            </button>

            <button
                class="delete-btn"
                data-delete="${task.id}"
                title="Delete task"
            >
                🗑️
            </button>

        </div>
    `;
}


// ========================================
// RENDER TASKS
// ========================================

let currentFilter = "all";


function renderTasks(
    filter = currentFilter
) {

    currentFilter = filter;

    let filteredTasks =
        tasks;


    if (filter === "active") {

        filteredTasks =
            tasks.filter(
                task => !task.completed
            );
    }


    if (filter === "completed") {

        filteredTasks =
            tasks.filter(
                task => task.completed
            );
    }


    if (filteredTasks.length === 0) {

        allTasks.innerHTML =
            emptyTasks();

    } else {

        allTasks.innerHTML =
            filteredTasks
                .map(createTaskHTML)
                .join("");
    }


    if (tasks.length === 0) {

        dashboardTasks.innerHTML =
            emptyTasks();

    } else {

        dashboardTasks.innerHTML =
            tasks
                .slice(-5)
                .reverse()
                .map(createTaskHTML)
                .join("");
    }


    updateDashboard();
}


// ========================================
// EMPTY STATE
// ========================================

function emptyTasks() {

    return `
        <div style="
            text-align:center;
            padding:40px 10px;
            color:var(--muted);
            font-size:13px;
        ">
            <div style="
                font-size:30px;
                margin-bottom:10px;
            ">
                🚀
            </div>

            <strong>No tasks yet</strong>

            <div style="
                margin-top:5px;
            ">
                Add a task and start being productive.
            </div>
        </div>
    `;
}


// ========================================
// TASK ACTIONS
// ========================================

document.addEventListener("change", event => {

    if (
        !event.target.classList
            .contains("task-checkbox")
    ) {
        return;
    }


    const id =
        Number(event.target.dataset.id);


    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) return;


    task.completed =
        event.target.checked;


    saveData();

    renderTasks();

    if (task.completed) {

        showToast(
            "🎉 Task completed!"
        );

    } else {

        showToast(
            "Task moved back to active"
        );
    }

});


// ========================================
// EDIT + DELETE
// ========================================

document.addEventListener("click", event => {

    // EDIT

    const editButton =
        event.target.closest(
            "[data-edit]"
        );


    if (editButton) {

        const id =
            Number(
                editButton.dataset.edit
            );


        const task =
            tasks.find(
                task => task.id === id
            );


        if (!task) return;


        const newTitle =
            prompt(
                "Edit task:",
                task.title
            );


        if (
            newTitle === null ||
            !newTitle.trim()
        ) {
            return;
        }


        task.title =
            newTitle.trim();


        saveData();

        renderTasks();

        showToast(
            "✓ Task updated"
        );

        return;
    }


    // DELETE

    const deleteButton =
        event.target.closest(
            "[data-delete]"
        );


    if (!deleteButton) return;


    const id =
        Number(
            deleteButton.dataset.delete
        );


    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) return;


    const confirmed =
        confirm(
            `Delete "${task.title}"?`
        );


    if (!confirmed) return;


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveData();

    renderTasks();

    showToast(
        "Task deleted"
    );

});


// ========================================
// FILTERS
// ========================================

document
    .querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".filter"
                    )
                    .forEach(btn =>
                        btn.classList
                            .remove("active")
                    );


                button.classList.add(
                    "active"
                );


                renderTasks(
                    button.dataset.filter
                );

            }
        );

    });


// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const taskPercentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    const todayMinutes =
        getTodayStudyMinutes();


    const goalMinutes =
        settings.goal * 60;


    const studyPercentage =
        goalMinutes === 0
            ? 0
            : Math.min(
                Math.round(
                    (todayMinutes /
                        goalMinutes) *
                    100
                ),
                100
            );


    // PRODUCTIVITY SCORE

    const productivity =
        total === 0
            ? 0
            : Math.round(
                (taskPercentage * 0.6) +
                (studyPercentage * 0.4)
            );


    const scoreElement =
        document.getElementById(
            "productivityScore"
        );


    if (scoreElement) {

        scoreElement.textContent =
            `${productivity}%`;
    }


    const dailyGoal =
        document.getElementById(
            "dailyGoal"
        );


    if (dailyGoal) {

        dailyGoal.textContent =
            `${studyPercentage}%`;
    }


    const dailyGoalText =
        document.getElementById(
            "dailyGoalText"
        );


    if (dailyGoalText) {

        dailyGoalText.textContent =
            `${completed} / ${total} tasks`;
    }


    const productivityText =
        document.getElementById(
            "productivityText"
        );


    if (productivityText) {

        productivityText.textContent =
            total === 0
                ? "Complete your first task"
                : `${completed} of ${total} completed`;
    }


    const studyTime =
        document.getElementById(
            "studyTime"
        );


    if (studyTime) {

        studyTime.textContent =
            formatMinutes(
                todayMinutes
            );
    }


    updateStudyProgress(
        todayMinutes
    );

    updateStreak();

    updateAnalytics();

    updateStudySummary();

    updateChart();
}


// ========================================
// STUDY GOAL
// ========================================

function updateStudyProgress(
    minutes
) {

    const goalMinutes =
        settings.goal * 60;


    let percentage =
        goalMinutes === 0
            ? 0
            : Math.round(
                (minutes /
                    goalMinutes) *
                100
            );


    percentage =
        Math.min(
            percentage,
            100
        );


    const progress =
        document.getElementById(
            "studyProgress"
        );


    if (progress) {

        progress.style.width =
            `${percentage}%`;
    }


    const progressText =
        document.getElementById(
            "studyProgressText"
        );


    if (progressText) {

        progressText.textContent =
            `${formatMinutes(minutes)} studied`;
    }


    const goalText =
        document.getElementById(
            "studyGoalText"
        );


    if (goalText) {

        goalText.textContent =
            `${settings.goal}h goal`;
    }
}


// ========================================
// DATE HELPERS
// ========================================

function sameDay(
    date1,
    date2
) {

    return (
        date1.getFullYear() ===
        date2.getFullYear() &&

        date1.getMonth() ===
        date2.getMonth() &&

        date1.getDate() ===
        date2.getDate()
    );
}


function getTodayStudyMinutes() {

    const today =
        new Date();


    return sessions
        .filter(session =>
            sameDay(
                new Date(
                    session.date
                ),
                today
            )
        )
        .reduce(
            (total, session) =>
                total +
                Number(session.minutes),
            0
        );
}


// ========================================
// FORMAT TIME
// ========================================

function formatMinutes(
    minutes
) {

    minutes =
        Math.max(
            0,
            Math.round(minutes)
        );


    if (minutes < 60) {

        return `${minutes}m`;
    }


    const hours =
        Math.floor(
            minutes / 60
        );


    const remaining =
        minutes % 60;


    return remaining === 0
        ? `${hours}h`
        : `${hours}h ${remaining}m`;
}


// ========================================
// STREAK
// ========================================

function updateStreak() {

    const studyDays =
        new Set(
            sessions.map(
                session =>
                    new Date(
                        session.date
                    ).toDateString()
            )
        );


    let streak = 0;

    const today =
        new Date();


    for (
        let i = 0;
        i < 365;
        i++
    ) {

        const checkDate =
            new Date();


        checkDate.setDate(
            today.getDate() - i
        );


        if (
            studyDays.has(
                checkDate.toDateString()
            )
        ) {

            streak++;

        } else {

            break;
        }
    }


    const streakElement =
        document.getElementById(
            "streak"
        );


    if (streakElement) {

        streakElement.textContent =
            `${streak} day${
                streak !== 1
                    ? "s"
                    : ""
            }`;
    }


    const streakText =
        document.getElementById(
            "streakText"
        );


    if (streakText) {

        streakText.textContent =
            streak > 0
                ? "Keep it going!"
                : "Start your journey";
    }
}


// ========================================
// STUDY TIMER
// ========================================

let timerSeconds = 30 * 60;
let selectedMinutes = 30;
let timerInterval = null;
let timerRunning = false;


// ----------------------------------------
// TIMER OPTIONS
// ----------------------------------------

document
    .querySelectorAll(".timer-option")
    .forEach(button => {

        button.addEventListener("click", () => {

            if (timerRunning) {
                showToast("Pause the timer before changing duration.");
                return;
            }

            document
                .querySelectorAll(".timer-option")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

            selectedMinutes =
                Number(button.dataset.minutes);

            timerSeconds =
                selectedMinutes * 60;

            updateTimerDisplay();
        });

    });


// ----------------------------------------
// DISPLAY
// ----------------------------------------

function updateTimerDisplay() {

    const timer =
        document.getElementById("timer");

    if (!timer) return;

    const hours =
        Math.floor(timerSeconds / 3600);

    const minutes =
        Math.floor(
            (timerSeconds % 3600) / 60
        );

    const seconds =
        timerSeconds % 60;

    timer.textContent =
        `${String(hours).padStart(2, "0")}:` +
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;
}


// ----------------------------------------
// START / PAUSE
// ----------------------------------------

document
    .getElementById("startTimer")
    .addEventListener("click", () => {

        const timerCard =
            document.querySelector(".timer-card");

        const startButton =
            document.getElementById("startTimer");


        // ==============================
        // PAUSE
        // ==============================

        if (timerRunning) {

            clearInterval(timerInterval);

            timerRunning = false;

            timerCard?.classList.remove("timer-running");

            startButton.textContent = "▶ Resume";

            showToast("Timer paused");

            return;
        }


        // ==============================
        // START / RESUME
        // ==============================

        timerRunning = true;

        timerCard?.classList.add("timer-running");

        startButton.textContent = "⏸ Pause";


        timerInterval = setInterval(() => {

            timerSeconds--;

            updateTimerDisplay();


            // ==============================
            // TIMER COMPLETE
            // ==============================

            if (timerSeconds <= 0) {

                clearInterval(timerInterval);

                timerRunning = false;

                timerCard?.classList.remove("timer-running");


                // Save completed session
                saveStudySession(selectedMinutes);


                showToast(
                    `🎉 ${formatMinutes(selectedMinutes)} study session completed!`
                );


                // Reset timer
                timerSeconds =
                    selectedMinutes * 60;


                startButton.textContent =
                    "▶ Start";


                updateTimerDisplay();

            }

        }, 1000);

    });


// ----------------------------------------
// RESET
// ----------------------------------------

document
    .getElementById("resetTimer")
    .addEventListener("click", () => {

        clearInterval(timerInterval);

        timerRunning = false;

        document
            .querySelector(".timer-card")
            ?.classList.remove("timer-running");

        timerSeconds =
            selectedMinutes * 60;

        document
            .getElementById("startTimer")
            .textContent = "▶ Start";

        updateTimerDisplay();

        showToast("Timer reset");

    });
// ========================================
// SAVE STUDY SESSION
// ========================================

function saveStudySession(
    minutes
) {

    const subject =
        document.getElementById(
            "subjectSelect"
        ).value;


    sessions.push({

        id: Date.now(),

        date:
            new Date()
                .toISOString(),

        minutes:

            Number(minutes),

        subject
    });


    saveData();

    updateDashboard();

    renderSessions();
}


// ========================================
// STUDY SUMMARY
// ========================================

function updateStudySummary() {

    const todaySessions =
        sessions.filter(
            session =>
                sameDay(
                    new Date(
                        session.date
                    ),
                    new Date()
                )
        );


    const todayMinutes =
        todaySessions.reduce(
            (sum, session) =>
                sum +
                Number(session.minutes),
            0
        );


    const summary =
        document.getElementById(
            "studySummary"
        );


    if (summary) {

        summary.textContent =
            formatMinutes(
                todayMinutes
            );
    }


    const count =
        document.getElementById(
            "sessionCount"
        );


    if (count) {

        count.textContent =
            todaySessions.length;
    }


    renderSessions();
}


// ========================================
// RECENT SESSIONS
// ========================================

function renderSessions() {

    const container =
        document.getElementById(
            "recentSessions"
        );


    if (!container) return;


    const todaySessions =
        sessions
            .filter(
                session =>
                    sameDay(
                        new Date(
                            session.date
                        ),
                        new Date()
                    )
            )
            .slice(-5)
            .reverse();


    if (
        todaySessions.length === 0
    ) {

        container.innerHTML = `
            <p style="
                color:var(--muted);
                font-size:12px;
                padding-top:15px;
            ">
                No study sessions today.
            </p>
        `;

        return;
    }


    container.innerHTML =
        todaySessions
            .map(
                session => `
                    <div class="session">

                        <strong>
                            ${escapeHTML(
                                session.subject
                            )}
                        </strong>

                        <span>
                            ${session.minutes} min
                        </span>

                    </div>
                `
            )
            .join("");
}


// ========================================
// ANALYTICS
// ========================================

function updateAnalytics() {

    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const totalStudy =
        sessions.reduce(
            (sum, session) =>
                sum +
                Number(session.minutes),
            0
        );


    const streak =
        document.getElementById(
            "streak"
        );


    const analyticsTasks =
        document.getElementById(
            "analyticsTasks"
        );


    const analyticsStudy =
        document.getElementById(
            "analyticsStudy"
        );


    const analyticsStreak =
        document.getElementById(
            "analyticsStreak"
        );


    if (analyticsTasks) {

        analyticsTasks.textContent =
            completed;
    }


    if (analyticsStudy) {

        analyticsStudy.textContent =
            formatMinutes(
                totalStudy
            );
    }


    if (
        analyticsStreak &&
        streak
    ) {

        analyticsStreak.textContent =
            streak.textContent;
    }
}


// ========================================
// CHARTS
// ========================================

let weeklyChart = null;

let analyticsChart = null;


function getWeeklyData() {

    const result = [];


    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date();


        date.setDate(
            date.getDate() - i
        );


        const minutes =
            sessions
                .filter(
                    session =>
                        sameDay(
                            new Date(
                                session.date
                            ),
                            date
                        )
                )
                .reduce(
                    (sum, session) =>
                        sum +
                        Number(
                            session.minutes
                        ),
                    0
                );


        result.push({

            label:
                date.toLocaleDateString(
                    "en-US",
                    {
                        weekday:
                            "short"
                    }
                ),

            value:
                Number(
                    (
                        minutes / 60
                    ).toFixed(2)
                )
        });
    }


    return result;
}


// ========================================
// UPDATE CHART
// ========================================

function updateChart() {

    if (
        typeof Chart ===
        "undefined"
    ) {
        return;
    }


    const weeklyCanvas =
        document.getElementById(
            "weeklyChart"
        );


    const analyticsCanvas =
        document.getElementById(
            "analyticsChart"
        );


    if (
        !weeklyCanvas ||
        !analyticsCanvas
    ) {
        return;
    }


    const data =
        getWeeklyData();


    const labels =
        data.map(
            item => item.label
        );


    const values =
        data.map(
            item => item.value
        );


    const commonOptions = {

        responsive: true,

        maintainAspectRatio: false,

        animation: {
            duration: 700
        },

        plugins: {

            legend: {
                display: false
            }
        },

        scales: {

            y: {
                beginAtZero: true,

                ticks: {
                    precision: 1
                }
            },

            x: {
                grid: {
                    display: false
                }
            }
        }
    };


    if (weeklyChart) {

        weeklyChart.destroy();
    }


    weeklyChart =
        new Chart(
            weeklyCanvas,
            {

                type: "bar",

                data: {

                    labels,

                    datasets: [{

                        data: values,

                        borderRadius: 8,

                        borderSkipped:
                            false

                    }]
                },

                options:
                    commonOptions
            }
        );


    if (analyticsChart) {

        analyticsChart.destroy();
    }


    analyticsChart =
        new Chart(
            analyticsCanvas,
            {

                type: "line",

                data: {

                    labels,

                    datasets: [{

                        data: values,

                        tension: 0.4,

                        fill: true,

                        pointRadius: 4,

                        pointHoverRadius: 7

                    }]
                },

                options:
                    commonOptions
            }
        );
}


// ========================================
// SETTINGS
// ========================================

const nameInput =
    document.getElementById(
        "nameInput"
    );

const goalInput =
    document.getElementById(
        "goalInput"
    );


if (nameInput) {

    nameInput.value =
        settings.name;
}


if (goalInput) {

    goalInput.value =
        settings.goal;
}


if (nameInput) {

    nameInput.addEventListener(
        "change",
        () => {

            const name =
                nameInput.value.trim();


            if (!name) {

                nameInput.value =
                    settings.name;

                return;
            }


            settings.name =
                name;


            saveData();

            updateGreeting();

            showToast(
                "✓ Name updated"
            );
        }
    );
}


if (goalInput) {

    goalInput.addEventListener(
        "change",
        () => {

            settings.goal =
                Number(
                    goalInput.value
                );


            saveData();

            updateDashboard();

            showToast(
                "✓ Study goal updated"
            );
        }
    );
}


// ========================================
// THEME
// ========================================

function applyTheme() {

    document.body.classList.toggle(
        "dark",
        settings.dark
    );


    const themeButton =
        document.getElementById(
            "themeBtn"
        );


    if (themeButton) {

        themeButton.textContent =
            settings.dark
                ? "☀️ Light Mode"
                : "🌙 Dark Mode";
    }
}


document
    .getElementById("themeBtn")
    .addEventListener(
        "click",
        () => {

            settings.dark =
                !settings.dark;


            saveData();

            applyTheme();

            showToast(
                settings.dark
                    ? "🌙 Dark mode enabled"
                    : "☀️ Light mode enabled"
            );
        }
    );


// ========================================
// RESET DATA
// ========================================

document
    .getElementById("resetData")
    .addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "This will permanently delete all tasks and study history. Continue?"
                );


            if (!confirmed) return;


            tasks = [];

            sessions = [];


            saveData();

            renderTasks();

            updateDashboard();

            showToast(
                "All data has been reset"
            );
        }
    );


// ========================================
// SECURITY
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(text);


    return div.innerHTML;
}


// ========================================
// INITIALIZE
// ========================================

updateDate();

updateGreeting();

applyTheme();

updateTimerDisplay();

renderTasks();

updateDashboard();

renderSessions();
