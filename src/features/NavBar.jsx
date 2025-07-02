import { NavLink } from 'react-router-dom';
import NavStyle from '../css/modules/NavBar.module.css';
import Gear from '../assets/settings.png';
import Info from '../assets/instructions.png';
import Home from '../assets/home.png';
import ButtonSound from '../context/ButtonSound';

function NavBar() {
  return (
    <>
      <div className={NavStyle.NavBar}>
        <NavLink
          to="/settings"
          className={({ isActive }) => `${NavStyle.NavItem} ${isActive ? NavStyle.activeLink : ''}`}
        >
          <ButtonSound invisible className={NavStyle.ButtonClickSet}>
            <img className={NavStyle.Settings} src={Gear} alt="Settings" />
            <span className={NavStyle.SetText}>Settings</span>
          </ButtonSound>
        </NavLink>

        <NavLink to="/" className={({ isActive }) => `${NavStyle.NavItem} ${isActive ? NavStyle.activeLink : ''}`}>
          <ButtonSound invisible className={NavStyle.ButtonClickHome}>
            <img className={NavStyle.Home} src={Home} alt="Home" />
            <span className={NavStyle.HomeText}>Home</span>
          </ButtonSound>
        </NavLink>

        <NavLink
          to="/instructions"
          className={({ isActive }) => `${NavStyle.NavItem} ${isActive ? NavStyle.activeLink : ''}`}
        >
          <ButtonSound invisible className={NavStyle.ButtonClickInfo}>
            <img className={NavStyle.Info} src={Info} alt="Info" />
            <span className={NavStyle.InfoText}>Instructions</span>
          </ButtonSound>
        </NavLink>
      </div>
    </>
  );
}

export default NavBar;
