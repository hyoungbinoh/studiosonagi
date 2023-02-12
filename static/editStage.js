var mapContainer = document.getElementById('map3'), // 지도를 표시할 div 
mapOption = { 
    center: new kakao.maps.LatLng(37.49998, 127.03970), // 지도의 중심좌표
    level: 3 // 지도의 확대 레벨
};

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 마커가 표시될 위치입니다 
var markerPosition  = new kakao.maps.LatLng(37.49998, 127.03970); 

// 마커를 생성합니다
var marker = new kakao.maps.Marker({
position: markerPosition
});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);

    // 커스텀 오버레이에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
var content = '<div class="customoverlay">' +
'  <a href="https://map.kakao.com/link/map/소나기사운드웍스, 37.49998, 127.03970" target="_blank">' +
'    <span class="title">서울 강남구 테헤란로30길 19, 지하 1층</span>' +
'  </a>' +
'</div>';

// 커스텀 오버레이가 표시될 위치입니다 
var position = new kakao.maps.LatLng(37.49998, 127.03970);  

// 커스텀 오버레이를 생성합니다
var customOverlay = new kakao.maps.CustomOverlay({
map: map,
position: position,
content: content,
yAnchor: 1 
});