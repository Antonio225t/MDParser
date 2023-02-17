import './styles/style.css';
import './libraries/highlight/styles/stackoverflow-light.min.css';
//import './styles/github-markdown.css';
import './styles/base.scss'
import './styles/app.scss';
import './styles/fonts.scss';

import purify from 'dompurify';
import hljs from 'highlight.js';

import { marked, lexer, parser } from 'marked';
//import { Helmet } from 'react-helmet';

function App() {
  var md = `
# MDParser
**MDParser** is a tool writted in \`JavaScript\` for browser-rendering \`MarkDown\`.
\`\`\`JSON
{
  "test": 12,
  "ohno": "Leo potato"
}
\`\`\`
\`\`\`JS
function test(owo) {
  console.log(\`This is owo: \${owo}\` + " and I say hi to you!");
}
\`\`\`
**__owo__**
`;

  marked.setOptions({
    langPrefix: "hljs cblock language-",
    highlight: (code, lang) => {
      lang = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, {language:lang}).value;
    }
  });

  marked.use({
    extensions: [
      {
        name: "underline",
        level: "inline",
        start: (src) => {
          return src.match(/__(.*)__/)?.index;
        },
        tokenizer(src, tokens) {
          var match = src.match(/__(.*)__/);
          if (match) {
            var token = {
              type: "underline",
              raw: match[0],
              text: match[1].trim(),
              textTokens: [],
              childToken: ["text", "raw"]
            };
            this.lexer.inlineTokens(token.text, token.textTokens);
            return token;
          }
        },
        renderer(token) {
          console.log(token)
          return `<u>${this.parser.parseInline(token.textTokens)}</u>`;
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
