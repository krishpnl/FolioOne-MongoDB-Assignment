document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const loading = form.querySelector(".loading");
  const errorMessage = form.querySelector(".error-message");
  const sentMessage = form.querySelector(".sent-message");
  const successOverlay = document.getElementById("success-overlay");
  // Hide all messages initially

  loading.style.display = "none";
  errorMessage.style.display = "none";
  sentMessage.style.display = "none";
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    // Hide previous messages

    loading.style.display = "none";
    errorMessage.style.display = "none";
    sentMessage.style.display = "none";
    // Get form values

    const name = form.elements["name"].value.trim();
    const email = form.elements["email"].value.trim();
    const subject = form.elements["subject"].value.trim();
    const message = form.elements["message"].value.trim();
    // =========================
    // EMPTY FIELD VALIDATION
    // =========================

    if (!name || !email || !subject || !message) {
      errorMessage.textContent = "Please fill in all fields.";
      errorMessage.style.display = "block";
      setTimeout(function () {
        errorMessage.style.display = "none";
      }, 3000);
      return;
    }
    // =========================
    // EMAIL VALIDATION
    // =========================

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errorMessage.textContent = "Please enter a valid email address.";
      errorMessage.style.display = "block";
      setTimeout(function () {
        errorMessage.style.display = "none";
      }, 3000);
      return;
    }
    // =========================
    // SHOW LOADING
    // =========================

    loading.style.display = "block";
    try {
      // =========================
      // SEND DATA TO NODE.JS
      // =========================

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: subject,
          message: message,
        }),
      });
      // Convert response to JSON

      const data = await response.json();
      // Hide loading

      loading.style.display = "none";
      // =========================
      // CHECK SERVER RESPONSE
      // =========================

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to send your message.");
      }
      // =========================
      // SUCCESS
      // =========================
      // Reset the form

      form.reset();
      // Show full-page success animation

      if (successOverlay) {
        successOverlay.classList.add("show");
        // Hide the success animation after 2.5 seconds

        setTimeout(function () {
          successOverlay.classList.remove("show");
        }, 2500);
      } else {
        // Fallback if overlay is not present

        sentMessage.textContent = "Your message has been sent successfully.";
        sentMessage.style.display = "block";
        setTimeout(function () {
          sentMessage.style.display = "none";
        }, 3000);
      }
    } catch (error) {
      // =========================
      // ERROR
      // =========================

      loading.style.display = "none";
      errorMessage.textContent = error.message || "Unable to send your message. Please try again.";
      errorMessage.style.display = "block";
      // Hide error after 4 seconds

      setTimeout(function () {
        errorMessage.style.display = "none";
      }, 4000);
    }
  });
});
