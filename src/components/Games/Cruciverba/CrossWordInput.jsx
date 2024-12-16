import styles from "./CrossWordInput.module.scss";
import {useEffect, useRef, useState} from "react";
const CrossWordInput = (props)=>{
    const cells = [...Array(props.risposta.length)];
    const [letters, setLetters] = useState(props.letters || []);
    const [confirmedLetters, setConfirmedLetters] = useState(props.letters || []);

    const inputContainerRef = useRef(null);

    const valueChangedHandler = (e,i)=>{
        // se la cella non è vuota, o è già confermata, passo alla prossima
        if (confirmedLetters[i]){
            e.target.nextElementSibling?.focus();
        }else{
            setLetters(letters => {
                let updatedLetters = [...letters];
                updatedLetters[i] = e.target.value;
                return updatedLetters;
            })
            if (e.target.value){
                e.target.nextElementSibling?.focus()
            }
        }



        /*setLetters(Array.from(e.target.value));*/
    }

    // al mount del componente sposto il focus nella prima cella da compilare
    useEffect(()=>{
        inputContainerRef.current?.getElementsByTagName("input")[0].focus();
        props.filledLetters && setLetters([...props.filledLetters])
    },[])

    useEffect(()=>{
        if (!props.readOnly && !props.confirmed){
            reset();
        }
    },[props.confirmed])

    useEffect(()=>{
        if (letters.length >= props.risposta.length){
            props.onWordFilled(letters.join(''));
        }
    },[letters])

    const reset = ()=>{
        setLetters([...confirmedLetters])
    }

    const onFocusHandler = (e,i)=>{
        if (confirmedLetters[i]){ // se la cella è già confermata passo alla prossima
            valueChangedHandler(e,i);
        }else{ // altrimenti autoselect del value
            e.target.value && e.target.select()
        }
    }

    return (
        <div className={styles.CrossWordInput} ref={inputContainerRef}>
            { cells.map((cell,i) => <input type={"text"}
                                           key={'ic_'+i}
                                       maxLength={1}
                                       size={1}
                                       spellCheck={false}
                                       className={[styles.CrossWordInput, (confirmedLetters[i] || props.readOnly) && letters[i]?.length ? styles.filled : ''].join(' ')}
                                        onFocus={(e)=>onFocusHandler(e,i)}
                                        value={letters[i]||""}
                                        disabled={props.readOnly || props.confirmed}
                                        onInput={(e)=>valueChangedHandler(e,i)}
            />)}
        </div>

    )
}
export default CrossWordInput;