import React from 'react';

const PrevNextButtons = (props)=>{
    return (        
        <div style={{width: "100%", display: "flex", justifyContent: "space-between", margin: "16px 0"}}>
            {props.btnPrevQuestion ? props.btnPrevQuestion : <div style={{flex: "1 0 auto"}}></div>}
            {props.btnNextQuestion ? props.btnNextQuestion : <div style={{flex: "1 0 auto"}}></div>}
        </div>
    )
}

export default PrevNextButtons;