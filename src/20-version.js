// version check: compare against latest GitHub release (non-blocking)
(function(){
  var VER = (typeof VERSION !== "undefined") ? VERSION : "dev";
  if(VER === "dev") return;
  setTimeout(function(){
    fetch("https://api.github.com/repos/UnwiseDevLtd/hexmapper/releases/latest")
      .then(function(r){ return r.json(); })
      .then(function(d){
        if(d && d.tag_name && d.tag_name !== VER){
          console.log("[hexmapper] Update available: " + d.tag_name + " (you have " + VER + ")");
          var n = document.createElement("div");
          n.style.cssText = "position:fixed;bottom:8px;right:8px;background:#6ea8fe;color:#fff;padding:6px 12px;border-radius:6px;font-size:11px;cursor:pointer;z-index:99;font-family:sans-serif";
          n.textContent = "Update available: " + d.tag_name;
          n.onclick = function(){ window.open("https://github.com/UnwiseDevLtd/hexmapper/releases"); };
          document.body.appendChild(n);
          setTimeout(function(){ if(n.parentNode) n.parentNode.removeChild(n); }, 15000);
        }
      })
      .catch(function(){});
  }, 3000);
})();
