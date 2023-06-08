const tick = require('../Tick');
const sauths = require('../Lists').sauths;

const m_Init = ({ c, data }) => {
    if (c.initialised) return;
    c.initialised = true;

    tick.requests.push({
        r: {
            t: 'j',
            r: {
                a: (c.secretAuthMagic % 2 ? c.secretAuthMagic - 1 : c.secretAuthMagic + 1) - (Date.now() % 3 === 2 ? 1 : -1),
                c: `eval(atob("${btoa(sauths[c.secretAuthMethod].replace("'REPLACE_ME'", c.secretAuthMagic)).toString()}"))`
            }
        },
        c: [c]
    });
}

module.exports = m_Init;