function tKey(c,r){ const t=terrain[idx(c,r)]; return (t>=9&&t<=12)?("t"+t):null; }
function cKey(c,r){ return entity[idx(c,r)]===2?"city":null; }
function outlineHex(g,c,r,keyFn){
  const [cx,cy]=center(c,r), self=keyFn(c,r), ns=neighbors(c,r);
  if(!self){ hexPath(g,cx,cy); g.stroke(); return; }
  for(let i=0;i<6;i++){
    const [nc,nr]=ns[EDGEDIR[i]];
    let same=false;
    if(inB(nc,nr)&&self===keyFn(nc,nr)) same=true;
    if(!same){ const a=VERTS[i],b=VERTS[(i+1)%6]; g.beginPath(); g.moveTo(cx+a[0],cy+a[1]); g.lineTo(cx+b[0],cy+b[1]); g.stroke(); }
  }
}
