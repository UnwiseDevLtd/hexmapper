document.querySelectorAll(".tabs button").forEach(b=>{
  b.onclick=()=>{
    document.querySelectorAll(".tabs button").forEach(x=>x.classList.toggle("on",x===b));
    document.querySelectorAll(".pane").forEach(p=>p.classList.toggle("on",p.dataset.pane===b.dataset.tab));
  };
});
function setPaintMode(m){
  paintMode=m;
  document.getElementById("pmline").classList.toggle("on",m==="line");
  document.getElementById("pmfill").classList.toggle("on",m==="fill");
}
document.getElementById("pmline").onclick=()=>setPaintMode("line");
document.getElementById("pmfill").onclick=()=>setPaintMode("fill");
document.getElementById("dimapply").onclick=()=>{ resizeGrid(+document.getElementById("colsin").value||1, +document.getElementById("rowsin").value||1); };
document.getElementById("rotate").onclick=rotate60;
document.getElementById("idshow").addEventListener("change",e=>{ showIds=e.target.checked; dirty=true; render(); });
document.getElementById("idsz").addEventListener("input",e=>{ idSize=+e.target.value; document.getElementById("idsv").textContent=idSize; if(showIds){ dirty=true; render(); } });
document.getElementById("idbg").onclick=()=>{ idBg = idBg==="none"?"white":(idBg==="white"?"dark":"none"); document.getElementById("idbg").textContent="BG: "+idBg; if(showIds){ dirty=true; render(); } };
document.getElementById("idpos").onclick=()=>{ idPos = idPos==="center"?"top":"center"; document.getElementById("idpos").textContent="Pos: "+idPos; if(showIds){ dirty=true; render(); } };
