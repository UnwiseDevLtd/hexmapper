let saveTimer=null; const STORE="hexmapper.v9";
function scheduleSave(force){ if(saveTimer) clearTimeout(saveTimer); saveTimer=setTimeout(doSave,force?0:500); }
function doSave(){
  try{ localStorage.setItem(STORE,JSON.stringify({cols:COLS,rows:ROWS,
    terrain:Array.from(terrain), veg:Array.from(veg), entity:Array.from(entity),
    edges:[...overlayEdges.values()].map(e=>({a:e.a,b:e.b,river:e.river,road:e.road})),
    texts, cam})); }catch(_){}
}
function loadSaved(){
  try{
    const s=localStorage.getItem(STORE);
    if(!s){ loadExampleImage(); return; }
    const d=JSON.parse(s);
    if(d.terrain){ for(let i=0;i<d.terrain.length;i++){ const t=d.terrain[i]; if(t!==0 && !TERR[t]) throw new Error("unknown terrain id "+t); } }
    if(d.cols&&d.rows){ COLS=d.cols; ROWS=d.rows; recomputeGrid(); allocArrays(); }
    if(d.terrain) terrain.set(d.terrain); if(d.veg) veg.set(d.veg); if(d.entity) entity.set(d.entity); if(d.texts) texts=d.texts;
    if(Array.isArray(d.edges)){ overlayEdges=new Map(d.edges.map(e=>{ const n=normEdge(e); return [edgeKeyOf(n.a,n.b),n]; })); }
    else if(d.rivers||d.roads){ seedEdgesFromTiles(d.rivers,d.roads); }
    if(d.cam){cam.x=d.cam.x;cam.y=d.cam.y;cam.z=d.cam.z;}
  }catch(e){
    console.warn("[hexmapper] could not load cached map ("+e.message+"); clearing cache.");
    try{ localStorage.removeItem(STORE); }catch(_){}
    COLS=100; ROWS=100; recomputeGrid(); allocArrays(); overlayEdges=new Map(); texts=[]; selText=-1;
  }
}
function loadExampleImage(){
  const src = (typeof EXAMPLE_IMG !== "undefined") ? EXAMPLE_IMG : "example.png";
  const img = new Image();
  img.onload = function(){
    bgImg = img; bgOp = 0.8; bgScaleMul = 1; bgOffX = 0; bgOffY = 0;
    document.getElementById("bgop").value = 80;
    document.getElementById("opv").textContent = "80%";
    document.getElementById("bgstatus").textContent = "Example map loaded";
    document.getElementById("bglabel").textContent = "Replace image…";
    dirty = true; fitGrid(); render();
  };
  img.src = src;
}
setInterval(()=>{document.getElementById("curzoom").textContent=Math.round(cam.z*100)+"%";},200);
