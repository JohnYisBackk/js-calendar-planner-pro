"use strict";

lucide.createIcons();

// ======================================================
// SELECT ELEMENTS
// ======================================================

const searchBtn = document.querySelector(".search-icon");
const notificationsBtn = document.querySelector(".notifications-icon");

const miniCalendarTitle = document.querySelector("#miniCalendarTitle");
const prevMonthBtn = document.querySelector("#prevMonthBtn");
const nextMonthBtn = document.querySelector("#nextMonthBtn");
const miniCalendarDays = document.querySelector("#miniCalendarDays");
const miniCalendarTodayBtn = document.querySelector("#miniCalendarTodayBtn");

const viewAllEventsBtn = document.querySelector("#viewAllEventsBtn");
const upcomingEventsList = document.querySelector("#upcomingEventsList");
const upcomingEventsEmpty = document.querySelector("#upcomingEventsEmpty");

const viewTimeBreakdownBtn = document.querySelector("#viewTimeBreakdownBtn");

const addCalendarBtn = document.querySelector("#addCalendarBtn");
const myCalendarsList = document.querySelector("#myCalendarsList");

const mainCalendarTitle = document.querySelector("#mainCalendarTitle");
const mainCalendarSubtitle = document.querySelector("#mainCalendarSubtitle");

const calendarTodayBtn = document.querySelector("#calendarTodayBtn");
const prevWeekBtn = document.querySelector("#prevWeekBtn");
const nextWeekBtn = document.querySelector("#nextWeekBtn");

const calendarViewBtns = document.querySelectorAll(".calendar-view-btn");
const addEventBtn = document.querySelector("#addEventBtn");

const calendarWeekDays = document.querySelector("#calendarWeekDays");
const calendarScrollArea = document.querySelector("#calendarScrollArea");
const calendarTimeLabels = document.querySelector("#calendarTimeLabels");
const calendarDaysGrid = document.querySelector("#calendarDaysGrid");
const calendarEventsLayer = document.querySelector("#calendarEventsLayer");

const eventModal = document.querySelector("#eventModal");
const closeEventModalBtn = document.querySelector("#closeEventModalBtn");
const cancelEventBtn = document.querySelector("#cancelEventBtn");

const eventModalTitle = document.querySelector("#eventModalTitle");
const eventForm = document.querySelector("#eventForm");

const eventTitle = document.querySelector("#eventTitle");
const eventDescription = document.querySelector("#eventDescription");
const eventDate = document.querySelector("#eventDate");
const eventStartTime = document.querySelector("#eventStartTime");
const eventEndTime = document.querySelector("#eventEndTime");
const eventCalendar = document.querySelector("#eventCalendar");
const eventLocation = document.querySelector("#eventLocation");

const saveEventBtn = document.querySelector("#saveEventBtn");
const saveEventBtnText = document.querySelector("#saveEventBtnText");
const deleteEventBtn = document.querySelector("#deleteEventBtn");

const themeToggleBtn = document.querySelector("#themeToggleBtn");

// ======================================================
// DATA
// ======================================================

const calendars = [
  {
    id: "personal",
    name: "Personal",
    color: "#9989e9",
  },
  {
    id: "work",
    name: "Work",
    color: "#599ee8",
  },
  {
    id: "meetings",
    name: "Meetings",
    color: "#48c99a",
  },
  {
    id: "important",
    name: "Important",
    color: "#e6a25e",
  },
];

const initialEvents = [
  {
    id: "event-1",
    title: "Project presentation",
    description: "Present the latest project updates.",
    date: "2026-11-16",
    startTime: "08:30",
    endTime: "10:30",
    calendar: "work",
    location: "Conference Room A",
  },
  {
    id: "event-2",
    title: "Design review",
    description: "Review the latest UI designs.",
    date: "2026-11-16",
    startTime: "11:40",
    endTime: "12:10",
    calendar: "meetings",
    location: "Meeting Room B",
  },
  {
    id: "event-3",
    title: "Lunch break",
    description: "Lunch with the team.",
    date: "2026-11-16",
    startTime: "12:00",
    endTime: "13:00",
    calendar: "personal",
    location: "Restaurant",
  },
  {
    id: "event-4",
    title: "Leading a workshop",
    description: "Frontend development workshop.",
    date: "2026-11-16",
    startTime: "13:00",
    endTime: "15:00",
    calendar: "work",
    location: "Training Room",
  },
  {
    id: "event-5",
    title: "Team meeting",
    description: "Weekly team planning.",
    date: "2026-11-18",
    startTime: "09:00",
    endTime: "10:00",
    calendar: "meetings",
    location: "Office",
  },
  {
    id: "event-6",
    title: "Gym workout",
    description: "Upper body training.",
    date: "2026-11-19",
    startTime: "17:00",
    endTime: "18:30",
    calendar: "personal",
    location: "Fitness Center",
  },
];

