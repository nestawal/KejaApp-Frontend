import React from "react"
import { render } from 'react-dom';
import ARoutes from "./ARoutes";
import { createRoot } from 'react-dom/client';
import Signup from "./signUp";
import { BrowserRouter } from 'react-router-dom';

const root = createRoot(document.getElementById("root"));
root.render(<ARoutes/>);