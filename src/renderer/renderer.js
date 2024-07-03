const axios = require('axios');
const fs = require('fs');
const CONFIG = require('../config/user_config.json');
const API_KEY = require('../config/api_key.json');

window.addEventListener('load', function () {
  document.getElementById('message').addEventListener('keyup', (e) => {

    if(e.key === 'Enter') {
      var now = new Date();
      var fileName = now.toISOString().replace(/[.:]/g,"")+".wav";
      const message = document.getElementById('message').value;
      document.getElementById('message').value = "";
      generateMessage(message, fileName);
  }
  
});

  document.getElementById('closeBtn').addEventListener('click', () => {
    window.close();
});

});


const generateMessage = async (message, fileName) => {
  const request = {
    input: {text: message},
    voice: {
      ...CONFIG.VOICE,
    },
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the text-to-speech request
  axios.post(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY.GOOGLE_TTS_API_KEY}`,
    request
  ).then((response) => {
  const audioContent = response.data.audioContent;
  fs.writeFileSync(`${fileName}.mp3`, audioContent, 'base64');
  });


}
