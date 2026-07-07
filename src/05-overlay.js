function overlayMids(arr, c, r, matchVal){
  const ns=neighbors(c,r), mids=[];
  for(let d=0;d<6;d++){ const [nc,nr]=ns[d]; if(inB(nc,nr)&&arr[idx(nc,nr)]===matchVal) mids.push(d); }
  return mids;
}
function sep6(a,b){ let d=Math.abs(a-b)%6; return d>3?6-d:d; }
// draw the overlay segments for one tile. Repeatedly pair the FARTHEST-apart
// connected edges (the through-path); opposite (gap 3) => straight line through
// the centre, else a quadratic curve. Anything unpaired => a centre spoke.
function drawSegments(g, cx, cy, mids){
  if(!mids.length) return;
  let pool=mids.slice();
  while(pool.length>=2){
    let bi=0,bj=1,bs=-1;
    for(let i=0;i<pool.length;i++) for(let j=i+1;j<pool.length;j++){
      const s=sep6(pool[i],pool[j]);
      if(s>bs){ bs=s; bi=i; bj=j; }
    }
    const d1=pool[bi], d2=pool[bj];
    const [ax,ay]=EDGE_MID[d1], [bx,by]=EDGE_MID[d2];
    g.beginPath(); g.moveTo(cx+ax,cy+ay);
    if(bs===3) g.lineTo(cx+bx,cy+by); else g.quadraticCurveTo(cx,cy,cx+bx,cy+by);
    g.stroke();
    pool.splice(bj,1); pool.splice(bi,1);
  }
  for(const d of pool){ const [mx,my]=EDGE_MID[d]; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+mx,cy+my); g.stroke(); }
}
function drawOverlay(g, arr, matchVal, color, dashed){
  g.save(); g.strokeStyle=color; g.lineWidth=dashed?S*0.13:S*0.18; g.lineCap=dashed?"butt":"round"; g.lineJoin="round";
  if(dashed) g.setLineDash([S*0.3,S*0.2]);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    if(arr[idx(c,r)]!==matchVal) continue;
    const [cx,cy]=center(c,r);
    drawSegments(g, cx, cy, overlayMids(arr,c,r,matchVal));
  }
  if(dashed) g.setLineDash([]);
  g.restore();
}
