export default class Index {
    module = 0;
    lesson = 0;
    page = 0;
    component = 0;

    constructor(...params) {
        this.setIndex(...params);
    }
    setIndex = (iM, iL, iP, iC) => {
        this.module = iM;
        this.lesson = iL;
        this.page = iP;
        this.component = iC;
    }
    toArray = () => {
        return [this.module, this.lesson, this.page, this.component];
    }
}