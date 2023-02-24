import './styles/style.css';
import './libraries/highlight/styles/stackoverflow-light.min.css';
import './styles/app.css';

import base64 from './base64';
import fetc from './Fetch';
import Constants from './Constants';
import MDRenderer from './Components/MDRenderer';

import { useState } from 'react';


function App() {

  // Initializing some variables.
  var parsed = false;
  var website = false;

  var [md, setMD] = useState("");
  var query =  new URLSearchParams(document.location.search);

  // Normal base64 text parser.
  if (md === "" && query.has("text")) {
    parsed = true;
    setMD(base64.decode(query.get("text")));
  }
  if (md === "" && !parsed && query.has("url")) {
    parsed = true;
    website = true;
    try {
      fetc(query, setMD);
      
    } catch(_) {
      
    }
  }

  // MDocuments support.
  if (md === "" && !parsed && query.has("mdoc")) {
    if (query.get("mdoc").startsWith("http://") || query.get("mdoc").startsWith("https://")) {
      var mdoc = {};
      var setIndex = false;
      var observer = new Proxy(mdoc, {
        set: (target, prop, value) => {
          if (prop === "index" && !setIndex) {
            setIndex = true;
            target[prop] = value;

            query.set("mdoc", base64.encode(JSON.stringify(mdoc)));
            window.location.href = window.location.href.split("?")[0] + "?" + query.toString();
          } else {
            target[prop] = value;
          }
        }
      });
      
      window.mdoc = observer;

      var script = document.createElement("SCRIPT");
      script.src = query.get("mdoc");

      document.body.appendChild(script);
    } else {
      parsed = true;
      window.page = query.has("mdocPage") ? query.get("mdocPage") : "index";
      window.mdoc = JSON.parse(base64.decode(query.get("mdoc")));
      var amd = window.mdoc[window.page];

      try {
        amd = base64.decode(amd);
      } catch(_) {}

      setMD(amd);
    }
  }

  // Send error message when URL doesn't load.
  if (md === "" && parsed && website) {
    setMD(Constants.httpError(query.get("url")));
  }

  


  return (
    <MDRenderer md={md} query={query} />
  );
}

export default App;
