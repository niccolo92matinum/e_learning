import {useEffect, useState} from "react";
import Sound from "react-sound";
import log from "loglevel";

const useAudio = (audioCode, playing, currentLang,muted) => {
    const [playStatus, setPlayStatus] = useState(Sound.status.STOPPED);
    const [src, setSrc] = useState(null);
    const [volume, setVolume] = useState(80);

    const stopAudioHandler = ()=>{
        setPlayStatus(Sound.status.STOPPED);
    }

    useEffect(() => {
        setVolume(muted ? 0 : 80);
    }, [muted]);

    useEffect(() => {
        setPlayStatus(Sound.status.STOPPED);
        if (!audioCode){
            return;
        }
        setSrc(`assets/audio/appro/${currentLang}/${audioCode}.mp3`);
        setPlayStatus(Sound.status.PLAYING);
    }, [audioCode, playing, currentLang]);

    return [playStatus, src, stopAudioHandler, volume];
}

export default useAudio;
