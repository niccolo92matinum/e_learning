import React, {useEffect, useState} from 'react'
import {Rnd} from "react-rnd";

const DebugDnD = (props) => {
    const {children, coords} = props;
    const [xPos, setXPos] = useState(0);
    const [yPos, setYPos] = useState(0);

    const [leftPerc, setLeftPerc] = useState(0);
    const [topPerc, setTopPerc] = useState(0);
    const [widthPerc, setWidthPerc] = useState(0);
    const [heightPerc, setHeightPerc] = useState(0);

    useEffect(() => {
        const videoSize = props.areeCliccabiliRef.current;
        setXPos((parseFloat(coords.left.replace(/\D/g,'')) * 100) / videoSize?.offsetWidth);
        setYPos((parseFloat(coords.top.replace(/\D/g,'')) * 100) / videoSize?.offsetHeight);
    }, [coords.left, coords.top, props.areeCliccabiliRef]);

    const calculateCoords= (e, data) => {
        e.preventDefault();          
        e.stopPropagation()

        const targetEl = document.getElementsByClassName('react-draggable')[0]

        const parentCoords = targetEl.parentNode.getBoundingClientRect();

        const offsetLeft = data.node.offsetLeft + data.x;
        const offsetTop = data.node.offsetTop + data.y;

        const parentHeight =  parentCoords.height;
        const parentWidth = parentCoords.width;

        setLeftPerc(parseFloat(offsetLeft * 100 / parentWidth).toFixed(2));
        setTopPerc(parseFloat(offsetTop * 100 / parentHeight).toFixed(2));
    }

    const onResizeHandler = (e, direction, ref, delta, position)=>{
        e.preventDefault();
        e.stopPropagation();

        const targetEl = document.getElementsByClassName('react-draggable')[0]

        const parentCoords = targetEl.parentNode.getBoundingClientRect();

        const offsetLeft = position.x;
        const offsetTop = position.y;
        const width = targetEl.getBoundingClientRect()['width'];
        const height = targetEl.getBoundingClientRect()['height'];

        const parentHeight =  parentCoords.height;
        const parentWidth = parentCoords.width;

        setLeftPerc(parseFloat(offsetLeft * 100 / parentWidth).toFixed(2));
        setTopPerc(parseFloat(offsetTop * 100 / parentHeight).toFixed(2));
        setWidthPerc(parseFloat(width * 100 / parentWidth).toFixed(2));
        setHeightPerc(parseFloat(height * 100 / parentHeight).toFixed(2));
    }

    return coords && xPos && yPos ? (
        <>
            <span style={{userSelect: 'all', background:'#fff', color: '#000'}}>top: {topPerc}%; left:{leftPerc}%,width:{widthPerc}%,height:{heightPerc}%</span>
            <Rnd
                style={{border: '2px solid yellow'}}
                default={{x: parseFloat(xPos), y: parseFloat(yPos), width: parseFloat(coords.width), height: parseFloat(coords.height)}}
                onDragStop={calculateCoords}
                onResizeStop={onResizeHandler}
            >
                {children}
            </Rnd>
        </>
    )
    : children
}

export default DebugDnD
