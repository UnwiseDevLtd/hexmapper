const ctr=()=>({l:cv.getBoundingClientRect().left+cv.clientWidth/2,t:cv.getBoundingClientRect().top+cv.clientHeight/2});
document.getElementById("zin").onclick=()=>{const c=ctr();zoomAt(c.l,c.t,1.25);};
document.getElementById("zout").onclick=()=>{const c=ctr();zoomAt(c.l,c.t,1/1.25);};
document.getElementById("zfit").onclick=fitGrid;
document.getElementById("z1").onclick=()=>{ cam.z=1; cam.x=cv.clientWidth/2-(GRID_W/2); cam.y=cv.clientHeight/2-(GRID_H/2); render(); };
undoBtn.onclick=undo; redoBtn.onclick=redo;
