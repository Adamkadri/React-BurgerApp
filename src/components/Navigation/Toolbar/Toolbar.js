import React from "react";
import classes from "./Toolbar.module.css";
import Logo from "../../Logo/Logo.js";
import NavigationItems from "../NavigationItems/NavigationItems";
import Button from "../../UI/Button/Button";

const toolbar = props => {
  return (
    <header className={classes.Toolbar}>
      <div className={classes.MobileOnly}>
        <Button clicked={props.btnClicked}>MENU</Button>
      </div>
      <div className={classes.Logo}>
        <Logo></Logo>
      </div>
      <nav className={classes.DesktopOnly}>
        <NavigationItems></NavigationItems>
      </nav>
    </header>
  );
};

export default toolbar;
