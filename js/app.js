(()=>{"use strict";
const A=document.getElementById("app"),M=document.getElementById("modal"),T=document.getElementById("toast");
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const save=()=>localStorage.setItem("exhibition_db",JSON.stringify(DB));
const sid=id=>DB.spaces.find(x=>x.id===id), cid=id=>DB.contents.find(x=>x.id===id);
const sname=id=>sid(id)?.name||"Chưa gán", cname=id=>cid(id)?.name||"Chưa gán";
const toast=x=>{T.textContent=x;T.className="show";setTimeout(()=>T.className="",1600)};
const page=()=>location.hash.slice(1).split("?")[0]||"dashboard";
const go=p=>location.hash=p;
const pages={
 dashboard:["Tổng quan","Toàn cảnh hệ thống"],
 spaces:["Không gian trưng bày","Danh mục các phòng/khu vực cố định"],
 contents:["Nội dung trưng bày","Nội dung được quản lý theo từng không gian"],
 artifacts:["Hiện vật","Hiện vật gắn với không gian và nội dung"],
 documents:["Tài liệu số hóa","Tài liệu, hồ sơ và dữ liệu số"],
 media:["Media","Ảnh, video, audio, 3D"],
 locations:["Vị trí trưng bày","Tủ, màn hình và vị trí vật lý"],
 settings:["Thiết lập","Tên đơn vị và dữ liệu"]
};
const navItems=[
 ["dashboard","▦","Tổng quan"],["spaces","▣","Không gian"],["contents","◈","Nội dung trưng bày"],
 ["artifacts","◇","Hiện vật"],["documents","▤","Tài liệu số hóa"],["media","▧","Media"],
 ["locations","⌗","Vị trí trưng bày"],["settings","⚙","Thiết lập"]
];
function nav(){return `<aside class="side"><div class="logo">EXHIBITION<br>CMS</div><div class="nav">${navItems.map(x=>`<button class="${page()==x[0]?"on":""}" onclick="go('${x[0]}')">${x[1]} <span>${x[2]}</span></button>`).join("")}</div><div class="sidefoot">HTML · CSS · JavaScript<br>LocalStorage · Offline</div></aside>`}
function shell(title,sub,body){
 A.innerHTML=nav()+`<main class="main"><header class="head"><div><div class="eyebrow">EXHIBITION CMS</div><h1>${title}</h1><div class="muted">${sub}</div></div><div class="actions"><button class="btn" onclick="exportData()">Xuất JSON</button><label class="btn">Nhập JSON<input hidden type=file accept=.json onchange="importData(this)"></label></div></header>${body}</main>`;
}
function count(arr,fn){return arr.filter(fn||(()=>true)).length}
function toolbar(type,label,placeholder,spaceFilter=true){
 return `<div class="toolbar"><div class="toolbar-left"><input id="search" placeholder="${placeholder}">${spaceFilter?`<select id="spaceFilter"><option value="">Tất cả không gian</option>${DB.spaces.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("")}</select>`:""}</div><button class="btn primary" onclick="openForm('${type}')">＋ ${label}</button></div>`;
}
function table(cols,rows){return `<div class="tablewrap"><table><thead><tr>${cols.map(c=>`<th>${c}</th>`).join("")}</tr></thead><tbody>${rows||`<tr><td colspan="${cols.length}" class="empty">Chưa có dữ liệu</td></tr>`}</tbody></table></div>`}
function bindTable(){
 const s=document.getElementById("search"),f=document.getElementById("spaceFilter");
 const apply=()=>document.querySelectorAll("tbody tr[data-search]").forEach(r=>r.style.display=(!s?.value||r.dataset.search.includes(s.value.toLowerCase()))&&(!f?.value||r.dataset.space===f.value)?"":"none");
 if(s)s.oninput=apply;if(f)f.onchange=apply;
}
function status(v){return `<span class="badge ${v?"green":"gray"}">${v?"Đang dùng":"Ẩn"}</span>`}
function dashboard(){
 shell("Tổng quan",DB.settings.subtitle,`
 <section class="cards">
  <div class="card">Không gian<strong>${DB.spaces.length}</strong><small>${count(DB.spaces,x=>x.status)} đang hoạt động</small></div>
  <div class="card">Nội dung<strong>${DB.contents.length}</strong><small>Được cấu hình theo phòng</small></div>
  <div class="card">Hiện vật<strong>${DB.artifacts.length}</strong><small>${DB.artifacts.filter(x=>x.status=="Trưng bày").reduce((a,x)=>a+Number(x.qty||0),0)} đang trưng bày</small></div>
  <div class="card">Tài liệu số hóa<strong>${DB.documents.length}</strong><small>${DB.documents.reduce((a,x)=>a+Number(x.pages||0),0)} trang</small></div>
 </section>
 <div class="grid">
 <section class="panel"><h2>Không gian & tài nguyên</h2>${DB.spaces.map(s=>{
  const n=count(DB.contents,x=>x.spaceId===s.id),a=count(DB.artifacts,x=>x.spaceId===s.id),d=count(DB.documents,x=>x.spaceId===s.id),m=count(DB.media,x=>x.spaceId===s.id);
  return `<div class="space" onclick="go('contents?space=${s.id}')"><div class=icon>${esc(s.code)}</div><div class=grow><b>${esc(s.name)}</b><small>${esc(s.floor)} · ${s.area} m²</small></div><div class=metrics><b>${n}<small>Nội dung</small></b><b>${a}<small>Hiện vật</small></b><b>${d}<small>Tài liệu</small></b><b>${m}<small>Media</small></b></div>→</div>`}).join("")}</section>
 <section class="panel"><h2>Thao tác nhanh</h2><div class="quick">
 <button onclick="openForm('space')">＋ Thêm không gian<small>Danh mục phòng cố định</small></button>
 <button onclick="openForm('content')">＋ Thêm nội dung<small>Gán vào không gian</small></button>
 <button onclick="openForm('artifact')">＋ Thêm hiện vật<small>Gán phòng + nội dung</small></button>
 <button onclick="openForm('document')">＋ Thêm tài liệu số<small>Gán phòng + nội dung</small></button>
 </div></section></div>
 <section class="panel"><h2>Mô hình dữ liệu</h2><div class="flow"><div><b>01</b> Không gian<small>Danh mục gốc</small></div><i>→</i><div><b>02</b> Nội dung<small>Chủ đề / timeline</small></div><i>→</i><div><b>03</b> Tài nguyên<small>Hiện vật · tài liệu · media</small></div><i>→</i><div><b>04</b> Vị trí<small>Tủ · màn hình · khu vực</small></div></div></section>`);
}
function spaces(){
 const rows=DB.spaces.map(s=>`<tr data-search="${esc((s.code+" "+s.name+" "+s.floor).toLowerCase())}"><td><b>${esc(s.code)}</b></td><td><b>${esc(s.name)}</b><small>${esc(s.description)}</small></td><td>${esc(s.floor)}</td><td>${s.area} m²</td><td>${count(DB.contents,x=>x.spaceId===s.id)}</td><td>${count(DB.artifacts,x=>x.spaceId===s.id)}</td><td>${count(DB.documents,x=>x.spaceId===s.id)}</td><td>${status(s.status)}</td><td class=actions><button onclick="openForm('space','${s.id}')">Sửa</button><button class=danger onclick="removeItem('spaces','${s.id}')">Xóa</button></td></tr>`);
 shell("Không gian trưng bày",pages.spaces[1],toolbar("space","Thêm không gian","Tìm mã, tên phòng...",false)+table(["Mã","Không gian","Tầng","Diện tích","ND","HV","TL","Trạng thái",""],rows.join("")));
 bindTable();
}
function contents(){
 const params=new URLSearchParams(location.hash.split("?")[1]||""),qspace=params.get("space")||"";
 const rows=DB.contents.filter(c=>!qspace||c.spaceId===qspace).map(c=>`<tr data-search="${esc((c.code+" "+c.name+" "+sname(c.spaceId)).toLowerCase())}" data-space="${c.spaceId}"><td><b>${esc(c.code)}</b></td><td><b>${esc(c.name)}</b><small>${esc(c.summary)}</small></td><td>${esc(sname(c.spaceId))}</td><td><span class=badge>${esc(c.type)}</span></td><td>${count(DB.artifacts,x=>x.contentId===c.id)}</td><td>${count(DB.documents,x=>x.contentId===c.id)}</td><td>${count(DB.media,x=>x.contentId===c.id)}</td><td>${status(c.status)}</td><td class=actions><button onclick="openForm('content','${c.id}')">Sửa</button><button class=danger onclick="removeItem('contents','${c.id}')">Xóa</button></td></tr>`);
 shell("Nội dung trưng bày",pages.contents[1],toolbar("content","Thêm nội dung","Tìm mã, tiêu đề...")+table(["Mã","Nội dung","Không gian","Loại","HV","TL","Media","Trạng thái",""],rows.join("")));
 bindTable();
}
function artifacts(){
 const rows=DB.artifacts.map(x=>`<tr data-search="${esc((x.code+" "+x.name+" "+x.category+" "+sname(x.spaceId)).toLowerCase())}" data-space="${x.spaceId}"><td><b>${esc(x.code)}</b></td><td><b>${esc(x.name)}</b><small>${esc(x.category)} · ${esc(x.period)}</small></td><td>${esc(sname(x.spaceId))}</td><td>${esc(cname(x.contentId))}</td><td>${x.qty}</td><td>${esc(x.location)}</td><td><span class="badge green">${esc(x.status)}</span></td><td class=actions><button onclick="openForm('artifact','${x.id}')">Sửa</button><button class=danger onclick="removeItem('artifacts','${x.id}')">Xóa</button></td></tr>`);
 shell("Hiện vật",pages.artifacts[1],toolbar("artifact","Thêm hiện vật","Tìm mã, tên, danh mục...")+table(["Mã","Hiện vật","Không gian","Nội dung","SL","Vị trí","Trạng thái",""],rows.join("")));
 bindTable();
}
function documents(){
 const rows=DB.documents.map(x=>`<tr data-search="${esc((x.code+" "+x.name+" "+x.type+" "+sname(x.spaceId)).toLowerCase())}" data-space="${x.spaceId}"><td><b>${esc(x.code)}</b></td><td><b>${esc(x.name)}</b></td><td>${esc(sname(x.spaceId))}</td><td>${esc(cname(x.contentId))}</td><td><span class=badge>${esc(x.type)}</span></td><td>${x.pages||"—"}</td><td>${esc(x.size)}</td><td class=actions><button onclick="openForm('document','${x.id}')">Sửa</button><button class=danger onclick="removeItem('documents','${x.id}')">Xóa</button></td></tr>`);
 shell("Tài liệu số hóa",pages.documents[1],toolbar("document","Thêm tài liệu","Tìm mã, tên tài liệu...")+table(["Mã","Tài liệu","Không gian","Nội dung","Loại","Trang","Dung lượng",""],rows.join("")));
 bindTable();
}
function media(){
 const rows=DB.media.map(x=>`<tr data-search="${esc((x.code+" "+x.name+" "+x.type+" "+sname(x.spaceId)).toLowerCase())}" data-space="${x.spaceId}"><td><b>${esc(x.code)}</b></td><td><b>${esc(x.name)}</b></td><td>${esc(sname(x.spaceId))}</td><td>${esc(cname(x.contentId))}</td><td><span class=badge>${esc(x.type)}</span></td><td><span class="badge ${x.status=="Đã xuất bản"?"green":"orange"}">${esc(x.status)}</span></td><td class=actions><button onclick="openForm('media','${x.id}')">Sửa</button><button class=danger onclick="removeItem('media','${x.id}')">Xóa</button></td></tr>`);
 shell("Media",pages.media[1],toolbar("media","Thêm media","Tìm mã, tên media...")+table(["Mã","Tên","Không gian","Nội dung","Loại","Trạng thái",""],rows.join("")));
 bindTable();
}
function locations(){
 const rows=DB.locations.map(x=>`<tr data-search="${esc((x.code+" "+x.name+" "+sname(x.spaceId)).toLowerCase())}" data-space="${x.spaceId}"><td><b>${esc(x.code)}</b></td><td>${esc(x.name)}</td><td>${esc(sname(x.spaceId))}</td><td>${esc(x.type)}</td><td><span class=badge green>Hoạt động</span></td><td class=actions><button onclick="openForm('location','${x.id}')">Sửa</button><button class=danger onclick="removeItem('locations','${x.id}')">Xóa</button></td></tr>`);
 shell("Vị trí trưng bày",pages.locations[1],toolbar("location","Thêm vị trí","Tìm mã, tên vị trí...")+table(["Mã","Vị trí","Không gian","Loại","Trạng thái",""],rows.join("")));
 bindTable();
}
const S={
 space:["spaces","Không gian",[["code","Mã","text",1],["name","Tên không gian","text",1],["floor","Tầng / khu","text",0],["area","Diện tích m²","number",0],["status","Trạng thái","select",0,[["1","Đang hoạt động"],["0","Ẩn"]]],["description","Mô tả","textarea",0]]],
 content:["contents","Nội dung",[["code","Mã","text",1],["name","Tên / tiêu đề","text",1],["spaceId","Không gian","space",1],["type","Loại","select",0,[["Chủ đề","Chủ đề"],["Timeline","Timeline"],["Giới thiệu","Giới thiệu"],["Tiểu mục","Tiểu mục"]]],["summary","Mô tả ngắn","textarea",0],["status","Trạng thái","select",0,[["1","Đang dùng"],["0","Ẩn"]]]]],
 artifact:["artifacts","Hiện vật",[["code","Mã","text",1],["name","Tên hiện vật","text",1],["spaceId","Không gian","space",1],["contentId","Nội dung","content",0],["category","Danh mục","text",0],["period","Niên đại","text",0],["qty","Số lượng","number",0],["status","Trạng thái","select",0,[["Trưng bày","Đang trưng bày"],["Kho","Lưu kho"]]],["condition","Tình trạng","text",0],["location","Vị trí","text",0]]],
 document:["documents","Tài liệu",[["code","Mã","text",1],["name","Tên tài liệu","text",1],["spaceId","Không gian","space",1],["contentId","Nội dung","content",0],["type","Loại","select",0,[["PDF","PDF"],["IMAGE","Ảnh"],["DOC","DOC"],["OTHER","Khác"]]],["pages","Số trang","number",0],["size","Dung lượng","text",0]]],
 media:["media","Media",[["code","Mã","text",1],["name","Tên media","text",1],["spaceId","Không gian","space",1],["contentId","Nội dung","content",0],["type","Loại","select",0,[["IMAGE","Ảnh"],["VIDEO","Video"],["AUDIO","Audio"],["3D","Mô hình 3D"]]],["status","Trạng thái","select",0,[["Đã xuất bản","Đã xuất bản"],["Nháp","Nháp"]]]]],
 location:["locations","Vị trí",[["code","Mã","text",1],["name","Tên vị trí","text",1],["spaceId","Không gian","space",1],["type","Loại","select",0,[["Tủ","Tủ"],["Màn hình","Màn hình"],["Mảng tường","Mảng tường"],["Khu vực","Khu vực"]]]]]
};
function opts(kind,val){
 const arr=kind=="space"?DB.spaces:DB.contents;
 return arr.map(x=>`<option value="${x.id}" ${x.id===val?"selected":""}>${esc(x.code)} - ${esc(x.name)}</option>`).join("");
}
function openForm(type,eid){
 const cfg=S[type],arr=DB[cfg[0]],old=eid?arr.find(x=>x.id===eid):{};
 const fields=cfg[2].map(f=>{
  const [key,label,t,req,choices]=f,v=old[key]??"";
  let c="";
  if(t=="textarea")c=`<textarea name="${key}" rows="3">${esc(v)}</textarea>`;
  else if(t=="space")c=`<select name="${key}" ${req?"required":""}><option value="">-- Chọn --</option>${opts("space",v)}</select>`;
  else if(t=="content")c=`<select name="${key}"><option value="">-- Không gán --</option>${opts("content",v)}</select>`;
  else if(t=="select")c=`<select name="${key}">${choices.map(o=>`<option value="${esc(o[0])}" ${String(v)===String(o[0])?"selected":""}>${esc(o[1])}</option>`).join("")}</select>`;
  else c=`<input name="${key}" type="${t}" value="${esc(v)}" ${req?"required":""}>`;
  return `<div class=field><label>${esc(label)}${req?" *":""}</label>${c}</div>`;
 }).join("");
 M.innerHTML=`<div class=modal><div class=backdrop onclick="closeModal()"></div><div class=box><div class=mhead><div><div class=eyebrow>QUẢN LÝ</div><h2>${eid?"Chỉnh sửa":"Thêm"} ${esc(cfg[1])}</h2></div><button class=close onclick="closeModal()">×</button></div><form id=form><div class=form>${fields}</div><div class=foot><button type=button class=btn onclick="closeModal()">Hủy</button><button class="btn primary">Lưu dữ liệu</button></div></form></div></div>`;
 M.querySelector("#form").onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));["area","pages","qty"].forEach(k=>{if(k in d&&d[k]!="")d[k]=Number(d[k])});if(eid)Object.assign(old,d);else{d.id=type.slice(0,2)+Date.now().toString(36);arr.push(d)}save();closeModal();toast("Đã lưu dữ liệu");render()};
}
function closeModal(){M.innerHTML=""}
function removeItem(key,id){
 if(!confirm("Xóa dữ liệu này?"))return;
 const a=DB[key],i=a.findIndex(x=>x.id===id);if(i<0)return;a.splice(i,1);
 if(key=="spaces")["contents","artifacts","documents","media","locations"].forEach(k=>DB[k].forEach(x=>{if(x.spaceId===id)x.spaceId=""}));
 if(key=="contents")["artifacts","documents","media"].forEach(k=>DB[k].forEach(x=>{if(x.contentId===id)x.contentId=""}));
 save();toast("Đã xóa");render();
}
function settings(){
 shell("Thiết lập","Cấu hình hệ thống và dữ liệu",`<section class=panel><h2>Cấu hình</h2><form id=set><div class=form><div class=field><label>Tên đơn vị</label><input name=name value="${esc(DB.settings.name)}"></div><div class=field><label>Mô tả</label><input name=subtitle value="${esc(DB.settings.subtitle)}"></div></div><button class="btn primary">Lưu</button></form><hr><h2>Dữ liệu</h2><p class=muted>Toàn bộ dữ liệu mẫu được lưu trong LocalStorage. Có thể xuất JSON để sao lưu.</p><button class="btn danger" onclick="resetData()">Khôi phục dữ liệu mẫu</button></section>`);
 document.getElementById("set").onsubmit=e=>{e.preventDefault();Object.assign(DB.settings,Object.fromEntries(new FormData(e.target)));save();toast("Đã cập nhật");render()};
}
const initial=JSON.parse(JSON.stringify(DB));
function resetData(){if(confirm("Khôi phục dữ liệu mẫu?")){localStorage.removeItem("exhibition_db");location.reload()}}
function exportData(){const b=new Blob([JSON.stringify(DB,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="exhibition-data.json";a.click();URL.revokeObjectURL(a.href)}
function importData(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!d.spaces||!d.contents)throw 0;Object.keys(DB).forEach(k=>delete DB[k]);Object.assign(DB,d);save();toast("Đã nhập dữ liệu");render()}catch(e){alert("JSON không hợp lệ")}};r.readAsText(f)}
function render(){const p=page();const fn={dashboard,spaces,contents,artifacts,documents,media,locations,settings}[p]||dashboard;fn()}
window.go=go;window.openForm=openForm;window.closeModal=closeModal;window.removeItem=removeItem;window.exportData=exportData;window.importData=importData;window.resetData=resetData;
window.addEventListener("hashchange",render);render();
})();