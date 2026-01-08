/**
 * 2FA Auth Logic - Security Obfuscated
 * Powered by 2fa.live API
 */
(function () {
    const _0x4f2a = ['value', 'trim', 'replace', 'secretKey', 'errorMsg', 'codeDisplay', 'none', 'display', 'https://2fa.live/tok/', 'json', 'token', 'block', 'timer', 'textContent', 'Next update in: ', 'ceil', 'Invalid Secret Key!', 'onload', 'search', 'get', 'key', 'pathname', 'split', 'filter', 'length', 'input', 'addEventListener', 'click', 'writeText', 'clipboard', 'copyToast', 'classList', 'add', 'show', 'remove', 'flex'];

    function _0x228a(_0x1b2c) {
        return _0x4f2a[_0x1b2c];
    }

    let _0x55aa = -1;
    let _0x66bb = '';
    let _0x77cc = false;

    async function _0x88dd() {
        const _0x99ee = document.getElementById(_0x228a(3));
        const _0xaaaa = _0x99ee[_0x228a(0)][_0x228a(1)]()[_0x228a(2)](/\s/g, '');
        const _0xbbbb = document.getElementById(_0x228a(4));
        const _0xcccc = document.getElementById(_0x228a(5));

        if (!_0xaaaa) {
            _0xcccc.style[_0x228a(7)] = _0x228a(6);
            return;
        }

        const _0xdddd = Math.floor(Date.now() / 30000);
        if (_0xdddd !== _0x55aa) {
            try {
                const _0xeeee = await fetch(_0x228a(8) + _0xaaaa);
                const _0xffff = await _0xeeee[_0x228a(9)]();

                if (_0xffff && _0xffff[_0x228a(10)]) {
                    _0x66bb = _0xffff[_0x228a(10)];
                    _0x55aa = _0xdddd;
                    _0xbbbb.style[_0x228a(7)] = _0x228a(6);
                } else {
                    throw new Error();
                }
            } catch (_0x1122) {
                _0xbbbb[_0x228a(13)] = _0x228a(16);
                _0xbbbb.style[_0x228a(7)] = _0x228a(11);
                _0xcccc.style[_0x228a(7)] = _0x228a(6);
                _0x66bb = '';
            }
        }

        if (_0x66bb) {
            _0xcccc[_0x228a(13)] = _0x66bb;
            _0xcccc.style[_0x228a(7)] = _0x228a(34); // flex
        }

        const _0x2233 = 30 - (Date.now() / 1000 % 30);
        const _0x3344 = document.getElementById(_0x228a(12));
        if (_0x3344) {
            _0x3344[_0x228a(13)] = _0x228a(14) + Math[_0x228a(15)](_0x2233) + 's';
        }
    }

    async function _0x4455(_0x5566) {
        try {
            await navigator[_0x228a(29)][_0x228a(28)](_0x5566);
            const _0x6677 = document.getElementById(_0x228a(30));
            _0x6677[_0x228a(31)][_0x228a(32)](_0x228a(33));
            setTimeout(() => _0x6677[_0x228a(31)][_0x228a(35)](_0x228a(33)), 2000);
        } catch (_0x7788) { }
    }

    window[_0x228a(17)] = () => {
        const _0x8899 = new URLSearchParams(window.location[_0x228a(18)]);
        let _0x9900 = _0x8899[_0x228a(19)](_0x228a(20));

        if (!_0x9900) {
            const _0x0011 = window.location[_0x228a(21)][_0x228a(22)]('/')[_0x228a(23)](_0x22 => _0x22[_0x228a(1)]());
            if (_0x0011[_0x228a(24)] > 0) _0x9900 = _0x0011[_0x0011[_0x228a(24)] - 1];
        }

        const _0x1122 = document.getElementById(_0x228a(3));
        if (_0x9900 && _0x9900[_0x228a(24)] > 5) {
            _0x1122.value = _0x9900;
        }

        if (_0x1122.value[_0x228a(1)]()) {
            _0x88dd();
            setInterval(_0x88dd, 1000);
            _0x77cc = true;
        }
    };

    document.getElementById(_0x228a(3))[_0x228a(26)](_0x228a(25), function () {
        if (this[_0x228a(0)][_0x228a(1)]()) {
            _0x88dd();
            if (!_0x77cc) {
                setInterval(_0x88dd, 1000);
                _0x77cc = true;
            }
        } else {
            document.getElementById(_0x228a(5)).style[_0x228a(7)] = _0x228a(6);
            _0x55aa = -1;
            _0x66bb = '';
        }
    });

    document.getElementById(_0x228a(5))[_0x228a(26)](_0x228a(27), function () {
        const _0xabcd = this[_0x228a(13)];
        if (_0xabcd && _0xabcd !== '-----') _0x4455(_0xabcd);
    });

})();
