// ========================================
// STUDYFLOW
// Student Productivity Dashboard
// ========================================


// ========================================
// STORAGE
// ========================================

const savedTasks =
    JSON.parse(localStorage.getItem("studyflowTasks")) || [];

let tasks = Array.isArray(savedTasks) ? savedTasks : [];

const savedSessions =
    JSON.parse(localStorage.getItem("studyflowSessions")) || [];

let sessions =
    Array.isArray(savedSessions) ? savedSessions : [];

const savedSettings =
    JSON.parse(localStorage.getItem("studyflowSettings"));

let settings = savedSettings || {
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
// MOBILE MENU
// ========================================

const mobileMenuBtn =
    document.querySelector(".mobile-menu-btn");

const sidebar =
    document.querySelector(".sidebar");


// Create overlay
const mobileOverlay =
    document.createElement("div");

mobileOverlay.className =
    "mobile-overlay";

document.body.appendChild(
    mobileOverlay
);


// Open menu
function openMobileMenu() {

    sidebar?.classList.add(
        "mobile-open"
    );

    mobileOverlay.classList.add(
        "show"
    );

    document.body.style.overflow =
        "hidden";
}


// Close menu
function closeMobileMenu() {

    sidebar?.classList.remove(
        "mobile-open"
    );

    mobileOverlay.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";
}


// Hamburger click
mobileMenuBtn?.addEventListener(
    "click",
    () => {

        if (
            sidebar?.classList.contains(
                "mobile-open"
            )
        ) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }

    }
);


// Overlay click
mobileOverlay.addEventListener(
    "click",
    closeMobileMenu
);


// Close after selecting page
navItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            if (
                window.innerWidth <= 750
            ) {
                closeMobileMenu();
            }

        }
    );

});
// ========================================
// TOAST
// ========================================

function showToast(message) {

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

            @media(max-width:600px) {
                #toast {
                    left: 15px;
                    right: 15px;
                    bottom: 15px;
                    text-align: center;
                }
            }
        `;

        document.head.appendChild(style);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);
}


// ========================================
// DATE
// ========================================

function updateDate() {

    const dateElement =
        document.getElementById("currentDate");

    if (!dateElement) return;

    dateElement.textContent =
        new Date().toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );
}


// ========================================
// GREETING
// ========================================

function updateGreeting() {

    const hour =
        new Date().getHours();

    let greeting = "Good morning";

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

        // Update charts whenever analytics page opens
        setTimeout(updateChart, 50);
    });
});


// ========================================
// TASK MODAL
// ========================================

function openTaskModal() {

    if (!taskModal) return;

    taskModal.classList.add("show");

    if (taskInput) {
        taskInput.value = "";
        taskInput.focus();
    }

    if (priorityInput) {
        priorityInput.value = "Medium";
    }
}


function closeTaskModal() {

    if (!taskModal) return;

    taskModal.classList.remove("show");

    if (taskForm) {
        taskForm.reset();
    }
}


const addTaskBtn =
    document.getElementById("addTaskBtn");

const addTaskBtn2 =
    document.getElementById("addTaskBtn2");

const closeModal =
    document.getElementById("closeModal");


addTaskBtn?.addEventListener(
    "click",
    openTaskModal
);

addTaskBtn2?.addEventListener(
    "click",
    openTaskModal
);

closeModal?.addEventListener(
    "click",
    closeTaskModal
);

taskModal?.addEventListener(
    "click",
    event => {

        if (event.target === taskModal) {
            closeTaskModal();
        }
    }
);


document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            closeTaskModal();
        }
    }
);


// ========================================
// ADD TASK
// ========================================

taskForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const title =
            taskInput?.value.trim();

        if (!title) {

            showToast("Please enter a task");

            return;
        }

        const newTask = {

            id: Date.now(),

            title,

            priority:
                priorityInput?.value || "Medium",

            completed: false,

            createdAt:
                new Date().toISOString()
        };

        tasks.push(newTask);

        saveData();

        renderTasks();

        closeTaskModal();

        showToast("✓ Task added successfully");
    }
);


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
                    String(task.priority)
                        .toLowerCase()
                }">
                    ${escapeHTML(task.priority)}
                </span>

            </div>

            <button
                class="delete-btn edit-btn"
                data-edit="${task.id}"
                title="Edit task"
                aria-label="Edit task"
            >
                ✏️
            </button>

            <button
                class="delete-btn"
                data-delete="${task.id}"
                title="Delete task"
                aria-label="Delete task"
            >
                🗑️
            </button>

        </div>
    `;
}


// ========================================
// EMPTY TASK STATE
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
// RENDER TASKS
// ========================================

let currentFilter = "all";


function renderTasks(
    filter = currentFilter
) {

    currentFilter = filter;

    let filteredTasks = [...tasks];

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

    if (allTasks) {

        allTasks.innerHTML =
            filteredTasks.length === 0
                ? emptyTasks()
                : filteredTasks
                    .map(createTaskHTML)
                    .join("");
    }

    if (dashboardTasks) {

        dashboardTasks.innerHTML =
            tasks.length === 0
                ? emptyTasks()
                : tasks
                    .slice(-5)
                    .reverse()
                    .map(createTaskHTML)
                    .join("");
    }

    updateDashboard();
}


