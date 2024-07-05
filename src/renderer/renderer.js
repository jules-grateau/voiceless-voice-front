const axios = require('axios');
const fs = require('fs');
const CONFIG = require('../config/user_config.json');
const API_KEY = require('../config/api_key.json');

window.addEventListener('load', function () {
  document.getElementById('message').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      const message = document.getElementById('message').value;
      document.getElementById('message').value = '';
      generateMessage(message);
    }
  });

  document.getElementById('reddit').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      const redditUrl = document.getElementById('reddit').value;
      readReddit(redditUrl);
    }
  });

  document.getElementById('closeBtn').addEventListener('click', () => {
    window.close();
  });
});

const generateFileName = () => {
  var now = new Date();
  return now.toISOString().replace(/[.:]/g, '');
};

const generateMessage = async (message) => {
  const request = {
    input: { text: message },
    voice: {
      ...CONFIG.VOICE,
    },
    audioConfig: { audioEncoding: 'MP3' },
  };

  // Performs the text-to-speech request
  await axios
    .post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY.GOOGLE_TTS_API_KEY}`,
      request
    )
    .then((response) => {
      const audioContent = response.data.audioContent;
      fs.writeFileSync(`${generateFileName()}.mp3`, audioContent, 'base64');
    });
};

const readReddit = async (redditUrl) => {
  const response = await (await fetch(redditUrl + '.json')).json();

  const post = response[0].data.children[0].data;
  var comments = response[1].data.children;

  message = `Lecture d'un poste Reddit. Titre : ${post.title} par ${post.author} `;
  await generateMessage(message);
  message = `${post.selftext}`;
  await generateMessage(message);

  const nbCommentsToRead = 2;
  var commentRead = 0;
  comments = comments.filter(
    (comment) => comment.data.author != 'AutoModerator'
  );

  comments.sort((a, b) => b.data.score - a.data.score);

  while (commentRead < nbCommentsToRead) {
    var comment = comments[commentRead]?.data;
    if (comment) {
      message = `${comment.author} à répondu : ${comment.body}`;
      await generateMessage(message);
    }

    commentRead++;
  }
};
