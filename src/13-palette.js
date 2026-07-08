const toolbarEl=document.getElementById("toolbar");
function selectTool(d){
  if(d.kind==="op"){ opMode=d.mode; reflectTool(); render(); return; }
  if(d.kind==="terrain") active={kind:"terrain",id:d.id};
  else if(d.kind==="river") active={kind:"river",type:d.type};
  else if(d.kind==="road") active={kind:"road"};
  else if(d.kind==="veg") active={kind:"veg",type:d.type};
  else if(d.kind==="entity") active={kind:"entity",id:d.id};
  else active={kind:d.kind};
  if(active.kind!=="text") selText=-1;
  syncTextPanel(); reflectTool(); render();
}
function toolName(a){
  if(a.kind==="terrain") return TERR[a.id].label;
  if(a.kind==="river") return a.type===1?"Water river":"Lava river";
  if(a.kind==="road") return "Road";
  if(a.kind==="veg") return a.type===1?"Trees":"Forest";
  if(a.kind==="entity") return ENT_NAME[a.id];
  if(a.kind==="text") return "Text";
  return "Erase";
}
function matchActive(d){
  const a=active;
  if(d.kind==="terrain") return a.kind==="terrain"&&a.id===d.id;
  if(d.kind==="river")   return a.kind==="river"&&a.type===d.type;
  if(d.kind==="veg")     return a.kind==="veg"&&a.type===d.type;
  if(d.kind==="entity")  return a.kind==="entity"&&a.id===d.id;
  return a.kind===d.kind;
}
function reflectTool(){
  document.querySelectorAll("[data-d]").forEach(b=>{
    const d=JSON.parse(b.dataset.d);
    if(d.kind==="op") b.classList.toggle("on", d.mode===opMode);
    else b.classList.toggle("on", matchActive(d));
  });
  document.getElementById("curtool").textContent=toolName(active);
}
function sep(){ const s=document.createElement("div"); s.className="sep"; return s; }
function modeBtn(d){
  const b=document.createElement("button"); b.className="tbtn"; b.type="button";
  b.dataset.d=JSON.stringify(d); b.textContent=d.icon||d.label;
  b.title=d.label; b.onclick=()=>selectTool(d);
  return b;
}
function ditem(d){
  const b=document.createElement("button"); b.className="ditem"; b.type="button";
  b.dataset.d=JSON.stringify(d);
  b.innerHTML=`<span class="sw" style="background:${d.sw||"#888"}"></span>${d.label}`;
  b.onclick=(e)=>{ e.stopPropagation(); selectTool(d); };
  return b;
}
function dropdown(label, tools){
  const dd=document.createElement("div"); dd.className="dropdown";
  const h=document.createElement("button"); h.className="tbtn"; h.type="button"; h.textContent=label+" \u25BE";
  const m=document.createElement("div"); m.className="dropdown-menu";
  tools.forEach(t=> m.appendChild(ditem(t)));
  dd.appendChild(h); dd.appendChild(m);
  return dd;
}
function buildToolbar(){
  const tb=toolbarEl; tb.innerHTML="";
  PAINT_TOOLS.forEach(d=> tb.appendChild(modeBtn(d)));
  tb.appendChild(sep());
  tb.appendChild(dropdown("\u26F0 Terrain", TERRAIN_TOOLS));
  tb.appendChild(dropdown("\uD83C\uDF3F Nature", [...VEG_TOOLS, ...RIVER_TOOLS]));
  tb.appendChild(dropdown("\uD83C\uDFF0 Build", [ROAD_TOOL, ...POI_TOOLS.filter(t=>[1,2,6,7,8].includes(t.id))]));
  tb.appendChild(dropdown("\uD83D\uDCCD Markers", POI_TOOLS.filter(t=>[3,4,5].includes(t.id))));
  const tbtn=document.createElement("button"); tbtn.className="tbtn"; tbtn.type="button";
  tbtn.dataset.d=JSON.stringify(TEXT_TOOL); tbtn.textContent="Text";
  tbtn.onclick=()=>selectTool(TEXT_TOOL); tb.appendChild(tbtn);
  reflectTool();
}
