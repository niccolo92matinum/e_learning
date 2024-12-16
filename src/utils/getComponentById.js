import QuestionDropdown from "../components/MultipleStepTest/QuestionDropdown/QuestionDropdown.jsx";
import QuestionDropdownInline from "../components/MultipleStepTest/QuestionDropdownInline/QuestionDropdownInline.jsx";
import QuestionCards from "../components/MultipleStepTest/QuestionCard/QuestionCards.jsx";
import QuestionFill from "../components/MultipleStepTest/QuestionFill/QuestionFill.jsx";
import QuestionDraggable from "../components/MultipleStepTest/QuestionDraggable/QuestionDraggable.jsx";
import QuestionMultiple from "../components/MultipleStepTest/QuestionMultiple/QuestionMultiple.jsx";
import QuestionSingle from "../components/MultipleStepTest/QuestionSingle/QuestionSingle.jsx";
import QuestionYesOrNO from "../components/MultipleStepTest/QuestionYesOrNO/QuestionYesOrNO.jsx";
import SurveyStar from "../components/MultipleStepTest/Survey/SurveyStar.jsx";

const getComponentById = (id) => {
    let Exercise = null;
    switch (id) {
        case "exercise_dropdown":
            Exercise = QuestionDropdown;
            break;
        case "exercise_dropdown_inline":
            Exercise = QuestionDropdownInline;
            break;
        case "exercise_card":
            Exercise = QuestionCards;
            break;
        case "exercise_fillDnD":
            Exercise = QuestionFill;
            break;
        case "exercise_draggable":
            Exercise = QuestionDraggable;
            break;
        case "exercise_multiple":
            Exercise = QuestionMultiple;
            break;
        case "exercise_single": {
            Exercise = QuestionSingle;
            break;
        }
        case "exercise_yesorno": {
            Exercise = QuestionYesOrNO;
            break;
        }
        case "survey_star": {
            Exercise = SurveyStar;
            break;
        }
        default:
            Exercise = null;
    }
    return Exercise;
}

export default getComponentById;
