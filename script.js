
const url = "http://localhost:3000/jogos";


// Pegando os elementos do HTML
const listaJogos = document.getElementById("listaJogos");

const formJogo = document.getElementById("formJogo");

const pesquisa = document.getElementById("pesquisa");

const filtroStatus = document.getElementById("filtroStatus");

const mensagem = document.getElementById("mensagem");

const totalJogos = document.getElementById("totalJogos");

const totalJogando = document.getElementById("totalJogando");

const totalFinalizados = document.getElementById("totalFinalizados");

const cancelar = document.getElementById("cancelar");

const tituloFormulario = document.getElementById("tituloFormulario");


// Array que vai guardar os jogos
let jogos = [];


// ID do jogo que está sendo editado
let idEditando = null;

   // Mostrar Mensagem
function mostrarMensagem(texto) {

    mensagem.textContent = texto;

}


    // GET busca os jogos

function carregarJogos() {

    fetch(url)

        .then(response => {

            // Verifica se deu algum erro
            if (!response.ok) {
                throw new Error("Erro ao buscar os jogos");
            }

            return response.json();

        })

        .then(dados => {

            // Guarda os jogos no array
            jogos = dados;

            // Mostra os jogos na tela
            mostrarJogos();

            // Atualiza os números
            atualizarDashboard();

        })

        .catch(erro => {

            console.error(erro);

            mostrarMensagem(
                "Não foi possível conectar com a API."
            );

        });

}


     // Mostra jogos na tela

function mostrarJogos() {

    // Limpa a lista antes de colocar os jogos
    listaJogos.innerHTML = "";


    // Pega o texto digitado na pesquisa
    const textoPesquisa = pesquisa.value.toLowerCase();


    // Pega o status escolhido
    const statusEscolhido = filtroStatus.value;


    // Filtra os jogos
    const jogosFiltrados = jogos.filter(jogo => {

        const nomeJogo = jogo.titulo.toLowerCase();

        const combinaPesquisa =
            nomeJogo.includes(textoPesquisa);


        const combinaStatus =
            statusEscolhido === "Todos" ||
            jogo.status === statusEscolhido;


        return combinaPesquisa && combinaStatus;

    });


    // Verifica se não encontrou nenhum jogo
    if (jogosFiltrados.length === 0) {

        listaJogos.innerHTML =
            "<p>Nenhum jogo encontrado.</p>";

        return;

    }


    // Percorre os jogos
    jogosFiltrados.forEach(jogo => {

        // Cria uma div
        const card = document.createElement("div");

        card.classList.add("card");


        // Coloca as informações dentro do card
        card.innerHTML = `

            <h3>${jogo.titulo}</h3>

            <p>
                <strong>Gênero:</strong>
                ${jogo.genero}
            </p>

            <p>
                <strong>Plataforma:</strong>
                ${jogo.plataforma}
            </p>

            <p>
                <strong>Nota:</strong>
                ${jogo.nota}
            </p>

            <p>
                <strong>Status:</strong>
                ${jogo.status}
            </p>

            <button
                class="editar"
                onclick="editarJogo('${jogo.id}')"
            >
                Editar
            </button>

            <button
                class="excluir"
                onclick="excluirJogo('${jogo.id}')"
            >
                Excluir
            </button>

        `;


        // Coloca o card na tela
        listaJogos.appendChild(card);

    });

}

      // Cadastrar novo jogo

