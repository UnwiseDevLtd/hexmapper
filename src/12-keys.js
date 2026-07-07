window.addEventListener("keydown",e=>{
  const mod=e.ctrlKey||e.metaKey;
  if(mod && (e.code==="KeyZ"||e.code==="KeyY")){
    e.preventDefault();
    if(e.code==="KeyY"||e.shiftKey) redo(); else undo();
  }
});
