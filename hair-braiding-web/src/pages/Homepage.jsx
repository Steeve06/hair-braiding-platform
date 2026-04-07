import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Homepage.module.css";

const Homepage = () => {
    return (
        <div className={styles.homepage}>

            {/** Status Banner */}
            <div className={styles.status}>
                <button className={styles.statusButton}>Now Accepting Bookings</button>
            </div>

            {/** Hero section */}
            <div className={styles.heroSection}>
                <h1 className={styles.mainTitle}>Welcome to Styled by <span className={styles.highlight}>Miah</span></h1>
                <span className={styles.subTitle}>Luxury Hair Braiding & Protective Styling.</span>
                <p className={styles.description}>Elevating beauty through artistry, precision, and care. Experience the difference of premium hair braiding services</p>
            </div>

            {/** CTA Section */}
            <div className={styles.CTA}>
                <button className={styles.primaryBtn}>
                    <Link to="/booking" className={styles.link}>Book Appointment</Link>
                </button>
                <button className={styles.secondaryBtn}>
                    <Link to="/services" className={styles.link}>View Services</Link>
                </button>
            </div>

        </div>
    );
};

export default Homepage;
       