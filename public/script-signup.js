document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const otpSection = document.getElementById('otp-section');

  // Variables to hold user data between steps
  let userName = '';
  let userEmail = '';
  let userPassword = '';

  // Basic email validation function
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // Submit signup form: send OTP
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    if (!name || !validateEmail(email) || !password) {
      alert('Please enter valid username, email, and password.');
      return;
    }

    userName = name;
    userEmail = email;
    userPassword = password;

    fetch('/api/auth/signup-request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Hide form, show OTP section
        signupForm.style.display = 'none';
        otpSection.style.display = 'block';
        alert('OTP has been sent to your email.');
      } else {
        alert(data.msg || 'Failed to send OTP. Try again.');
      }
    })
    .catch(err => {
      console.error('Error sending OTP:', err);
      alert('Error occurred. Please try again.');
    });
  });

  // Verify OTP button
  document.getElementById('verify-otp-btn').addEventListener('click', () => {
    const otp = document.getElementById('signup-otp').value.trim();

    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP.');
      return;
    }

    fetch('/api/auth/signup-verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userName, email: userEmail, password: userPassword, otp })
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        alert('Signup successful!');
        // Redirect to the dashboard or login page here:
        // window.location.href = '/dashboard.html';
      } else {
        alert(data.msg || 'OTP verification failed.');
      }
    })
   .catch(err => {
    console.error('Verification error:', err);
    alert('Error occurred: ' + err.message || 'Please try again.');
});

  });
});


