import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

};

export default ThemeToggleButton;
