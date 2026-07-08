function allocArrays(){
  terrain=new Uint8Array(ROWS*COLS); veg=new Uint8Array(ROWS*COLS); entity=new Uint8Array(ROWS*COLS);
}
function updateDims(){
  dimsEl.textContent=`${COLS} × ${ROWS} hexes`;
  document.getElementById("colsin").value=COLS; document.getElementById("rowsin").value=ROWS;
}
// ---- edge helpers (rivers/roads) ----
// an edge carries BOTH a river (0/1 water /2 lava) AND a road (0/1), so a river
// and a road can share the same tile-tile connection.
function edgeKeyOf(a,b){
  const [ac,ar]=a,[bc,br]=b;
  return (ar<br||(ar===br&&ac<bc)) ? ar+","+ac+"|"+br+","+bc : br+","+bc+"|"+ar+","+ac;
}
function addEdge(a,b,type){
  const k=edgeKeyOf(a,b);
  let e=overlayEdges.get(k);
  if(!e){ e={a:[a[0],a[1]],b:[b[0],b[1]],river:0,road:0}; overlayEdges.set(k,e); }
  if(type===1||type===2) e.river=type; else if(type===3) e.road=1;
  dirty=true;
}
function eraseEdgesAt(c,r,type){
  for(const [k,e] of overlayEdges){
    if(!((e.a[0]===c&&e.a[1]===r)||(e.b[0]===c&&e.b[1]===r))) continue;
    if(type<=2) e.river=0; else e.road=0;
    if(e.river===0 && e.road===0) overlayEdges.delete(k);
  }
  dirty=true;
}
function tilesAdjacent(a,b){ const ns=neighbors(a[0],a[1]); for(const [nc,nr] of ns){ if(nc===b[0]&&nr===b[1]) return true; } return false; }
// accept either the new {river,road} shape or the legacy single-{type} shape
function normEdge(e){
  const river=e.river||((e.type===1||e.type===2)?e.type:0);
  const road=e.road||(e.type===3?1:0);
  return {a:[e.a[0],e.a[1]],b:[e.b[0],e.b[1]],river,road};
}
// TEMP seed stub: convert legacy tile-based rivers/roads arrays into edges.
function seedEdgesFromTiles(tileRivers, tileRoads){
  const pick=(c,r,d,arr,match,type)=>{ const ns=neighbors(c,r); const [nc,nr]=ns[d]; if(inB(nc,nr)&&arr[nr*COLS+nc]===match) addEdge([c,r],[nc,nr],type); };
  if(tileRivers) for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){ const t=tileRivers[r*COLS+c]; if(t===1||t===2) for(let d=0;d<3;d++) pick(c,r,d,tileRivers,t,t); }
  if(tileRoads)  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){ if(tileRoads[r*COLS+c]) for(let d=0;d<3;d++) pick(c,r,d,tileRoads,1,3); }
}
function resizeGrid(newCols,newRows){
  newCols=Math.max(1,Math.min(400,newCols|0)); newRows=Math.max(1,Math.min(400,newRows|0));
  if(newCols===COLS&&newRows===ROWS) return;
  const nt=new Uint8Array(newRows*newCols), nv=new Uint8Array(newRows*newCols), ne=new Uint8Array(newRows*newCols);
  const cmax=Math.min(COLS,newCols), rmax=Math.min(ROWS,newRows);
  for(let r=0;r<rmax;r++) for(let c=0;c<cmax;c++){ const o=r*COLS+c, n=r*newCols+c; nt[n]=terrain[o]; nv[n]=veg[o]; ne[n]=entity[o]; }
  COLS=newCols; ROWS=newRows; terrain=nt; veg=nv; entity=ne;
  const fe=new Map();
  for(const e of overlayEdges.values()){ if(inB(e.a[0],e.a[1])&&inB(e.b[0],e.b[1])) fe.set(edgeKeyOf(e.a,e.b),e); }
  overlayEdges=fe;
  recomputeGrid(); selText=-1; dirty=true; updateDims(); syncTextPanel(); fitGrid(); commit("resize"); scheduleSave(true);
}
function transposeGrid(){
  const nC=ROWS, nR=COLS;
  const nt=new Uint8Array(nR*nC), nv=new Uint8Array(nR*nC), ne=new Uint8Array(nR*nC);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){ const o=r*COLS+c, ni=c*nC+r; nt[ni]=terrain[o]; nv[ni]=veg[o]; ne[ni]=entity[o]; }
  const ntexts=texts.map(t=>{ const [oc,or]=worldToHex(t.x,t.y); const [wx,wy]=center(or,oc); return {x:wx,y:wy,s:t.s,size:t.size}; });
  const nedges=new Map();
  for(const e of overlayEdges.values()){ const na=[e.a[1],e.a[0]], nb=[e.b[1],e.b[0]]; nedges.set(edgeKeyOf(na,nb),{a:na,b:nb,river:e.river,road:e.road}); }
  COLS=nC; ROWS=nR; terrain=nt; veg=nv; entity=ne; texts=ntexts; overlayEdges=nedges;
  recomputeGrid(); selText=-1; dirty=true; updateDims(); syncTextPanel(); fitGrid(); commit("rotate"); scheduleSave(true);
}