// ======================================================
// STATE
// ======================================================

let events = [...initialEvents];

let upcomingEvents = [];

let myCalendars = [...calendars];

let currentDate = new Date();

let selectedDate = new Date();

let displayedMonth = new Date();

let currentView = "week";

let editingEventId = null;

let searchTerm = "";

let activeCalendars = calendars.map((calendar) => calendar.id);

let currentTheme = localStorage.getItem("calendarTheme") || "dark";

// ======================================================
// SAVE / LOAD DATA
// ======================================================

function saveData() {
  const savedData = {
    events,
    myCalendars,
    activeCalendars,
  };

  localStorage.setItem("calendarPlanner", JSON.stringify(savedData));
}

function loadData() {
  const storedData = localStorage.getItem("calendarPlanner");

  if (!storedData) return;

  try {
    const parsedData = JSON.parse(storedData);

    if (Array.isArray(parsedData.events)) {
      events = parsedData.events;
    }

    if (Array.isArray(parsedData.myCalendars)) {
      myCalendars = parsedData.myCalendars;
    }

    if (Array.isArray(parsedData.activeCalendars)) {
      activeCalendars = parsedData.activeCalendars;
    }
  } catch (error) {
    console.error("Failed to load calendar data:", error);
  }
}

// ======================================================
// DATE HELPERS
// ======================================================

function getFirstDayOfMonth(year, month) {
  const firstDay = new Date(year, month, 1).getDay();

  return (firstDay + 6) % 7;
}

function formatMonthYear(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatWeekday(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
  });
}

