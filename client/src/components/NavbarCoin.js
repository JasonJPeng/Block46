// Navbar for coin app
import React from "react";

function NavbarCoin({ children }) {
    return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        { children }
    </nav>);
}

export default NavbarCoin;