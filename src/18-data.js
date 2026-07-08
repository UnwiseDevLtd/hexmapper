function buildHatchPatterns(g){
  const P={}, S="#888", mk=(fn)=>{ const c=document.createElement("canvas"); c.width=10; c.height=10; fn(c.getContext("2d")); return g.createPattern(c,null); };
  P[3]=mk(h=>{h.fillStyle="#ccc";[1,5,9].forEach(x=>[1,5,9].forEach(y=>h.fillRect(x,y,1.5,1.5)));});
  P[4]=mk(h=>{h.strokeStyle=S;h.lineWidth=.5;h.beginPath();h.moveTo(0,10);h.lineTo(10,0);h.stroke();});
  P[5]=mk(h=>{});
  P[6]=mk(h=>{h.fillStyle="#ddd";for(let i=0;i<10;i+=3)for(let j=0;j<10;j+=3)h.fillRect(i,j,1,1);});
  P[7]=mk(h=>{h.strokeStyle=S;h.lineWidth=.5;h.beginPath();h.moveTo(0,10);h.lineTo(10,0);h.moveTo(3,10);h.lineTo(10,3);h.stroke();});
  P[8]=mk(h=>{h.strokeStyle=S;h.lineWidth=.5;h.beginPath();h.moveTo(0,10);h.lineTo(10,0);h.moveTo(3,10);h.lineTo(10,3);h.moveTo(0,7);h.lineTo(7,0);h.stroke();});
  P[9]=mk(h=>{h.strokeStyle=S;h.lineWidth=.5;h.beginPath();h.moveTo(0,3);h.lineTo(10,3);h.moveTo(0,7);h.lineTo(10,7);h.stroke();});
  P[10]=mk(h=>{h.strokeStyle=S;h.lineWidth=.5;h.beginPath();h.moveTo(0,2);h.lineTo(10,2);h.moveTo(0,5);h.lineTo(10,5);h.moveTo(0,8);h.lineTo(10,8);h.stroke();});
  P[11]=mk(h=>{h.strokeStyle=S;h.lineWidth=.5;h.beginPath();h.moveTo(0,0);h.lineTo(10,10);h.moveTo(10,0);h.lineTo(0,10);h.stroke();});
  P[12]=mk(h=>{h.strokeStyle=S;h.lineWidth=.5;h.beginPath();h.moveTo(0,0);h.lineTo(10,10);h.moveTo(10,0);h.lineTo(0,10);h.moveTo(0,5);h.lineTo(5,0);h.moveTo(5,10);h.lineTo(10,5);h.stroke();});
  P[13]=mk(h=>{h.strokeStyle=S;h.lineWidth=.5;h.beginPath();h.moveTo(0,4);h.lineTo(5,4);h.moveTo(7,4);h.lineTo(10,4);h.stroke();});
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
  rd.onload=()=>{ try{ const d=JSON.parse(rd.result);
    COLS=d.cols||COLS; ROWS=d.rows||ROWS; recomputeGrid(); allocArrays();
    if(d.terrain) terrain.set(d.terrain); if(d.veg) veg.set(d.veg); if(d.entity) entity.set(d.entity);
    overlayEdges=new Map();
    if(Array.isArray(d.edges)) d.edges.forEach(e=>{ const n=normEdge(e); overlayEdges.set(edgeKeyOf(n.a,n.b),n); });
    else if(d.rivers||d.roads) seedEdgesFromTiles(d.rivers,d.roads); // TEMP seed stub
    texts=Array.isArray(d.texts)?d.texts:[]; selText=-1;
    dirty=true; updateDims(); syncTextPanel(); fitGrid(); render(); commit("load"); scheduleSave(true);
  }catch(err){alert("Invalid JSON: "+err.message);} };
  rd.readAsText(f);
});
document.getElementById("clear").onclick=()=>{ if(!confirm("Clear all hexes and labels?")) return; allocArrays(); overlayEdges=new Map(); texts=[]; selText=-1; dirty=true; syncTextPanel(); render(); commit("clear"); scheduleSave(true); };
