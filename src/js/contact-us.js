document.querySelector('button.submit').addEventListener('click', function (event) {
  var nameInput = document.querySelector('.name input');
  var emailInput = document.querySelector('.email input');
  var msgInput = document.querySelector('.msg textarea');

  var name = nameInput.value.trim();
  var email = emailInput.value.trim();
  var text = msgInput.value.trim();

  if (!name || !email || !text) {
    alert('Semua kolom harus diisi!');
    return;
  }

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert('Format email tidak valid!');
    return;
  }

  var encodedName = encodeURIComponent(name);
  var encodedEmail = encodeURIComponent(email);
  var encodedText = encodeURIComponent(text);

  var message = `Permisi, Tokko Saya ${encodedName}.%0A%0A${encodedText}%0A%0ARegards, ${encodedName}%0A%0A${encodedEmail}`;
  var url = `https://api.whatsapp.com/send?phone=6285704993774&text=${message}`;

  window.open(url);
});
