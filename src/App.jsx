import './styles/style.css';
import './libraries/highlight/styles/stackoverflow-light.min.css';
import './styles/app.css';

import base64 from './base64';
import Constants from './Constants'

import MDRenderer from './Components/MDRenderer';

import { useState } from 'react';
import ButtonForPhone from './Components/ButtonsForPhone';


function App() {

  // Initializing some variables.
  var parsed = false;
  var query =  new URLSearchParams(document.location.search);
  var onPhone = Constants.phonePattern.test(window.navigator.userAgent);
  if (onPhone) {
    var style = document.createElement("STYLE");
    style.innerHTML += "div#root > div.container {margin:0px;margin-top:50px;zoom:225%;}";
    
    document.head.appendChild(style);
  }

  var [md, setMD] = useState("");
  var [exts, setExts] = useState(query.has("extensions") ? base64.decode(query.get("extensions")) : []);

  // Normal base64 text parser.
  if (md === "" && query.has("text")) {
    parsed = true;
    setMD(base64.decode(query.get("text")));
  }

  // From url
  if (md === "" && !parsed && query.has("url")) {
    parsed = true;

    var url = {};
    var urlObserver = new Proxy(url, {
      set: (target, prop, value) => {
        target[prop] = value;
        if (prop === "md") {
          setExts(target["extensions"] !== void 0 ? target["extensions"] : []);
          setMD(value);
        }
      }
    });

    window.urlPage = urlObserver;

    var urlScript = document.createElement("SCRIPT");
    urlScript.src = query.get("url");
    document.head.appendChild(urlScript);
  }

  // MDocuments support.
  if (md === "" && !parsed && query.has("mdoc")) {
    if (query.get("mdoc").startsWith("http://") || query.get("mdoc").startsWith("https://")) {
      var mdoc = {};
      var page = {};
      var setIndex = false;
      var docObserver = new Proxy(mdoc, {
        set: (target, prop, value) => {
          target[prop] = value;
          if (prop === "index" && !setIndex) {
            setIndex = true;
            parsed = true;
            target[prop] = value;

            try {
              window.mdocPage["page"] = query.has("mdocPage") ? query.get("mdocPage") : "index";
            } catch(_) {}
            // var amd = window.mdoc[window.mdocPage.page];

            // try {
            //   amd = base64.decode(amd);
            // } catch(_) {}
      
            // setMD(amd);
            //query.set("mdoc", base64.encode(JSON.stringify(mdoc)));
            //window.location.href = window.location.href.split("?")[0] + "?" + query.toString();

            window.addEventListener("popstate", (e)=>{
              query = new URLSearchParams(window.location.search);
              try {
                window.mdocPage["page"] = query.has("mdocPage") ? query.get("mdocPage") : "index";
              } catch(_) {}
            })
          }
        }
      });

      var pageObserver = new Proxy(page, {
        set: (target, prop, value) => {
          target[prop] = value;
          if (prop === "page") {
            setMD(window.mdoc[value]);
          }
        }
      });
      
      window.mdoc = docObserver;
      window.mdocPage = pageObserver;

      var mdocScript = document.createElement("SCRIPT");
      mdocScript.src = query.get("mdoc");

      document.body.appendChild(mdocScript);
    } else {
      /*parsed = true;
      window.page = query.has("mdocPage") ? query.get("mdocPage") : "index";
      window.mdoc = JSON.parse(base64.decode(query.get("mdoc")));
      var amd = window.mdoc[window.page];

      try {
        amd = base64.decode(amd);
      } catch(_) {}

      setMD(amd);*/
    }
  }

  // Send error message when URL doesn't load.
  // if (md === "" && parsed && website) {
  //   setMD(Constants.httpError(query.get("url")));
  // }

  // Buttons support
  md = md !== "" ? md : Constants.defaultText;
  var btns = [];

  var buttonsMatch = md.match(/\{btn\s"(.*?)"\s"(.*?)"\s"(.*?)"\s"(.*?)"\}/g);
  if (buttonsMatch) {
    for (let btn of buttonsMatch) {
      var btnMatch = btn.match(/\{btn\s"(.*?)"\s"(.*?)"\s"(.*?)"\s"(.*?)"\}/);
      btns.push({
        text:btnMatch[1].trim(),
        icon:btnMatch[2],
        tooltip:btnMatch[3].trim(),
        function:btnMatch[4]
      });
    }
  }

  md = md.replace(/\{btn\s"(.*?)"\s"(.*?)"\s"(.*?)"\s"(.*?)"\}/g, "");
  
  return (
    <>
      <ButtonForPhone btns={btns} />
      <MDRenderer md={md} query={query} extensions={exts} />
    </>
  );
}

export default App;