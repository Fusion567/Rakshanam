// Utility function to get the current date in IST
const getISTDate = () => {
  const now = new Date();
  const istOffset = 330; // IST is UTC + 5:30
  return new Date(now.getTime() + istOffset * 60 * 1000);
};

// Calendar variables
const calendarGrid = document.getElementById("calendarGrid");
const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const timeSlots = document.getElementById("timeSlots");

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Function to get the number of days in a month
const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

// Function to generate the calendar for the current month and year
const generateCalendar = (year, month) => {
  // Clear existing content
  calendarGrid.innerHTML = "";
  calendarDays.innerHTML = "";

  // Render days of the week
  daysOfWeek.forEach(day => {
    const dayDiv = document.createElement("div");
    dayDiv.textContent = day;
    dayDiv.classList.add("calendar-day-name");
    calendarDays.appendChild(dayDiv);
  });

  const today = getISTDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDays = daysInMonth(year, month);

  // Add empty slots for the days before the first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptySlot = document.createElement("div");
    emptySlot.classList.add("empty-slot");
    calendarGrid.appendChild(emptySlot);
  }

  // Generate days of the month
  for (let day = 1; day <= totalDays; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.textContent = day;
    dayDiv.classList.add("calendar-day");

    // Disable past dates
    if (
      year < today.getFullYear() ||
      (year === today.getFullYear() && month < today.getMonth()) ||
      (year === today.getFullYear() && month === today.getMonth() && day < today.getDate())
    ) {
      dayDiv.classList.add("disabled");
    } else {
      dayDiv.onclick = () => selectDate(day);
    }

    calendarGrid.appendChild(dayDiv);
  }

  // Update displayed month and year
  monthYear.textContent = `${monthNames[month]} ${year}`;
};

// Function to handle date selection
const selectDate = (day) => {
  // Remove 'selected' class from all days
  document.querySelectorAll(".calendar-day").forEach(dayEl => dayEl.classList.remove("selected"));

  // Add 'selected' class to the clicked day
  const dayElements = calendarGrid.querySelectorAll(".calendar-day");
  dayElements[day - 1].classList.add("selected");

  // Update hidden input
  document.getElementById("selectedDay").value = `${day}-${monthNames[currentMonth]}-${currentYear}`;

  // Load available time slots for the selected day
  loadTimeSlots(day);
};

// Function to load available time slots for a selected day
const loadTimeSlots = (day) => {
  const slots = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
    "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
    "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM"
  ];

  timeSlots.innerHTML = `<h2>Available Time Slots for ${monthNames[currentMonth]} ${day}, ${currentYear}</h2>`;
  timeSlots.innerHTML += slots
  .map(slot => `<span class="time-slot" data-time="${slot}">${slot}</span>`)
    .join("");

  // Add click listener to each time slot
  document.querySelectorAll(".time-slot").forEach(slot => {
    slot.addEventListener("click", () => selectTime(slot));
  });
};

// Function to handle time slot selection
const selectTime = (slotElement) => {
  // Remove 'selected' class from all slots
  document.querySelectorAll(".time-slot").forEach(slot => slot.classList.remove("selected-slot"));

  // Add 'selected' class to the clicked slot
  slotElement.classList.add("selected-slot");

  // Update hidden input
  document.getElementById("selectedTime").value = slotElement.dataset.time;
};

// Event listeners for month navigation
prevMonthBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar(currentYear, currentMonth);
});

nextMonthBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateCalendar(currentYear, currentMonth);
});

// Form submission handler
const handleSubmit = (event) => {
  event.preventDefault();
  const form = document.getElementById("bookingForm");

  // Collect selected services
  const selectedServices = Array.from(
    document.querySelectorAll('input[type="checkbox"]:checked')
  ).map(service => service.value);

  if (selectedServices.length === 0) {
    alert("Please select at least one service.");
    return false;
  }

  const selectedDay = document.getElementById("selectedDay").value;
  const selectedTime = document.getElementById("selectedTime").value;

  if (!selectedDay || !selectedTime) {
    alert("Please select a date and time.");
    return false;
  }

  // Add selected services to hidden field
  document.getElementById("selectedServices").value = selectedServices.join(", ");

  // Submit the form
  form.submit();
};

// Initialize the calendar
generateCalendar(currentYear, currentMonth);
