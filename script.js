let currentLevel="";

function selectLevel(level){

currentLevel=level;

document.getElementById("levelPage").classList.add("hidden");

document.getElementById("gamePage").classList.remove("hidden");

document.getElementById("levelTitle").innerHTML=
"Level Dipilih : "+level;

}

function loadActivity(no){

const area=document.getElementById("activityArea");

switch(no){

case 1:

area.innerHTML=`

<h2>Aktiviti 1 : Mengecam Bunyi</h2>

<p>Tekan butang bunyi dan pilih jawapan.</p>

<button onclick="alert('Bunyi Ayam dimainkan')">
🔊 Main Bunyi
</button>

<br><br>

<button onclick="checkAnswer(true)">
🐔 Ayam
</button>

<button onclick="checkAnswer(false)">
🚗 Kereta
</button>

`;

break;

case 2:

area.innerHTML=`

<h2>Aktiviti 2 : Padanan</h2>

<p>Padankan gambar dengan label.</p>

<div class="card">🐔 Ayam ↔ Bunyi Kokok</div>
<div class="card">🚗 Kereta ↔ Vroom</div>

`;

break;

case 3:

area.innerHTML=`

<h2>Aktiviti 3 : Drag & Drop</h2>

<div id="dragItem"
class="draggable"
draggable="true">
🐔 Ayam
</div>

<div class="dropzone"
ondrop="drop(event)"
ondragover="allowDrop(event)">
Haiwan
</div>

`;

break;

case 4:

memoryGame();
break;

case 5:

area.innerHTML=`

<h2>Aktiviti 5 : Betul dan Salah</h2>

<p>Adakah ini bunyi kenderaan?</p>

<h1>🚗</h1>

<button onclick="checkAnswer(true)">
✔ Betul
</button>

<button onclick="checkAnswer(false)">
✘ Salah
</button>

`;

break;

case 6:

area.innerHTML=`

<h2>Aktiviti 6 : Susun Urutan</h2>

<p>1 → Haiwan</p>
<p>2 → Manusia</p>
<p>3 → Kenderaan</p>

`;

break;

case 7:

area.innerHTML=`

<h2>Aktiviti 7 : Puzzle Gambar</h2>

<p>Susun 4 kepingan gambar.</p>

<div style="display:grid;
grid-template-columns:repeat(2,150px);
gap:10px;">

<div class="card">1</div>
<div class="card">2</div>
<div class="card">3</div>
<div class="card">4</div>

</div>

`;

break;

}

}

function checkAnswer(correct){

const area=document.getElementById("activityArea");

if(correct){

area.innerHTML+=
"<p class='success'>🎉 Tahniah!</p>";

}
else{

area.innerHTML+=
"<p class='fail'>❌ Cuba Lagi</p>";

}

}

function allowDrop(ev){
ev.preventDefault();
}

function drop(ev){

ev.preventDefault();

alert("Tahniah!");

}

function memoryGame(){

const area=document.getElementById("activityArea");

area.innerHTML=`
<h2>Aktiviti 4 : Permainan Memori</h2>

<div class="memory-grid">

<div class="memory-card"></div>
<div class="memory-card"></div>
<div class="memory-card"></div>
<div class="memory-card"></div>

<div class="memory-card"></div>
<div class="memory-card"></div>
<div class="memory-card"></div>
<div class="memory-card"></div>

</div>
`;

}
