const exp = {
    httpError: (url) => {
        return `
# Error on loading the URL
Can't get the MD file from **${url}**.


### What went wrong?
This could be the result of a **CORS** error or a **404**.

Click **COMMAND/CTRL** + **ALT** + **F4** (or **F12**) and open the console for more informations.`
    },
    defaultText: `{btn "Open Editor" "https://raw.githubusercontent.com/Antonio225t/MDParser/main/src/Editor.png" "Click to open the editor" "var link = "editor";if (window.location.href.split("?")[0].split("#")[0].endsWith("/")) {window.location.href = window.location.href.split("?")[0].split("#")[0] + link;} else {window.location.href = window.location.href.split("?")[0].split("#")[0] + "/" + link;} "}
{btn "Open MD64" "https://github.com/Antonio225t/MDParser/blob/main/src/Input%20URL.png" "Click to open a .md64 file url" "var link = "?url=" + window.prompt("Input the url of the .md64 file (without '/MDParser?url=')");if (window.location.href.split("?")[0].split("#")[0].endsWith("/")) {window.location.href = window.location.href.split("?")[0].split("#")[0] + link;} else {window.location.href = window.location.href.split("?")[0].split("#")[0] + "/" + link;} "}
{btn "Open MDOC" "https://github.com/Antonio225t/MDParser/blob/main/src/Input%20URL.png" "Click to open a .mdoc file url" "var link = "?mdoc=" + window.prompt("Input the url of the .mdoc file (without '/MDParser?mdoc=')");if (window.location.href.split("?")[0].split("#")[0].endsWith("/")) {window.location.href = window.location.href.split("?")[0].split("#")[0] + link;} else {window.location.href = window.location.href.split("?")[0].split("#")[0] + "/" + link;} "}
[TOC]
# MDParser
This is **MDParser**. A tool that you can use for building Markdown page by a Base64 text!
## How does this work?
**For starters:** You can hop in the [editor](editor) and try it by typing **MarkDown**, then hover on the buttons for more information about them and you're good to go.

**For pros:** There are several ways to work with this tool, it just needs some \`query parameters\` __note that none of this are required, they are all optional__:
* \`?text=<base64 text>\` - **Base64 encoded** string containing **MarkDown**.
* \`?extensions=<base64 extension list>\` - Custom [Marked extensions](https://marked.js.org/using_pro#extensions) as list **Base64 encoded**.
* \`?url=<url to file.md64>\` - It loads a **MarkDown64** file (**it is __NOT__ a MarkDown file!!!**).
* \`?mdoc=<url to file.mdoc>\` - It loads a **Markdown Document** file, usefull for more pages than one.

If you want, you can convert plain text into Base64 using [this](https://amp.base64encode.org/) website.

## In depth
### What is an MD64 file?
A **MarkDown64** file is a \`JavaScript\` code containing **MarkDown** that will be loaded in the website with the \`url\` query parameter.

**MarkDown64** file can start with \`window.urlPage["md"]\` wich contains the **MarkDown** string, or it can start with \`window.urlPage["extensions"]\` wich includes custom extensions (__note that it **MUST** end with__ \`window.urlPage["md"]\` __bcause this starts the rendering script!__).

### What is an MDoc?
A **MarkDown Document** is a \`JavaScript\` file containing some **MarkDown** pages.

You can declare pages with \`window.mdoc["pagename"]\` and you can redirect users to it in other **MarkDown** pages with \`[page](mdoc://pagename)\`. To start all the script declare the \`index\` page with \`window.mdoc["index"]\` (__note that this **MUST** be the last page declared because it will start the rendering script!__).
## Thank you.
I'll upgrade this tool so it'll be flexible and fun to use, but for now thank you for using it! 😀`,
    noMdoc: "Can't find the doc!",
    phonePattern: /Android|iPhone|Phone/,
    defaultEdit: `
# Hello, World!
You can type here and your text appears in \`Markdown\` [here](on_the_right)!`,
    on_the_right: `
# on_the_right
Yes, the parsed text will appear on this box! Go back in the [editor](editor) and check it out yourself!`,
    defaultExtension: `
    [
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
            return \`<u>\${this.parser.parseInline(token.text, null)}</u>\`;
          },
        }
      ]`
};

export default exp;