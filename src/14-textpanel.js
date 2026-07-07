function syncTextPanel(){ tpanelEl.style.display = selText>=0 ? "block" : "none"; updateTextPanel(); }
function updateTextPanel(){
  const sel=selText>=0&&texts[selText];
  txtEl.value = sel? sel.s : "";
  tsizeEl.value = sel? sel.size : fontSize;
  tsvEl.textContent = tsizeEl.value;
  tdelEl.disabled = !sel;
  thintEl.textContent = sel ? "Selected — drag on map to move, type above, or delete." : "Click the map to add a label; click a label to edit it.";
}
txtEl.addEventListener("input",()=>{ if(selText>=0){ texts[selText].s=txtEl.value; dirty=true; render(); commit("text"); scheduleSave(); } });
tsizeEl.addEventListener("input",()=>{ const v=+tsizeEl.value; fontSize=v; tsvEl.textContent=v; if(selText>=0){ texts[selText].size=v; dirty=true; render(); commit("text"); scheduleSave(); } });
tdelEl.onclick=()=>{ if(selText>=0){ texts.splice(selText,1); selText=-1; syncTextPanel(); dirty=true; scheduleSave(true); commit("delete"); render(); } };
