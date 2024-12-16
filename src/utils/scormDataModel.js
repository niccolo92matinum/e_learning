const SCM_12 = Object.freeze({
    lesson_location: 'cmi.core.lesson_location',
    completion_status: 'cmi.core.lesson_status',
    score_raw: 'cmi.core.score.raw',
    suspend_data: 'cmi.suspend_data'
})

const SCM_2004 = Object.freeze({
    lesson_location: 'cmi.location',
    completion_status: 'cmi.completion_status',
    score_raw: 'cmi.score.raw',
    suspend_data: 'cmi.suspend_data'
})

const scormDataModel = Object.freeze({
    '1.2': SCM_12,
    '2004': SCM_2004
})

export default scormDataModel;
