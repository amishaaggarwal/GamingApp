import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateFireBase } from "utils/firebaseSetup/firebaseFunctions";
import { auth } from "utils/firebaseSetup/FirebaseSetup";
import {
  getSessionStorage,
  setSessionStorage,
} from "utils/Storage/SessionStorage";
import "./Login.scss";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState({});
  const [isLoginPage, setIsLoginPage] = useState(true);
  const navigate = useNavigate();
  const myUser = JSON.parse(getSessionStorage("user"));
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);

      updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: "https://example.com/jane-q-user/profile.jpg",
      });
      updateFireBase("UserList", email, "name", username);
      updateFireBase("UserList", email, "email", email);
      updateFireBase(
        "UserList",
        email,
        "dp",
        "https://example.com/jane-q-user/profile.jpg"
      );
      updateFireBase("UserList", email, "scoreCredit", 0);

      toast.success(`Welcome to the game dashboard!`, {
        theme: "dark",
      });
      redirectTo();
    } catch (error) {
      let index = error.message.indexOf("/");
      toast.error(error.message.slice(index + 1, -2), {
        theme: "dark",
      });
    }
  };

  const redirectTo = () => {
    navigate("/dashboard");
  };
  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      toast.success(`Logged-in Success!`, {
        theme: "dark",
      });
      console.log(user);
      redirectTo();
    } catch (error) {
      let index = error.message.indexOf("/");
      toast.error(error.message.slice(index + 1, -2), {
        theme: "dark",
        position: "top-center",
      });
    }
  };

  // const logout = async () => {
  //   await signOut(auth);
  //   toast.warn("you logged out to game dashboard", {
  //     theme: "dark",
  //     position: "bottom-center",
  //   });
  // };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const Gprovider = new GoogleAuthProvider();

  const signInWithGoggle = () => {
    signInWithPopup(auth, Gprovider)
      .then((result) => {
        setSessionStorage(
          "user",
          JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
          })
        );
        updateFireBase(
          "UserList",
          result.user.email,
          "name",
          result.user.displayName
        );
        updateFireBase(
          "UserList",
          result.user.email,
          "email",
          result.user.email
        );
        updateFireBase(
          "UserList",
          result.user.email,
          "dp",
          result.user.photoURL
        );
        updateFireBase("UserList", result.user.email, "scoreCredit", 0);

        toast.success(`loggedin success`, {
          theme: "dark",
        });
        redirectTo();
      })
      .catch((error) => {
        toast.error(error.message, {
          theme: "dark",
          position: "top-center",
        });
      });
  };

  const FBprovider = new FacebookAuthProvider();

  const signInWithFaceBook = () => {
    signInWithPopup(auth, FBprovider)
      .then((result) => {
        // const user = result.user;
        // const credential = FacebookAuthProvider.credentialFromResult(result);
        // const accessToken = credential.accessToken;
        redirectTo();
      })
      .catch((error) => {
        toast.error(`${error.code}:${error.message}`, {
          theme: "dark",
          position: "top-center",
        });
      });
  };

  return !myUser ? (
    <div className="container">
      <div className="login">
        <h2 className="login-text">
          {isLoginPage ? "Login" : "Sign up"} to Game Dashboard
        </h2>
        <form onSubmit={handleSubmit}>
          <Stack
            spacing={29}
            direction="row"
            className="login-contain"
            justifyContent="center"
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Box>
              <Stack spacing={3}>
                {!isLoginPage && (
                  <>
                    <label className="input-label">Username</label>
                    <TextField
                      id="standard-basic"
                      className="input-text"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </>
                )}
                <label className="input-label">Email</label>
                <TextField
                  id="standard-basic"
                  className="input-text"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label className="input-label">Password</label>
                <TextField
                  id="standard-basic"
                  className="input-text"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="contained"
                  type="submit"
                  className="login-btn"
                  onClick={() => (isLoginPage ? login() : register())}
                >
                  {isLoginPage ? "Login" : "Sign in"}
                </Button>
              </Stack>
            </Box>
            <Box className="provider-block">
              <Stack spacing={5}>
                <Button
                  variant="outlined"
                  className="provider-btn"
                  onClick={() => signInWithGoggle()}
                >
                  <GoogleIcon className="provider-icons" />
                  Continue with Google
                </Button>
                <Button
                  variant="outlined"
                  className="provider-btn"
                  onClick={() => signInWithFaceBook()}
                >
                  <FacebookIcon className="provider-icons" />
                  Continue with Facebook
                </Button>
              </Stack>
            </Box>
          </Stack>
        </form>
        {isLoginPage ? (
          <p className="bottom-text">
            Not in game-dev app?
            <span className="bottom-link" onClick={() => setIsLoginPage(false)}>
              Sign up
            </span>
          </p>
        ) : (
          <p className="bottom-text">
            already have an account?
            <span className="bottom-link" onClick={() => setIsLoginPage(true)}>
              Login
            </span>
          </p>
        )}
      </div>
    </div>
  ) : (
    <Navigate to="/dashboard" />
  );
}
