let terrain=new Uint8Array(ROWS*COLS);
let veg    =new Uint8Array(ROWS*COLS);
let entity =new Uint8Array(ROWS*COLS);
// rivers & roads are now EXPLICIT EDGES between adjacent tiles (edge model).
// edge value: {type, a:[c,r], b:[c,r]}; type 1=water river, 2=lava river, 3=road.
let overlayEdges=new Map();
let texts=[];
let selText=-1;

const cv=document.getElementById("cv");
const ctx=cv.getContext("2d");
const stage=document.getElementById("stage");
const world=document.createElement("canvas");
const wctx=world.getContext("2d");

function recomputeGrid(){
  GRID_W=PAD*2 + W*COLS + W/2;
  GRID_H=PAD*2 + S + 1.5*S*(ROWS-1) + S;
  world.width=Math.ceil(GRID_W); world.height=Math.ceil(GRID_H);
}
recomputeGrid();

let cam={x:0,y:0,z:1};
let bgImg=null,bgOp=0.8,bgScaleMul=1,bgOffX=0,bgOffY=0;
let dirty=true, hover={c:-1,r:-1};
let fontSize=14;
let opMode="paint";
let showIds=false, idSize=9, idBg="none", idPos="center";
let bgAbove=false;
let bgColor="#ffffff";
let viewStyle="color";
let hatchDensity=80;

const txtEl=document.getElementById("txt");
const tsvEl=document.getElementById("tsv");
const tsizeEl=document.getElementById("txtsize");
const tdelEl=document.getElementById("txtdelete");
const thintEl=document.getElementById("texthint");
const tpanelEl=document.getElementById("textpanel");
const undoBtn=document.getElementById("undo");
const redoBtn=document.getElementById("redo");
const dimsEl=document.getElementById("dims");

function resize(){
  const dpr=Math.min(window.devicePixelRatio||1,2);
  const w=stage.clientWidth,h=stage.clientHeight;
  cv.width=Math.round(w*dpr); cv.height=Math.round(h*dpr);
  cv.style.width=w+"px"; cv.style.height=h+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  render();
}
window.addEventListener("resize",resize);
