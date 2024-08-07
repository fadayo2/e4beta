document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
      Name: document.getElementById('name').value,
      Email: document.getElementById('email').value,
      Message: document.getElementById('message').value
    };

    // Send data to SheetDB
    fetch('https://sheetdb.io/api/v1/zwcvfz71s4l4i', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('SheetDB Response:', data);

      Swal.fire({
        icon: "success",
        title: "Thank you for reaching out",
        showConfirmButton: false,
        timer: 3500
      });
      
      // Send confirmation email to user
      return emailjs.send('service_22stnrc', 'template_fk56lrl', {
        user_name: formData.Name,
        user_email: formData.Email,
        message: formData.Message
      }); 
    })
    .then(function(response) {
      console.log('EmailJS Response (User):', response.status, response.text);
      
      // Send email to yourself
      return emailjs.send('service_22stnrc', 'template_3htp74v', {
        user_name: formData.Name,
        user_email: formData.Email,
        message: formData.Message,
        to_email: 'fadunmiyemarvellous@gmail.com'
      });
    })
    .then(function(response) {
      console.log('EmailJS Response (Self):', response.status, response.text);
    }, function(error) {
      console.error('EmailJS Error:', error);
    })
    .catch(error => {
      console.error('Error:', error);
      Swal.fire({
        icon: "error",
        title: "An error occured when trying to send the message",
        showConfirmButton: false,
        timer: 1500
      });
    });
  });