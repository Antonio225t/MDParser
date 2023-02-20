import './styles/style.css';
import './libraries/highlight/styles/stackoverflow-light.min.css';
import './styles/app.css';

import purify from 'dompurify';
import hljs from 'highlight.js';
import base64 from 'base-64';
import utf8 from 'utf8';
import fetc from "./Fetch";

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
    setMD(utf8.decode(base64.decode(query.get("text"))));
  }
  if (md === "" && !parsed && query.has("url")) {
    parsed = true;
    website = true;
    try {
      fetc(query, setMD);
      
    } catch(_) {
      
    }
  }

  if (md === "" && parsed && website) {
    setMD(`
# Error on loading the URL
Can't get the MD file from **${query.get("url")}**.


### What went wrong?
This could be the result of a **CORS** error or a **404**.

Click **COMMAND/CTRL** + **ALT** + **F4** (or **F12**) and open the console for more informations.
    `);
  }

  if (md === "" && !parsed) {
    setMD(`
# MDParser
This is **MDParser**. A tool that you can use for building Markdown page by a Base64 text!
### How does this work?
Here's how it works:

* First off, you want to write your MD document in a Base64 formatter like [this](https://amp.base64encode.org/) one.
* After you write your document and converted it into a Base64 text, go to \`/?text=(md-in-base64)\` replacing the \`(md-in-base64)\` with your Base64 document.
And that's all!

(This doesn't actually support TOC at the moment.)
## Thank you.
I'll upgrade this tool so it'll be flexible and fun to use, but for now thank you for using it! 😀`
);

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

  return (
    <>
      <div className="container markdown-body" dangerouslySetInnerHTML={{__html: purify.sanitize(marked.parse(md))}}></div>
    </>
  );
}

export default App;
