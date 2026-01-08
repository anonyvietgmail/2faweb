/**
 * 2FA Auth Logic - Security Obfuscated
 * Powered by 2fa.live API via CORS Proxy
 */
(function () {
    // Array of words used in the script (English only)
    const _0x4f2a = [
        'value',            // 0
        'trim',             // 1
        'replace',          // 2
        'secretKey',        // 3
        'errorMsg',         // 4
        'codeDisplay',      // 5
        'none',             // 6
        'display',          // 7
        'https://api.allorigins.win/get?url=', // 8 (Proxy)
        'https://2fa.live/tok/', // 9 (API)
        'json',             // 10
        'contents',         // 11
        'parse',            // 12
        'token',            // 13
        'block',            // 14
        'timer',            // 15
        'textContent',      // 16
        'Next update in: ', // 17
        'ceil',             // 18
        'Invalid Secret Key!', // 19
        'onload',           // 20
        'search',           // 21
        'get',              // 22
        'key',              // 23
        'pathname',         // 24
        'split',            // 25
        'filter',           // 26
        'length',           // 27
        'input',            // 28
        'addEventListener', // 29
        'click',            // 30
        'writeText',        // 31
        'clipboard',        // 32
        'copyToast',        // 33
        'classList',        // 34
        'add',              // 35
        'show',             // 36
        'remove',           // 37
        'flex'              // 38
    ];

    function _0x228a(_0x1b2c) {
        return _0x4f2a[_0x1b2c];
    }

    let _0x55aa = -1;
    let _0x66bb = '';
    let _0x77cc = false;

    async function _0x88dd() {
        const _0x99ee = document.getElementById(_0x228a(3)); // secretKey
        const _0xaaaa = _0x99ee[_0x228a(0)][_0x228a(1)]()[_0x228a(2)](/\s/g, ''); // value, trim, replace
        const _0xbbbb = document.getElementById(_0x228a(4)); // errorMsg
        const _0xcccc = document.getElementById(_0x228a(5)); // codeDisplay

        if (!_0xaaaa) {
            _0xcccc.style[_0x228a(7)] = _0x228a(6); // display, none
            return;
        }

        const _0xdddd = Math.floor(Date.now() / 30000);
        if (_0xdddd !== _0x55aa) {
            try {
                // Fetch via CORS Proxy
                const _0xeeee = await fetch(_0x228a(8) + encodeURIComponent(_0x228a(9) + _0xaaaa));
                const _0xffff = await _0xeeee[_0x228a(10)](); // json

                if (_0xffff && _0xffff[_0x228a(11)]) { // contents
                    const _0x1122 = JSON[_0x228a(12)](_0xffff[_0x228a(11)]); // parse
                    if (_0x1122 && _0x1122[_0x228a(13)]) { // token
                        _0x66bb = _0x1122[_0x228a(13)];
                        _0x55aa = _0xdddd;
                        _0xbbbb.style[_0x228a(7)] = _0x228a(6); // none
                    } else {
                        throw new Error();
                    }
                } else {
                    throw new Error();
                }
            } catch (_0x2233) {
                _0xbbbb[_0x228a(16)] = _0x228a(19); // textContent, Invalid Secret Key!
                _0xbbbb.style[_0x228a(7)] = _0x228a(14); // block
                _0xcccc.style[_0x228a(7)] = _0x228a(6); // none
                _0x66bb = '';
            }
        }

        if (_0x66bb) {
            _0xcccc[_0x228a(16)] = _0x66bb; // textContent
            _0xcccc.style[_0x228a(7)] = _0x228a(38); // flex
        }

        const _0x3344 = 30 - (Date.now() / 1000 % 30);
        const _0x4455 = document.getElementById(_0x228a(15)); // timer
        if (_0x4455) {
            _0x4455[_0x228a(16)] = _0x228a(17) + Math[_0x228a(18)](_0x3344) + 's'; // Next update in: , ceil
        }
    }

    async function _0x5566(_0x6677) {
        try {
            await navigator[_0x228a(32)][_0x228a(31)](_0x6677); // clipboard, writeText
            const _0x7788 = document.getElementById(_0x228a(33)); // copyToast
            _0x7788[_0x228a(34)][_0x228a(35)](_0x228a(36)); // classList, add, show
            setTimeout(() => _0x7788[_0x228a(34)][_0x228a(37)](_0x228a(36)), 2000); // remove
        } catch (_0x8899) { }
    }

    window[_0x228a(20)] = () => { // onload
        const _0x9900 = new URLSearchParams(window.location[_0x228a(21)]); // search
        let _0x0011 = _0x9900[_0x228a(22)](_0x228a(23)); // get, key

        if (!_0x0011) {
            const _0x1122 = window.location[_0x228a(24)][_0x228a(25)]('/')[_0x228a(26)](_0x22 => _0x22[_0x228a(1)]()); // pathname, split, filter
            if (_0x1122[_0x228a(27)] > 0) _0x0011 = _0x1122[_0x1122[_0x228a(27)] - 1]; // length
        }

        const _0x3344 = document.getElementById(_0x228a(3)); // secretKey
        if (_0x0011 && _0x0011[_0x228a(27)] > 5) {
            _0x3344.value = _0x0011;
        }

        if (_0x3344.value[_0x228a(1)]()) {
            _0x88dd();
            setInterval(_0x88dd, 1000);
            _0x77cc = true;
        }
    };

    document.getElementById(_0x228a(3))[_0x228a(29)](_0x228a(28), function () { // secretKey, addEventListener, input
        if (this[_0x228a(0)][_0x228a(1)]()) {
            _0x88dd();
            if (!_0x77cc) {
                setInterval(_0x88dd, 1000);
                _0x77cc = true;
            }
        } else {
            document.getElementById(_0x228a(5)).style[_0x228a(7)] = _0x228a(6); // codeDisplay, display, none
            _0x55aa = -1;
            _0x66bb = '';
        }
    });

    document.getElementById(_0x228a(5))[_0x228a(29)](_0x228a(30), function () { // codeDisplay, addEventListener, click
        const _0xabcd = this[_0x228a(16)]; // textContent
        if (_0xabcd && _0xabcd !== '-----') _0x5566(_0xabcd);
    });

})();
