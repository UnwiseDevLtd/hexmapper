function center(c,r){ return [PAD+W/2+W*c+(r&1)*(W/2), PAD+S+1.5*S*r]; }
const VERTS=[[0,-S],[W/2,-S/2],[W/2,S/2],[0,S],[-W/2,S/2],[-W/2,-S/2]];
const AXIAL_DIRS=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
const EDGE_MID =[[W/2,0],[W/4,-3*S/4],[-W/4,-3*S/4],[-W/2,0],[-W/4,3*S/4],[W/4,3*S/4]];
const EDGEDIR=[1,0,5,4,3,2];

function neighbors(c,r){
  const q0=c-((r-(r&1))>>1), r0=r, out=[];
  for(const [dq,dr] of AXIAL_DIRS){ const q=q0+dq, rr=r0+dr; out.push([q+((rr-(rr&1))>>1), rr]); }
  return out;
}
function hexPath(g,cx,cy){
  g.beginPath(); g.moveTo(cx,cy-S);
  g.lineTo(cx+W/2,cy-S/2); g.lineTo(cx+W/2,cy+S/2);
  g.lineTo(cx,cy+S);
  g.lineTo(cx-W/2,cy+S/2); g.lineTo(cx-W/2,cy-S/2);
  g.closePath();
}
function clientToWorld(x,y){ const rc=cv.getBoundingClientRect(); return [(x-rc.left-cam.x)/cam.z,(y-rc.top-cam.y)/cam.z]; }
function worldToHex(x,y){
  const px=x-(PAD+W/2), py=y-(PAD+S);
  const q=(Math.sqrt(3)/3*px-1/3*py)/S, r=(2/3*py)/S, s=-q-r;
  let rq=Math.round(q),rr=Math.round(r),rs=Math.round(s);
  const dq=Math.abs(rq-q),dr=Math.abs(rr-r),ds=Math.abs(rs-s);
  if(dq>dr&&dq>ds) rq=-rr-rs; else if(dr>ds) rr=-rq-rs;
  return [rq+((rr-(rr&1))>>1), rr];
}
function bijective(n){ let s=""; while(n>0){ n--; s=String.fromCharCode(65+n%26)+s; n=Math.floor(n/26); } return s; }
function hexId(c,r){ return bijective(r+1)+"-"+(c+1); }
