import './styles/style.css';
import './libraries/highlight/styles/stackoverflow-light.min.css';
import './styles/app.css';

import purify from 'dompurify';
import hljs from 'highlight.js';

import fetc from './Fetch';
import Constants from './Constants';
import base64 from './base64';

import { marked } from 'marked';
import { useState } from 'react';

function App() {

  // Getting the query
  var parsed = false;
  var website = false;

  var [md, setMD] = useState("");

  var query =  new URLSearchParams(document.location.search);
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

  if (md === "" && parsed && website) {
    setMD(Constants.httpError(query.get("url")));
  }

  if (md === "" && !parsed) {
    setMD(Constants.defaultText);

  }


  marked.setOptions({
    renderer: new marked.Renderer(),
    langPrefix: "hljs cblock language-",
    highlight: (code, lang) => {
      lang = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, {language:lang}).value;
    }
  });

  /* Footnote extension made by jun-sheaf at https://github.com/markedjs/marked/issues/1562#issuecomment-643171344 */
  const footnoteMatch = /^\[\^([^\]]+)\]:([\s\S]*)$/;
  const referenceMatch = /\[\^([^\]]+)\](?!\()/g;
  const referencePrefix = "marked-fnref";
  const footnotePrefix = "marked-fn";
  const footnoteTemplate = (ref, text) => {
    return `<sup id="${footnotePrefix}:${ref}">${ref}</sup>${text}`;
  };
  const referenceTemplate = ref => {
    return `<sup id="${referencePrefix}:${ref}"><a href="#${footnotePrefix}:${ref}">${ref}</a></sup>`;
  };
  const interpolateReferences = (text) => {
    return text.replace(referenceMatch, (_, ref) => {
      return referenceTemplate(ref);
    });
  }
  const interpolateFootnotes = (text) => {
    return text.replace(footnoteMatch, (_, value, text) => {
      return footnoteTemplate(value, text);
    });
  }
  const renderer = {
    paragraph(text) {
      return marked.Renderer.prototype.paragraph.apply(null, [
        interpolateReferences(interpolateFootnotes(text))
      ]);
    },
    text(text) {
      return marked.Renderer.prototype.text.apply(null, [
        interpolateReferences(interpolateFootnotes(text))
      ]);
    }
  };
  marked.use({ renderer });

  marked.use({
    extensions: [
      {
        name: "underline",
        level: "inline",
        start: (src) => {
          return src.match(/__(.*?)__/)?.index;
        },
        tokenizer(src, tokens) {
          var match = src.match(/^__(.*?)__/);
          if (match) {
            var token = {
              type: "underline",
              raw: match[0],
              text: this.lexer.inlineTokens(match[1].trim(), [])
            };
            return token;
          }
        },
        renderer(token) {
          return `<u>${this.parser.parseInline(token.text, null)}</u>`;
        },
      }
    ]
  });

  marked.use({
    extensions: [
      {
        name: "mdoclink",
        level: "inline",
        start(src) {
          return src.match(/\[(.*)\]\(mdoc:\/\/(.*)\)/)?.index;
        },
        tokenizer(src) {
          var match = src.match(/^\[(.*)\]\(mdoc:\/\/(.*)\)/);
          if (match) {
            return {
              type: "mdoclink",
              raw: match[0],
              text: this.lexer.inlineTokens(match[1].trim(), []),
              doc: match[2].trim()
            };
          }
        },
        renderer(token) {
          query.set("mdocPage", token.doc);
          return `<a href="${window.location.href.split("?")[0] + "?" + query.toString()}">${this.parser.parseInline(token.text, null)}</a>`
        }
      }
    ]
  });

  return (
    <>
      <div className="container markdown-body" dangerouslySetInnerHTML={{__html: purify.sanitize(marked.parse(md))}}></div>
    </>
  );
}

export default App;
