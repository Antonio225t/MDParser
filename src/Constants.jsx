const exp = {
    httpError: (url) => {
        return `
# Error on loading the URL
Can't get the MD file from **${url}**.


### What went wrong?
This could be the result of a **CORS** error or a **404**.

Click **COMMAND/CTRL** + **ALT** + **F4** (or **F12**) and open the console for more informations.`
    },
    defaultText: `
# MDParser
This is **MDParser**. A tool that you can use for building Markdown page by a Base64 text!
### How does this work?
Here's how it works:

* First off, you want to write your MD document in a base64, you can use the [editor](editor) or a Base64 formatter like [this](https://amp.base64encode.org/) one.
* After you write your document and converted it into a Base64 text, go to \`/?text=(md-in-base64)\` replacing the \`(md-in-base64)\` with your Base64 document.
And that's all!

(This doesn't actually support TOC at the moment.)
## Thank you.
I'll upgrade this tool so it'll be flexible and fun to use, but for now thank you for using it! 😀`,
    noMdoc: "Can't find the doc!",
    defaultEdit: `
# Hello, World!
You can type here and your text appears in \`Markdown\` [here](on_the_right)!`,
    on_the_right: `
# on_the_right
Yes, the parsed text will appear on this box! Go back [here](editor) to check it out yourself!`
};

export default exp;