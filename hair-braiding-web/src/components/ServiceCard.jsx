import React from 'react';
import styles from '../styles/ServiceCard.module.css';
import { Clock } from 'lucide-react'; // Optional: for tiny luxury icons

const ServiceCard = ({ hairstyle, price, duration, imageUrl }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={imageUrl} alt={hairstyle} className={styles.image} />
      </div>

      <div className={styles.detailsContainer}>
        {/* Left: Price */}
        <span className={styles.price}>
           ${price}
        </span>

        {/* Center: Hairstyle */}
        <h3 className={styles.title}>{hairstyle}</h3>

        {/* Right: Duration */}
        <span className={styles.duration}>
          <Clock size={16} />
          {duration}
        </span>
      </div>
      
      <button className={styles.bookBtn}>Select Style</button>
    </div>
  );
};

export default ServiceCard;