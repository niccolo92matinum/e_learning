import React, {useLayoutEffect, useRef} from 'react';
import styles from "./FirstLevel.module.scss";
import gsap from "gsap";

const FirstLevel= (props) => {

    const comp = useRef(); // create a ref for the root level element (we'll use it later)

    useLayoutEffect(() => {

        let ctx = gsap.context(() => {

            // Our animations can use selector text like ".box"
            // this will only select '.box' elements that are children of the component
            // or we can use refs
            gsap.set('[data-animate=\'fade-enter\']', {opacity: 0, translateY: -40});
            gsap.to('[data-animate=\'fade-enter\']', { duration: 1, opacity: 1, translateY: 0, stagger: 0.3 });

        }, comp); // <- IMPORTANT! Scopes selector text

        return () => ctx.revert(); // cleanup

    }, []); // <- empty dependency Array so it doesn't re-run on every render!

        return (
            <div ref={comp} className={styles.containerFirstBlocks}>
                {props.children.map(el => React.cloneElement(el, { anim: 'fade-enter' }))}
            </div>
        )
}

export default FirstLevel;