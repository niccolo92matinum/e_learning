import React, {useRef, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./LangSelector.module.scss";
import {faLanguage} from "@fortawesome/free-solid-svg-icons";
import {useSelector} from "react-redux";
import useClickEvent from "../../../utils/useClickEvent";

const LangSelector = ({languages, currentLang, onChangeCc, onChangeLanguage, vttLanguages, accessibleLabel}) => {

    const structureData = useSelector((state) => state.structure.data);
    const [activeCC, setActiveCC] = useState(null);
    const [langSelectorVisible, setLangSelectorVisible] = useState(false);

    const toggleLangSelectorVisible = ()=> {
        setLangSelectorVisible(oldState => !oldState);
    }

    const onChangeCcHandler = (smallTitleLang)=> {
        smallTitleLang ? onChangeCc(smallTitleLang) : onChangeCc(null);
        setLangSelectorVisible(false);
    }

    const buttonLangEl = useRef(null);

    useClickEvent(
        [buttonLangEl],
        [() => setLangSelectorVisible(false)]
    );

    const handleKeyDown = (e, action) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    };

    return (
        <div ref={buttonLangEl} className={`${styles.LangSelector} ${langSelectorVisible ? styles.opened : ''}`}>
            <button 
              className={`${'headerButton'} ${'headerButton-double'}`} 
              onClick={toggleLangSelectorVisible} 
              aria-label={accessibleLabel} 
              aria-expanded={langSelectorVisible} 
              aria-haspopup="menu" 
              aria-controls="LangSelectorPanel">
              <FontAwesomeIcon
                icon={faLanguage}
                size="lg"
                className={"icon"}
              ></FontAwesomeIcon>
            </button>
            <div id="LangSelectorPanel" className={styles.LangSelectorPanel} role="menu" aria-live="polite">
                <section>
                    <span id="LangSelectorSectionCourse">{structureData.course}</span>
                    <ul id="courseList" role="menu" 
                      aria-labelledby="LangSelectorSectionCourse">
                        {languages.map((lang) => {
                            return <li key={`lang_course_${lang.small_title}`}
                              onClick={()=>onChangeLanguage(lang.small_title)}
                              onKeyDown={(e) => handleKeyDown(e, () => onChangeLanguage(lang.small_title))}
                              className={lang.small_title === currentLang ? styles.active : ""}
                              role="menuitem"
                              aria-selected={lang.small_title === currentLang}
                              tabIndex="0"
                            >
                              {lang.long_title}
                            </li>;
                        })}
                    </ul>
                </section>
                {!!vttLanguages?.length && <section>
                    <span id="LangSelectorSectionSubtitles">{structureData.subtitles}</span>
                    <ul id="subtitlesList" role="menu" 
                      aria-labelledby="LangSelectorSectionSubtitles">
                        <li className={!activeCC ? styles.active : ''} onClick={() => {
                            onChangeCcHandler(null);
                            setActiveCC(null);
                          }}
                          onKeyDown={(e) => handleKeyDown(e, () => {
                            onChangeCcHandler(null);
                            setActiveCC(null);
                          })}
                          role="menuitem"
                          aria-selected={!activeCC}
                          tabIndex="0"
                        >
                            Disattivati
                        </li>
                        {vttLanguages.map((lang) => {
                            return (
                                <li
                                    key={`lang_vtt_${lang.small_title}`}
                                    onClick={() => {
                                        if (!activeCC || activeCC !== lang.small_title){
                                            onChangeCcHandler(lang.small_title);
                                            setActiveCC(lang.small_title);
                                        }else{
                                            onChangeCcHandler(null);
                                            setActiveCC(null);
                                        }
                                      }
                                    }
                                    onKeyDown={(e) => handleKeyDown(e, () => {
                                        if (!activeCC || activeCC !== lang.small_title) {
                                            onChangeCcHandler(lang.small_title);
                                            setActiveCC(lang.small_title);
                                        } else {
                                            onChangeCcHandler(null);
                                            setActiveCC(null);
                                        }
                                    })}
                                    className={
                                        lang.small_title === activeCC ? styles.active : ""
                                    }
                                    role="menuitem"
                                    aria-selected={lang.small_title === activeCC}
                                    tabIndex="0"
                                >
                                    {lang.long_title}
                                </li>
                            );
                        })}
                    </ul>
                </section>}
            </div>
        </div>
    );
};

export default LangSelector;
