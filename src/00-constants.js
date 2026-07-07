const S=24;
const W=Math.sqrt(3)*S;
const PAD=S;
let COLS=100, ROWS=100;
let GRID_W=0, GRID_H=0;
const idx=(c,r)=>r*COLS+c;
const inB=(c,r)=>c>=0&&c<COLS&&r>=0&&r<ROWS;

const TERR={
  3:{label:"Grasslands",     fill:"#bcdc7e", sym:"#54701f"},
  4:{label:"Hills",          fill:"#93b65a", sym:"#3a521a"},
  5:{label:"Plains",         fill:"#d9d3a3", sym:"#8f8651"},
  6:{label:"Desert",         fill:"#e6d38a", sym:"#8a6a22"},
  7:{label:"Small mountain", fill:"#7a7066", sym:"#ece8e1"},
  8:{label:"Large mountain", fill:"#3b3b3b", sym:"#ffffff"},
  9:{label:"Shallow water",  fill:"#5fa8d3", sym:"#1d5f8a", merge:true},
 10:{label:"Deep water",     fill:"#1f5c92", sym:"#0c3358", merge:true},
 11:{label:"Shallow lava",   fill:"#f4a03a", sym:"#6e3300", merge:true},
 12:{label:"Deep lava",      fill:"#b83227", sym:"#ffd27a", merge:true},
 13:{label:"Marsh",          fill:"#bca771", sym:"#54401c"},
 14:{label:"Fog / unknown",  fill:"#6f6f6f", sym:"#3f3f3f"},
};
const TERRAIN_TOOLS=Object.keys(TERR).map(k=>{const id=+k; return {kind:"terrain",id,label:TERR[id].label,sw:TERR[id].fill};});

const WATER_RIVER="#2f7ab8", LAVA_RIVER="#ef6a2a", ROAD_COLOR="#9a6a36";
const RIVER_TOOLS=[
 {kind:"river",type:1,label:"Water river",sw:WATER_RIVER},
 {kind:"river",type:2,label:"Lava river",sw:LAVA_RIVER},
];
const ROAD_TOOL={kind:"road",label:"Road",sw:ROAD_COLOR};
const VEG_TOOLS=[
 {kind:"veg",type:1,label:"Trees",sw:"#2f6e2f"},
 {kind:"veg",type:2,label:"Forest",sw:"#0c3a12"},
];
const ENT_NAME={1:"Town",2:"City",3:"Unknown",4:"Danger",5:"Cave",6:"Castle",7:"Tower",8:"Campsite"};
const POI_TOOLS=[
 {kind:"entity",id:1,label:"Town",     sw:"#ffd479"},
 {kind:"entity",id:2,label:"City",     sw:"#9a93a3"},
 {kind:"entity",id:6,label:"Castle",   sw:"#8a7a6a"},
 {kind:"entity",id:7,label:"Tower",    sw:"#b8b8c0"},
 {kind:"entity",id:8,label:"Campsite", sw:"#c98e4a"},
 {kind:"entity",id:5,label:"Cave",     sw:"#5b524a"},
 {kind:"entity",id:4,label:"Danger",   sw:"#eeeeee"},
 {kind:"entity",id:3,label:"Unknown",  sw:"#ffe14d"},
];
const TEXT_TOOL={kind:"text",label:"Text",sw:"#ffffff"};
const PAINT_TOOLS=[
 {kind:"op",mode:"paint",label:"Paintbrush",icon:"🖌"},
 {kind:"op",mode:"fill",label:"Bucket",icon:"🪣"},
 {kind:"op",mode:"erase",label:"Eraser",icon:"🧽"},
];

let active={kind:"veg",type:1};
