import React from "react";
import AccountCreate from "./components/AccountCreate";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="light"
        transition={Bounce}
      />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <AccountCreate />
      </div>
    </>
  );
};

export default App;
