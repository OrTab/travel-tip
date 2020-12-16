'use strict'

export const utilService = {
    makeId
}

function makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEGHIJK36LMNO21485PQRSTUVWXYZabxyz0123456789';

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
}