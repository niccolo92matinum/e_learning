import React, {memo} from 'react';

const FeedbackText = (props)=>{
    
    return (
        <div
            style={{
                textAlign: "center",
                // backgroundColor: props.isCorrect ? "#18A558" : "#E43D40",
                padding: "10px 0",
                margin: "20px 0",
                // color: "#FFF",
                color: "#000",
                fontSize: "1.2em"
            }}
        >
            {props.feedbackText}
        </div>
    )
}

export default memo(FeedbackText);