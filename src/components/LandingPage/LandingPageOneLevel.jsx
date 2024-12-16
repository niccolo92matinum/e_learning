import React from 'react';
import BoxAnimator from './theme/BoxAnimator';
import styles from "./LandingPage.module.scss";
import {useSelector} from "react-redux";
import Box from "./theme/Box";

/**
 * Pagina di lancio con un solo livello (lezioni)
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const LandingPageOneLevel = (props) => {
    const structureData = useSelector((state) => state.structure.data);

    const getStructureModules = ()=>{
        const modules = Object.values(structureData.modules).map(module => {
            return {
                id: module.id,
                title: module.title,
                lessons: Object.values(structureData.lessons).filter(l => {
                    return module.childIds.findIndex(c => c === l.id) >= 0;
                })
            }
        })
        return modules;
    }
    let structure = getStructureModules();
    let boxes = [];
    structure.forEach(s => s.lessons.forEach(l => {
        boxes.push({
            moduleId: s.id,
            lessonId: l.id,
            title: l.title
        })
    }))
    return (
        <div className={`${styles.LandingPage} ${props.closed ? styles.closed : ''}`} >
            <BoxAnimator>
            {
                boxes.map(el => <Box locked={false} key={`m${el.moduleId}_l${el.lessonId}`}
                                     title={el.title} onClick={() => {
                                         props.onOpenLesson(el.moduleId,el.lessonId)}}/>
                )
            }

            </BoxAnimator>
        </div>
    )
}

export default LandingPageOneLevel;