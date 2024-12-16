import useFullscreenStatus from "../../utils/useFullscreenStatus.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCompress, faExpand} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const FullscreenButton = ({maximizableElement, accessibleLabel}) => {
    let isFullscreen, setIsFullscreen;
    let errorMessage;

    try {
        [isFullscreen, setIsFullscreen] = useFullscreenStatus(maximizableElement);
    } catch (e) {
        errorMessage = true;
        isFullscreen = false;
        setIsFullscreen = undefined;
    }
    const handleExitFullscreen = () => {
        try {
            document.exitFullscreen();
        } catch {
            /** gestione bug safari */
            document.webkitExitFullscreen();
        }
    };

    return !errorMessage ? (
        isFullscreen ? (
            <button className={'headerButton btn-fullscreen'}
                    onClick={handleExitFullscreen}
                    aria-label={accessibleLabel}>
                <FontAwesomeIcon
                    icon={faCompress}
                    size="lg"
                    className={"icon"}
                />
            </button>
        ) : (
            <button className={'headerButton btn-fullscreen'}
                    onClick={setIsFullscreen}
                    aria-label={accessibleLabel}>
                <FontAwesomeIcon
                    icon={faExpand}
                    size="lg"
                    className={"icon"}
                />
            </button>
        )
    ) : null
};

export default FullscreenButton;
