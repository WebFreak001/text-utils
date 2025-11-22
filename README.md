# text-utils

Simple text & E-Mail encoding/decoding utilities:

* MIME header decode (e.g. `=?UTF-8?B?SGVsbG8gd29ybGQ=?=`)
* Base64 encode/decode (e.g. `SGVsbG8gV29ybGQ=`)
* Hex encode/decode (e.g. `SGVsbG8gV29ybGQ=`)
* JSON string encode/decode (e.g. `"^\\s*\\/\\*\\*(?!\\/)([^\\*]|\\*(?!\\/))*$"`) - warning: uses simple JSON.parse/JSON.stringify
* URL component encode/decode (e.g. `Hello%20World!`)
* XML entity encode/decode (e.g. `&lt;tag attr=&quot;val&quot;&gt;&amp;text&lt;/tag&gt;`) - optimized for European texts

Works in untrusted / restricted workspaces.

All decoding decodes to JavaScript strings, which are UTF-16, which VSCode then converts to the documents configured charset (e.g. UTF-8), so **binary data may be mangled and lost**. Newline characters inside your strings also auto-convert to the VSCode configured line endings. If you want to convert between charsets, use VSCode's text encoding feature in the bottom right.

Encoding converts the text to UTF-8 first before applying encodings. This may be configurable in the future to respect the currently selected VSCode file encoding.

Note that VSCode does not sync text of large files (> 5 MB) with extensions, so extensions can't convert properly within a large file (true for any extension) - copy over parts into a new untitled file, convert there, and paste back if you want to work around this. (While the extension could work around this by assuming a local file system, editing history would be lost, it would not work with dirty files and it would not work inside the web editor, so I am probably not going to add or accept changes regarding this while these issues remain)

This extension is primarily inspired from https://open-vsx.org/vscode/item?itemName=adamhartford.vscode-base64 - the extension works great and is dead simple, but is only for Base64 - I needed just a little bit more.

Similar extensions:
* https://open-vsx.org/vscode/item?itemName=mitchdenny.ecdc - contains more stuff, but hides it all behind a selection panel so you can't shortcut individual conversions easily, so I dropped that one immediately
* https://open-vsx.org/vscode/item?itemName=biati.vscode-text-tools - too many functions for me, also can call system commands and too much code for me to audit + does not contain MIME header decoding
* https://open-vsx.org/vscode/item?itemName=sergiogarciadev.vscode-encoding-tools - only Base64, Base32 and Hex - also has some buggy quirks with uppercase characters

Only semi-related, but looks really cool:
* https://open-vsx.org/vscode/item?itemName=lapo.asn1js

---

This extension is just the standard extension scaffold and then 90% ChatGPT generated, but tested afterwards and also not everything used. You can find the ChatGPT prompts in prompts.txt if you are interested in my usage with it. New additions will probably not continue from that chat.

I have no idea how the base code generated from that would be licensed but the code is so trivial that I doubt there can be much copyright on it.
