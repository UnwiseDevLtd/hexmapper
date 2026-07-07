let mode=null,lastHex=null,panStart=null,dragOff=null;
stage.addEventListener("contextmenu",e=>e.preventDefault());
stage.addEventListener("pointerdown",e=>{
  try{ stage.setPointerCapture(e.pointerId); }catch(_){}
  if(e.button===1){ mode="pan"; panStart={x:e.clientX,y:e.clientY,cx:cam.x,cy:cam.y}; stage.classList.add("panning"); return; }
  if(active.kind==="text"){
    if(e.button===0){
      const [wx,wy]=clientToWorld(e.clientX,e.clientY);
      const hi=hitText(wx,wy);
      if(hi>=0){ selText=hi; dragOff={x:wx-texts[hi].x,y:wy-texts[hi].y}; }
      else { texts.push({x:wx,y:wy,s:"",size:fontSize}); selText=texts.length-1; dragOff={x:0,y:0}; commit("create"); }
      syncTextPanel(); dirty=true; render(); mode="textdrag";
    }
    return;
  }
  const [wx,wy]=clientToWorld(e.clientX,e.clientY);
  const [c,r]=worldToHex(wx,wy);
  if(e.button===0 && opMode==="fill" && active.kind==="terrain"){
    if(floodFill(c,r)){ commit("fill"); scheduleSave(true); }
    render(); return;
  }
  // right-click always erases the active layer; Eraser op erases on left-click too
  strokeErasing = (e.button===2) || (e.button===0 && opMode==="erase");
  if(!strokeErasing){
    if(active.kind==="river") strokeVal=active.type;
    else if(active.kind==="road") strokeVal=1;
    else if(active.kind==="veg") strokeVal=active.type;
    else strokeVal=0;
  }
  mode="paint"; applyTool(c,r); lastHex={c,r}; scheduleSave(); render();
});
stage.addEventListener("pointermove",e=>{
  const [wx,wy]=clientToWorld(e.clientX,e.clientY);
  const [c,r]=worldToHex(wx,wy); hover={c,r};
  document.getElementById("curhex").textContent=inB(c,r)?`${hexId(c,r)} (${c},${r})`:"—";
  if(active.kind==="text"){ stage.classList.toggle("textmode",hitText(wx,wy)>=0||mode==="textdrag"); }
  if(mode==="pan"){ cam.x=panStart.cx+(e.clientX-panStart.x); cam.y=panStart.cy+(e.clientY-panStart.y); render(); }
  else if(mode==="textdrag"){ if(selText>=0){ texts[selText].x=wx-dragOff.x; texts[selText].y=wy-dragOff.y; dirty=true; render(); } }
  else if(mode==="paint"){ if(lastHex) paintLine(lastHex.c,lastHex.r,c,r); else applyTool(c,r); lastHex={c,r}; scheduleSave(); render(); }
  else render();
});
function endPtr(e){
  if(mode==="paint") commit("paint");
  else if(mode==="textdrag") commit("drag");
  if(mode==="paint"||mode==="textdrag") scheduleSave(true);
  mode=null; lastHex=null; dragOff=null; strokeErasing=false;
  stage.classList.remove("panning"); stage.classList.remove("textmode");
  try{stage.releasePointerCapture(e.pointerId);}catch(_){}
  render();
}
stage.addEventListener("pointerup",endPtr);
stage.addEventListener("pointercancel",endPtr);
stage.addEventListener("pointerleave",()=>{ hover={c:-1,r:-1}; if(mode!=="paint"&&mode!=="textdrag") render(); });
stage.addEventListener("wheel",e=>{ e.preventDefault(); zoomAt(e.clientX,e.clientY,e.deltaY<0?1.12:1/1.12); },{passive:false});
