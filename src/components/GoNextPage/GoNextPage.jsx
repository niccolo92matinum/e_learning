import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button/Button";

const GoNextPage = (props) => {
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
        onClick={props.onNext}
      >
        NEXT <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
      </Button>
    </div>
  );
};

export default GoNextPage;
