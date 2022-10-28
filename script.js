let nome;
let messageType = "message";
let nomeEscolhido = "Todos";

//pergunta o nome do usuário, verifica se está disponivel e libera entrada
function começar () {
     nome= prompt ('Qual o seu nome?');

    const promise= axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name: nome}); 
    promise.then(nomeAceito); 
    promise.catch(nomeErrado);

}
começar();

function nomeAceito (resposta){
 setInterval(toAqui, 5000);
 setInterval(puxarMensagens, 3000);
}


function nomeErrado(sinal) {
    let status = (sinal.response.status);
    if (status === 400) {
        alert (`Esse user não está disponível! Tente novamente`);
        começar();
    } else {
        alert (`Puxa! Encontramos o erro ${status} !`);
    }
}

//manter conexão do usuário a cada 5 segundos
function toAqui() {
    const promise= axios.post('https://mock-api.driven.com.br/api/v6/uol/status', 
    {name: nome});
}


//trazer as mensagens anteriores do chat

function puxarMensagens () {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(printarMensagens);
}

function printarMensagens (array) {
    let qtdMensagens = array.data.length;
    let batePapo = document.querySelector('.batePapo');
    batePapo.innerHTML = '';

    for (i=0; i<qtdMensagens; i++) {

    let msg = array.data[i];
    let divDosPosts;

    if (msg.type === 'status') {
        divDosPosts =
            `<div class= "${msg.type}" >
                <p><em>(${msg.time})</em> <b>${msg.from}</b> para <b> ${msg.to} </b>: ${msg.text}</p>
            </div>`

     } else if (msg.type === "message") {
        divDosPosts =
            `<div class="${msg.type}">
                <p><em>(${msg.time})</em> <b>${msg.from}</b> para <b>${msg.to}</b>: ${msg.text}</p>
            </div>`

    } else if (msg.type === "private_message" && (msg.to === nome || msg.from === nome)) {
        divDosPosts =
            `<div class= "${msg.type}">
                <p><em>(${msg.time})</em> <b>${msg.from}</b> reservadamente para <b> ${msg.to} </b>: ${msg.text}</p>
            </div>`
    }else {
        divDosPosts=
        `<div class="esconde">
        </div>`
    }
    batePapo.innerHTML += divDosPosts;
    mensagensAtualizadas();
    }
}



//enviar mensagens pro chat
function enviarMensagem () {
    let mensagem = document.querySelector(".input");

    if (mensagem !== ""){


        let post = {
            from: nome,
            to: nomeEscolhido,
            text: mensagem.value,
            type: messageType
        }

        let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', post);
        promise.then(puxarMensagens);
        promise.catch(window.location.reload);

        mensagem.value = "";

    }
}

//manter um scroll automatico

function mensagensAtualizadas() {
    const ultimasMensagens = document.querySelector(".batePapo").lastElementChild;
    ultimasMensagens.scrollIntoView();
}