formJogo.addEventListener("submit", function(event) {

    // Evita a página de recarregar
    event.preventDefault();


    // Pegando os valores do formulário
    const titulo = document.getElementById("titulo").value.trim();

    const genero = document.getElementById("genero").value.trim();

    const plataforma = document.getElementById("plataforma").value.trim();

    const nota = Number(document.getElementById("nota").value);

    const status = document.getElementById("status").value;

     // Validação

    if (titulo === "") {

        mostrarMensagem("Digite o título do jogo.");

        return;

    }


    if (genero === "") {

        mostrarMensagem("Digite o gênero do jogo.");

        return;

    }


    if (plataforma === "") {

        mostrarMensagem("Digite a plataforma.");

        return;

    }


    if (nota < 0 || nota > 10 || isNaN(nota)) {

        mostrarMensagem(
            "A nota precisa estar entre 0 e 10."
        );

        return;

    }


    if (status === "") {

        mostrarMensagem(
            "Selecione um status."
        );

        return;

    }


    // Cria o objeto do jogo
    const novoJogo = {

        titulo: titulo,

        genero: genero,

        plataforma: plataforma,

        nota: nota,

        status: status

    };

// Verifica se é cadastrado ou edição
    if (idEditando === null) {

       // Post

        fetch(url, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(novoJogo)

        })

        .then(response => {

            if (!response.ok) {
                throw new Error("Erro ao cadastrar jogo");
            }

            return response.json();

        })

        .then(dado => {

            mostrarMensagem(
                "Jogo cadastrado com sucesso!"
            );

            limparFormulario();

            // Atualiza a lista 
            carregarJogos();

        })

        .catch(erro => {

            console.error(erro);

            mostrarMensagem(
                "Erro ao cadastrar o jogo."
            );

        });

    } else {
            // Put
        fetch(`${url}/${idEditando}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(novoJogo)

        })

        .then(response => {

            if (!response.ok) {
                throw new Error("Erro ao editar jogo");
            }

            return response.json();

        })

        .then(dado => {

            mostrarMensagem(
                "Jogo editado com sucesso!"
            );

            limparFormulario();

            carregarJogos();

        })

        .catch(erro => {

            console.error(erro);

            mostrarMensagem(
                "Erro ao editar o jogo."
            );

        });

    }

});


// Editar jogo

function editarJogo(id) {

    // Procura o jogo pelo ID
    const jogo = jogos.find(jogo => jogo.id == id);


    if (!jogo) {

        mostrarMensagem(
            "Jogo não encontrado."
        );

        return;

    }


    // Coloca os dados no formulário
    document.getElementById("titulo").value =
        jogo.titulo;

    document.getElementById("genero").value =
        jogo.genero;

    document.getElementById("plataforma").value =
        jogo.plataforma;

    document.getElementById("nota").value =
        jogo.nota;

    document.getElementById("status").value =
        jogo.status;


    // Guarda o ID que está sendo editado
    idEditando = id;


    // Muda o título do formulário
    tituloFormulario.textContent =
        "Editar jogo";


    // Mostra botão cancelar
    cancelar.style.display = "block";


    // Vai para o formulário
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

// Delete - Excluir Jogo 

function excluirJogo(id) {

    // Confirma antes de excluir
    const confirmar = confirm(
        "Tem certeza que deseja excluir este jogo?"
    );


    if (!confirmar) {

        return;

    }


    fetch(`${url}/${id}`, {

        method: "DELETE"

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Erro ao excluir jogo");
        }

        mostrarMensagem(
            "Jogo excluído com sucesso!"
        );


        // Atualiza a lista
        carregarJogos();

    })

    .catch(erro => {

        console.error(erro);

        mostrarMensagem(
            "Erro ao excluir o jogo."
        );

    });

}

// Atualziar DashBoard

function atualizarDashboard() {

    // Total de jogos
    totalJogos.textContent = jogos.length;


    //  Quantidade jogando
    const jogando = jogos.filter(jogo =>
        jogo.status === "Jogando"
    );


    //  QUantidade finalizados

    const finalizados = jogos.filter(jogo =>
        jogo.status === "Finalizado"
    );


    totalJogando.textContent = jogando.length;

    totalFinalizados.textContent =
        finalizados.length;

}


// Pesquisa

pesquisa.addEventListener("input", function() {

    mostrarJogos();

});


// Filtro

filtroStatus.addEventListener("change", function() {

    mostrarJogos();

});


// Cancelar edição

cancelar.addEventListener("click", function() {

    limparFormulario();

});


// Limpar formulário

function limparFormulario() {

    formJogo.reset();

    idEditando = null;

    tituloFormulario.textContent =
        "Cadastrar jogo";

    cancelar.style.display = "none";

}


// Iniciar Sistema

carregarJogos();