document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("kLYR-GTWNzTCXckct");

    const step1 = document.getElementById("step-1");
    const step2 = document.getElementById("step-2");
    const nextStep1 = document.getElementById("nextStep1");
    const prevStep2 = document.getElementById("prevStep2");
    const form = document.getElementById("registrationForm");
    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");
    const loadingScreen = document.getElementById("loadingScreen");
    const main = document.getElementById("main");
    const img = document.getElementById("img");
    const container = document.getElementById("container");

    const correctAnswers = {
        quiz1: "D",
        quiz2: "D",
        quiz3: "A",
        quiz4: "D",
        quiz5: "A",
        quiz6: "C",
        quiz7: "C",
        quiz8: "B",
        quiz9: "G",
        quiz10: "D"
    };

    nextStep1.addEventListener("click", function () {
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const availability = document.getElementById("availability").value;
        const location = document.getElementById("location").value;
        const role = document.getElementById("role").value;

        if (!firstName || !lastName || !email || !availability || !location || !role) {
            errorMessage.innerText = "Please fill out all fields in step 1.";
            errorMessage.style.display = "block";
            return;
        } else {
            errorMessage.style.display = "none";
        }

        step1.classList.remove("active");
        step2.classList.add("active");
    });

    prevStep2.addEventListener("click", function () {
        step2.classList.remove("active");
        step1.classList.add("active");
    });

    const options = document.querySelectorAll(".option");
    options.forEach(option => {
        option.addEventListener("click", function () {
            const question = this.getAttribute("data-question");
            const value = this.getAttribute("data-value");

            document.querySelectorAll(`.option[data-question="${question}"]`).forEach(opt => {
                opt.classList.remove("selected");
            });

            this.classList.add("selected");

            let hiddenInput = document.querySelector(`input[name="${question}"]`);
            if (!hiddenInput) {
                hiddenInput = document.createElement("input");
                hiddenInput.type = "hidden";
                hiddenInput.name = question;
                form.appendChild(hiddenInput);
            }
            hiddenInput.value = value;
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        loadingScreen.style.display = "flex";

        if (!form.checkValidity()) {
            errorMessage.innerText = "Please fill out all required fields.";
            errorMessage.style.display = "block";
            loadingScreen.style.display = "none";
            return;
        }

        const fileUpload = document.getElementById("fileUpload").files[0];
        if (!fileUpload) {
            errorMessage.innerText = "Please upload a file.";
            errorMessage.style.display = "block";
            loadingScreen.style.display = "none";
            return;
        }

        const formValues = new FormData(form);
        let score = 0;
        for (const [question, answer] of Object.entries(correctAnswers)) {
            if (formValues.get(question) === answer) {
                score++;
            }
        }

        const upload = new tus.Upload(fileUpload, {
            endpoint: "https://tusd.tusdemo.net/files/",
            metadata: {
                filename: fileUpload.name,
                filetype: fileUpload.type
            },
            onError: function (error) {
                console.error("Error:", error);
                errorMessage.innerText = "There was an error uploading the file. Please try again later.";
                errorMessage.style.display = "block";
                loadingScreen.style.display = "none";
            },
            onSuccess: async function () {
                const fileURL = upload.url;
                const timestamp = new Date().toISOString();

                const dataToSend = {
                    firstName: formValues.get("firstName"),
                    lastName: formValues.get("lastName"),
                    email: formValues.get("email"),
                    availability: formValues.get("availability"),
                    location: formValues.get("location"),
                    role: formValues.get("role"),
                    score: score,
                    fileURL: fileURL,
                    timestamp: timestamp
                };

                try {
                    await fetch("https://sheetdb.io/api/v1/5d4sgd82liy40", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(dataToSend)
                    });

                    const templateParams = {
                        email: formValues.get("email"),
                        first_name: formValues.get("firstName"),
                        last_name: formValues.get("lastName"),
                        availability: formValues.get("availability"),
                        location: formValues.get("location"),
                        role: formValues.get("role"),
                        score: score,
                        fileURL: fileURL,
                        applicationDate: new Date().toLocaleDateString()
                    };

                    await emailjs.send('service_cmsntb7', 'template_xqhzcza', templateParams);

                    form.reset();
                    step1.classList.remove("active");
                    step2.classList.remove("active");
                    main.style.display = 'flex';
                    img.style.display = 'none';
                    container.style.display = 'none';
                    successMessage.innerHTML = `
                        <h1>Application Details:</h1>
                        <p>You have successfully completed the job application. Thank you.</p>
                        <p>Date applied: ${new Date().toLocaleDateString()}</p>
                    `;
                    successMessage.style.display = "block";
                } catch (error) {
                    console.error("Error:", error);
                    errorMessage.innerText = "There was an error submitting the form. Please try again later.";
                    errorMessage.style.display = "block";
                } finally {
                    loadingScreen.style.display = "none";
                }
            }
        });

        upload.start();
    });
});