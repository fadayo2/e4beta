document.addEventListener("DOMContentLoaded", function () {
    const loginScreen = document.getElementById("loginScreen");
    const dashboard = document.getElementById("dashboard");
    const loginButton = document.getElementById("loginButton");
    const adminPassword = document.getElementById("adminPassword");
    const loginError = document.getElementById("loginError");

    const clientTable = document.getElementById("client-table");
    const modal = document.getElementById("detailsModal");
    const span = document.getElementsByClassName("close")[0];
    const applicantDetails = document.getElementById("applicantDetails");
    const deleteButton = document.getElementById("deleteApplicant");
    const loadingText = document.getElementById("loadingText");

    let selectedApplicantEmail = null; // Use email instead of ID

    // Admin login
    loginButton.addEventListener("click", function () {
        const password = adminPassword.value;

        if (password === "ElRoi2018@") {
            loginScreen.style.display = "none";
            dashboard.style.display = "block";
            fetchApplicants();
        } else {
            loginError.textContent = "Incorrect password. Please try again.";
            loginError.style.display = "block";
        }
    });

    // Function to calculate relative time
    function timeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;

        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    }

    // Function to fetch and display applicants
    function fetchApplicants() {
        console.log("Fetching applicants..."); // Debugging output
        loadingText.style.display = "block"; // Show loading text

        fetch("https://sheetdb.io/api/v1/5d4sgd82liy40")
            .then(response => {
                console.log("Response received:", response); // Debugging output
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Data fetched:", data); // Debugging output
                clientTable.innerHTML = ""; // Clear the table before adding new rows
                loadingText.style.display = "none"; // Hide loading text

                if (data.length > 0) {
                    data.forEach(applicant => {
                        const row = document.createElement("tr");

                        // Create cells for each applicant's data
                        const nameCell = document.createElement("td");
                        nameCell.textContent = `${applicant.firstName} ${applicant.lastName}`;
                        row.appendChild(nameCell);

                        const emailCell = document.createElement("td");
                        emailCell.textContent = applicant.email;
                        row.appendChild(emailCell);

                        const locationCell = document.createElement("td");
                        locationCell.textContent = applicant.location;
                        row.appendChild(locationCell);

                        const scoreCell = document.createElement("td");
                        scoreCell.textContent = applicant.score;
                        row.appendChild(scoreCell);

                        const resumeCell = document.createElement("td");
                        const resumeLink = document.createElement("a");
                        resumeLink.href = applicant.fileURL;
                        resumeLink.textContent = "View Resume";
                        resumeLink.target = "_blank";
                        resumeCell.appendChild(resumeLink);
                        row.appendChild(resumeCell);

                        const timeCell = document.createElement("td");
                        timeCell.textContent = timeAgo(applicant.timestamp); // Display relative time
                        row.appendChild(timeCell);

                        // Add onclick to show full details
                        row.onclick = function () {
                            selectedApplicantEmail = applicant.email; // Store the applicant email
                            console.log("Selected applicant email:", selectedApplicantEmail); // Debugging output
                            applicantDetails.innerHTML = `
                                <p><strong>Name:</strong> ${applicant.firstName} ${applicant.lastName}</p>
                                <p><strong>Email:</strong> ${applicant.email}</p>
                                <p><strong>Location:</strong> ${applicant.location}</p>
                                <p><strong>Role:</strong> ${applicant.role}</p>
                                <p><strong>Score:</strong> ${applicant.score}</p>
                                <p><strong>Availability:</strong> ${applicant.availability}</p>
                                <p><strong>Resume:</strong> <a href="${applicant.fileURL}" target="_blank">View Resume</a></p>
                                <p><strong>Timestamp:</strong> ${applicant.timestamp}</p>
                            `;
                            modal.style.display = "block";
                        };

                        // Add the row to the table
                        clientTable.appendChild(row);
                    });
                } else {
                    // Display "No applicants found" message
                    const noApplicantsRow = document.createElement("tr");
                    const noApplicantsCell = document.createElement("td");
                    noApplicantsCell.colSpan = 6;
                    noApplicantsCell.textContent = "No applicants found.";
                    noApplicantsCell.style.textAlign = "center";
                    noApplicantsRow.appendChild(noApplicantsCell);
                    clientTable.appendChild(noApplicantsRow);
                }
            })
            .catch(error => {
                console.error("Error fetching applicants:", error);
                loadingText.style.display = "none"; // Hide loading text in case of error
            });
    }

    // Delete an applicant
    deleteButton.onclick = function () {
        if (selectedApplicantEmail) {
            console.log("Attempting to delete applicant with email:", selectedApplicantEmail); // Debugging output
            fetch(`https://sheetdb.io/api/v1/5d4sgd82liy40/email/${encodeURIComponent(selectedApplicantEmail)}`, {
                method: "DELETE",
            })
                .then(response => response.json())
                .then(result => {
                    console.log("Delete result:", result); // Debugging output
                    if (result.deleted > 0) {
                        console.log("Applicant deleted successfully."); // Debugging output
                        fetchApplicants(); // Refresh the list after deletion
                        modal.style.display = "none";
                        selectedApplicantEmail = null;
                    } else {
                        throw new Error("Failed to delete the applicant");
                    }
                })
                .catch(error => {
                    console.error("Error deleting applicant:", error);
                });
        }
    };

    // Close the modal
    span.onclick = function () {
        modal.style.display = "none";
        selectedApplicantEmail = null;
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            selectedApplicantEmail = null;
        }
    };

    // Show a confirmation dialog before leaving the page
    window.addEventListener("beforeunload", function (event) {
        event.preventDefault();
        event.returnValue = "Are you sure you want to leave? Changes you made may not be saved.";
    });

    // Initial fetch and setup interval to refresh the table every hour
    setInterval(fetchApplicants, 3600000); // Refresh every 3600000 milliseconds (1 hour)
});