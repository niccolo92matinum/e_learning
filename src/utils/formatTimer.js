const formatSecondsToTime = (timeInSeconds)=>{
    let minutes = Math.floor(timeInSeconds/60)
    let seconds = timeInSeconds - minutes * 60;
    seconds = seconds < 10 ? "0"+seconds : seconds;
    return minutes + ":" + seconds;
}
export const msToTime = (duration) => {
    // Calcola le ore, i minuti e i secondi
    let hours = Math.floor(duration / (1000 * 60 * 60));
    let minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((duration % (1000 * 60)) / 1000);

    // Aggiunge zeri iniziali se il valore è inferiore a 10
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}
export default formatSecondsToTime;
