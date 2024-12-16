const getRetryCountFinalTest = (structure)=> {
    const finalTest = Object.values(structure.timings).find(obj => obj.component?.type === "multiple_step_test" && obj.component?.attempt);
    return finalTest?.component?.attempt && (finalTest?.component?.attempt ?? 0);
}
export default getRetryCountFinalTest;
