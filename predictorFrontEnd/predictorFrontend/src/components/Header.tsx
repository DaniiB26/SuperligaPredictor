import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import QuoteBand from './QuoteBand';

const Header: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <header className="header-container" ref={dropdownRef}>
                <div className="header-logo">
                    <Link to="/home">
                        <img src="/Logo.png" alt="Logo" />
                    </Link>
                </div>
                <div className="header-quote">
                    PREDICTOR
                </div>
                <nav className="header-menu">
                    <button className="menu-icon" onClick={toggleDropdown} aria-label="Toggle menu">
                        ☰
                    </button>
                    <ul className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
                        <li><Link to="/home" onClick={closeDropdown}>Home</Link></li>
                        <li><Link to="/matches" onClick={closeDropdown}>Results</Link></li>
                        <li><Link to="/mypredictions" onClick={closeDropdown}>Predictions</Link></li>
                        <li><Link to="/standings" onClick={closeDropdown}>Standings</Link></li>
                        <li><Link to="/leaderboard" onClick={closeDropdown}>Leaderboard</Link></li>
                    </ul>
                </nav>
            </header>
            <QuoteBand />
        </>
    );
};

export default Header;
