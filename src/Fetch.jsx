
function f(query, setMD) {
    fetch(query.get("url"), {method:"GET"}).then(ret=>{
        return ret.text();
    }).then(ret=>{
        setMD(ret);
    });
}

export default f;