import React from 'react';
import logo from '../../assets/logo.png';

const Logo = (props) => {
    return <img className={props.className} src={logo} alt="" />
}

export default Logo;