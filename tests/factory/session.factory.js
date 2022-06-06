const buffer  = require('safe-buffer').Buffer;
const key     = require('../../config/keys'); 
const KeyGrip = require('Keygrip');


module.exports = userId => {
    const sessionObj = {
        'passport': {
            'user': userId
        }
    }

    const sessionBase64 = buffer.from(JSON.stringify(sessionObj)).toString('base64');
    const keygrip = new KeyGrip([key.cookieKey]);
    const sessionsignature = keygrip.sign(`session=${sessionBase64}`);
    
    return {sessionBase64, sessionsignature}
}