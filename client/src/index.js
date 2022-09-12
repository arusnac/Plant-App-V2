import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Account } from "./components/Account";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/Store";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import PlantPage from "./components/PlantPage";
import About from "./components/About";
import UserAccount from "./components/UserAccount";
import PrivateRoute from "./PrivateRoute/index";
import UserHome from "./components/UserHome";
import PlantBySpace from "./pages/PlantBySpace";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <Provider store={store}>
        <Account>
          <Routes>
            <Route
              path="plants/:option"
              element={
                <PrivateRoute>
                  <App />
                </PrivateRoute>
              }
            />
            <Route
              path="/plants"
              element={
                <PrivateRoute>
                  <App />
                </PrivateRoute>
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="space/:space" element={<PlantBySpace />} />
            <Route path="SignUp" element={<SignUp />} />
            <Route
              path="plantpage/:plantId"
              element={
                <PrivateRoute>
                  <PlantPage />
                </PrivateRoute>
              }
            />
            <Route path="about" element={<About />} />
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <UserAccount />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <UserHome />
                </PrivateRoute>
              }
            />
          </Routes>
        </Account>
      </Provider>
    </React.StrictMode>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
