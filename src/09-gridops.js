function allocArrays(){
  terrain=new Uint8Array(ROWS*COLS); rivers=new Uint8Array(ROWS*COLS);
  roads=new Uint8Array(ROWS*COLS); veg=new Uint8Array(ROWS*COLS); entity=new Uint8Array(ROWS*COLS);
}
function updateDims(){
  dimsEl.textContent=`${COLS} × ${ROWS} hexes`;
  document.getElementById("colsin").value=COLS; document.getElementById("rowsin").value=ROWS;
}
function resizeGrid(newCols,newRows){
  newCols=Math.max(1,Math.min(400,newCols|0)); newRows=Math.max(1,Math.min(400,newRows|0));
  if(newCols===COLS&&newRows===ROWS) return;
  const nt=new Uint8Array(newRows*newCols), nr=new Uint8Array(newRows*newCols),
        nrd=new Uint8Array(newRows*newCols), nv=new Uint8Array(newRows*newCols), ne=new Uint8Array(newRows*newCols);
  const cmax=Math.min(COLS,newCols), rmax=Math.min(ROWS,newRows);
  for(let r=0;r<rmax;r++) for(let c=0;c<cmax;c++){
    nt[r*newCols+c]=terrain[r*COLS+c]; nr[r*newCols+c]=rivers[r*COLS+c];
    nrd[r*newCols+c]=roads[r*COLS+c]; nv[r*newCols+c]=veg[r*COLS+c]; ne[r*newCols+c]=entity[r*COLS+c];
  }
  COLS=newCols; ROWS=newRows; terrain=nt; rivers=nr; roads=nrd; veg=nv; entity=ne;
  recomputeGrid(); selText=-1; dirty=true; updateDims(); syncTextPanel(); fitGrid(); commit("resize"); scheduleSave(true);
}
function rotateHex60(c,r){
  const q=c-((r-(r&1))>>1), rr=r;
  const x=q, z=rr, y=-x-z;
  const nx=-y, ny=-z, nz=-x;
  const nq=nx, nr=nz;
  return [nq+((nr-(nr&1))>>1), nr];
}
function rotate60(){
  const cells=[];
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const i=idx(c,r); if(!(terrain[i]||rivers[i]||roads[i]||veg[i]||entity[i])) continue;
    const [nc,nr]=rotateHex60(c,r);
    cells.push({c:nc,r:nr,t:terrain[i],rv:rivers[i],rd:roads[i],v:veg[i],e:entity[i]});
  }
  if(!cells.length) return;
  let minC=Infinity,maxC=-Infinity,minR=Infinity,maxR=-Infinity;
  for(const o of cells){ if(o.c<minC)minC=o.c; if(o.c>maxC)maxC=o.c; if(o.r<minR)minR=o.r; if(o.r>maxR)maxR=o.r; }
  const nC=Math.max(1,maxC-minC+1), nR=Math.max(1,maxR-minR+1);
  const nt=new Uint8Array(nR*nC), nrv=new Uint8Array(nR*nC), nrd=new Uint8Array(nR*nC), nv=new Uint8Array(nR*nC), ne=new Uint8Array(nR*nC);
  for(const o of cells){ const rr=o.r-minR, cc=o.c-minC; nt[rr*nC+cc]=o.t; nrv[rr*nC+cc]=o.rv; nrd[rr*nC+cc]=o.rd; nv[rr*nC+cc]=o.v; ne[rr*nC+cc]=o.e; }
  const ntexts=texts.map(t=>{ const [oc,or]=worldToHex(t.x,t.y); const [nc,nr]=rotateHex60(oc,or); const [wx,wy]=center(nc-minC,nr-minR); return {x:wx,y:wy,s:t.s,size:t.size}; });
  COLS=nC; ROWS=nR; terrain=nt; rivers=nrv; roads=nrd; veg=nv; entity=ne; texts=ntexts;
  recomputeGrid(); selText=-1; dirty=true; updateDims(); syncTextPanel(); fitGrid(); commit("rotate"); scheduleSave(true);
}
