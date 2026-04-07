import { services } from "../services/OurServices";
import ServicesCard from "../components/ServiceCard";
import  styles from "../styles/ServicesPage.module.css";

const ServicesPage = () => {
    if (!services?.length){
        return <p className={styles.noServices}>No services available at the moment. Please check back later.</p>
    }

    return (
        <>
            <div className={styles.pageContainer}>
                {/** Page Header */}
                <div className={styles.heroSection}>
                    <h1 className={styles.mainTitle}>Our Services</h1>
                    <p className={styles.description}>Premium hair braiding services tailored to enhance your natural beauty. Every style is crafted with care and precision.</p>
                </div>

                {/** Search Section */}
                <div className={styles.searchContainer}>
                    <input 
                        type="text" 
                        placeholder="Search for a style..." 
                        className={styles.searchInput}
                    />
                    <button className={styles.searchButton}>Search</button>
                </div>

                {/** Services List */}
                <div className={styles.servicesList}>
                    {services.map((service) => (
                        <ServicesCard 
                            key={service.id}
                            hairstyle={service.hairstyle}
                            price={service.price}
                            duration={service.duration}
                            imageUrl={service.imageUrl}
                        />
                    ))}
                </div>
            </div>

        </>
    )
}

export default ServicesPage;
