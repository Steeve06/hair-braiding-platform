import React from 'react';
import { FaInstagram, FaTiktok, FaFacebook, FaLinkedin} from 'react-icons/fa';
import styles from '../styles/Footer.module.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>

                {/* 1. Social Icons */}
                <div className={styles.socials}>
                    <a href="https://github.com/Steeve06" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <FaInstagram />
                    </a>
                    <a href="https://www.tiktok.com/@yourusername" target="_blank" rel="noopener noreferrer" aria-label="Tiktok">
                        <FaTiktok />
                    </a>
                    <a href="mailto:info@yourcompany.com" aria-label="Facebook">
                        <FaFacebook />
                    </a>
                </div>

                {/* 2. Divider line */}
                <hr className={styles.divider} />

                {/* 3. Bottom Row: Copyright and Legal */}
                <div className={styles.bottomRow}>
                    <p className={styles.copyright}>
                        &copy; {currentYear} Designed and Developed by <a href="https://www.linkedin.com/in/steeve-mocto-024429268/" target="_blank" 
                        rel="noopener noreferrer" aria-label="Linkedin">
                        <FaLinkedin />
                    </a> . All rights reserved.
                    </p>
                    <div className={styles.legalLinks}>
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/terms">Terms of Service</a>
                        <a href="/cookies">Cookie Policy</a>
                        <a href="/cookies">Stylist Login</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
