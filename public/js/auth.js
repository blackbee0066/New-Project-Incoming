document.addEventListener('DOMContentLoaded', () => {

    // Auto-fill username + initial when user is logged in
    const savedName = localStorage.getItem("fullname");

    if (savedName) {

        const usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay) {
            usernameDisplay.textContent = savedName;
        }

        //Inserting first initial into profile circle
        const profileInitial = document.getElementById('profileInitial');
        if (profileInitial) {
            profileInitial.textContent = savedName.charAt(0).toUpperCase();
        }
    }

    //if register button is clicked
    const registerBtn = document.querySelector('.register-btn');

    if (registerBtn) {
        registerBtn.addEventListener('click', async (e) => {
            e.preventDefault();
           
            const fullname = document.getElementById('fullName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fullname, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Registered successfully! Redirecting...");
                    window.location.href = "/login";
                } else {
                    alert(data.message);
                }

            } catch (err) {
                console.error(err);
                alert("Something went wrong.");
            }
        });
    }


    //If the login button is clicked

    const loginBtn = document.querySelector('.signin-btn');

    console.log("loginBtn found:", loginBtn);

    if(loginBtn) {
        loginBtn.addEventListener('click', async(e) => {
            e.preventDefault();

           // console.log("Login button CLICKED!");
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('/login', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email, password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem("fullname", data.user.fullname);

                    window.location.href = "/mini_splitter";

                } else {
                    console.log("login erroe:", data.message);
                    alert(data.message);
                }
            } catch(error) {
                console.error("Login error:", error);
            }
        });
    }

    //Logout functionality
    const logout = document.querySelector('#logoutBtn');

    console.log("Logout button clicked!");

    if (logout) {
        logout.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            try{
                const res = await fetch('/logout', {
                    method: 'POST',
                   credentials: 'include',
                });

                const data = await res.json();
                console.log(data.message);

                if(data.message === "Logged out successfully") {
                    window.location.href = '/Home.html';
                }
            }catch(err) {
                console.error('Logout error:', err);
            }
        });
    }
    
});
