let saveTimer=null; const STORE="hexmapper.v6";
function scheduleSave(force){ if(saveTimer) clearTimeout(saveTimer); saveTimer=setTimeout(doSave,force?0:500); }
function doSave(){
  try{ localStorage.setItem(STORE,JSON.stringify({cols:COLS,rows:ROWS,
    terrain:Array.from(terrain), rivers:Array.from(rivers), roads:Array.from(roads),
    veg:Array.from(veg), entity:Array.from(entity), texts, cam})); }catch(_){}
}
function loadSaved(){
  try{ const s=localStorage.getItem(STORE); if(!s) return; const d=JSON.parse(s);
    if(d.cols&&d.rows){ COLS=d.cols; ROWS=d.rows; recomputeGrid(); allocArrays(); }
    if(d.terrain) terrain.set(d.terrain); if(d.rivers) rivers.set(d.rivers); if(d.roads) roads.set(d.roads); if(d.veg) veg.set(d.veg); if(d.entity) entity.set(d.entity); if(d.texts) texts=d.texts;
    migrateArrays();
    if(d.cam){cam.x=d.cam.x;cam.y=d.cam.y;cam.z=d.cam.z;}
  }catch(_){}
}
setInterval(()=>{document.getElementById("curzoom").textContent=Math.round(cam.z*100)+"%";},200);
