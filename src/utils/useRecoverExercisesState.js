import {useEffect} from "react";
import {isNil} from "ramda";

export const useRecoverExercises = (givenAnswers, setAnsweredIndex) => {
    // recupero stato da multipleStepTest/NonEvaluativeTest
    useEffect(() => {
        if (!isNil(givenAnswers) && (!Array.isArray(givenAnswers) || givenAnswers.length > 0)) {
            setAnsweredIndex(givenAnswers);
        }
    }, [givenAnswers]);
}
