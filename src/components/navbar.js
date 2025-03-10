// Filename - "./components/Navbar.js
 
import React from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";
 
const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <NavLink to="/" activestyle="true">
                        Home
                    </NavLink>
                    <NavLink to="/round_begin" activestyle="true">
                        Round Begin
                    </NavLink>
                    <NavLink to="/round_started" activestyle="true">
                        Round Started   
                    </NavLink>
                    <NavLink to="/round_finish" activestyle="true">
                        Round Finish
                    </NavLink>
                    <NavLink to="/sign-up" activestyl="true">
                        Sign Up
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};
 
export default Navbar;