

function FancyButton({ text, icon, alt, tooltip, onClick }) {
    if (icon) {
        alt = alt ? alt : icon;
    }

    return (
        <div title={tooltip} onClick={onClick} className="nyabutton">
            {icon ? (
                <img src={icon} alt={alt} />
            ) : <></>}
            {text ? <span>{text}</span> : ""}
        </div>
    );
}

FancyButton.defaultProps = {
    text:"",
    icon:void 0,
    alt:void 0,
    tooltip:"",
    onClick:()=>{}
};

export default FancyButton;