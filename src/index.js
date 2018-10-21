(function (apiUrl) {

  const UNPARROT_IMG = 'images/light-parrot.svg';
  const PARROT_IMG = 'images/parrot.png';
  const UNPARROT_COLOR = '#fff';
  const PARROT_COLOR = '#FFFAE7';

  function fetchParrotsCount() {
    return fetch(apiUrl + "/messages/parrots-count")
      .then(function (response) {
        return response.json();
      })
      .then(function (count) {
        document.getElementById("parrots-counter").innerHTML = count;
      });
  }

  function listMessages() {
    // Faz um request para a API de listagem de mensagens
    // Atualiza a o conteúdo da lista de mensagens
    // Deve ser chamado a cada 3 segundos
    fetchParrotsCount();

    return fetch(apiUrl + "/messages")
      .then(response => response.json())
      .then(messages => {
        var html = "";

        for (var i = 0; i < messages.length; i++) {

          var date = new Date(messages[i].created_at);
          var stringTime = formatTime(date.getHours(), date.getMinutes());
          var imgPath = UNPARROT_IMG;

          html += "<li id='li" + messages[i].id + "' ";

          if (messages[i].has_parrot) {
            html += "class='parrotMsg'";
            imgPath = PARROT_IMG;
          }

          html += "><div class='container'>" +
            "<img src='" + messages[i].author.avatar + "' class='avatar'>" +
            "<p>" + messages[i].author.name + " <span class='time'> " + stringTime + " </span>" +
            "<img class='parrotImg' id='" + messages[i].id + "' src='" + imgPath + "'></p>" +
            "<p>" + messages[i].content + "</p>" +
            "</div></li>";
        }

        document.querySelector('.messages').innerHTML = html;

        var parrotsImgs = document.querySelectorAll('.parrotImg');
        for (var i = 0; i < parrotsImgs.length; i++)
          parrotsImgs[i].addEventListener("click", event => {
            if (event.target.src.indexOf(UNPARROT_IMG) >= 0)
              parrotMessage(event.target.id);
            else
              unparrotMessage(event.target.id);
          });

      });
  }

  function parrotMessage(messageId) {
    // Faz um request para marcar a mensagem como parrot no servidor
    // Altera a mensagem na lista para que ela apareça como parrot na interface
    return fetch(apiUrl + "/messages/" + messageId + "/parrot", { method: 'PUT' })
      .then(() => {
        document.querySelector("#li" + messageId).style.backgroundColor = PARROT_COLOR;
        document.querySelector("#li" + messageId + " > div > p > img").src = PARROT_IMG;
        fetchParrotsCount();
      })
      .catch((err) => alert("Erro ao marcar mensagem: " + err));
  }

  function unparrotMessage(messageId) {

    return fetch(apiUrl + "/messages/" + messageId + "/unparrot", { method: 'PUT' })
      .then(() => {
        document.querySelector("#li" + messageId).style.backgroundColor = UNPARROT_COLOR;
        document.querySelector("#li" + messageId + " > div > p > img").src = UNPARROT_IMG;
        fetchParrotsCount();
      })
      .catch((err) => alert("Erro ao desmarcar mensagem: " + err));
  }

  function sendMessage(message, authorId) {
    // Manda a mensagem para a API quando o usuário envia a mensagem
    // Caso o request falhe exibe uma mensagem para o usuário utilizando Window.alert ou outro componente visual
    // Se o request for bem sucedido, atualiza o conteúdo da lista de mensagens
    return fetch(apiUrl + "/messages", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message, author_id: authorId })
    })
      .then((response) => {
        if (response.ok) {
          listMessages();
          document.querySelector('#msg').value = '';
        } else
          alert("Falha ao enviar a mensagem, tente novamente");
      })
      .catch((err) => console.err("Erro ao enviar mensagem: " + err));
  }

  function getMe() {
    // Faz um request para pegar os dados do usuário atual
    // Exibe a foto do usuário atual na tela e armazena o seu ID para quando ele enviar uma mensagem
    return fetch(apiUrl + "/me")
      .then(response => response.json())
      .then(user => {
        document.querySelector('#userImage').src = user.avatar;
        window.sessionStorage.setItem("userId", user.id);
      });
  }

  function formatTime(hours, minutes) {

    var ret = '';
    ret += (hours < 10) ? '0' + hours : hours;
    ret += ":";
    ret += (minutes < 10) ? '0' + minutes : minutes;
    return ret;
  }


  function initialize() {
    fetchParrotsCount();
    getMe();
    listMessages();

    window.addEventListener("DOMContentLoaded", () => {

      document.getElementById("btnEnviar").addEventListener("click", () => {
        sendMessage(document.querySelector("#msg").value, window.sessionStorage.getItem("userId"));
      });

      setInterval(listMessages, 3000);
      
    });
  }

  initialize();
})("https://tagchatter.herokuapp.com");

