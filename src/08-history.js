let history=[], histPtr=-1, lastKind=null, lastTime=0;
const HIST_MAX=100;
function snapshot(){
  return {cols:COLS,rows:ROWS,
    terrain:terrain.slice(), rivers:rivers.slice(), roads:roads.slice(), veg:veg.slice(), entity:entity.slice(),
    texts:texts.map(t=>({...t}))};
}
function restore(s){
  COLS=s.cols; ROWS=s.rows; recomputeGrid();
  allocArrays();
  terrain.set(s.terrain);
  if(s.rivers) rivers.set(s.rivers);
  if(s.roads) roads.set(s.roads);
  if(s.veg) veg.set(s.veg);
  if(s.entity) entity.set(s.entity);
  texts=s.texts.map(t=>({...t})); selText=-1; dirty=true; updateDims(); syncTextPanel(); fitGrid(); render();
}
function commit(kind){
  const now=Date.now(), snap=snapshot();
  if(kind==="text"&&lastKind==="text"&&now-lastTime<500&&histPtr>=0&&histPtr===history.length-1){
    history[histPtr]=snap;
  } else {
    history=history.slice(0,histPtr+1); history.push(snap);
    if(history.length>HIST_MAX) history.shift();
    histPtr=history.length-1;
  }
  lastKind=kind; lastTime=now; updateHistButtons();
}
function undo(){ if(histPtr<=0) return; histPtr--; restore(history[histPtr]); lastKind=null; updateHistButtons(); scheduleSave(true); }
function redo(){ if(histPtr>=history.length-1) return; histPtr++; restore(history[histPtr]); lastKind=null; updateHistButtons(); scheduleSave(true); }
function updateHistButtons(){ undoBtn.disabled=histPtr<=0; redoBtn.disabled=histPtr>=history.length-1; }
