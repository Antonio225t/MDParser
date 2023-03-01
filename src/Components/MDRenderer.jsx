import purify from 'dompurify';
import hljs from 'highlight.js';

import Constants from '../Constants';

import { marked } from 'marked';


function MDRenderer({ md, extensions, query }) {

    md = md !== "" ? md : Constants.defaultText;

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
              query.set("mdocPage", token.doc);
              return query.has("mdoc") && window.mdoc[token.doc] ? `<a href="${window.location.href.split("?")[0] + "?" + query.toString()}">${this.parser.parseInline(token.text, null)}</a>` : `<span class="noMdoc" title="${Constants.noMdoc}">${this.parser.parseInline(token.text, null)}</span>`;
            }
          }
        ]
      });

      try {
        marked.use({extensions: extensions});
      } catch(_) {}

    return (
        <div className="container markdown-body" dangerouslySetInnerHTML={{__html: purify.sanitize(marked.parse(md))}} />
    );
}

MDRenderer.defaultProps = {
    md: Constants.defaultText,
    extensions: [],
    query: new URLSearchParams(document.location.search)
}

export default MDRenderer;