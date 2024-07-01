const say = require('say');

window.addEventListener('load', function () {
  document.getElementById('message').addEventListener('keyup', (e) => {

    if(e.key === 'Enter') {
      var now = new Date();
      var fileName = now.toISOString().replace(/[.:]/g,"")+".wav";
      const message = document.getElementById('message').value;
      document.getElementById('message').value = "";

      say.export(message, "Paul", null, fileName);
    }

  });
});
