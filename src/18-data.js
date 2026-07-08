function exportDraw(g){
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){ const t=terrain[idx(c,r)]; if(!t||!TERR[t]) continue; const [cx,cy]=center(c,r); hexPath(g,cx,cy); g.fillStyle=TERR[t].fill; g.fill(); }
  g.strokeStyle="rgba(0,0,0,0.4)"; g.lineWidth=1; for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++) outlineHex(g,c,r,tKey);
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){ const t=terrain[idx(c,r)]; if(t&&TERR[t]){ const [cx,cy]=center(c,r); drawTerrain(g,t,cx,cy); } }
  const bank=computeBankOffsets();
  drawEdges(g, 1, WATER_RIVER, false, bank);
  drawEdges(g, 2, LAVA_RIVER, false, bank);
  drawEdges(g, 3, ROAD_COLOR, true, bank);
  drawSettlementPaths(g);
  drawVeg(g);
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){ const e=entity[idx(c,r)]; if(e===0) continue; const [cx,cy]=center(c,r); drawEntity(g,e,cx,cy,c,r); }
  drawIds(g); drawTexts(g);
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
