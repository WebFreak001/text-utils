import iconv from "iconv-lite";

export function mimeHeaderDecode(text: string, warnings?: string[]): string {
  // Match one or more MIME-encoded blocks: =?charset?B|Q?encoded?=
  return text.replace(
    /=\?([^?]+)\?([bBqQ])\?([^?]+)\?=/g,
    (_, charset: string, encoding: string, encoded: string) => {
      try {
        charset = charset.toLowerCase();

        if (["B", "b"].includes(encoding)) {
          const bytes = Buffer.from(encoded, "base64");
          if (charset === "utf-8") {
            return bytes.toString("utf8");
          } else if (iconv.encodingExists(charset)) {
            return iconv.decode(bytes, charset);
          }
        } else if (["Q", "q"].includes(encoding)) {
          // RFC 2047 Quoted-Printable variant
          let str = encoded.replace(/_/g, " ");
          const bytes = Buffer.from(
            str.replace(/=([0-9A-Fa-f]{2})/g, (_, hex) =>
              String.fromCharCode(parseInt(hex, 16))
            ),
            "latin1"
          );

          if (charset === "utf-8") {
            return bytes.toString("utf8");
          } else if (iconv.encodingExists(charset)) {
            return iconv.decode(bytes, charset);
          }
        }
      } catch (e) {
        warnings?.push(
          e instanceof Error
            ? "Failed decoding MIME header part: " + e.message
            : "Failed decoding MIME header part"
        );
      }
      return _;
    }
  );
}

export function xmlEntityDecode(text: string) {
  // Full named-entity mapping (common XML/HTML entities)
  /* prettier-ignore */
  const namedEntities: Record<string, string> = {
    quot: '"',
    apos: "'",
    amp: "&",
    lt: "<",
    gt: ">",
    copy: "©",
    reg: "®",
    trade: "™",
    cent: "¢",
    pound: "£",
    yen: "¥",
    euro: "€",
    sect: "§",
    para: "¶",
    bull: "•",
    hellip: "…",
    ldquo: "“",
    rdquo: "”",
    lsquo: "‘",
    apos2: "’", // alternate apostrophe
    ndash: "–",
    mdash: "—",
    iexcl: "¡",
    iquest: "¿",
    deg: "°",
    plusmn: "±",
    micro: "µ",
    divide: "÷",
    times: "×",
    laquo: "«",
    raquo: "»",

    // ---- European accented characters (Latin-1 HTML4 entities) ----
    // Uppercase
    Agrave: "À", Aacute: "Á", Acirc: "Â", Atilde: "Ã", Auml: "Ä", Aring: "Å",
    AElig: "Æ", Ccedil: "Ç", Egrave: "È", Eacute: "É", Ecirc: "Ê", Euml: "Ë",
    Igrave: "Ì", Iacute: "Í", Icirc: "Î", Iuml: "Ï",
    ETH: "Ð", Ntilde: "Ñ",
    Ograve: "Ò", Oacute: "Ó", Ocirc: "Ô", Otilde: "Õ", Ouml: "Ö", Oslash: "Ø",
    Ugrave: "Ù", Uacute: "Ú", Ucirc: "Û", Uuml: "Ü",
    Yacute: "Ý", THORN: "Þ",

    // Lowercase
    agrave: "à", aacute: "á", acirc: "â", atilde: "ã", auml: "ä", aring: "å",
    aelig: "æ", ccedil: "ç", egrave: "è", eacute: "é", ecirc: "ê", euml: "ë",
    igrave: "ì", iacute: "í", icirc: "î", iuml: "ï",
    eth: "ð", ntilde: "ñ",
    ograve: "ò", oacute: "ó", ocirc: "ô", otilde: "õ", ouml: "ö", oslash: "ø",
    ugrave: "ù", uacute: "ú", ucirc: "û", uuml: "ü",
    yacute: "ý", thorn: "þ", yuml: "ÿ"
  };

  return text
    .replace(/&#(\d+);?/g, (_, dec) => {
      try {
        return String.fromCodePoint(Number(dec));
      } catch {
        return _;
      }
    })
    .replace(/&#x([0-9a-fA-F]+);?/g, (_, hex) => {
      try {
        return String.fromCodePoint(parseInt(hex, 16));
      } catch {
        return _;
      }
    })
    .replace(
      /&([a-zA-Z][a-zA-Z0-9]+);?/g,
      (_, name) => namedEntities[name] ?? `&${name};`
    );
}

export function xmlEntityEncode(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function base64Decode(text: string): string {
  return Buffer.from(text, "base64").toString("utf8");
}

export function base64Encode(text: string): string {
  return Buffer.from(text, "utf8").toString("base64");
}
