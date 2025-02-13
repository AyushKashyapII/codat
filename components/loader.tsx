"use client"
import styles from './loader.module.css';

const Loader = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.loaderContainer}>
        {/* Outer spinning ring */}
        <div className={styles.spinningRing}></div>

        {/* Inner pulsing circle */}
        <div className={styles.pulsingCircleContainer}>
          <div className={styles.pulsingCircle}></div>
        </div>

        {/* Orbiting dots */}
        <div className={styles.orbitingDotContainer}>
          <div className={styles.orbitingDot}></div>
        </div>
        <div className={styles.orbitingDotContainerReverse}>
          <div className={styles.orbitingDot}></div>
        </div>

        {/* Loading text */}
        <div className={styles.loadingText}>
          Loading...
        </div>
      </div>

      {/* Background particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={styles.particle}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

export default Loader;
