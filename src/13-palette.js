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
function activeSection(){
  const k=active.kind;
  if(k==="text") return "text";
  if(k==="terrain") return "terrain";
  if(k==="erase") return "edit";
  return "features";
}
function openActiveSection(){
  const s=activeSection();
  palEl.querySelectorAll(":scope > .collapse").forEach(c=>c.classList.toggle("open", c.dataset.section===s));
}
function reflectTool(){
  document.querySelectorAll(".tool").forEach(b=>{ const d=JSON.parse(b.dataset.d); b.classList.toggle("on",matchActive(d)); });
  document.getElementById("curtool").textContent=toolName(active);
  openActiveSection();
}
function btn(d){
  const b=document.createElement("button");
  b.className="tool"; b.dataset.d=JSON.stringify(d);
  b.innerHTML=`<span class="sw" style="background:${d.sw}"></span><span class="lab">${d.label}</span>`;
  b.onclick=()=>selectTool(d);
  return b;
}
function toolList(items){ const gw=document.createElement("div"); gw.className="tools"; items.forEach(d=>gw.appendChild(btn(d))); return gw; }
function makeCollapse(title, bodyEl, section){
  const c=document.createElement("div"); c.className="collapse"; c.dataset.section=section;
  const h=document.createElement("button"); h.type="button"; h.className="collapse-head";
  h.innerHTML=`<span class="ttl">${title}</span><span class="caret">▸</span>`;
  const b=document.createElement("div"); b.className="collapse-body"; b.appendChild(bodyEl);
  c.appendChild(h); c.appendChild(b);
  return c;
}
function buildPalette(){
  palEl.innerHTML="";
  const textBody=document.createElement("div");
  textBody.appendChild(btn(TEXT_TOOL));
  textBody.appendChild(tpanelEl);
  palEl.appendChild(makeCollapse("Text", textBody, "text"));
  palEl.appendChild(makeCollapse("Terrain", toolList(TERRAIN_TOOLS), "terrain"));
  palEl.appendChild(makeCollapse("Features", toolList([...VEG_TOOLS, ...RIVER_TOOLS, ROAD_TOOL, ...POI_TOOLS]), "features"));
  palEl.appendChild(makeCollapse("Edit", toolList([ERASE_TOOL]), "edit"));
  reflectTool();
}
