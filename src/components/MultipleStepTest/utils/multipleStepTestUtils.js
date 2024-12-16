import _ from "lodash";

export const isCurrentConfirmed = (arrayState, index) => {
    return !!arrayState?.find((ex) => {
        return ex.index === index && ex.confirmed;
    });
};
export const isCurrentCorrect = (arrayState, index) => {
    return !!arrayState?.find(
        (ex) => ex.index === index && ex.confirmed && ex.correct
    );
};
export const isCurrentViewed = (arrayState, index)=>{
    return !!arrayState?.find((ex) => {
        return ex.index === index && ex.viewed;
    });
}

export const buildFilteredExercises = ({ exercises, random, limit, groups, totalAttempt, shuffleAnswers })=>{
    let filteredExercises = [];

    // pesco n domande da ciascun gruppo
    if (groups){
        let exercisesByGroups = [];
        Object.keys(groups).forEach((groupId) => {
            exercisesByGroups = [...exercisesByGroups, ...exercises.filter(ex => ex.groupId === groupId).slice(0,groups[groupId])];
        })
        filteredExercises = exercisesByGroups;
    }else{
        filteredExercises = exercises;
    }

    if (limit && limit > 0) {
        filteredExercises = filteredExercises.slice(0, limit);
    }


    let orderIndexExercises = Object.keys(filteredExercises).map(key=> parseInt(key));
    let orderedFilteredExercises = [];
    if (random) {
        orderIndexExercises = _.shuffle(orderIndexExercises);
        orderIndexExercises.forEach(index => {
            orderedFilteredExercises.push(exercises[index]);
        })
        filteredExercises = orderedFilteredExercises;
    }

    filteredExercises = filteredExercises.map(ex => {
        // ordine casuale solo per esercitazioni contenenti answers
        if (!ex.answers){
            return ex;
        }
        let shuffledIndexes = shuffleAnswers ? _.shuffle(Object.keys(ex.answers).map(key=> parseInt(key))) : Object.keys(ex.answers);
        let resExercise = {...ex, answers: []};
        shuffledIndexes.forEach(index => {
            resExercise.answers.push({...ex.answers[index], position: index});
        })
        return resExercise;
    })
    const exerciseWrapper = filteredExercises.map((e, i) => {
        return { el: e, index: i, givenAnswers: null };
    });

    const max = filteredExercises.reduce((counter, obj) => {
        if (obj.score < 1) {
            throw new Error(
                "Score in final test must be at least 1! Please fix the element in json file!"
            );
        }
        return counter + (obj.score || 0);
    }, 0);

    return {
        filteredElements: filteredExercises, // usato in caso di reset_test per non dover ripescare randomicamente
        arrayStates: exerciseWrapper,
        extractedExercisesCount: filteredExercises.length,
        exercisesTotalCount: exercises.length,
        maxScore: max,
        totalAttempt
    }
}

export const createInitialState = (args)=>{
    const filteredExercises = buildFilteredExercises(args)
    return {
        ...filteredExercises,
        score: args.score || 0,
        currentQuestionIndex: 0,
        isFinalProfile: args.isFinalProfile || false,
        isStartTestMessage: !args.isFinalProfile,
        solutionVisible: false,
        attempt: args.userAttempt,
        arrayStates: args.arrayStates || filteredExercises.arrayStates
    };
}