// ========================================
// TASK ACTIONS
// ========================================

document.addEventListener(
    "change",
    event => {

        if (
            !event.target.classList.contains(
                "task-checkbox"
            )
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

        showToast(
            task.completed
                ? "🎉 Task completed!"
                : "Task moved back to active"
        );
    }
);


// ========================================
// EDIT + DELETE
// ========================================

document.addEventListener(
    "click",
    event => {

        const editButton =
            event.target.closest("[data-edit]");

        if (editButton) {

            const id =
                Number(editButton.dataset.edit);

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

            showToast("✓ Task updated");

            return;
        }


        const deleteButton =
            event.target.closest("[data-delete]");

        if (!deleteButton) return;

        const id =
            Number(deleteButton.dataset.delete);

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

        showToast("Task deleted");
    }
);


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
                    .querySelectorAll(".filter")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );

                button.classList.add("active");

                renderTasks(
                    button.dataset.filter || "all"
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
        Number(settings.goal) * 60;

    const studyPercentage =
        goalMinutes === 0
            ? 0
            : Math.min(
                Math.round(
                    (todayMinutes /
                        goalMinutes) * 100
                ),
                100
            );

    const productivity =
        total === 0
            ? studyPercentage
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
            formatMinutes(todayMinutes);
    }


    updateStudyProgress(todayMinutes);

    updateStreak();

    updateAnalytics();

    updateStudySummary();
}


// ========================================
// STUDY PROGRESS
// ========================================

function updateStudyProgress(minutes) {

    const goalMinutes =
        Number(settings.goal) * 60;

    let percentage =
        goalMinutes === 0
            ? 0
            : Math.round(
                (minutes / goalMinutes) * 100
            );

    percentage =
        Math.min(percentage, 100);

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

function sameDay(date1, date2) {

    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}


function getTodayStudyMinutes() {

    const today =
        new Date();

    return sessions
        .filter(session =>
            sameDay(
                new Date(session.date),
                today
            )
        )
        .reduce(
            (total, session) =>
                total + Number(session.minutes || 0),
            0
        );
}


// ========================================
// FORMAT MINUTES
// ========================================

function formatMinutes(minutes) {

    minutes =
        Math.max(
            0,
            Math.round(Number(minutes) || 0)
        );

    if (minutes < 60) {

        return `${minutes}m`;
    }

    const hours =
        Math.floor(minutes / 60);

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

    for (let i = 0; i < 365; i++) {

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
        document.getElementById("streak");

    if (streakElement) {

        streakElement.textContent =
            `${streak} day${
                streak !== 1 ? "s" : ""
            }`;
    }

    const streakText =
        document.getElementById("streakText");

    if (streakText) {

        streakText.textContent =
            streak > 0
                ? "Keep it going!"
                : "Start your journey";
    }
}


// ========================================
// TIMER
// ========================================

let selectedMinutes = 30;

let timerSeconds =
    selectedMinutes * 60;

let timerInterval = null;

let timerRunning = false;


// ========================================
// TIMER OPTIONS
// ========================================

document
    .querySelectorAll(".timer-option")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (timerRunning) {

                    showToast(
                        "Pause the timer before changing duration."
                    );

                    return;
                }

                document
                    .querySelectorAll(
                        ".timer-option"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );

                button.classList.add("active");

                selectedMinutes =
                    Number(
                        button.dataset.minutes
                    ) || 30;

                timerSeconds =
                    selectedMinutes * 60;

                updateTimerDisplay();

                updateTimerStatus("Ready");
            }
        );
    });


// ========================================
// TIMER DISPLAY
// ========================================

