import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "./login.css";

export default function Login({ setShowLogin, setCurrentUsername,myStorage }) {
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };
    //console.log(user)
    try {
      const res = await axios.post("/users/login", user);
      //console.log(res)
      setCurrentUsername(res.data.username);
      localStorage.setItem('user', res.data.username);
      setShowLogin(false)
    } catch (err) {
      console.log(err.message)
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <Room className="logoIcon" />
        <span>PinMyLocation</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" ref={usernameRef} />
        <input
          type="password"
          placeholder="password"
          ref={passwordRef}
        />
        <h6>User Credentials : Username - admin, Password - admin</h6>
        <button className="loginBtn" type="submit">
          Login
        </button>
        {error && <span className="failure">Invalid Credentials</span>}
      </form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}