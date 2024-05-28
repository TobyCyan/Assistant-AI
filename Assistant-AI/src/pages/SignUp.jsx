import React, {useState} from 'react'
import NavBar from "../components/NavBar/NavBar.jsx";


function SignUp() {
    // Used to check whether the passwords match.
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // userData state will be used to send user info to the back-end.
    const [userData, setUserData] = useState({
        username: '',
        password: ''
    })

    // Checks whether the passwords match.
    function handleConfirmPassword() {
        return confirmPassword === userData.password;
    }
    
    // Update userData with the new username.
    const handleNameChange = (newName) => {
        return setUserData((prevState) => {
              return { ...prevState, username: newName };
            });
      };

      // Update userData with the new password.
      const handlePasswordChange = (newPW) => {
        return setUserData((prevState) => {
              return { ...prevState, password: newPW };
            });
      };  
    
      function handleSignUp() {
        if (userData.username != '') {
            
        
        } else {
            console.log('Username cannot be empty!');
        }
    }
    // TODO
    // Sends userData to the back-end to insert into database.
    function handleSignUp(e) {
        e.preventDefault();
        if (handleConfirmPassword()) {
            if (userData.username != '') {
                var hashedPW = CryptoJS.SHA512(password).toString();
                
            } else {
                console.log('Username must not be empty!');
            }
        } else {
            console.log('Passwords do not match!');
        }
    }

    return (
        <>
        <div>
            <NavBar/>
            <h1>Sign Up</h1>
            <div>
                <form onSubmit={handleSignUp}>
                    <div>
                    <label>Enter Your Name:
                        <input type='text' 
                        value={userData.username}
                        onChange={(e) => handleNameChange(e.target.value)}/>
                    </label>
                    </div>
                    <div>
                    <label>Enter Your Password:
                        <input type='password' 
                        value={userData.password} 
                        onChange={(e) => handlePasswordChange(e.target.value)}/>
                    </label>
                    </div>
                    <div>
                    <label>Confirm Password:
                        <input type='password' 
                        value={confirmPassword} 
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            }}/>
                    </label>  
                    </div>
                    <button type='submit'>
                    Submit
                    </button> 
                </form>
            </div>      
        </div>
        </>
    );
}

export default SignUp;