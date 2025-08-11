document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signinForm');
    const otpSection = document.getElementById('otp-section');
    let userEmail = '';
    let userPassword = '';

    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        userEmail = email;
        userPassword = password;

        if (!validateEmail(email) || !password) {
            alert('Enter valid email and password.');
            return;
        }
        // Send request to server to email OTP
        fetch('/api/auth/signin-request-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        }).then(res => res.json())
          .then(data => {
            if (data.success) {
                signinForm.style.display = 'none';
                otpSection.style.display = 'block';
                alert('OTP sent to your email.');
            } else {
                alert(data.msg || 'Sign in failed.');
            }
        });
    });

    document.getElementById('verify-otp-btn').addEventListener('click', () => {
        const otp = document.getElementById('signin-otp').value;
        fetch('/api/auth/signin-verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, password: userPassword, otp })
        }).then(res => res.json())
          .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                alert('Login successful!');
                // window.location.href = '/dashboard'; // Uncomment to redirect
            } else {
                alert(data.msg || 'OTP Verification failed.');
            }
        });
    });

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Forgot Password
    document.getElementById('forgot-password-link').addEventListener('click', (e) => {
        e.preventDefault();
        const email = prompt('Enter your registered email:');
        if (validateEmail(email)) {
            fetch('/api/auth/request-reset-otp', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            }).then(res => res.json())
              .then(data => { alert(data.msg); });
        } else {
            alert('Enter a valid email.');
        }
    });
});
