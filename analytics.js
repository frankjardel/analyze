var hasConsole = typeof console !== "undefined"

var fingerprintReport = function () {
  var d1 = new Date()
  Fingerprint2.get(function(components) {
    var murmur = Fingerprint2.x64hash128(components.map(function (pair) { return pair.value }).join(), 31)
    var d2 = new Date()
    var time = d2 - d1

    localStorage.setItem('time', time)
    localStorage.setItem('fingerprint', murmur)

    var details = ""

    for (var index in components) {
      var obj = components[index]
      var line = obj.key + " = " + String(obj.value).substr(0, 100)
      details += line + "<br>"
    }

    localStorage.setItem('details', details)

  })
}

var cancelId
var cancelFunction

// see usage note in the README
if (window.requestIdleCallback) {
  cancelId = requestIdleCallback(fingerprintReport)
  cancelFunction = cancelIdleCallback
} else {
  cancelId = setTimeout(fingerprintReport, 500)
  cancelFunction = clearTimeout
}


/**
 * @IP
 */
function getIp(callback)
{
  function response(s)
  {
      callback(window.userip);

      s.onload = s.onerror = null;
      document.body.removeChild(s);
  }

  function trigger()
  {
    window.userip = false;

    var s = document.createElement("script");
    s.async = true;
    s.onload = function() {
        response(s);
    };
    s.onerror = function() {
        response(s);
    };

    s.src = "https://l2.io/ip.js?var=userip";
    document.body.appendChild(s);
  }

  if (/^(interactive|complete)$/i.test(document.readyState)) {
      trigger();
  } else {
      document.addEventListener('DOMContentLoaded', trigger);
  }
}

getIp(function (ip) {
  localStorage.setItem('ip', ip)
});
