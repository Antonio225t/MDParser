import '../../styles/editor.css';

import MDRenderer from '../../Components/MDRenderer';
import Constants from '../../Constants';
import base64 from '../../base64';

import { useState } from 'react';


function App() {
    var query = new URLSearchParams(window.location.search);
    var [md, setMD] = useState(query.has("text") ? base64.decode(query.get("text")) : Constants.defaultEdit);

    query.set("text", base64.encode(md))
    window.history.pushState(null, "", window.location.href.split("?")[0] + "?" + query.toString());

    return (
        <div className='editorContainer'>
            <textarea spellCheck={false} className="textEditor" value={md} onInput={(e) => {
                var text = e.target.value;

                query.set("text", base64.encode(text))
                window.history.pushState(null, "", window.location.href.split("?")[0] + "?" + query.toString());
                setMD(text);
            }} />
            <MDRenderer md={md} />
        </div>
    );
}

export default App;