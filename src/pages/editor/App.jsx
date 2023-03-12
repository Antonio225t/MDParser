import '../../styles/editor.css';

import copyTextIcon from '../../Copy text.png';
import copyURLIcon from '../../Copy URL.png';
import copyBase64Icon from '../../Copy Base64.png';
import editExtensionsIcon from '../../Edit Extensions.png';
import editMDIcon from '../../Edit MD.png';
import downloadMD64Icon from '../../Download .md64.png';
import backIcon from '../../Back.png';

import MDRenderer from '../../Components/MDRenderer';
import ButtonsForPhone from '../../Components/ButtonsForPhone';

import Constants from '../../Constants';
import base64 from '../../base64';

import { useState } from 'react';


function App() {
    var query = new URLSearchParams(window.location.search);
    var [md, setMD] = useState(query.has("text") ? base64.decode(query.get("text")) : Constants.defaultEdit);
    var [exts, setExts] = useState(query.has("extensions") ? base64.decode(query.get("extensions")) : Constants.defaultExtension);
    var [viewExtsEditor, setViewExtsEditor] = useState(false);
    var [mobileViewMD, setMobileViewMD] = useState(false);
    var btns = [
        {
            text:"Back",
            icon:backIcon,
            tooltip:"Go back to the MDParser default's MD",
            function:()=>{
                window.location.href = window.location.href.split("?")[0].replace("/editor", "");
            }
        }
    ];
    if (!viewExtsEditor) {
        btns.push({text:"Edit Extensions",icon:editExtensionsIcon,tooltip:"View the editor of extensions, documentation on Marked.",function:()=>{
            setViewExtsEditor(!viewExtsEditor);
        }});
    } else {
        btns.push({text:"Edit MarkDown",icon:editMDIcon,tooltip:"View the editor of MarkDown.",function:()=>{
            setViewExtsEditor(!viewExtsEditor);
        }});
    }

    btns = [...btns,
        {
            text:"Download as .MD64 file",
            icon:downloadMD64Icon,
            tooltip:"Download the file as .md64 extension for loading it with '?url=<link_to_file.md64>'.",
            function:()=>{
                var fileName = window.prompt("Give a name to your file here:");
                if (fileName!==null) {
                    fileName = fileName!=="" ? fileName : "MarkDown Document";
                    var downloadable = document.createElement("A");

                    var file = ``;
                    if (exts !== Constants.defaultExtension) {
                        file += `window.urlPage["extensions"] = \`${exts.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`;\n\n`;
                    }
                    file += `window.urlPage["md"] = \`${md.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`;`;

                    downloadable.href = `data:application/octet-stream;base64,` + base64.encode(file);
                    downloadable.download = fileName + ".md64";

                    downloadable.click();
                }
            }
        },
        {
            text:"Copy as URL",
            icon:copyURLIcon,
            tooltip:"Copy the text as URL (not editor) in the clipboard",
            function:()=>{
                var url = window.location.href.split("?")[0];
                url = url.split("/").splice(0, url.split("/").length-1).join("/") + "?text=" + query.get("text") + (query.has("extensions") ? "&extensions=" + query.get("extensions") : "");

                navigator.clipboard.writeText(url);
            }
        },
        {
            text:"Copy as Text",
            icon:copyTextIcon,
            tooltip:"Copy the text as just MarkDown text",
            function:()=>{
                navigator.clipboard.writeText(md);
            }
        },
        {
            text:"Copy Text as Base64",
            icon:copyBase64Icon,
            tooltip:"Copy the text as Base64 URL-safe encoded text",
            function:()=>{
                navigator.clipboard.writeText(query.get("text"));
            }
        },
        {
            text:"Copy Extensions as Base64",
            icon:copyBase64Icon,
            tooltip:"Copy extensions as Base64 URL-safe encoded text",
            function:()=>{
                navigator.clipboard.writeText(query.get("extensions"));
            }
        }
    ];

    query.set("text", base64.encode(md));
    window.history.pushState(null, "", window.location.href.split("?")[0] + "?" + query.toString());

    const onPhone = Constants.phonePattern.test(window.navigator.userAgent);
    if (onPhone) {
        var style = document.createElement("STYLE");
        style.innerHTML += "div#root > div > textarea {height:500px;width:100%;resize:vertical;margin:0px;margin-top:50px;zoom:225%;}";
        style.innerHTML += "div#root > div.container {margin:0px;margin-top:50px;zoom:225%;}";
        
        document.head.appendChild(style);
    }

    return (
        <>
            <div className="editorButtons">
                <ButtonsForPhone btns={btns} />
                {onPhone ? (!mobileViewMD ? (
                    <div className="phoneShowBtnsButton show" onClick={()=>{
                        setMobileViewMD(!mobileViewMD);
                    }}>→</div>
                ) : (
                    <div className="phoneShowBtnsButton show" onClick={()=>{
                        setMobileViewMD(!mobileViewMD);
                    }}>←</div>
                )) : ""}
            </div>
            {mobileViewMD ? <MDRenderer md={md} extensions={exts} /> : viewExtsEditor ? (
                <div className={!onPhone ? "editorContainer" : ""}>
                    <textarea spellCheck={false} className="hljs language-JavaScript" value={exts} onChange={(e) => {
                        var text = e.target.value;

                        query.set("extensions", base64.encode(text));
                        window.history.pushState(null, "", window.location.href.split("?")[0] + "?" + query.toString());
                        setExts(text);
                    }} />
                    {!onPhone ? <MDRenderer md={md} extensions={exts} /> : ""}
                </div>
            ) : (
                <div className={!onPhone ? "editorContainer" : ""}>
                    <textarea spellCheck={false} className="textEditor" value={md} onChange={(e) => {
                        var text = e.target.value;

                        query.set("text", base64.encode(text))
                        window.history.pushState(null, "", window.location.href.split("?")[0] + "?" + query.toString());
                        setMD(text);
                    }} />
                    {!onPhone ? <MDRenderer md={md} extensions={exts} /> : ""}
                </div>
            )}
        </>
    );
}

export default App;