function getToday() {
  return new Date();
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function addDays(date, days) {
  const newDate = new Date(date);

  newDate.setDate(newDate.getDate() + days);

  return newDate;
}

function addMonths(date, months) {
  const newDate = new Date(date);

  newDate.setDate(1);
  newDate.setMonth(newDate.getMonth() + months);

  return newDate;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isSameDay(firstDate, secondDate) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function formatWeekRange(date) {
  const startDate = getStartOfWeek(date);
  const endDate = addDays(startDate, 6);

  const startMonth = startDate.toLocaleDateString("en-US", {
    month: "short",
  });

  const endMonth = endDate.toLocaleDateString("en-US", {
    month: "short",
  });

  if (startDate.getFullYear() !== endDate.getFullYear()) {
    return `${startMonth} ${startDate.getDate()}, ${startDate.getFullYear()} - ${endMonth} ${endDate.getDate()}, ${endDate.getFullYear()}`;
  }

  if (startDate.getMonth() === endDate.getMonth()) {
    return `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}, ${endDate.getFullYear()}`;
  }

  return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${endDate.getFullYear()}`;
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function getEventDuration(startTime, endTime) {
  return timeToMinutes(endTime) - timeToMinutes(startTime);
}

function getStartOfWeek(date) {
  const startDate = new Date(date);

  const day = startDate.getDay();
  const difference = (day + 6) % 7;

  startDate.setDate(startDate.getDate() - difference);
  startDate.setHours(0, 0, 0, 0);

  return startDate;
}

function getWeekDates(date) {
  const startOfWeek = getStartOfWeek(date);

  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    weekDates.push(addDays(startOfWeek, i));
  }

  return weekDates;
}

function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
}

// ======================================================
// CALENDAR NAVIGATION
// ======================================================

function navigateMiniCalendar(direction) {
  displayedMonth = addMonths(displayedMonth, direction);

  renderMiniCalendar();
}

function navigateMainCalendar(direction) {
  if (currentView === "week") {
    currentDate = addDays(currentDate, direction * 7);
  }

  if (currentView === "day") {
    currentDate = addDays(currentDate, direction);
  }

  if (currentView === "month") {
    currentDate = addMonths(currentDate, direction);
  }

  renderMainCalendar();
  updateDashboard();
}

function goToToday() {
  const today = getToday();

  currentDate = new Date(today);
  selectedDate = new Date(today);
  displayedMonth = new Date(today);

  renderMiniCalendar();
  renderMainCalendar();

  updateDashboard();
}

function selectCalendarDate(date) {
  selectedDate = new Date(date);
  currentDate = new Date(date);
  displayedMonth = new Date(date);

  renderMiniCalendar();
  renderMainCalendar();

  updateDashboard();
}

function changeCalendarView(view) {
  currentView = view;

  calendarViewBtns.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  renderMainCalendar();
}

// ======================================================
// RENDER MINI CALENDAR
// ======================================================

function renderMiniCalendar() {
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const today = getToday();

  miniCalendarTitle.textContent = formatMonthYear(displayedMonth);

  miniCalendarDays.innerHTML = "";

  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyDay = document.createElement("span");

    miniCalendarDays.appendChild(emptyDay);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);

    const dayButton = document.createElement("button");

    dayButton.type = "button";
    dayButton.className = "mini-calendar-day";
    dayButton.textContent = day;

    if (isSameDay(date, today)) {
      dayButton.classList.add("today");
    }

    if (isSameDay(date, selectedDate)) {
      dayButton.classList.add("selected");
    }

    const hasEvent = events.some((event) => {
      return (
        event.date === formatDate(date) &&
        activeCalendars.includes(event.calendar)
      );
    });

    if (hasEvent) {
      dayButton.classList.add("has-event");
    }

    dayButton.addEventListener("click", () => {
      selectCalendarDate(date);
    });

    miniCalendarDays.appendChild(dayButton);
  }
}

// ======================================================
// RENDER MAIN CALENDAR
// ======================================================

function renderMainCalendar() {
  calendarScrollArea.classList.toggle("day-view", currentView === "day");
  calendarScrollArea.classList.toggle("month-view", currentView === "month");

  if (currentView === "month") {
    renderMonthView();
    return;
  }

  if (currentView === "day") {
    renderDayView();
    return;
  }

  const weekDates = getWeekDates(currentDate);

  mainCalendarTitle.textContent = formatMonthYear(currentDate);
  mainCalendarSubtitle.textContent = formatWeekRange(currentDate);

  calendarWeekDays.innerHTML = "";
  calendarTimeLabels.innerHTML = "";
  calendarDaysGrid.innerHTML = "";
  calendarEventsLayer.innerHTML = "";

  weekDates.forEach((date) => {
    const dayElement = document.createElement("div");

    dayElement.className = "calendar-week-day";

    const dayName = document.createElement("span");
    dayName.className = "calendar-week-day-name";
    dayName.textContent = formatWeekday(date);

    const dayNumber = document.createElement("span");
    dayNumber.className = "calendar-week-day-number";
    dayNumber.textContent = date.getDate();

    if (isSameDay(date, getToday())) {
      dayElement.classList.add("today");
    }

    if (isSameDay(date, selectedDate)) {
      dayElement.classList.add("selected");
    }

    dayElement.appendChild(dayName);
    dayElement.appendChild(dayNumber);

    calendarWeekDays.appendChild(dayElement);
  });

  for (let hour = 0; hour < 24; hour++) {
    const timeLabel = document.createElement("div");

    timeLabel.className = "calendar-time-label";
    timeLabel.textContent = `${String(hour).padStart(2, "0")}:00`;

    calendarTimeLabels.appendChild(timeLabel);
  }

  weekDates.forEach((date) => {
    const dayColumn = document.createElement("div");

    dayColumn.className = "calendar-day-column";

    if (isSameDay(date, getToday())) {
      dayColumn.classList.add("today");
    }

    for (let hour = 0; hour < 24; hour++) {
      const hourSlot = document.createElement("div");

      hourSlot.className = "calendar-hour-slot";

      dayColumn.appendChild(hourSlot);
    }

    calendarDaysGrid.appendChild(dayColumn);
  });

  renderEvents();
}

function renderMonthView() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  mainCalendarTitle.textContent = formatMonthYear(currentDate);
  mainCalendarSubtitle.textContent = "Monthly Overview";

  calendarWeekDays.innerHTML = "";
  calendarTimeLabels.innerHTML = "";
  calendarDaysGrid.innerHTML = "";
  calendarEventsLayer.innerHTML = "";

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  weekdays.forEach((day) => {
    const dayHeader = document.createElement("div");

    dayHeader.className = "calendar-week-day";
    dayHeader.textContent = day;

    calendarWeekDays.appendChild(dayHeader);
  });

  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    const day = i - firstDayOfMonth + 1;
    const date = new Date(year, month, day);

    const dayCell = document.createElement("div");

    dayCell.className = "month-day-cell";

    if (date.getMonth() !== month) {
      dayCell.classList.add("outside-month");
    }

    if (isSameDay(date, getToday())) {
      dayCell.classList.add("today");
    }

    const dayNumber = document.createElement("span");

    dayNumber.className = "month-day-number";
    dayNumber.textContent = date.getDate();

    dayCell.appendChild(dayNumber);

    const dayEvents = events
      .filter((event) => {
        return (
          event.date === formatDate(date) &&
          activeCalendars.includes(event.calendar)
        );
      })
      .sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
      });

    dayEvents.slice(0, 3).forEach((event) => {
      const calendar = myCalendars.find((item) => {
        return item.id === event.calendar;
      });

      const eventItem = document.createElement("button");

      eventItem.type = "button";
      eventItem.className = "month-event";
      eventItem.textContent = event.title;

      eventItem.style.backgroundColor = calendar?.color || "#9989e9";

      eventItem.addEventListener("click", (eventClick) => {
        eventClick.stopPropagation();
        openEventModal(event);
      });

      dayCell.appendChild(eventItem);
    });

    if (dayEvents.length > 3) {
      const moreEvents = document.createElement("span");

      moreEvents.className = "month-more-events";
      moreEvents.textContent = `+${dayEvents.length - 3} more`;

      dayCell.appendChild(moreEvents);
    }

    dayCell.addEventListener("click", () => {
      selectedDate = new Date(date);
      currentDate = new Date(date);
      displayedMonth = new Date(date);

      changeCalendarView("day");

      renderMiniCalendar();
      updateDashboard();
    });

    calendarDaysGrid.appendChild(dayCell);
  }
}

function renderDayView() {
  calendarScrollArea.classList.add("day-view");

  mainCalendarTitle.textContent = formatMonthYear(currentDate);

  mainCalendarSubtitle.textContent = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  calendarWeekDays.innerHTML = "";
  calendarTimeLabels.innerHTML = "";
  calendarDaysGrid.innerHTML = "";
  calendarEventsLayer.innerHTML = "";

  const dayElement = document.createElement("div");

  dayElement.className = "calendar-week-day";
  dayElement.innerHTML = `
    <span class="calendar-week-day-name">${formatWeekday(currentDate)}</span>
    <span class="calendar-week-day-number">${currentDate.getDate()}</span>
  `;

  if (isSameDay(currentDate, getToday())) {
    dayElement.classList.add("today");
  }

  calendarWeekDays.appendChild(dayElement);

  for (let hour = 0; hour < 24; hour++) {
    const timeLabel = document.createElement("div");

    timeLabel.className = "calendar-time-label";
    timeLabel.textContent = `${String(hour).padStart(2, "0")}:00`;

    calendarTimeLabels.appendChild(timeLabel);
  }

  const dayColumn = document.createElement("div");

  dayColumn.className = "calendar-day-column";

  for (let hour = 0; hour < 24; hour++) {
    const hourSlot = document.createElement("div");

    hourSlot.className = "calendar-hour-slot";

    dayColumn.appendChild(hourSlot);
  }

  calendarDaysGrid.appendChild(dayColumn);

  renderDayEvents();
}

function renderDayEvents() {
  const currentDay = formatDate(currentDate);

  const visibleEvents = events.filter((event) => {
    return (
      event.date === currentDay && activeCalendars.includes(event.calendar)
    );
  });

  visibleEvents.forEach((event) => {
    const eventCalendar = myCalendars.find((calendar) => {
      return calendar.id === event.calendar;
    });

    const eventColor = eventCalendar?.color || "#9989e9";

    const startMinutes = timeToMinutes(event.startTime);
    const duration = getEventDuration(event.startTime, event.endTime);

    if (duration <= 0) return;

    const layout = getEventLayout(event, visibleEvents);

    const eventWidth = 100 / layout.totalColumns;
    const left = layout.column * eventWidth;

    const eventElement = document.createElement("div");

    eventElement.className = "calendar-event";

    eventElement.style.backgroundColor = eventColor;
    eventElement.style.top = `${startMinutes + 2}px`;
    eventElement.style.height = `${Math.max(duration - 4, 12)}px`;
    eventElement.style.left = `calc(${left}% + 3px)`;
    eventElement.style.width = `calc(${eventWidth}% - 6px)`;

    const eventTitle = document.createElement("span");

    eventTitle.className = "calendar-event-title";
    eventTitle.textContent = event.title;

    const eventTime = document.createElement("span");

    eventTime.className = "calendar-event-time";
    eventTime.textContent = `${event.startTime} - ${event.endTime}`;

    eventElement.appendChild(eventTitle);
    eventElement.appendChild(eventTime);

    eventElement.addEventListener("click", () => {
      openEventModal(event);
    });

    calendarEventsLayer.appendChild(eventElement);
  });
}

// ======================================================
// RENDER EVENTS
// ======================================================

function getEventLayout(event, visibleEvents) {
  const dayEvents = visibleEvents
    .filter((item) => {
      return item.date === event.date;
    })
    .sort((a, b) => {
      return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    });

  const groups = [];
  let currentGroup = [];
  let groupEnd = -1;

  dayEvents.forEach((item) => {
    const start = timeToMinutes(item.startTime);
    const end = timeToMinutes(item.endTime);

    if (currentGroup.length > 0 && start >= groupEnd) {
      groups.push(currentGroup);
      currentGroup = [];
      groupEnd = -1;
    }

    currentGroup.push(item);
    groupEnd = Math.max(groupEnd, end);
  });

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  const eventGroup = groups.find((group) => {
    return group.some((item) => item.id === event.id);
  });

  if (!eventGroup) {
    return { column: 0, totalColumns: 1 };
  }

  const columns = [];
  let eventColumn = 0;

  eventGroup.forEach((item) => {
    const start = timeToMinutes(item.startTime);
    const end = timeToMinutes(item.endTime);

    let columnIndex = columns.findIndex((columnEnd) => {
      return columnEnd <= start;
    });

    if (columnIndex === -1) {
      columnIndex = columns.length;
      columns.push(end);
    } else {
      columns[columnIndex] = end;
    }

    if (item.id === event.id) {
      eventColumn = columnIndex;
    }
  });

  return {
    column: eventColumn,
    totalColumns: columns.length,
  };
}

function renderEvents() {
  calendarEventsLayer.innerHTML = "";

  const weekDates = getWeekDates(currentDate);

  const visibleEvents = events.filter((event) => {
    return activeCalendars.includes(event.calendar);
  });

  visibleEvents.forEach((event) => {
    const eventDate = parseDate(event.date);

    const dayIndex = weekDates.findIndex((date) => {
      return isSameDay(date, eventDate);
    });

    if (dayIndex === -1) return;

    const eventCalendar = myCalendars.find((calendar) => {
      return calendar.id === event.calendar;
    });

    const eventColor = eventCalendar?.color || "#9989e9";

    const startMinutes = timeToMinutes(event.startTime);

    const duration = getEventDuration(event.startTime, event.endTime);

    if (duration <= 0) return;

    const top = startMinutes;
    const height = duration;

    const layout = getEventLayout(event, visibleEvents);

    const dayWidth = 100 / 7;
    const eventWidth = dayWidth / layout.totalColumns;

    const left = dayIndex * dayWidth + layout.column * eventWidth;
    const width = eventWidth;

    const eventElement = document.createElement("div");

    eventElement.className = "calendar-event";

    eventElement.style.backgroundColor = eventColor;

    eventElement.style.top = `${top + 2}px`;
    eventElement.style.height = `${Math.max(height - 4, 12)}px`;
    eventElement.style.left = `calc(${left}% + 3px)`;
    eventElement.style.width = `calc(${width}% - 6px)`;

    const eventTitle = document.createElement("span");

    eventTitle.className = "calendar-event-title";
    eventTitle.textContent = event.title;

    const eventTime = document.createElement("span");

    eventTime.className = "calendar-event-time";
    eventTime.textContent = `${event.startTime} - ${event.endTime}`;

    eventElement.appendChild(eventTitle);
    eventElement.appendChild(eventTime);

    eventElement.addEventListener("click", () => {
      openEventModal(event);
    });

    calendarEventsLayer.appendChild(eventElement);
  });
}

// ======================================================
// EVENT MODAL
// ======================================================

function openEventModal(event = null) {
  editingEventId = null;

  eventForm.reset();

  if (event) {
    editingEventId = event.id;

    eventModalTitle.textContent = "Edit Event";

    eventTitle.value = event.title;
    eventDescription.value = event.description;
    eventDate.value = event.date;
    eventStartTime.value = event.startTime;
    eventEndTime.value = event.endTime;
    eventCalendar.value = event.calendar;
    eventLocation.value = event.location;

    deleteEventBtn.hidden = false;
    saveEventBtnText.textContent = "Save Changes";
  } else {
    editingEventId = null;

    eventModalTitle.textContent = "Add New Event";

    eventDate.value = formatDate(selectedDate);

    deleteEventBtn.hidden = true;
    saveEventBtnText.textContent = "Create Event";
  }

  eventModal.showModal();
}

function closeEventModal() {
  eventModal.close();
}

// ======================================================
// ADD / EDIT / DELETE EVENT
// ======================================================

function saveEvent() {
  const title = eventTitle.value.trim();
  const description = eventDescription.value.trim();
  const date = eventDate.value;
  const startTime = eventStartTime.value;
  const endTime = eventEndTime.value;
  const calendar = eventCalendar.value;
  const location = eventLocation.value.trim();

  if (!title || !date || !startTime || !endTime || !calendar) {
    alert("Please fill in all required fields.");
    return;
  }

  if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
    alert("End time must be later than start time.");
    return;
  }

  if (editingEventId) {
    const existingEvent = events.find((event) => {
      return event.id === editingEventId;
    });

    if (!existingEvent) return;

    existingEvent.title = title;
    existingEvent.description = description;
    existingEvent.date = date;
    existingEvent.startTime = startTime;
    existingEvent.endTime = endTime;
    existingEvent.calendar = calendar;
    existingEvent.location = location;
  } else {
    const newEvent = {
      id: crypto.randomUUID(),
      title,
      description,
      date,
      startTime,
      endTime,
      calendar,
      location,
    };

    events.push(newEvent);
  }

  saveData();

  renderMiniCalendar();
  renderMainCalendar();

  updateDashboard();

  closeEventModal();
}

function deleteEvent() {
  if (!editingEventId) return;

  const confirmed = confirm("Are you sure you want to delete this event?");

  if (!confirmed) return;

  events = events.filter((event) => {
    return event.id !== editingEventId;
  });

  editingEventId = null;

  saveData();

  renderMiniCalendar();
  renderMainCalendar();

  updateDashboard();

  closeEventModal();
}

// ======================================================
// UPDATE DASHBOARD
// ======================================================

function renderUpcomingEvents() {
  upcomingEventsList.innerHTML = "";

  const today = formatDate(getToday());

  upcomingEvents = events
    .filter((event) => {
      return event.date >= today && activeCalendars.includes(event.calendar);
    })
    .sort((a, b) => {
      const dateA = `${a.date}T${a.startTime}`;
      const dateB = `${b.date}T${b.startTime}`;

      return dateA.localeCompare(dateB);
    })
    .slice(0, 4);

  upcomingEventsEmpty.hidden = upcomingEvents.length > 0;

  upcomingEvents.forEach((event) => {
    const eventItem = document.createElement("div");

    eventItem.className = "upcoming-event-item";

    const eventInfo = document.createElement("div");

    eventInfo.className = "upcoming-event-info";

    const eventCheckbox = document.createElement("input");

    eventCheckbox.type = "checkbox";
    eventCheckbox.className = "upcoming-event-checkbox";

    const eventName = document.createElement("span");

    eventName.className = "upcoming-event-name";
    eventName.textContent = event.title;

    const eventTime = document.createElement("span");

    eventTime.className = "upcoming-event-time";
    eventTime.textContent = `${event.startTime} - ${event.endTime}`;

    eventInfo.appendChild(eventCheckbox);
    eventInfo.appendChild(eventName);

    eventItem.appendChild(eventInfo);
    eventItem.appendChild(eventTime);

    upcomingEventsList.appendChild(eventItem);
  });
}

function renderTimeBreakdown() {
  const categoryMinutes = {};

  myCalendars.forEach((calendar) => {
    categoryMinutes[calendar.id] = 0;
  });

  const weekDates = getWeekDates(currentDate);

  const startDate = formatDate(weekDates[0]);
  const endDate = formatDate(weekDates[6]);

  events.forEach((event) => {
    if (event.date < startDate || event.date > endDate) return;

    if (!activeCalendars.includes(event.calendar)) return;

    const duration = getEventDuration(event.startTime, event.endTime);

    if (duration <= 0) return;

    if (categoryMinutes[event.calendar] !== undefined) {
      categoryMinutes[event.calendar] += duration;
    }
  });

  const totalMinutes = Object.values(categoryMinutes).reduce(
    (total, minutes) => total + minutes,
    0,
  );

  document.querySelectorAll(".time-breakdown-item").forEach((item) => {
    const label = item.querySelector(".time-breakdown-label");
    const progress = item.querySelector(".time-breakdown-fill");

    if (!label || !progress) return;

    const calendar = myCalendars.find((calendar) => {
      return (
        calendar.name.toLowerCase() === label.textContent.trim().toLowerCase()
      );
    });

    if (!calendar) return;

    const minutes = categoryMinutes[calendar.id] || 0;

    const percentage = totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0;

    progress.style.width = `${percentage}%`;
  });
}

function renderMyCalendars() {
  myCalendarsList.innerHTML = "";

  myCalendars.forEach((calendar) => {
    const calendarItem = document.createElement("div");

    calendarItem.className = "my-calendar-item";

    const calendarColor = document.createElement("span");

    calendarColor.className = "my-calendar-color";
    calendarColor.style.backgroundColor = calendar.color;

    const calendarName = document.createElement("span");

    calendarName.className = "my-calendar-name";
    calendarName.textContent = calendar.name;

    const calendarToggle = document.createElement("button");

    calendarToggle.type = "button";
    calendarToggle.className = "my-calendar-toggle";

    const isActive = activeCalendars.includes(calendar.id);

    calendarToggle.classList.toggle("active", isActive);

    calendarToggle.setAttribute("aria-pressed", String(isActive));
    calendarToggle.setAttribute(
      "aria-label",
      `Toggle ${calendar.name} calendar`,
    );

    const checkIcon = document.createElement("span");

    checkIcon.textContent = "✓";

    calendarToggle.appendChild(checkIcon);

    calendarToggle.addEventListener("click", () => {
      toggleCalendar(calendar.id);
    });

    calendarItem.appendChild(calendarColor);
    calendarItem.appendChild(calendarName);
    calendarItem.appendChild(calendarToggle);

    myCalendarsList.appendChild(calendarItem);
  });
}

function toggleCalendar(calendarId) {
  if (activeCalendars.includes(calendarId)) {
    activeCalendars = activeCalendars.filter((id) => {
      return id !== calendarId;
    });
  } else {
    activeCalendars.push(calendarId);
  }

  saveData();

  renderMiniCalendar();
  renderMainCalendar();

  updateDashboard();
}

function updateDashboard() {
  renderUpcomingEvents();
  renderTimeBreakdown();
  renderMyCalendars();
}

// ======================================================
// THEME MANAGEMENT
// ======================================================

function applyTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.setAttribute(
      "aria-label",
      currentTheme === "dark" ? "Switch to light mode" : "Switch to dark mode",
    );
  }
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";

  localStorage.setItem("calendarTheme", currentTheme);

  applyTheme();
}

// ======================================================
// EVENT LISTENERS
// ======================================================

calendarViewBtns.forEach((button) => {
  button.addEventListener("click", () => {
    changeCalendarView(button.dataset.view);
  });
});

prevMonthBtn.addEventListener("click", () => {
  navigateMiniCalendar(-1);
});

nextMonthBtn.addEventListener("click", () => {
  navigateMiniCalendar(1);
});

miniCalendarTodayBtn.addEventListener("click", () => {
  goToToday();
});

prevWeekBtn.addEventListener("click", () => {
  navigateMainCalendar(-1);
});

nextWeekBtn.addEventListener("click", () => {
  navigateMainCalendar(1);
});

calendarTodayBtn.addEventListener("click", () => {
  goToToday();
});

addEventBtn.addEventListener("click", () => {
  openEventModal();
});

closeEventModalBtn.addEventListener("click", () => {
  closeEventModal();
});

cancelEventBtn.addEventListener("click", () => {
  closeEventModal();
});

eventForm.addEventListener("submit", (event) => {
  event.preventDefault();

  saveEvent();
});

deleteEventBtn.addEventListener("click", () => {
  deleteEvent();
});

themeToggleBtn?.addEventListener("click", toggleTheme);

// ======================================================
// INITIALIZE APP
// ======================================================

function initApp() {
  loadData();
  applyTheme();

  renderMiniCalendar();
  renderMainCalendar();

  updateDashboard();
}

initApp();
