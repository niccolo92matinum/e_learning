import styles from "./Cruciverba.module.scss";
import React, {useContext, useEffect, useState} from "react";
import HeaderGeneric from "../../MultipleStepTest/HeaderGeneric/HeaderGeneric";
import CrossWordCell from "./CrossWordCell";
import DefinitionRow from "./DefinitionRow";
import CountdownTimerContext from "../../../sharedContext/countdownTimer-context";

import DEFINITION_STATE from "./DEFINITION_STATE";
import InstructionsStart from "../InstructionsStart/InstructionsStart";
import GameContainer from "../../Hoc/GameContainer/GameContainer";

import ScoreView from "../ScoreView/ScoreView";
import useSessionTimeTracker from "../../../utils/useSessionTimeTracker";
import { withScorm } from "../../../utils/react-scorm-provider";
import Button from "../../Button/Button";

const Cruciverba =(props)=>{

    const STEPS = {
        "NOT_STARTED": "NOT_STARTED",
        "STARTED": "STARTED",
        "COMPLETED": "COMPLETED",
        "SCORE_VIEW": "SCORE_VIEW"
    }

    const [stepGame, setStepGame] = useState(STEPS.NOT_STARTED);
    const [crosswordMatrix, setCrosswordMatrix] = useState([]);
    const [definitions, setDefinitions] = useState(props.propsComponent.definizioni);

    const {timer, setSessionTimerFn} = useSessionTimeTracker(props.sco);

    const [detailViewDefinitionIndex, setDetailViewDefinitionIndex] = useState(-1);

    const countdownTimerCtx = useContext(CountdownTimerContext);
    let clearIntervalFunction = null;

    const POINTS_PER_CORRECT = 10;

    const COUNTDONW_TIMER_QUESTION_SECONDS = 10*60;
    useEffect(()=>{
        if (stepGame === STEPS.STARTED){
            clearIntervalFunction = countdownTimerCtx.startTimer(COUNTDONW_TIMER_QUESTION_SECONDS);
        }
        if (stepGame === STEPS.SCORE_VIEW){
            setSessionTimerFn(); // track session time
        }

        return ()=>{
            clearIntervalFunction && clearIntervalFunction();
        }
    },[stepGame])

    const buildMatrix = () => {
        const matrix = [...Array(props.propsComponent.rows)];
        for (let y = 0; y < matrix.length; y++){
            matrix[y] = [...Array(props.propsComponent.cols)];
        }
        return matrix;
    }
    const fillMatrixColumn = (arr, colIndex, def)=>{
        for (let wIndex = 0; wIndex<def.risposta.length; wIndex++){
            const rowIndex = wIndex+def.y;
            if (!(arr[rowIndex][colIndex] && arr[rowIndex][colIndex].value)) { // se ho già una labelIndex (numerino accanto alla cella) non la sovrascrivo con null
                arr[rowIndex][colIndex] = {
                    fillable: true,
                    value: rowIndex === def.y ? def.index : null, // label solo nella prima cella della colonna
                    //letter: def.risposta[wIndex],
                    horizontal: false
                }
            }
        }
    }
    const fillMatrixRow = (arr, rowIndex, def) => {
        arr[rowIndex].splice(def.x,def.risposta.length, ...[ ...Array(def.risposta.length).keys() ].map( i => {
            return {
                fillable: true,
                value: i === 0 ? def.index : null, // label solo nella prima cella della riga
                //letter: def.risposta[i],
                horizontal: true
            }
        }))
    }

    const getIntersectedDefinitions = (definition)=>{
        const hasSameRowOrCol = (compiledDef, currentRowCol)=>{
            if (compiledDef.orizzontale){
                return (currentRowCol.x >= compiledDef.x) && (currentRowCol.x <= compiledDef.x+compiledDef.risposta.length) &&// escludo le definizioni che hanno colonne diverse da quella compilata
                    (compiledDef.y >= currentRowCol.y) && (compiledDef.y<=currentRowCol.risposta.length+currentRowCol.y)// prendo le definizioni la cui lunghezza arriva alla parola completata
            }else{
                return (currentRowCol.y >= compiledDef.y) && (currentRowCol.y <= compiledDef.y+compiledDef.risposta.length) &&// escludo le definizioni che hanno righe diverse da quella compilata
                    (compiledDef.x >= currentRowCol.x) && (compiledDef.x<=currentRowCol.risposta.length+currentRowCol.x)
            }
        }
        const filteredDefs = definitions.filter(def => {
            const isPerpendicular = (definition.orizzontale !== def.orizzontale) // escludo tutte le definizioni con lo stesso orientamento di quella compilata (non possono intersecarsi)
            return isPerpendicular &&
                hasSameRowOrCol(definition, def) // escludo le definizioni che hanno righe/colonne diverse da quella compilata
        })
        return filteredDefs;
    }

    const setFilledLetters = (definition)=>{
        setDefinitions(oldDefs => {
            let defs = [...oldDefs];
            let filteredDefs = getIntersectedDefinitions(definition); // prendo le definizioni che hanno una lettera in comune con la parola appena compilata
            for (const d of defs){
                if (d.index === definition.index){
                    d.filledLetters = definition.risposta.split('');
                    d.completed = (definition.risposta.length === d.filledLetters?.length);
                }
                for (const f of filteredDefs){
                    if (d.index === f.index) { // se trovo la definzione tra quelle che intersecano la parola
                        if (!(d.filledLetters && d.filledLetters.length)){
                            d.filledLetters = [...Array(d.risposta.length)];
                        }
                        let intersectionPosition = definition.orizzontale ? definition.y-d.y : definition.x-d.x
                        d.filledLetters[intersectionPosition] = d.risposta[intersectionPosition];
                    }
                }
            }
            return defs;
        })
    }
    const setWordCorrect = (def, index)=>{
        setCrosswordMatrix(oldMatrix => {
            let matrix = [...oldMatrix];
            if (def.orizzontale){
                matrix[def.y].splice(def.x,def.risposta.length, ...[ ...Array(def.risposta.length).keys() ].map( i => {
                    return {
                        fillable: true,
                        value: i === 0 ? def.index : null, // label solo nella prima cella della riga
                        letter: def.risposta[i],
                        horizontal: true
                    }
                }))
            }else{
                for (let wIndex = 0; wIndex<def.risposta.length; wIndex++){
                    const rowIndex = wIndex+def.y;
                    matrix[rowIndex][def.x] = {
                        fillable: true,
                        value: rowIndex === def.y ? def.index : null, // label solo nella prima cella della colonna
                        letter: def.risposta[wIndex],
                        horizontal: false
                    }
                }
            }
            return matrix;
        })
        setFilledLetters(def);
    }

    useEffect(()=>{
        const areAllCorrect = getCorrectCount() === definitions.length;
        if (areAllCorrect){
            setStepGame(STEPS.COMPLETED);
            countdownTimerCtx.stopTimer();
        }
    },[definitions])


    useEffect(()=>{
        let tmpCrosswordMatrix = buildMatrix();
        for (let y = 0; y<tmpCrosswordMatrix.length; y++){
            props.propsComponent.definizioni.forEach(def => {
                if (def.orizzontale){
                    if (def.y === y){
                        fillMatrixRow(tmpCrosswordMatrix, y, def);
                    }
                }
            })
            props.propsComponent.definizioni.forEach(def => {
                if (!def.orizzontale){
                    fillMatrixColumn(tmpCrosswordMatrix,def.x,def);
                }
            })
        }

        setCrosswordMatrix(tmpCrosswordMatrix)

    },[])

    useEffect(()=>{
        if ((stepGame === STEPS.STARTED) && countdownTimerCtx.timer < 1){
            setStepGame(STEPS.COMPLETED);
        }
    },[countdownTimerCtx.timer])


    const startGameHandler = ()=>{
        setStepGame(STEPS.STARTED);
    }

    const onDetailViewCorrectHandler = ()=>{
        let definition = definitions[detailViewDefinitionIndex];
        setWordCorrect(definition, detailViewDefinitionIndex);
        setDetailViewDefinitionIndex(-1);
    }

    const getCorrectCount = ()=>{
        return definitions.filter(def => def.completed).length;
    }

    return (
        <div className={styles.Cruciverba}>
            <GameContainer>
                <>
                {
                stepGame !== STEPS.SCORE_VIEW && <>
                    <HeaderGeneric hideTimer={(stepGame === STEPS.NOT_STARTED) || (stepGame === STEPS.SCORE_VIEW)}
                                   title={"Crosswords"}
                                   subtitle={(stepGame === STEPS.NOT_STARTED) ? `<p>Time for another game, let&rsquo;s see what you remember from the brand presentation!</p><p>Read the definitions and insert the right word into the grid.</p><br/><p>You must complete in less than<br/><strong>${Math.round(COUNTDONW_TIMER_QUESTION_SECONDS/60)} minutes</strong></p>` : null}/>
                    {(detailViewDefinitionIndex === -1) && <table>
                        <tbody>
                        {crosswordMatrix?.map((row, y) => <tr key={"row_" + y}>{row?.map((col, x) =>
                            <CrossWordCell key={"" + y + x} fillable={col?.fillable} value={col?.value} filled={!!col?.letter} letter={col?.letter} horizontal={col?.horizontal}/>)}</tr>)}
                        </tbody>
                    </table>}
                    </>}

                {(stepGame === STEPS.NOT_STARTED) && <InstructionsStart onStartClick={startGameHandler}/>
                }

                {/* vista preview */}
                {((stepGame === STEPS.STARTED) || (stepGame === STEPS.COMPLETED)) && (detailViewDefinitionIndex === -1) &&
                <div className={styles.definitionsList}>
                    {definitions.map((definition,i) => <DefinitionRow key={""+definition.index+(definition.orizzontale ? 'O' : 'V')} preview onOpenDetail={()=>!definition.completed && setDetailViewDefinitionIndex(i)} definition={definition}/>)}
                </div>}

                {/* vista di dettaglio */}
                {((stepGame === STEPS.STARTED) || (stepGame === STEPS.COMPLETED)) && (detailViewDefinitionIndex >= 0) &&
                    <div className={styles.detailView}>
                        <DefinitionRow definition={definitions[detailViewDefinitionIndex]} state={DEFINITION_STATE.EMPTY} onDetailViewCorrect={onDetailViewCorrectHandler} onBackToDefinitions={()=>setDetailViewDefinitionIndex(-1)} state={definitions[detailViewDefinitionIndex].completed ? DEFINITION_STATE.COMPLETED : DEFINITION_STATE.EMPTY}/>
                    </div>}
                </>
                { (stepGame === STEPS.COMPLETED) && <div style={{textAlign: "center", margin: "10px"}}><Button onClick={()=>setStepGame(STEPS.SCORE_VIEW)}>SCORE VIEW</Button></div> }
                { (stepGame === STEPS.SCORE_VIEW) && <ScoreView title={"Crosswords"}
                                                                isPassed={getCorrectCount() === definitions.length}
                                                                pointsCorrectAnswer={props.propsComponent.pointsCorrectAnswer}
                                                                correctCount={getCorrectCount()}
                                                                questionsCount={definitions.length}
                                                                halfTimeElapsed={countdownTimerCtx.timer < (countdownTimerCtx.initialTimer / 2)}
                                                                timeOver={countdownTimerCtx.timer < 1}/> }
            </GameContainer>
        </div>
    )
}

export default withScorm()(Cruciverba);
