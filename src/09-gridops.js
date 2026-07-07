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
// rotate = swap vertical / horizontal alignment: transpose the grid so cols and
// rows exchange. Same data, re-laid-out across the diagonal.
function transposeGrid(){
  const nC=ROWS, nR=COLS;
  const nt=new Uint8Array(nR*nC), nr=new Uint8Array(nR*nC), nrd=new Uint8Array(nR*nC), nv=new Uint8Array(nR*nC), ne=new Uint8Array(nR*nC);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const oi=r*COLS+c, ni=c*nC+r;       // new[c][r] = old[r][c]
    nt[ni]=terrain[oi]; nr[ni]=rivers[oi]; nrd[ni]=roads[oi]; nv[ni]=veg[oi]; ne[ni]=entity[oi];
  }
  const ntexts=texts.map(t=>{ const [oc,or]=worldToHex(t.x,t.y); const [wx,wy]=center(or,oc); return {x:wx,y:wy,s:t.s,size:t.size}; });
  COLS=nC; ROWS=nR; terrain=nt; rivers=nr; roads=nrd; veg=nv; entity=ne; texts=ntexts;
  recomputeGrid(); selText=-1; dirty=true; updateDims(); syncTextPanel(); fitGrid(); commit("rotate"); scheduleSave(true);
}
