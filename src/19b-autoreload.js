// dev-only auto-reload: when node build.js --watch rewrites dist/app.js, the
// browser detects the new Last-Modified and refreshes. Skipped in standalone
// builds (where VERSION is defined and there's no separate app.js).
if(typeof VERSION === "undefined"){
  var _lastMod = null;
  setInterval(function(){
    fetch("dist/app.js", { method: "HEAD", cache: "no-store" })
      .then(function(r){
        var m = r.headers.get("last-modified");
        if(_lastMod !== null && m !== _lastMod) location.reload();
        _lastMod = m;
      }).catch(function(){});
  }, 1000);
}
