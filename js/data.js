window.DB={
 settings:{name:"TRUNG TÂM TRƯNG BÀY",subtitle:"Hệ thống quản lý không gian và nội dung"},
 spaces:[
  {id:"s1",code:"P01",name:"Lịch sử Thành phố",floor:"Tầng 1",area:320,status:1,description:"Không gian lịch sử."},
  {id:"s2",code:"P02",name:"Văn hóa Nam Bộ",floor:"Tầng 1",area:260,status:1,description:"Không gian văn hóa."},
  {id:"s3",code:"P03",name:"Ngoại giao & Hội nhập",floor:"Tầng 2",area:180,status:1,description:"Các dấu mốc ngoại giao."}
 ],
 contents:[
  {id:"c1",spaceId:"s1",code:"ND01",name:"Giai đoạn 1975 - 1985",type:"Timeline",status:1,summary:"Nền móng sau thống nhất."},
  {id:"c2",spaceId:"s1",code:"ND02",name:"Đổi mới và phát triển",type:"Chủ đề",status:1,summary:"Những chuyển biến thời kỳ đổi mới."},
  {id:"c3",spaceId:"s2",code:"ND03",name:"Đời sống cư dân Nam Bộ",type:"Chủ đề",status:1,summary:"Đời sống, văn hóa, lễ hội."}
 ],
 artifacts:[
  {id:"a1",spaceId:"s1",contentId:"c1",code:"HV001",name:"Hiện vật lịch sử mẫu",category:"Lịch sử",period:"1975",qty:1,status:"Trưng bày",condition:"Tốt",location:"A01"},
  {id:"a2",spaceId:"s2",contentId:"c3",code:"HV002",name:"Trang phục Nam Bộ",category:"Văn hóa",period:"Thế kỷ XX",qty:2,status:"Trưng bày",condition:"Tốt",location:"B01"}
 ],
 documents:[
  {id:"d1",spaceId:"s1",contentId:"c1",code:"TL001",name:"Hồ sơ giai đoạn 1975 - 1985",type:"PDF",pages:120,size:"48 MB"},
  {id:"d2",spaceId:"s2",contentId:"c3",code:"TL002",name:"Bộ ảnh văn hóa Nam Bộ",type:"IMAGE",pages:0,size:"320 MB"}
 ],
 media:[
  {id:"m1",spaceId:"s1",contentId:"c1",code:"M001",name:"Video tư liệu",type:"VIDEO",status:"Đã xuất bản"},
  {id:"m2",spaceId:"s2",contentId:"c3",code:"M002",name:"Album văn hóa",type:"IMAGE",status:"Nháp"}
 ],
 locations:[
  {id:"l1",spaceId:"s1",code:"A01",name:"Tủ trưng bày A01",type:"Tủ"},
  {id:"l2",spaceId:"s1",code:"A02",name:"Màn hình tương tác A02",type:"Màn hình"},
  {id:"l3",spaceId:"s2",code:"B01",name:"Tủ trưng bày B01",type:"Tủ"}
 ]
};
try{const s=localStorage.getItem("exhibition_db");if(s)window.DB=JSON.parse(s)}catch(e){}