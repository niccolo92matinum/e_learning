import styles from './ExerciseBgContainer.module.scss';

const ExerciseBgContainer = ({children}) => {
    return (
        <div className={styles.ExerciesBgContainer} style={{backgroundImage: `url(assets/images/exercises/background-exercise.jpg)`}}>
            {children}
        </div>
    );
};

export default ExerciseBgContainer;
