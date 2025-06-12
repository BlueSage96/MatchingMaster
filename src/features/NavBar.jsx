import Gear from '../assets/settings.png';
import Info from '../assets/instructions.png';
import Home from '../assets/home.png';
import NavStyle from '../css/modules/NavBar.module.css';
import { NavLink } from 'react-router-dom';

function NavBar () {
    return (
        <>
            <nav className={NavStyle.navbar}>
                <NavLink to="/settings" className={({isActive}) => isActive ? 'active-link' : ''}>
                <img className={NavStyle.Settings} src={Gear} alt="Settings icon"/>
                <h3 className={NavStyle.SetText}>Settings</h3>
                </NavLink>
                {/* <NavLink to="/main" className="active-link">Home</NavLink>
                <NavLink to="/information" className={({isActive}) => isActive ? 'active-link' : ''}>Information</NavLink> */}
            </nav>
        </>
    )
}
export default NavBar;