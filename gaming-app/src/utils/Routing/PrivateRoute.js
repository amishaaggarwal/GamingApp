
import { Navigate } from "react-router-dom";
import { auth } from "utils/firebaseSetup/FirebaseSetup";
import { getSessionStorage } from "utils/Storage/SessionStorage";

function PrivateRoute({ children }) {
 

  const user = JSON.parse(getSessionStorage("user"));

  return user ? children : <Navigate to="/" />;
}

export default PrivateRoute;
