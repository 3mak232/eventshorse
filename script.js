// Client-side handler: ticket selection, countdown, and WhatsApp form send
document.addEventListener('DOMContentLoaded',function(){
  const form = document.getElementById('bookingForm');
  const result = document.getElementById('formResult');
  const ticketButtons = document.querySelectorAll('.select-ticket');
  const ticketSelect = document.getElementById('ticketSelect');
  const bookTop = document.getElementById('bookTop');
  const waBase = 'https://wa.me/201014027210'; // owner WhatsApp (country code 20 + number without leading zero)

  ticketButtons.forEach(b=> b.addEventListener('click', ()=>{
    const t = b.dataset.ticket;
    ticketSelect.value = t;
    window.scrollTo({top: document.getElementById('booking').offsetTop - 20, behavior:'smooth'});
  }));

  if(bookTop) bookTop.addEventListener('click', ()=>{
    window.scrollTo({top: document.getElementById('booking').offsetTop - 20, behavior:'smooth'});
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    result.style.display = 'none';
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    // Validation
    if(!payload.name || !payload.phone || !payload.ticket){
      alert('من فضلك اكمل الحقول المطلوبة');
      return;
    }

    // Build Arabic message
    const messageLines = [
      'طلب حجز - حدث MRGH Events',
      'الاسم: ' + payload.name,
      'رقم الجوال: ' + payload.phone,
      'نوع التذكرة: ' + payload.ticket,
      'طريقة الدفع: ' + (payload.payment === 'cash' ? 'كاش' : payload.payment === 'vodafone_cash' ? 'فودافون كاش' : 'نستا باي'),
      'التاريخ: الجمعة 7 نوفمبر 2025'
    ];
    const message = encodeURIComponent(messageLines.join('%0A'));

    // Open WhatsApp with the message
    const waLink = waBase + '?text=' + message;
    window.open(waLink, '_blank');
    // show temporary confirmation on page
    result.style.display = 'block';
    result.innerHTML = '<strong>تم فتح واتساب</strong> — تأكد من إرسال الرسالة لإكمال الحجز.';
    form.reset();
  });

  // Countdown to Nov 7, 2025 (local time)
  const countdownEl = document.getElementById('countdown');
  const target = new Date('2025-11-07T09:00:00+03:00'); // event morning (Cairo UTC+3)
  function updateCountdown(){
    const now = new Date();
    const diff = target - now;
    if(diff <= 0){
      countdownEl.innerText = 'الحدث بدأ — الجمعة 7 نوفمبر 2025';
      clearInterval(timer);
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((diff % (1000*60)) / 1000);
    countdownEl.innerText = days + ' يوم ' + hours + ' س ' + minutes + ' د ' + seconds + ' ث';
  }
  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);
});
