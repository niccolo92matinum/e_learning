import React from "react";
import Flippy, { FrontSide, BackSide } from "react-flippy";
import styles from "./Card.module.scss";

const Card = (props) => {
    const {
        handleChange,
        cardInfo: { cover, flipped, frontContent, backContent, id, colorBackCard }
    } = props;

    return (
        <div className={styles.card}>
            <Flippy
                className={styles.flippyContainer}
                style={{ display: "block", width: "100%", height: "100%" }}
                flipOnClick={false}
                isFlipped={flipped}
            >
                <FrontSide
                    onClick={(event) => {handleChange(event, id)}}
                    className={`${styles.frontSide} ${flipped ? styles.visible : ''}` }
                    style={{borderRadius: "10px", backgroundSize: "contain", backgroundImage: cover ? `url(${cover})` : 'none', border: 'solid 5px #000' }}
                >
                    <div style={{height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}} dangerouslySetInnerHTML={{ __html: frontContent }}/>
                </FrontSide>
                <BackSide
                    className={`${styles.backSide} ${!flipped ? styles.visible : ''}` }
                    style={{ borderRadius: "10px", backgroundSize: "contain", backgroundImage: cover ? `url(${cover})` : 'none', backgroundColor: colorBackCard }}
                >
                    {<div className={styles.winFlipImage} />}
                    <div  style={{height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", overflowY: "auto"}}  dangerouslySetInnerHTML={{ __html: backContent }}/>
                </BackSide>
            </Flippy>
        </div>
    );
}


export default Card;
