import '../../styles/editor.css';

import copyTextIcon from '../../Copy text.png';
import copyURLIcon from '../../Copy URL.png';
import copyBase64Icon from '../../Copy Base64.png';
import editExtensionsIcon from '../../Edit Extensions.png';
import editMDIcon from '../../Edit MD.png';
import downloadMD64Icon from '../../Download .md64.png';
import backIcon from '../../Back.png';

import MDRenderer from '../../Components/MDRenderer';
import FancyButton from '../../Components/FancyButton';

import Constants from '../../Constants';
import base64 from '../../base64';

import { useState } from 'react';


function App() {
    var query = new URLSearchParams(window.location.search);
    var [md, setMD] = useState(query.has("text") ? base64.decode(query.get("text")) : Constants.defaultEdit);
    var [exts, setExts] = useState(query.has("extensions") ? base64.decode(query.get("extensions")) : Constants.defaultExtension);
    var [viewExtsEditor, setViewExtsEditor] = useState(false);

    query.set("text", base64.encode(md))
    window.history.pushState(null, "", window.location.href.split("?")[0] + "?" + query.toString());

    return (
        <>
            <div className="editorButtons">
                <FancyButton text={"Back"} icon={backIcon} tooltip={"Go back to the MDParser default's MD"} onClick={()=>{
                    window.location.href = window.location.href.split("?")[0].replace("/editor", "");
                }} />
                <FancyButton text={"Download as .MD64 file"} icon={downloadMD64Icon} tooltip={"Download the file as .md64 extension for loading it with '?url=<link_to_file.md64>'."} onClick={()=>{
                    var fileName = window.prompt("Give a name to your file here:");
                    var downloadable = document.createElement("A");

                    var file = ``;
                    if (exts !== Constants.defaultExtension) {
                        file += `window.urlPage["extensions"] = \`${exts.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`;\n\n`;
                    }
                    file += `window.urlPage["md"] = \`${md.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`;`;

                    downloadable.href = `data:application/octet-stream;base64,` + base64.encode(file);
                    downloadable.download = fileName + ".md64";

                    downloadable.click();
                }} />
                <FancyButton text={"Copy as URL"} icon={copyURLIcon} tooltip={"Copy the text as URL (not editor) in the clipboard"} onClick={()=>{
                    var url = window.location.href.split("?")[0];
                    url = url.split("/").splice(0, url.split("/").length-1).join("/") + "?text=" + query.get("text") + (query.has("extensions") ? "&extensions=" + query.get("extensions") : "");

                    navigator.clipboard.writeText(url);
                }} />
                <FancyButton text={"Copy as Text"} icon={copyTextIcon} tooltip={"Copy the text as just MarkDown text"} onClick={()=>{
                    navigator.clipboard.writeText(md);
                }} />
                <FancyButton text={"Copy Text as Base64"} icon={copyBase64Icon} tooltip={"Copy the text as Base64 URL-safe encoded text"} onClick={()=>{
                    navigator.clipboard.writeText(query.get("text"));
                }} />
                <FancyButton text={"Copy Extensions as Base64"} icon={copyBase64Icon} tooltip={"Copy extensions as Base64 URL-safe encoded text"} onClick={()=>{
                    navigator.clipboard.writeText(query.get("extensions"));
                }} />
                {!viewExtsEditor ? (
                    <FancyButton text={"Edit Extensions"} icon={editExtensionsIcon} tooltip={"View the editor of extensions, documentation on Marked."} onClick={()=>{
                        setViewExtsEditor(!viewExtsEditor);
                    }} />
                ) : (
                    <FancyButton text={"Edit MarkDown"} icon={editMDIcon} tooltip={"View the editor of MarkDown."} onClick={()=>{
                        setViewExtsEditor(!viewExtsEditor);
                    }} />
                )}
            </div>
            <div className='editorContainer'>
                {viewExtsEditor ? (
                    <textarea spellCheck={false} className="hljs language-JavaScript" value={exts} onChange={(e) => {
                        var text = e.target.value;

                        query.set("extensions", base64.encode(text));
                        window.history.pushState(null, "", window.location.href.split("?")[0] + "?" + query.toString());
                        setExts(text);
                    }} />
                ) : (
                    <textarea spellCheck={false} className="textEditor" value={md} onChange={(e) => {
                        var text = e.target.value;

                        query.set("text", base64.encode(text))
                        window.history.pushState(null, "", window.location.href.split("?")[0] + "?" + query.toString());
                        setMD(text);
                    }} />
                )}
                <MDRenderer md={md} extensions={exts} />
            </div>
        </>
    );
}

export default App;