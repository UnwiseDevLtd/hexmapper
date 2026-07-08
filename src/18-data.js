function densityToGray(d){ const v=Math.round(240-d/100*200); const h=v.toString(16).padStart(2,"0"); return "#"+h+h+h; }
function buildHatchPatterns(g, stroke){
  const ts=10;
  const P={}, mk=(fn)=>{ const c=document.createElement("canvas"); c.width=ts; c.height=ts; fn(c.getContext("2d")); return g.createPattern(c,null); };
  P[3]=mk(h=>{h.fillStyle=stroke;[1,5,9].forEach(x=>[1,5,9].forEach(y=>h.fillRect(x,y,1.5,1.5)));});
  P[4]=mk(h=>{h.strokeStyle=stroke;h.lineWidth=.5;h.beginPath();h.moveTo(0,ts);h.lineTo(ts,0);h.stroke();});
  P[5]=mk(h=>{});
  P[6]=mk(h=>{h.fillStyle=stroke;for(let i=0;i<ts;i+=3)for(let j=0;j<ts;j+=3)h.fillRect(i,j,1,1);});
  P[7]=mk(h=>{h.strokeStyle=stroke;h.lineWidth=.5;h.beginPath();h.moveTo(0,ts);h.lineTo(ts,0);h.moveTo(3,ts);h.lineTo(ts,3);h.stroke();});
  P[8]=mk(h=>{h.strokeStyle=stroke;h.lineWidth=.5;h.beginPath();h.moveTo(0,ts);h.lineTo(ts,0);h.moveTo(3,ts);h.lineTo(ts,3);h.moveTo(0,7);h.lineTo(7,0);h.stroke();});
  P[9]=mk(h=>{h.strokeStyle=stroke;h.lineWidth=.5;h.beginPath();h.moveTo(0,3);h.lineTo(ts,3);h.moveTo(0,7);h.lineTo(ts,7);h.stroke();});
  P[10]=mk(h=>{h.strokeStyle=stroke;h.lineWidth=.5;h.beginPath();h.moveTo(0,2);h.lineTo(ts,2);h.moveTo(0,5);h.lineTo(ts,5);h.moveTo(0,8);h.lineTo(ts,8);h.stroke();});
  P[11]=mk(h=>{h.strokeStyle=stroke;h.lineWidth=.5;h.beginPath();h.moveTo(0,0);h.lineTo(ts,ts);h.moveTo(ts,0);h.lineTo(0,ts);h.stroke();});
  P[12]=mk(h=>{h.strokeStyle=stroke;h.lineWidth=.5;h.beginPath();h.moveTo(0,0);h.lineTo(ts,ts);h.moveTo(ts,0);h.lineTo(0,ts);h.moveTo(0,5);h.lineTo(5,0);h.moveTo(5,ts);h.lineTo(ts,5);h.stroke();});
  P[13]=mk(h=>{h.strokeStyle=stroke;h.lineWidth=.5;h.beginPath();h.moveTo(0,4);h.lineTo(5,4);h.moveTo(7,4);h.lineTo(ts,4);h.stroke();});
  P[14]=mk(h=>{});
  return P;
}
function exportDraw(g){
  if(viewStyle==="bw"||viewStyle==="hatch"){ g.fillStyle="#ffffff"; g.fillRect(0,0,GRID_W,GRID_H); }
  drawTilesLayer(g);
  drawTexts(g);
}
document.getElementById("export").onclick=()=>{
  const t=document.createElement("canvas"); t.width=Math.ceil(GRID_W); t.height=Math.ceil(GRID_H);
  exportDraw(t.getContext("2d")); const a=document.createElement("a"); a.download="hexmap.png"; a.href=t.toDataURL("image/png"); a.click();
};
document.getElementById("save").onclick=()=>{
  const data={v:9,cols:COLS,rows:ROWS,
    terrain:Array.from(terrain), veg:Array.from(veg), entity:Array.from(entity),
    edges:[...overlayEdges.values()].map(e=>({a:e.a,b:e.b,river:e.river,road:e.road})),
    texts};
  const a=document.createElement("a"); a.download="hexmap.json"; a.href=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:"application/json"})); a.click();
};
document.getElementById("loadfile").addEventListener("change",e=>{
  const f=e.target.files[0]; if(!f) return; const rd=new FileReader();
  rd.onload=()=>{
    let d;
    try{ d=JSON.parse(rd.result); }catch(err){ alert("File is not valid JSON: "+err.message); return; }
    try{ if(d.cols&&d.rows){ COLS=d.cols; ROWS=d.rows; recomputeGrid(); allocArrays(); } }catch(_){}
    try{ if(d.terrain) terrain.set(d.terrain); }catch(_){ console.warn("[hexmapper] skipped malformed terrain"); }
    try{ if(d.veg) veg.set(d.veg); }catch(_){ console.warn("[hexmapper] skipped malformed veg"); }
    try{ if(d.entity) entity.set(d.entity); }catch(_){ console.warn("[hexmapper] skipped malformed entity"); }
    try{
      overlayEdges=new Map();
      if(Array.isArray(d.edges)) d.edges.forEach(e=>{ try{ const n=normEdge(e); overlayEdges.set(edgeKeyOf(n.a,n.b),n); }catch(_){} });
      else if(d.rivers||d.roads) seedEdgesFromTiles(d.rivers,d.roads);
    }catch(_){ console.warn("[hexmapper] skipped malformed edges"); }
    try{ texts=Array.isArray(d.texts)?d.texts:[]; }catch(_){}
    selText=-1; dirty=true; updateDims(); syncTextPanel(); fitGrid(); render(); commit("load"); scheduleSave(true);
  };
  rd.readAsText(f);
});
document.getElementById("clear").onclick=()=>{ if(!confirm("Clear all hexes and labels?")) return; allocArrays(); overlayEdges=new Map(); texts=[]; selText=-1; dirty=true; syncTextPanel(); render(); commit("clear"); scheduleSave(true); };
