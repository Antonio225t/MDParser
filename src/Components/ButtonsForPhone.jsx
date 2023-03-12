import '../styles/btnsPhone.css';

import closeIcon from '../Close.png';

import FancyButton from './FancyButton';

import Constants from '../Constants.jsx';

import { useState } from 'react';

function ButtonForPhone({ btns }) {

    const [active, setActive] = useState(false);
    const onPhone = Constants.phonePattern.test(window.navigator.userAgent);
    
    return btns.length > 0 ? (onPhone ? (!active ? (
        <div className="phoneShowBtnsButton" onClick={()=>{
            setActive(!active);
        }}>↓</div>
    ) : (
        <div className="phoneButtonsOverlay" onClick={(e)=>{
            if (e.target.className==="phoneButtonsOverlay") {
                setActive(!active);
            }
        }}>
            <div className="btnsContainer">
                <img src={closeIcon} alt="Close" className="phoneCloseButton" onClick={()=>{
                    setActive(!active);
                }} />
                <div className="containerOfButtons">
                {btns.map(item=>{
                    var text = item.text;
                    var icon = item.icon;
                    var tooltip = item.tooltip;
                    var fun = item.function;

                    var key = Math.random()*9999

                    return (
                    <FancyButton key={key} text={text} icon={icon} tooltip={tooltip} onClick={()=>{
                        switch (typeof fun) {
                            case "string":
                                // eslint-disable-next-line
                                eval(fun); // We have to eval the function...
                                break;
                            case "function":
                                fun(); // Or if it's a function, call it.
                                break;
                            default:
                                console.error(`Can't run the function from button '${text}', recieved function: ${fun}`);
                        }
                    }} />
                    )
                })}
                </div>
            </div>
        </div>
    )) : (
        <div className="editorButtons">
            {btns.map(item=>{
                var text = item.text;
                var icon = item.icon;
                var tooltip = item.tooltip;
                var fun = item.function;

                var key = Math.random()*9999

                return (
                    <FancyButton key={key} text={text} icon={icon} tooltip={tooltip} onClick={()=>{
                        switch (typeof fun) {
                            case "string":
                                // eslint-disable-next-line
                                eval(fun); // We have to eval the function...
                                break;
                            case "function":
                                fun(); // Or if it's a function, call it.
                                break;
                            default:
                                console.error(`Can't run the function from button '${text}', recieved function: ${fun}`);
                        }
                    }} />
                );
            })}
        </div>
    )) : "";
}

ButtonForPhone.defaultProps = {
    btns: []
}

export default ButtonForPhone;