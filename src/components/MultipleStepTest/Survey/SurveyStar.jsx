import styles from "./SurveyStar.module.scss";

const SurveyStar = () => {
    const stars = Array.from({ length: 4 });
    const filled = true;
    return (
        <div className={`Question ${styles.SurveyStar}`}>
            <h1>Questionario di gradimento</h1>
            <div className={styles.starsContainer}>
                {stars.map((star,i) => <div key={i} className={styles.star} style={{backgroundImage: `url(assets/images/exercises/star-${filled ? 'solid' : 'regular'}.svg)`}}></div>)}
            </div>
        </div>
    );
};

export default SurveyStar;
