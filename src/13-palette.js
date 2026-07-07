const palEl=document.getElementById("palette");
function selectTool(d){
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
  document.querySelectorAll(".tool").forEach(b=>{ const d=JSON.parse(b.dataset.d); b.classList.toggle("on",matchActive(d)); });
  document.getElementById("curtool").textContent=toolName(active);
}
function btn(d){
  const b=document.createElement("button");
  b.className="tool"; b.dataset.d=JSON.stringify(d);
  b.innerHTML=`<span class="sw" style="background:${d.sw}"></span><span class="lab">${d.label}</span>`;
  b.onclick=()=>selectTool(d);
  return b;
}
function h3(text){ const h=document.createElement("h3"); h.textContent=text; palEl.appendChild(h); }
function list(items){ const gw=document.createElement("div"); gw.className="tools"; items.forEach(d=>gw.appendChild(btn(d))); palEl.appendChild(gw); }
function buildPalette(){
  palEl.innerHTML="";
  h3("Text"); list([TEXT_TOOL]);
  palEl.appendChild(tpanelEl);
  h3("Terrain"); list(TERRAIN_TOOLS);
  h3("Vegetation"); list(VEG_TOOLS);
  h3("Rivers & roads"); list([...RIVER_TOOLS, ROAD_TOOL]);
  h3("Points of interest"); list(POI_TOOLS);
  h3("Edit"); list([ERASE_TOOL]);
  reflectTool();
}
