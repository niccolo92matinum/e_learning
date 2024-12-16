import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClosedCaptioning } from "@fortawesome/free-solid-svg-icons";
import styles from "./ClosedCaptioning.module.scss";
import {useSelector} from "react-redux";

const ClosedCaptioning = () => {
    const [activeCC, setActiveCC] = useState(null);
    const courseData = useSelector((state) => state.course.data);

  const videoData = useSelector((state) => state.video);

  const subtitleShow = (lang) => {
    var tracks = videoData?.player?.textTracks();    
    for (var i = 0; i < tracks.length; i++) {
        const track = tracks[i];              
        if (track.kind === 'captions' && track.language === lang) {
            track.mode = 'showing';
        }
        else {
            track.mode = 'disabled';
        }
    }
  }

  return (
    <div className={styles.ccDropdown}>
      <FontAwesomeIcon
        icon={faClosedCaptioning}
        size="lg"
        className={"icon"}
      ></FontAwesomeIcon>
      <div>
        <ul>
          {courseData.languages.map((lang) => {
            return (
              <li
                key={lang.small_title}
                onClick={() => {
                  
                    if (!activeCC || activeCC !== lang.small_title){                      
                        subtitleShow(lang.small_title);
                        setActiveCC(lang.small_title);
                    }else{
                        subtitleShow(null);
                        setActiveCC(null);
                    }

                }
                    
                }
                className={
                  lang.small_title === activeCC ? styles.active : ""
                }
              >
                {lang.small_title}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ClosedCaptioning;
