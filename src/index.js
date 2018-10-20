(function(apiUrl) {

 
  function fetchParrotsCount() {
    return fetch(apiUrl + "/messages/parrots-count")
      .then(function(response) {
        return response.json();
      })
      .then(function(count) {
        document.getElementById("parrots-counter").innerHTML = count;
      });
  }

  function listMessages() {
    // Faz um request para a API de listagem de mensagens
    // Atualiza a o conteúdo da lista de mensagens
    // Deve ser chamado a cada 3 segundos
    window.setInterval(function(){
      
      var list = document.querySelector('.messages');
      
      return fetch(apiUrl + "/messages")
        .then(response => response.json())
        .then(messages => {
          var html = "";
          
          for (var i=0; i<messages.length; i++){

            var date = new Date(messages[i].created_at);
            var stringTime = [date.getHours(), date.getMinutes()].join(':');
            
            html += "<li ";

            if (messages[i].has_parrot)
              html += "class='parrotMsg'";

            html += "><div class='container'>" + 
                    "<img src='" + messages[i].author.avatar + "' class='avatar'>" +
                    "<p>" + messages[i].author.name + " <span class='time'> " + stringTime + " </span>" + 
                    "<img class='parrotImg' value=" + messages[i].id + " src='images/light-parrot.svg'></p>" + 
                    "<p>" + messages[i].content + "</p>" +
                    "</div></li>";
          }

          list.innerHTML = '';
          list.innerHTML = html;
        });
    },3000);

  }

  function parrotMessage(messageId) {
    // Faz um request para marcar a mensagem como parrot no servidor
    // Altera a mensagem na lista para que ela apareça como parrot na interface
  }

  function sendMessage(message, authorId) {
    // Manda a mensagem para a API quando o usuário envia a mensagem
    // Caso o request falhe exibe uma mensagem para o usuário utilizando Window.alert ou outro componente visual
    // Se o request for bem sucedido, atualiza o conteúdo da lista de mensagens
  }

  function getMe() {
    // Faz um request para pegar os dados do usuário atual
    // Exibe a foto do usuário atual na tela e armazena o seu ID para quando ele enviar uma mensagem
    return fetch(apiUrl + "/me")
      .then(response => response.json())
      .then(user => {
        document.querySelector('#userImage').src = user.avatar;

        //window.sessionStorage.setItem("me", user);
      });
  }


  function initialize() {
    fetchParrotsCount();
    getMe();
    listMessages();
  }

  function uptadeList(){

  }


  initialize();
})("https://tagchatter.herokuapp.com");


