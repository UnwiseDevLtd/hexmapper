document.getElementById("bgfile").addEventListener("change",e=>{ const f=e.target.files[0]; if(f) loadImage(f); });
function loadImage(file){
  const url=URL.createObjectURL(file), img=new Image();
  img.onload=()=>{ bgImg=img; bgScaleMul=1; bgOffX=0; bgOffY=0;
    document.getElementById("bgscale").value=100; document.getElementById("bgx").value=0; document.getElementById("bgy").value=0;
    document.getElementById("scv").textContent="100%"; document.getElementById("bgstatus").textContent=`${file.name} — ${img.width}×${img.height}`;
    document.getElementById("bglabel").textContent="Replace image…"; dirty=true; render(); };
  img.src=url;
}
document.getElementById("bgop").addEventListener("input",e=>{ bgOp=e.target.value/100; document.getElementById("opv").textContent=e.target.value+"%"; dirty=true; render(); });
document.getElementById("bgcol").addEventListener("input",e=>{ bgColor=e.target.value; dirty=true; render(); });
document.getElementById("bgscale").addEventListener("input",e=>{ bgScaleMul=e.target.value/100; document.getElementById("scv").textContent=e.target.value+"%"; dirty=true; render(); });
document.getElementById("bgx").addEventListener("input",e=>{ bgOffX=+e.target.value; dirty=true; render(); });
document.getElementById("bgy").addEventListener("input",e=>{ bgOffY=+e.target.value; dirty=true; render(); });
document.getElementById("bgfit").onclick=()=>{ bgScaleMul=1; bgOffX=0; bgOffY=0;
  document.getElementById("bgscale").value=100; document.getElementById("bgx").value=0; document.getElementById("bgy").value=0;
  document.getElementById("scv").textContent="100%"; dirty=true; render(); };
document.getElementById("bgclear").onclick=()=>{ bgImg=null; document.getElementById("bgstatus").textContent="No background loaded."; document.getElementById("bglabel").textContent="Upload map image…"; dirty=true; render(); };
document.getElementById("bgabove").addEventListener("change",e=>{ bgAbove=e.target.checked; dirty=true; render(); });
stage.addEventListener("dragover",e=>{e.preventDefault();stage.classList.add("drag");});
stage.addEventListener("dragleave",()=>stage.classList.remove("drag"));
stage.addEventListener("drop",e=>{ e.preventDefault(); stage.classList.remove("drag"); const f=e.dataTransfer.files[0]; if(f&&f.type.startsWith("image")) loadImage(f); });
