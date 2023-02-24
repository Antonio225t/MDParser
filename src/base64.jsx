import base64 from 'base-64';
import utf8 from 'utf8';

function encode(text) {
    return encodeURI(base64.encode(utf8.encode(text)));
}

function decode(btext) {
    return utf8.decode(base64.decode(decodeURI(btext)));
}

const exp = { encode, decode };

export default exp;