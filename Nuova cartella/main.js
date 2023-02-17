// Get the container from HTML document
var container = document.getElementsByClassName("markdown-body")[0];

// Create the custom extension of Marked for underline support
marked.use({
    extensions: [
        {
            name: "Underline support",
            level: "inline",
            start: (src) => {
                return src.match(/__(.*)__/)?.index;
            },
            tokenizer: (src, tokens) => {
                var match = /__(.*)__/.exec(src);
                if (match) {
                    return {
                        type: "underline",
                        raw: match[0],
                        text: this.lexer.inlineTokens(match[1].trim())
                    };
                }
            },
            renderer: (token) => {
                return `<u>${this.parser.parseInline(token.text)}</u>`;
            },
            childToken: ["u"]
        }
    ]
});

container.insertAdjacentHTML("beforeend", marked.parse(`
# Splendor
Hello everybody!!

**Hellow** __Hi__

> Test
`));