// unit perpendicular to each edge direction, for offsetting co-located river+road
const PERP=EDGE_MID.map(([mx,my])=>{ const L=Math.hypot(mx,my)||1; return [-my/L, mx/L]; });

function sep6(a,b){ let d=Math.abs(a-b)%6; return d>3?6-d:d; }
// smooth segments through one tile. Pair the farthest directions first
// (through-path): opposite => straight line through the centre, else a quadratic
// curve; an odd one out is a centre spoke.
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
// rivers & roads share edges. Build a per-tile connection mask for this type,
// and where a tile also has the OTHER type on a shared edge, shift the whole
// tile's drawing perpendicular so the two lines sit side by side.
function drawEdges(g, type, color, dashed){
  const isRoad = type===3;
  const mask=new Uint8Array(ROWS*COLS), shared=new Uint8Array(ROWS*COLS);
  for(const e of overlayEdges.values()){
    const ns=neighbors(e.a[0],e.a[1]);
    let d=-1; for(let i=0;i<6;i++){ if(ns[i][0]===e.b[0]&&ns[i][1]===e.b[1]){ d=i; break; } }
    if(d<0) continue;
    const ai=e.a[1]*COLS+e.a[0], bi=e.b[1]*COLS+e.b[0];
    const hasT = isRoad ? e.road===1 : e.river===type;
    const hasOther = isRoad ? e.river!==0 : e.road===1;
    if(hasT){ mask[ai]|=(1<<d); mask[bi]|=(1<<((d+3)%6)); }
    if(hasT && hasOther){ shared[ai]|=(1<<d); shared[bi]|=(1<<((d+3)%6)); }
  }
  const sign = isRoad ? -1 : 1, dlt = S*0.14;
  g.save(); g.strokeStyle=color; g.lineWidth=dashed?S*0.13:S*0.18; g.lineCap=dashed?"butt":"round"; g.lineJoin="round";
  if(dashed) g.setLineDash([S*0.3,S*0.2]);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const m=mask[r*COLS+c]; if(!m) continue;
    const dirs=[]; for(let d=0;d<6;d++) if(m&(1<<d)) dirs.push(d);
    let ox=0, oy=0; const sm=shared[r*COLS+c];
    if(sm){ let sd=0; while(sd<6 && !(sm&(1<<sd))) sd++; if(sd<6){ ox=PERP[sd][0]*dlt*sign; oy=PERP[sd][1]*dlt*sign; } }
    const [cx,cy]=center(c,r);
    drawSegments(g, cx+ox, cy+oy, dirs);
  }
  if(dashed) g.setLineDash([]);
  g.restore();
}
