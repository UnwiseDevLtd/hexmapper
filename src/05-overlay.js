function sep6(a,b){ let d=Math.abs(a-b)%6; return d>3?6-d:d; }
// smooth segments through one tile, given the directions it connects. Pair the
// farthest directions first (through-path): opposite => straight line through
// the centre, else a quadratic curve; an odd one out is a centre spoke. Driven
// by explicit edges, so the topology is exactly what was drawn.
function drawSegments(g, cx, cy, mids){
  if(mids.length<1) return;
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
// rivers & roads are explicit edges. Build a per-tile connection mask for the
// given type, then draw smooth segments per tile.
function drawEdges(g, type, color, dashed){
  const mask=new Uint8Array(ROWS*COLS);
  for(const e of overlayEdges.values()){
    if(e.type!==type) continue;
    const ns=neighbors(e.a[0],e.a[1]);
    let d=-1; for(let i=0;i<6;i++){ if(ns[i][0]===e.b[0]&&ns[i][1]===e.b[1]){ d=i; break; } }
    if(d<0) continue;
    mask[e.a[1]*COLS+e.a[0]] |= (1<<d);
    mask[e.b[1]*COLS+e.b[0]] |= (1<<((d+3)%6));
  }
  g.save(); g.strokeStyle=color; g.lineWidth=dashed?S*0.13:S*0.18; g.lineCap=dashed?"butt":"round"; g.lineJoin="round";
  if(dashed) g.setLineDash([S*0.3,S*0.2]);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const m=mask[r*COLS+c]; if(!m) continue;
    const dirs=[]; for(let d=0;d<6;d++) if(m&(1<<d)) dirs.push(d);
    const [cx,cy]=center(c,r);
    drawSegments(g,cx,cy,dirs);
  }
  if(dashed) g.setLineDash([]);
  g.restore();
}
