// accordion behaviour for every .collapse (palette + settings): click head to
// toggle, siblings close. Only one open per group; palette auto-opens the
// section holding the active tool (see openActiveSection).
document.addEventListener("click",e=>{
  const head=e.target.closest(".collapse-head");
  if(!head) return;
  const col=head.closest(".collapse");
  const group=col.parentElement;
  if(group) group.querySelectorAll(":scope > .collapse").forEach(c=>{ if(c!==col) c.classList.remove("open"); });
  col.classList.toggle("open");
});

document.querySelectorAll("[data-vs]").forEach(b=>{
  b.onclick=()=>{ viewStyle=b.dataset.vs; document.querySelectorAll("[data-vs]").forEach(x=>x.classList.toggle("on",x===b)); dirty=true; render(); };
});
document.getElementById("dimapply").onclick=()=>{ resizeGrid(+document.getElementById("colsin").value||1, +document.getElementById("rowsin").value||1); };
document.getElementById("rotate").onclick=transposeGrid;
document.getElementById("idshow").addEventListener("change",e=>{ showIds=e.target.checked; dirty=true; render(); });
document.getElementById("idsz").addEventListener("input",e=>{ idSize=+e.target.value; document.getElementById("idsv").textContent=idSize; if(showIds){ dirty=true; render(); } });
document.getElementById("idbg").onclick=()=>{ idBg = idBg==="none"?"white":(idBg==="white"?"dark":"none"); document.getElementById("idbg").textContent="BG: "+idBg; if(showIds){ dirty=true; render(); } };
document.getElementById("idpos").onclick=()=>{ idPos = idPos==="center"?"top":"center"; document.getElementById("idpos").textContent="Pos: "+idPos; if(showIds){ dirty=true; render(); } };
