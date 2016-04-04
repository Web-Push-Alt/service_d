var COOKIE_NAME = "web-push";
var COOKIE_EXPIRATION_DATE = 1;
var docCookies = {
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};
/** クッキーの書き込み */
function writeCookie(aValue, aName, aExpires) {
    var value = aValue;
    var name = aName;
    var expires = aExpires;

    // クッキーの有効確認
    if (isEnabledCookie()) {
        if (!value) {
            return false;
        }
        if (!name) {
            name = COOKIE_NAME;
        }
        if (!expires) {
            // 有効期限の作成
            var nowtime = new Date().getTime();
            var clear_time = new Date(nowtime + (60 * 60 * 24 * 1000 * COOKIE_EXPIRATION_DATE));
            expires = clear_time.toGMTString();
        }
        var nameVal = escape(value);

        // クッキーの発行（書き込み）
        var domain = '.github.io';
        var encDomain = encodeURIComponent(domain);
        docCookies.setItems(name, value, expires, '/', domain, true);
        //setCookie(name, value, 365, '/', 'web-push-alt.github.io', false);
        //document.cookie = name + "=" + escape(value) + '; expires=' + expires  +'; domain=.github.io' + '; path=/';
        //chrome.cookies.set({
        //        "url": "https://web-push-alt.github.io/",
        //        "name": name,
        //        "value": nameVal,
        //        "domain": ".github.io",
        //        "path":"/",
        //        "secure":true,
        //        "expirationDateOptional":expires
        //    }, function (cookie) {
        //        console.log(JSON.stringify(cookie));
        //        console.log(chrome.extension.lastError);
        //       console.log(chrome.runtime.lastError);
        //    }
        //);
        return true;
    } else {
        return false;
    }
}

function setCookie(name, value, day, path, domain, secure){
    /**
     * 機能：クッキーを焼く（セットする）
     * 引数：name:キー（必須）
     * 引数：value:値 （必須）
     * 引数：day:クッキーの有効日数（省略時はセッションクッキー）
     * 引数：path:クッキーを書き込むPath（省略時は実行パス）
     * 引数：domain:クッキーを書き込むDomain（省略時は実行ドメイン）
     * 引数：secure:セキュアかどうか？（省略時はfalse）
     * 戻値：なし
     */
  
    var member = escape(name) + "=" + escape(value) + ";";
    if (day) {
        var exp = new Date();
        exp.setTime(exp.getTime() + (day*24*60*60*1000));
    }
    var cookie = member
        + ((day == null)     ? ""   : ("expires=" + exp.toUTCString()+";"))
        + ((path == null)    ? ""   : ("path=" + path+";"))
        + ((domain == null)  ? ""   : ("domain=" + domain+";"))
        + ((secure == true)  ? "secure;" : "");
    document.cookie = cookie;
}

/** クッキーの読み込み */
function readCookie(aName) {
    var name = aName;
    var cookie;
    // クッキーの有効確認
    if (isEnabledCookie()) {
        if (!name) {
            name = COOKIE_NAME;
        }

        // 発行したクッキーの取得（読み込み）
        if (document.cookie) {
            // 取得したクッキーを分割
            var cookies = document.cookie.split("; ");
            for (var i = 0; i < cookies.length; i++) {
                var str = cookies[i].split("=");
                if (str[0] == name) {
                    cookie = unescape(str[1]);
                    break;
                }
            }
        }
    }
    return cookie;
}

/** クッキーの削除 */
function deleteCookie(aName) {
    var name = aName;

    // クッキーの有効確認
    if (isEnabledCookie()) {
        if (!name) {
            name = COOKIE_NAME;
        }

        //日付データを作成する
        var date1 = new Date();

        //1970年1月1日00:00:00の日付データをセットする
        date1.setTime(0);

        //有効期限を過去にして書き込む
        document.cookie = name + "=;expires=" + date1.toGMTString() + '; path=/';

        return true;
    } else {
        return false;
    }
}

/** クッキーの有無確認 */
function isEnabledCookie() {
    return window.navigator.cookieEnabled;
}
