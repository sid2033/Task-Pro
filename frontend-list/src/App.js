import React, {useState} from 'react'
import './App.css';
import { useHistory, withRouter, Redirect } from "react-router-dom";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

function App() {

  let history = useHistory();

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");


  async function loginNext() {
    const response = await fetch (`http://localhost:5000/verify`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',  
            },
            body: JSON.stringify({
                username: loginUser,
                password: loginPass
            })
    });
    let result = await response.json();
    if (result.success === 0) {
      alert("Incorrect Username or Password");
      setLoginUser("");
      setLoginPass("");
    }
    else {
      let id = result.info[0].user_id;
      localStorage.setItem("authed", true);
      localStorage.setItem("userID", id);
      setLoginUser("");
      setLoginPass("");
      history.push("/Taskpage");
    }
  }

  const editUsername = e => {
    setUsername(e.target.value);
  }

  const editPassword = e => {
    setPassword(e.target.value);
  }

  const editUser = e => {
    setLoginUser(e.target.value);
  }

  const editPass = e => {
    setLoginPass(e.target.value);
  }

  async function validateCrendentials() {
    setOpen(false);
    setUsername("");
    setPassword("");
    if (username.length < 6 || password.length < 6) {
      alert("Username or Password is too short");
      return;
    }
    const response = await fetch (`http://localhost:5000/validate`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',  
            },
            body: JSON.stringify({
                username: username
            })
    });
    let result = await response.json();
    if (result >= 1) {
      alert("This Username has already been taken")
    }
    else {
      const response = await fetch (`http://localhost:5000/signup`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',  
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
      });
      alert("You have created an account successfully");
    }
  }

  return (
    <div className="App">
        <div id = "signup-modal">
          <Modal
            closeIcon
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            >
            <Header icon="address book" content="Register" />
            <Modal.Content>
                <h1>Create a Username and Password</h1>
                <h2>Both must be at least 6 characters long</h2>
                <h3>Username</h3>
                <input type="text" placeholder="New Username" value = {username} onChange = {editUsername}></input>
                <h3>Password</h3>
                <input type="password" placeholder="New Password" value = {password} onChange = {editPassword}></input>
            </Modal.Content>
            <Modal.Actions>
                <Button color="green" onClick = {validateCrendentials}>
                <Icon name="check"/> Register
                </Button>
            </Modal.Actions>
          </Modal>
        </div>
        <h1 className = "main-heading">Task Pro</h1>
        <h3 className = "second-heading'">An Easy Way To Manage Your Tasks</h3>
        <input type = "text" placeholder = "Username" className = "login-boxes" value = {loginUser} onChange = {editUser}></input>
        <input type = "password" placeholder = "Password" className = "login-boxes" value = {loginPass} onChange = {editPass}></input>
        <button className = "main-login" onClick = {loginNext}>Login</button>
        <button className = "signup" onClick = {() => setOpen(true)}>Register</button>
    </div>
  );
}

export default App;
