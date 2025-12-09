// AOS
AOS.init();

lightbox.option({
  alwaysShowNavOnTouchDevices: true,
  wrapAround: true,
});

// music
var music = '';
audio = document.querySelector('.audio');
if (music) {
  audio.src = music;
}

// door mulai
function mulai() {
  // back to top
  window.scrollTo(0, 0);

  var audioDoor = document.getElementById('doorSound');
  audioDoor.play();

  var doorSection = $('#door-section');
  var doors = document.querySelectorAll('.door');
  doors.forEach(function (door, index) {
    var direction = index === 0 ? -1 : 1;
    door.style.transform = 'rotateY(' + 70 * direction + 'deg)';
  });

  setTimeout(function () {
    // music
    audio.play();
    doorSection.css('transform', 'scale(6)');
  }, 600);

  setTimeout(function () {
    doorSection.css('opacity', 0);
    $('body').removeClass('overflow-hidden');
    $('body').addClass('transition');
    doorSection.css('display', 'none');
  }, 2000);
}

// button music
var isPlaying = true;

function toggleMusic(event) {
  event.preventDefault();

  const musicButton = document.getElementById('musicButton');
  const audioElement = document.querySelector('.audio');

  if (isPlaying) {
    musicButton.innerHTML = '<i class="fas fa-fw fa-pause"></i>';
    musicButton.classList.remove('rotate');
    musicButton.style.transform = 'translateY(0)';
    audioElement.pause();
  } else {
    musicButton.innerHTML = '<i class="fas fa-fw fa-compact-disc"></i>';
    musicButton.classList.add('rotate');
    audioElement.play();
  }

  isPlaying = !isPlaying;
}

// date counter
var countDownDate = new Date('Dec 22, 2025 00:00:00').getTime();

var x = setInterval(function () {
  var now = new Date().getTime();

  var distance = countDownDate - now;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('countdown-wedding').innerHTML = `
		<div class="col-lg-1 col-3"><div class="text-center p-2 rounded text-light"><h5>${days}</h5> Hari</div></div>
      	<div class="col-lg-1 col-3"><div class="text-center p-2 rounded text-light"><h5>${hours}</h5> Jam</div></div>
      	<div class="col-lg-1 col-3"><div class="text-center p-2 rounded text-light"><h5>${minutes}</h5> Menit</div></div>
      	<div class="col-lg-1 col-3"><div class="text-center p-2 rounded text-light"><h5>${seconds}</h5> Detik</div></div>
	`;

  if (distance < 0) {
    clearInterval(x);
    document.getElementById('countdown-wedding').innerHTML =
      "<span class='text-center p-3 rounded text-light m-2'><h2>Sudah dimulai!</h2></span>";
  }
}, 1000);

// get url to pronoun and name
const urlParams = new URLSearchParams(window.location.search);
const pronoun = urlParams.get('p');
const name = urlParams.get('n');
const namaSambutan = document.querySelector('#namaSambutan');
namaSambutan.innerText = `${pronoun} ${name},`;

// copy text
function copyText(el) {
  var content = jQuery(el)
    .siblings('div.card-container')
    .find('div.card-number')
    .text()
    .trim();

  var temp = document.createElement('textarea');
  document.body.appendChild(temp);
  temp.value = content.replace(/\s+/g, '');
  temp.select();
  document.execCommand('copy');
  document.body.removeChild(temp);

  jQuery(el).text('berhasil di copy');

  setTimeout(function () {
    jQuery(el).html(`<i class="fas fa-regular fa-copy"></i> Copy`);
  }, 1000);
}

// ambil nama berdasarkan ?id=
async function ambilNamaDariId() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'), 10);

  const response = await fetch(
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTN4kJI3xmVT1RbOq0j98UpH1ZUrkjTRBYpisFfd77ZTklukeYQ6dAtXc0Kjl_Pt4lx9ukqN82QWDE8/pub?gid=0&single=true&output=csv'
  );
  const csv = await response.text();
  const rows = csv
    .trim()
    .split('\n')
    .map((row) => row.split(','));
  const headers = rows[0];
  const namaIndex = headers.findIndex((h) => h.toLowerCase() === 'nama');

  const namaSambutan = document.querySelector('#namaSambutan');

  if (isNaN(id) || id < 1 || id >= rows.length) {
    namaSambutan.innerText = 'Tamu Undangan';
    return;
  }

  const nama = rows[id][namaIndex];
  namaSambutan.innerText = nama || 'Tamu Undangan';
}
ambilNamaDariId();

// Ambil data dari Google Apps Script Web App
const urlParams2 = new URLSearchParams(window.location.search);
const undanganId = urlParams2.get('id');

if (undanganId) {
  fetch(
    `https://script.google.com/macros/s/AKfycby2JZIjiQ3lX6GCoQVr0oqzeVk3BRIwfstn0sOclM2kTr2mzGlbfthBYrbOvu1krnoE/exec?id=${undanganId}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.nama) {
        const namaSambutan = document.querySelector('#namaSambutan');
        namaSambutan.innerText = `Kepada ${data.nama},`;
      } else {
        console.warn('Data tidak ditemukan');
      }
    })
    .catch((err) => console.error('Error:', err));
}

// rsvp
window.addEventListener('load', function () {
  const form = document.getElementById('rsvp-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const status = document.getElementById('status').value;
    const nama = document.getElementById('nama').value.trim();

    if (nama === '') {
      Swal.fire({
        icon: 'error',
        text: 'Nama harus diisi!',
      });
      return;
    }

    if (status == '0') {
      Swal.fire({
        icon: 'error',
        text: 'Pilih salah satu status terlebih dahulu!',
      });
      return;
    }

    const data = new FormData(form);
    const action = e.target.action;
    const input = form.querySelectorAll('input, select, button');
    input.forEach((input) => {
      input.disabled = true;
    });

    fetch(action, {
      method: 'POST',
      body: data,
    })
      .then(() => {
        Swal.fire({
          icon: 'success',
          text: 'Konfirmasi kehadiran Anda berhasil terkirim!',
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          text: error,
        });
      })
      .finally(() => {
        input.forEach((input) => {
          input.disabled = false;
        });
      });
  });
});

function getGuestNameFromQS() {
  setTimeout(function () {
    const qs = new URLSearchParams(window.location.search);
    const guestName = qs.get('guest_name');

    const namaSambutan = document.querySelector('#namaSambutan');
    if (guestName) {
      namaSambutan.innerText = `Kepada ${guestName},`;
    } else {
      namaSambutan.innerText = 'Tamu Undangan';
    }
  }, 2000);
}

getGuestNameFromQS();