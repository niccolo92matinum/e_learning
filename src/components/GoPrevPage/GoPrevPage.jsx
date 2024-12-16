import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button/Button";
import { courseActions } from "../../store/slices/courseSlice";
import { useDispatch, useSelector } from "react-redux";

const GoPrevPage = () => {
  const dispatch = useDispatch();

  const structureData = useSelector((state) => state.structure.data);

  const prevPageHandler = () => {
    dispatch(courseActions.prevPage(structureData?.modules));
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        left: 0,
        top: 0,
      }}
    >
      <Button
        style={{
          position: "absolute",
          left: "50%",
          bottom: "50px",
          color: "#FFF",
          background: "#333",
          borderRadius: "100px",
          transform: "translate(-50%)",
          fontSize: "1.5rem",
          boxShadow: "0 0 8px #00000066",
        }}
        onClick={prevPageHandler}
      >
        <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon> BACK
      </Button>
    </div>
  );
};

export default GoPrevPage;
