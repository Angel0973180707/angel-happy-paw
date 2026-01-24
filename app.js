const MOVES=['先聽完對方再回應','把語速放慢一點','少說一句應該'];
btnPick.onclick=()=>move.innerText=MOVES[Math.floor(Math.random()*MOVES.length)];