function updateTimerDisplay() {

    const timer =
        document.getElementById("timer");

    if (!timer) return;

    const hours =
        Math.floor(
            timerSeconds / 3600
        );

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


// ========================================
// TIMER STATUS
// ========================================

function updateTimerStatus(status) {

    const statusElement =
        document.querySelector(
            ".timer-status"
        );

    if (!statusElement) return;

    const dot =
        statusElement.querySelector(
            ".status-dot"
        );

    statusElement.lastChild.textContent =
        ` ${status}`;

    if (dot) {

        dot.style.animation =
            status === "Running"
                ? "timerDotPulse 1.2s infinite"
                : "none";
    }
}


// ========================================
// START / PAUSE / RESUME
// ========================================

const startTimerButton =
    document.getElementById(
        "startTimer"
    );


startTimerButton?.addEventListener(
    "click",
    () => {

        const timerCard =
            document.querySelector(
                ".timer-card"
            );

        // PAUSE
        if (timerRunning) {

            clearInterval(timerInterval);

            timerInterval = null;

            timerRunning = false;

            timerCard?.classList.remove(
                "timer-running"
            );

            startTimerButton.textContent =
                "▶ Resume";

            updateTimerStatus("Paused");

            showToast("Timer paused");

            return;
        }


        // START / RESUME

        if (timerSeconds <= 0) {

            timerSeconds =
                selectedMinutes * 60;

            updateTimerDisplay();
        }

        timerRunning = true;

        timerCard?.classList.add(
            "timer-running"
        );

        startTimerButton.textContent =
            "⏸ Pause";

        updateTimerStatus("Running");


        timerInterval =
            setInterval(
                () => {

                    timerSeconds--;

                    updateTimerDisplay();


                    if (
                        timerSeconds <= 0
                    ) {

                        clearInterval(
                            timerInterval
                        );

                        timerInterval = null;

                        timerRunning = false;

                        timerCard?.classList.remove(
                            "timer-running"
                        );


                        saveStudySession(
                            selectedMinutes
                        );


                        showToast(
                            `🎉 ${formatMinutes(
                                selectedMinutes
                            )} study session completed!`
                        );


                        timerSeconds =
                            selectedMinutes * 60;


                        startTimerButton.textContent =
                            "▶ Start";

                        updateTimerDisplay();

                        updateTimerStatus(
                            "Completed"
                        );
                    }

                },
                1000
            );
    }
);


// ========================================
// RESET TIMER
// ========================================

document
    .getElementById("resetTimer")
    ?.addEventListener(
        "click",
        () => {

            clearInterval(
                timerInterval
            );

            timerInterval = null;

            timerRunning = false;

            document
                .querySelector(".timer-card")
                ?.classList.remove(
                    "timer-running"
                );

            timerSeconds =
                selectedMinutes * 60;

            const button =
                document.getElementById(
                    "startTimer"
                );

            if (button) {

                button.textContent =
                    "▶ Start";
            }

            updateTimerDisplay();

            updateTimerStatus("Ready");

            showToast("Timer reset");
        }
    );


// ========================================
// SAVE STUDY SESSION
// ========================================

function saveStudySession(minutes) {

    const subjectSelect =
        document.getElementById(
            "subjectSelect"
        );

    const subject =
        subjectSelect?.value ||
        "General Study";

    sessions.push({

        id: Date.now(),

        date:
            new Date().toISOString(),

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
                    new Date(session.date),
                    new Date()
                )
        );

    const todayMinutes =
        todaySessions.reduce(
            (sum, session) =>
                sum +
                Number(session.minutes || 0),
            0
        );


    const summary =
        document.getElementById(
            "studySummary"
        );

    if (summary) {

        summary.textContent =
            formatMinutes(todayMinutes);
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
                        new Date(session.date),
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
                            ${Number(
                                session.minutes
                            )} min
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
                Number(session.minutes || 0),
            0
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
            formatMinutes(totalStudy);
    }

    if (analyticsStreak) {

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

        for (let i = 0; i < 365; i++) {

            const date =
                new Date();

            date.setDate(
                today.getDate() - i
            );

            if (
                studyDays.has(
                    date.toDateString()
                )
            ) {

                streak++;

            } else {

                break;
            }
        }

        analyticsStreak.textContent =
            `${streak} day${streak !== 1 ? "s" : ""}`;
    }
}


// ========================================
// CHART DATA
// ========================================

function getWeeklyData() {

    const result = [];

    for (let i = 6; i >= 0; i--) {

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
                            new Date(session.date),
                            date
                        )
                )
                .reduce(
                    (sum, session) =>
                        sum +
                        Number(session.minutes || 0),
                    0
                );

        result.push({

            label:
                date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
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
// CHARTS
// ========================================

let weeklyChart = null;

let analyticsChart = null;


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


    if (
        weeklyCanvas
    ) {

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
    }


    if (
        analyticsCanvas
    ) {

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


nameInput?.addEventListener(
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

        showToast("✓ Name updated");
    }
);


goalInput?.addEventListener(
    "change",
    () => {

        let goal =
            Number(goalInput.value);

        if (
            !Number.isFinite(goal) ||
            goal <= 0
        ) {

            goal =
                4;

            goalInput.value =
                goal;
        }

        settings.goal =
            goal;

        saveData();

        updateDashboard();

        showToast(
            "✓ Study goal updated"
        );
    }
);


// ========================================
// THEME
// ========================================

function applyTheme() {

    document.body.classList.toggle(
        "dark",
        Boolean(settings.dark)
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
    ?.addEventListener(
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

            updateChart();
        }
    );


// ========================================
// RESET DATA
// ========================================

document
    .getElementById("resetData")
    ?.addEventListener(
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

updateTimerStatus("Ready");

renderTasks();

updateDashboard();

renderSessions();


// ========================================
// TIMER STATUS ANIMATION
// ========================================

const timerStatusStyle =
    document.createElement("style");

timerStatusStyle.textContent = `
    @keyframes timerDotPulse {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }

        50% {
            opacity: .45;
            transform: scale(.75);
        }
    }
`;

document.head.appendChild(
    timerStatusStyle
);