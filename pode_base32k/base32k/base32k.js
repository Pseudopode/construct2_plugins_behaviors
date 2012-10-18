// base32k.js / https://github.com/simonratner/base32k
// Copyright (C) 2012 Simon Ratner, distributed under the MIT license.

(function(context){

/*
 *  Javascript implementation of base32k encoding, used to efficiently pack
 *  binary data into javascript's UTF-16 strings.
 *
 *  Based on comments by Perry A. Caro <caro@adobe.com>:
 *      http://lists.xml.org/archives/xml-dev/200307/msg00505.html
 *      http://lists.xml.org/archives/xml-dev/200307/msg00507.html
 *
 *  [Original comments follow, with corrections.]
 *
 *  Because of Unicode normalization requirements, it is important to pick an
 *  alphabet of codepoints that are unaffected by normalization, composition,
 *  or decomposition, and that are legal XML of course. I used the following
 *  ranges:
 *
 *      U+3400 thru U+4DB5 for 15-bit values of 0 thru 6581
 *      U+4E00 thru U+9FA5 for 15-bit values of 6582 thru 27483
 *      U+E000 thru U+F4A3 for 15-bit values of 27484 thru 32767
 *
 *  I was a little worried about using the private use area, since there are
 *  no guarantees about how an XML processor will report them, but there is
 *  no other contiguous range of Unicode codepoints of that size that avoid
 *  normalization issues.
 *
 *  Rather than padding, it turns out to be more useful to think about which
 *  bits are significant in the very last text character of the encoded data.
 *  Unless the original data was an even multiple of 15 bits, there will be
 *  from 1 to 14 bits left to encode. These bits can easily fit into a 16-bit
 *  text character, but unless some additional information is provided, a
 *  decoder will not be able to tell how many of the bits in the final text
 *  character are significant.
 *
 *  To solve this problem, a final UTF-16 character is used. This character is
 *  outside of the ranges listed above, so as not to be confused with data, and
 *  is used as a clear termination for the encoded data. It is selected from a
 *  contiguous range of 15 characters that have no normalization issues. I
 *  chose the following range, but there are several possible alternatives:
 *
 *      U+2401 thru U+240F
 *
 *  When this character is encountered, it signals the end of the encoding, and
 *  specifies the number of significant bits in the previous text character.
 *  U+2401 specifies 1 bit is significant, U+2402 specifies 2 bits, etc., thru
 *  U+240F for all 15 bits significant. This means that every encoded sequence
 *  is terminated by one of these characters, regardless of how many bits were
 *  in the original data.
 *
 *  As for all of the text characters, the data bits are read from most
 *  significant (0x4000) to least significant (0x0001).
 */

// Work around javascript's argument limit.
// See: http://webreflection.blogspot.com/2011/07/about-javascript-apply-arguments-limit.html
var fromCharCodes = (function(fromCharCode, maxargs) {
  return function(code) {
    typeof code == "number" && (code = [code]);
    var parts = [];
    for (var i = 0, len = code.length; i < len; i += maxargs) {
      parts.push(fromCharCode.apply(null, code.slice(i, i + maxargs)));
    }
    return parts.join("");
  };
}(String.fromCharCode, 2048));

// Convert a Unicode code point to a 15-bit int
var u2i = function(u) {
  if (u >= 0x3400 && u <= 0x4DB5) {
    return u - 0x3400;
  } else if (u >= 0x4E00 && u <= 0x9FA5) {
    return u - (0x4E00 - 6582);
  } else if (u >= 0xE000 && u <= 0xF4A3) {
    return u - (0xE000 - 27484);
  } else {
    throw "Invalid encoding U+" + ("000" + u.toString(16).toUpperCase()).slice(-4);
  }
};

// Convert a 15-bit int to a Unicode code point
var i2u = function(i) {
  if (i < 6582) {
    return 0x3400 + i;
  } else if (i < 27484) {
    return 0x4E00 + i - 6582;
  } else {
    return 0xE000 + i - 27484;
  }
};

context.base32k = {
  encode: function(a) {
    var bits = a.length * 32;
    var out = [];
    for (var p, q, r, i = 0; i < bits; i += 15) {
      q = (i / 32) | 0;  // force to int; Math.floor also works
      r = (i % 32);
      if (r <= 17) {
        p = (0x7FFF & (a[q] >>> (17 - r)));
      } else {
        p = (0x7FFF & (a[q] << (r - 17))) | (0x7FFF & (a[q + 1] >>> (49 - r)));
      }
      out.push(i2u(p));
    }
    out.push(0x240F - (i - bits));  // terminator
    return fromCharCodes(out);
  }
  ,
  encodeBytes: function(a) {
    var bits = a.length * 8;
    var at = typeof a == "string" ?
        function(i) { return a.charCodeAt(i) } :
        function(i) { return a[i] };
    var out = [];
    for (var p, q, r, i = 0; i < bits; i += 15) {
      q = (i / 8) | 0;  // force to int; Math.floor also works
      r = (i % 8);
      p = (at(q) << (7 + r));
      if (r == 0) {
        p |= (at(q + 1) >>> 1);
      } else {
        p |= (at(q + 1) << (r - 1)) | (at(q + 2) >>> (9 - r));
      }
      out.push(i2u(p & 0x7FFF));
    }
    out.push(0x240F - (i - bits));  // terminator
    return fromCharCodes(out);
  }
  ,
  decode: function(s) {
    var tailbits = s.charCodeAt(s.length - 1) - 0x2400;
    if (tailbits < 1 || tailbits > 15) {
      throw "Invalid encoding";
    }
    var out = [];
    for (var p, q, r, i = 0, len = s.length - 1; i < len; i++) {
      p = u2i(s.charCodeAt(i));
      q = ((i * 15) / 32) | 0;  // force to int; Math.floor also works
      r = ((i * 15) % 32);
      if (r <= 17) {
        out[q] |= p << (17 - r);
      } else {
        out[q] |= p >>> (r - 17);
        out[q + 1] |= p << (49 - r);
      }
    }
    if (r <= 17) {
      out[q] &= 0xFFFFFFFF << (32 - tailbits - r);
    } else if (tailbits > (32 - r)) {
      out[q + 1] &= 0xFFFFFFFF << (64 - tailbits - r);
    } else {
      out[q] &= 0xFFFFFFFF << (32 - tailbits - r);
      out.length--;
    }
    return out;
  }
  ,
  decodeBytes: function(s) {
    var tailbits = s.charCodeAt(s.length - 1) - 0x2400;
    if (tailbits < 1 || tailbits > 15) {
      throw "Invalid encoding";
    }
    var out = [];
    for (var p, q, r, i = 0, len = s.length - 1; i < len; i++) {
      p = u2i(s.charCodeAt(i));
      q = ((i * 15) / 8) | 0;  // force to int; Math.floor also works
      r = ((i * 15) % 8);
      out[q] |= 0xFF & (p >>> (7 + r));
      if (r == 0) {
        out[q + 1] |= 0xFF & (p << 1);
      } else {
        out[q + 1] |= 0xFF & (p >>> (r - 1));
        out[q + 2] |= 0xFF & (p << (9 - r));
      }
    }
    out.length = ((s.length - 2) * 15 + tailbits) / 8;
    return fromCharCodes(out);
  }
}

})(this);
