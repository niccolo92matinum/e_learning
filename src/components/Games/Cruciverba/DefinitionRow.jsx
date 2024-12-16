import styles from "./DefinitionRow.module.scss";
import CrossWordInput from "./CrossWordInput";
import DEFINITION_STATE from "./DEFINITION_STATE";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from "../../Button/Button";
import TextButton from "../../TextButton/TextButton";
import React, {useEffect, useState} from "react";
import FeedbackRow from "../FeedbackRow";
const DefinitionRow = (props)=>{

    const [filledWord, setFilledWord] = useState(false);
    const [isWordConfirmed, setIsWordConfirmed] = useState(false);
    const [feedbackVisible, setFeedbackVisible] = useState(false);

    let labelStateClass = "";
    let iconLabel = null;

    /*switch (props.state){
        case DEFINITION_STATE.COMPLETED:
            labelStateClass = styles.confirmed;
            iconLabel = <FontAwesomeIcon icon={faCheck}/>;
            break;
        case DEFINITION_STATE.KO:
            labelStateClass = styles.ko;
            iconLabel = <FontAwesomeIcon icon={faTimes}/>;
            break;
        /!*case DEFINITION_STATE.INCOMPLETE:
            labelStateClass = styles.ko;
            iconLabel = <FontAwesomeIcon icon={faTimes}/>;
            break;*!/
        default:
            labelStateClass = "";
    }*/
    const backToDefinitionsHandler = ()=>{
        props.onBackToDefinitions();
    }

    const tryAgainHandler = ()=>{
        setIsWordConfirmed(false);
    }

    const isFilledCorrect = ()=>{
        if (!filledWord){
            return false;
        }
        return filledWord.toLowerCase() === props.definition?.risposta?.toLowerCase();
    }
    if (props.definition?.completed || (isWordConfirmed && isFilledCorrect())){
        labelStateClass = styles.confirmed;
        iconLabel = <FontAwesomeIcon icon={faCheck}/>;
    }else if(isWordConfirmed && !isFilledCorrect()){
        labelStateClass = styles.ko;
        iconLabel = <FontAwesomeIcon icon={faTimes}/>;
    }

    useEffect(()=>{
        if (filledWord && isWordConfirmed){
            setFeedbackVisible(true);
            if (isFilledCorrect()){ // risposta corretta
                setTimeout(()=>{
                    props.onDetailViewCorrect();
                },1500)
            }
        }
    },[filledWord,isWordConfirmed])


    return (
        <div className={[styles.DefinitionRow, props.preview ? styles.preview : ''].join(' ')} onClick={props.onOpenDetail}>
            <div className={styles.orientationLabel}><span className={labelStateClass}>{props.definition?.index} {props.definition?.orizzontale ? "horizontal" : "vertical"} {iconLabel}</span></div>
            <div className={styles.definition}>
                <p>{props.definition?.text}</p>
                {props.preview && <img src="./assets/images/game/chevron-right.svg" alt=""/>}
            </div>

            <div className={styles.inputDefinition}>
                <CrossWordInput readOnly={props.preview} risposta={props.definition?.risposta} letters={props.definition?.filledLetters} onWordFilled={(word)=>setFilledWord(word)} confirmed={isWordConfirmed}/>
            </div>

            {!props.preview && <div className={styles.buttonsContainer}>
                {feedbackVisible && isWordConfirmed &&
                <>
                    {isFilledCorrect() ? <>
                        <FeedbackRow ok={true}>
                            Great! Right answer
                        </FeedbackRow>
                    </> : <>
                        <FeedbackRow ok={false}>
                            Wrong answer!
                        </FeedbackRow>
                        <Button onClick={tryAgainHandler}>TRY AGAIN</Button>
                    </>
                    }
                </>}
                {!isWordConfirmed && <Button disabled={!filledWord} fixedWidth onClick={()=>filledWord && setIsWordConfirmed(true)}>CONFIRM</Button>}
                {(!isWordConfirmed || !isFilledCorrect()) && <TextButton onClick={backToDefinitionsHandler}>back to definitions</TextButton>}
            </div>}
        </div>
    )
}
export default DefinitionRow;
