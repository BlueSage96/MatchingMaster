import { NavLink } from 'react-router-dom';
import NavStyle from '../css/modules/NavBar.module.css';
import Gear from '../assets/settings.png';
import Home from '../assets/home.png';
import Info from '../assets/instructions.png';

function NavBar() {
  return (
    <nav className={NavStyle.navBar}>
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          isActive ? `${NavStyle.navItem} ${NavStyle.activeLink}` : NavStyle.navItem
        }
      >
        <img className={NavStyle.Settings} src={Gear} alt="Settings" />
        <span className={NavStyle.SetText}>Settings</span>
      </NavLink>

      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? `${NavStyle.navItem} ${NavStyle.activeLink}` : NavStyle.navItem
        }
      >
        <img className={NavStyle.Home} src={Home} alt="Home" />
        <span className={NavStyle.HomeText}>Home</span>
      </NavLink>

      <NavLink
        to="/information"
        className={({ isActive }) =>
          isActive ? `${NavStyle.navItem} ${NavStyle.activeLink}` : NavStyle.navItem
        }
      >
        <img className={NavStyle.Info} src={Info} alt="Info" />
        <span className={NavStyle.InfoText}>Information</span>
      </NavLink>
    </nav>
  );
}

export default NavBar;
