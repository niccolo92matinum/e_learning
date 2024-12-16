import styles from './Dropdown.module.scss';
import {useEffect, useState} from "react";
import {isNil} from "ramda";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
const Dropdown = (props)=>{
    const [dropdownActive, setDropdownActive] = useState(false);
    const toggleDropdown = ()=>{
        isNil(props.correct) && setDropdownActive(prevState=> !prevState);
    }

    useEffect(()=>{
        setDropdownActive(props.active);
    },[props.active])

    const handleOptionClick = (i)=>{
        /*if (i < 0){
            setSelectedOption('Tutto');
            props.onOptionSelected('');
        }else{
            setSelectedOption(props.options[i]);
            props.onOptionSelected(props.options[i]);
        }*/
        props.onOptionSelected(props.dropdownIndex, i);
        setDropdownActive(false);
    }

    const selectedOption = props.answeredIndex[props.dropdownIndex] ?? -1;

    return <div className={styles.Dropdown}>
        <div className={styles.optionsContainer}>
            <div className={`${styles.selected} ${dropdownActive ? styles.active : ''}`} onClick={toggleDropdown}>
                {(!isNil(selectedOption) && (selectedOption>=0)) ? props.options[selectedOption].text : props.defaultValue}
                {(props.correct === true) && <FontAwesomeIcon icon={faCheck} className={`${styles.feedbackIcon} ${styles.correct}`}/>}
                {(props.correct === false) && <FontAwesomeIcon icon={faTimes} className={`${styles.feedbackIcon} ${styles.incorrect}`}/>}
            </div>
            <div className={`${styles.optionsBox} ${dropdownActive ? styles.active : ''}`}>
                {props.options?.map((option,i) => {
                    return (
                        <div key={`opt_${i}`} className={`${styles.option} ${(option.text === (props.options && props.options[selectedOption]?.text)) ? styles.active : ''} ${props.mutuallyExclusive && !isNil(props.answeredIndex[i]) ? styles.disabled : ''}`} onClick={()=>handleOptionClick(i)}>
                            <input type="radio" className={styles.radio} name="tipologia" id={`opt_${i}`} value={option.text} defaultChecked={option.text === selectedOption}/>
                            <label htmlFor={`opt_${i}`}>{option.text}</label>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
}
export default Dropdown;
