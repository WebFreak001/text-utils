import * as assert from "assert";
import {
  base64Encode,
  base64Decode,
  xmlEntityEncode,
  xmlEntityDecode,
  mimeHeaderDecode,
} from "../conversion";

describe("Text Utils Extension Tests", () => {
  // ---- Base64 ----
  it("should encode Base64", () => {
    const input = "Hello World";
    const output = base64Encode(input);
    assert.strictEqual(output, "SGVsbG8gV29ybGQ=");
  });

  it("should decode Base64", () => {
    const input = "SGVsbG8gV29ybGQ=";
    const output = base64Decode(input);
    assert.strictEqual(output, "Hello World");
  });

  // ---- XML Entity Encode/Decode ----
  it("should encode XML entities", () => {
    const input = `<tag attr="val">&text</tag>`;
    const output = xmlEntityEncode(input);
    assert.strictEqual(
      output,
      "&lt;tag attr=&quot;val&quot;&gt;&amp;text&lt;/tag&gt;"
    );
  });

  it("should decode XML entities", () => {
    const input = "&lt;tag attr=&quot;val&quot;&gt;&amp;text&lt;/tag&gt;";
    const output = xmlEntityDecode(input);
    assert.strictEqual(output, `<tag attr="val">&text</tag>`);
  });

  it("should decode numeric XML entities", () => {
    assert.strictEqual(xmlEntityDecode("&#65;"), "A");
    assert.strictEqual(xmlEntityDecode("&#x41;"), "A");
  });

  it("should decode named European characters", () => {
    assert.strictEqual(xmlEntityDecode("&eacute;"), "é");
    assert.strictEqual(xmlEntityDecode("&uuml;"), "ü");
    assert.strictEqual(xmlEntityDecode("&Agrave;"), "À");
  });

  // ---- MIME Header Decode ----
  it("should decode all occurences of mime headers in selection", () => {
    const input = "=?UTF-8?B?SGVsbG8=?= =?UTF-8?B?d29ybGQ=?=";
    const output = mimeHeaderDecode(input);
    assert.strictEqual(output, "Hello world");
  });

  it("should decode UTF-8 Base64 MIME header", () => {
    const input = "=?UTF-8?B?SGVsbG8gd29ybGQ=?=";
    const output = mimeHeaderDecode(input);
    assert.strictEqual(output, "Hello world");
  });

  it("should decode partially cut-off base64 MIME header", () => {
    const input = "=?utf-8?B?SWhyZSBBdWZ0cmFnc2Jlc3TDpHRpZ3VuZzsgSWhyZSBCZXN0ZW?=";
    const output = mimeHeaderDecode(input);
    assert.strictEqual(output, "Ihre Auftragsbestätigung; Ihre Beste");
  });

  it("should decode UTF-8 Quoted-Printable MIME header", () => {
    const input = "=?UTF-8?Q?Ol=C3=A1_Mundo?=";
    const output = mimeHeaderDecode(input);
    assert.strictEqual(output, "Olá Mundo");
  });
});
