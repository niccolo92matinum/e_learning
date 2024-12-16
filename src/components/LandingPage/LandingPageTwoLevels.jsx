import React, {useState} from 'react';
import FirstLevel from './theme/FirstLevel';
import FirstLevelTheme from './theme/FirstLevelBlock';
import SecondBlockTheme from './theme/SecondLevelBlock';
import styles from "./LandingPage.module.scss";
import {useSelector} from "react-redux";

/**
 * Pagina di lancio con due livelli preconfigurati: 1° livello con i moduli, 2° livello con le lezioni
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const LandingPageTwoLevels = (props) => {
        const [currentLevel, setCurrentLevel] = useState(0);
        const structureData = useSelector((state) => state.structure.data);
        const [openedModuleId, setOpenedModuleId] = useState(null);

        const openModuleHandler = (mId)=>{
            setOpenedModuleId(mId);
            props.onOpenModule(mId);
        }

        const module = structureData.modules[openedModuleId];
        const childIds = module?.childIds;
        const lessons = openedModuleId ? Object.values(structureData.lessons).filter(l => {
            return childIds.findIndex(c => c === l.id) >= 0;
        }) : [];

        return (
            <div className={styles.LandingPage} >
                {
                    currentLevel === 0 &&
                     <FirstLevel>
                         {
                            Object.keys(structureData.modules).map((key, index) => {
                                let module = structureData.modules[key];
                                return <FirstLevelTheme locked={false} cover={module.imgCover} key={`landing_module${key}`} title={module.title} onClick={()=>{ openModuleHandler(key); setCurrentLevel(1);}}  />
                            })
                        }
                    </FirstLevel>
                }
                {
                    (currentLevel === 1) && lessons.map((key, index) => {
                        return <SecondBlockTheme isActive={!props.restricted || (props.restricted && props.index.module  + "" + key <= props.lastViewedIndex.module + "" + props.lastViewedIndex.lesson)} cover={lessons[index].imgCover} key={`landing_second${lessons[index].id}`} index={index} title={lessons[index].title} onClick={()=>{props.onOpenLesson(openedModuleId,lessons[index].id); setCurrentLevel(2);}}  />
                    })
                }
            </div>
        )
}

export default LandingPageTwoLevels;