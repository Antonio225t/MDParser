import purify from 'dompurify';
import hljs from 'highlight.js';
import toc from '../libraries/markdown-toc-unlazy';

import Constants from '../Constants';

import { marked } from 'marked';


function MDRenderer({ md, extensions, query }) {
    md = md !== "" ? md : Constants.defaultText;
    var onPhone = Constants.phonePattern.test(window.navigator.userAgent);

    try {
      // eslint-disable-next-line
      extensions = eval(extensions); // Using "eval()" is never safe but must to in order to build functions properly.
    } catch(_) {
      extensions = [];
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
              return src.match(/__([^_]*?[^_]*?)__/)?.index;
            },
            tokenizer(src, tokens) {
              var match = src.match(/^__([^_]*?[^_]*?)__/);
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
    
      var tocUsed = false;

      marked.use({
        extensions: [
          {
            name: "mdoclink",
            level: "inline",
            start(src) {
              return src.match(/\[([^\]]*)\]\(mdoc:\/\/([^)]*)\)/)?.index;
            },
            tokenizer(src) {
              var match = src.match(/^\[([^\]]*)\]\(mdoc:\/\/([^)]*)\)/);
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
              var id = "mdoclinking-" + Math.random()*9999;
              var interval = setInterval(()=>{
                if (document.getElementById(id)) {

                  document.getElementById(id).onclick = () => {
                    query.set("mdocPage", token.doc);
                    window.history.pushState(void 0, "", window.location.href.split("?")[0] + "?" + query.toString());
                    try {
                      window.mdocPage['page'] = token.doc;
                    } catch(_) {}
                  };

                  document.getElementById(id).removeAttribute("id");
                  clearInterval(interval);
                }
              }, 10);
              return query.has("mdoc") && window.mdoc[token.doc] ? `<span id="${id}" class="mdoclink">${this.parser.parseInline(token.text, null)}</span>` : `<span class="noMdoc" title="${Constants.noMdoc}">${this.parser.parseInline(token.text, null)}</span>`;
            }
          },
          {
            name: "tocbuild",
            level:"inline",
            start(src) {
              return src.match(/\[TOC\]/)?.index;
            },
            tokenizer(src) {
              var match = src.match(/^\[TOC\]/);
              if (match) {
                if (!tocUsed) {
                  tocUsed = true;
                  return {
                    type: "tocbuild",
                    raw: match[0],
                    mode: "side"
                  }
                } else {
                  return {
                    type: "text",
                    raw: match[0]
                  }
                }
              }
            },
            renderer(token) {
              if (onPhone) {
                var id = "tocbuild-" + Math.random()*9999;
                var interval = setInterval(()=>{

                  if (document.getElementById(id)) {
                    var elem = document.getElementById(id);
                    elem.parentElement.innerHTML += `<div id="@TOC"></div>`;

                    var tocView = document.getElementById("@TOC");
                    elem = document.getElementById(id);

                    elem.removeAttribute("id");
                    clearInterval(interval);

                    var show = false;
                    var tocV = marked.parse(toc(md).content);

                    elem.onclick = () => {
                      if (!show) {
                        show = !show;
                        elem.style = "display: none;";

                        tocView.innerHTML = `
                          <div class="phoneButtonsOverlay">
                            <div class="toContainer">
                              <div class="toc">
                                ${tocV}
                              </div>
                            </div>
                          </div>
                        `;
                      } else {
                        show = !show;
                        elem.removeAttribute("style");

                        document.getElementById("@TOC").innerHTML = "";
                      }
                    };

                    tocView.onclick = () => {
                      if (show) {
                        show = !show;
                        elem.removeAttribute("style");

                        document.getElementById("@TOC").innerHTML = "";
                      }
                    };
                  }

                }, 10);
                return `<div class="phoneShowBtnsButton phoneTOCbtn" id="${id}">#</div>`;
              }
              return `<div class="toc side">${marked.parse(toc(md).content)}</div>`;
            }
          }
        ]
      });

      var text = purify.sanitize(marked.parse(md));

      try {
        marked.use({extensions: extensions});
      } catch(_) {}

      try {
        text = purify.sanitize(marked.parse(md));
      } catch(_) {}

    return (
        <div className="container markdown-body" dangerouslySetInnerHTML={{__html: text}} />
    );
}

MDRenderer.defaultProps = {
    md: Constants.defaultText,
    extensions: [],
    query: new URLSearchParams(document.location.search)
}

export default MDRenderer;