    const unidades = unidadesEmails.map(item => item.unidade);
    let unidadeSelecionada = "";

    function obterDominioEmail(unidade) {
        const unidadeEncontrada = unidadesEmails.find(item => item.unidade === unidade);
        return unidadeEncontrada ? unidadeEncontrada.email : "";
    }


    document.getElementById("unidadeInput").addEventListener("focus", function () {
        const sugestoes = document.getElementById("sugestoes");
        sugestoes.style.display = "block"; // Exibe a lista de sugestões ao focar no input
        atualizarSugestoesUnidade(); // Atualiza as sugestões baseadas no texto atual do input
    });

    document.getElementById("unidadeInput").addEventListener("input", function () {
        atualizarSugestoesUnidade(); // Atualiza as sugestões conforme o usuário digita
    });

    document.getElementById("unidadeInput").addEventListener("focus", function () {
        const sugestoes = document.getElementById("sugestoes");
        sugestoes.style.display = "block"; // Exibe a lista de sugestões ao focar no input
        atualizarSugestoesUnidade(); // Atualiza as sugestões baseadas no texto atual do input
    });
    
    document.getElementById("unidadeInput").addEventListener("input", function (event) {
        const unidadeInput = event.target;
        unidadeInput.value = formatarCNPJSeForCNPJ(unidadeInput.value);
        atualizarSugestoesUnidade(); // Atualiza as sugestões conforme o usuário digita
    });
    
    function formatarCNPJSeForCNPJ(texto) {
        // Remove tudo que não for dígito
        const apenasDigitos = texto.replace(/\D/g, '');
    
        // Verifica se o texto contém 14 dígitos, que é o comprimento de um CNPJ
        if (apenasDigitos.length === 14) {
            // Formata o texto como CNPJ: 99.999.999/9999-99
            return apenasDigitos.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
        }
    
        return texto; // Retorna o texto original se não for CNPJ
    }
    
    function atualizarSugestoesUnidade() {
        const unidadeInput = document.getElementById("unidadeInput");
        const sugestoes = document.getElementById("sugestoes");
        sugestoes.innerHTML = ""; // Limpa as sugestões anteriores
    
        const textoInput = removerAcentos(unidadeInput.value.toLowerCase().trim()); // Captura o texto digitado pelo usuário, removendo espaços em branco extras
    
        // Filtra e ordena as unidades
        const unidadesFiltradas = unidadesEmails.filter(item => {
            const unidadeMinuscula = item.unidade.toLowerCase();
            const emailMinusculo = item.email.toLowerCase();
            const cnpjFormatado = item.cnpj ? item.cnpj.replace(/[./]/g, "") : ""; // Remove apenas os caracteres . e / do CNPJ para comparação
            const cnpj2Formatado = item.cnpj2 ? item.cnpj2.replace(/[./]/g, "") : "";
    
            // Verifica se o texto digitado está contido no nome da unidade, no email ou no CNPJ
            return unidadeMinuscula.includes(textoInput) || emailMinusculo.includes(textoInput) || cnpjFormatado.includes(textoInput.replace(/[./]/g, "")) || cnpj2Formatado.includes(textoInput.replace(/[./]/g, ""));
        }).sort((a, b) => a.unidade.localeCompare(b.unidade)); // Ordena em ordem alfabética
    
        unidadesFiltradas.forEach(item => {
            const sugestao = document.createElement("div");
            sugestao.classList.add("sugestao");
            sugestao.textContent = `${item.unidade}`; // Define o texto da sugestão para incluir unidade, email e cnpj
            sugestao.addEventListener("click", function () {
                unidadeInput.value = item.unidade; // Preenche o campo de entrada com o nome da unidade
                sugestoes.innerHTML = ""; // Limpa as sugestões após a seleção
                selecionarUnidade(item.unidade); // Chama a função para selecionar a unidade
                limparListaUsuarios(); // Limpa a lista de usuários
            });
            sugestoes.appendChild(sugestao);
        });
    
        sugestoes.style.display = sugestoes.childNodes.length > 0 ? "block" : "none"; // Exibe ou oculta as sugestões conforme necessário
    }
    
    document.getElementById("reloadPage").addEventListener("click", function() {
        location.reload();
    });

    



    document.getElementById("usuario").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const usuario = document.getElementById("usuario").value.trim();
            const prefixo = document.getElementById("prefixo").value;
            const unidadeInput = document.getElementById("unidadeInput").value.trim();

            if (usuario && (prefixo || prefixo === "Nenhum") && unidadeSelecionada) {
                adicionarLogin();
            } else {
                alert("Preencha todos os campos antes de adicionar um login.");
            }
        }
    });

    document.body.addEventListener("click", function (event) {
        const sugestoes = document.getElementById("sugestoes");
        if (sugestoes.style.display === "block" && event.target !== unidadeInput) {
            sugestoes.style.display = "none";
        }
    });

  

    const listaUsuarios = [];

    function selecionarUnidade(unidade) {
        unidadeSelecionada = unidade;
        const emailInput = document.getElementById("email");
        const dominio = obterDominioEmail(unidadeSelecionada);
        emailInput.value = dominio;
        limparListaUsuarios();
        atualizarListaLogins();
    }

    function limparListaUsuarios() {
        listaUsuarios.length = 0;
        atualizarListaLogins();
    }

    // Array para armazenar o histórico de adições de login
    let historicoAdicoes = [];

    function adicionarLogin() {
        const usuarioInput = document.getElementById("usuario");
        let usuario = usuarioInput.value.trim().replace(/\s+/g, ' '); // Remove espaços extras entre palavras
        const prefixoSelecionado = document.getElementById("prefixo").value;
        const unidadeInput = document.getElementById("unidadeInput").value.trim();
    
        if (!usuario || (!prefixoSelecionado && prefixoSelecionado !== "Nenhum") || !unidadeSelecionada) {
            alert("Preencha todos os campos antes de adicionar um login.");
            return;
        }
    
        // Remover o prefixo do input se ele coincidir com o prefixo selecionado
        if (prefixoSelecionado === "Dr.") {
            usuario = usuario.replace(/^dr\.?\s+/i, '').trim();
        } else if (prefixoSelecionado === "Dra.") {
            usuario = usuario.replace(/^dra\.?\s+/i, '').trim();
        } else if (prefixoSelecionado === "Tec.") {
            usuario = usuario.replace(/^tec\.?\s+/i, '').trim();
        } else if (prefixoSelecionado === "Enf.") {
            usuario = usuario.replace(/^tec\.?\s+/i, '').trim();
        }
        
    
        // Extraindo o nome e a especialização
        const [nomeUsuario, especializacao = ""] = usuario.split(' - ');
    
        // Formatar a especialização com a primeira letra maiúscula
        const especializacaoFormatada = especializacao.charAt(0).toUpperCase() + especializacao.slice(1).toLowerCase();
    
        // Formatar o nome com o prefixo selecionado
        let nomeFormatado = `${formatarNomePrimeiraLetraMaiuscula(nomeUsuario)}`;
        if (prefixoSelecionado !== "Nenhum") {
            nomeFormatado = `${formatarNomePrimeiraLetraMaiuscula(prefixoSelecionado)} ${nomeFormatado}`;
        }
    
        let partesNome = nomeUsuario.split(' ');
        let primeiroNome = partesNome[0].toLowerCase();
        let primeiraLetraSegundoNome = partesNome[partesNome.length - 1].toLowerCase().charAt(0);
    
        let emailDominio = obterDominioEmail(unidadeSelecionada);
    
        let emailFinal = `${prefixoSelecionado !== "Nenhum" ? prefixoSelecionado.toLowerCase().replace('.', '') : ""}${removerAcentos(primeiroNome)}${removerAcentos(primeiraLetraSegundoNome)}@${removerAcentos(emailDominio)}`;
    
        let senha = `${prefixoSelecionado !== "Nenhum" ? prefixoSelecionado.toLowerCase().replace('.', '') : ""}${removerAcentos(primeiroNome)}${removerAcentos(primeiraLetraSegundoNome)}`.toLowerCase();
    
        // Adiciona o login ao array listaUsuarios
        listaUsuarios.push({"Usuário": nomeFormatado, "Especialização": especializacaoFormatada, "Senha": senha, "Email": emailFinal});
    
        // Adiciona a operação ao histórico de adições
        historicoAdicoes.push(listaUsuarios.length - 1);
    
        // Atualiza a lista visual de logins
        atualizarListaLogins();
    
        // Limpa os campos de entrada após adicionar o login
        usuarioInput.value = "";
        document.getElementById("sugestoes").innerHTML = "";
    }
    
    
    document.getElementById("usuario").addEventListener("input", function() {
        const usuarioInput = document.getElementById("usuario");
        const prefixoSelect = document.getElementById("prefixo");
        let valor = usuarioInput.value.trim();
    
        if (/^dr\.?\s+/i.test(valor)) {
            prefixoSelect.value = "Dr.";
            usuarioInput.value = valor.replace(/^dr\.?\s+/i, '');
        } else if (/^dra\.?\s+/i.test(valor)) {
            prefixoSelect.value = "Dra.";
            usuarioInput.value = valor.replace(/^dra\.?\s+/i, '');
        } else if (/^tec\.?\s+/i.test(valor)) {
            prefixoSelect.value = "Tec.";
            usuarioInput.value = valor.replace(/^tec\.?\s+/i, '');
        } else if (/^enf\.?\s+/i.test(valor)) {
            prefixoSelect.value = "Enf.";
            usuarioInput.value = valor.replace(/^enf\.?\s+/i, '');
        } 
        
    });
    
    
    

    // Função para desfazer a adição do último login
    function desfazerAdicaoLogin() {
        if (historicoAdicoes.length > 0) {
            const ultimoIndiceAdicao = historicoAdicoes.pop();
            listaUsuarios.splice(ultimoIndiceAdicao, 1); // Remove o último login adicionado

            // Atualiza a lista visual de logins após desfazer
            atualizarListaLogins();
        } else {
            alert("Não há adições para desfazer.");
        }
    }

    // Captura do evento de teclado global para Ctrl + Z
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'z') {
            event.preventDefault(); // Evita o comportamento padrão de desfazer no navegador
            desfazerAdicaoLogin();
        }
    });


    // Função para excluir o último usuário cadastrado
    function excluirTodosLogins() {
        if (listaUsuarios.length === 0) {
            alert("Nenhum login para excluir.");
            return;
        }
        listaUsuarios.length = 0;
        atualizarListaLogins();
    }

    // Função para copiar lista e saída 
    function copiarLista() {
        if (listaUsuarios.length === 0) {
            alert("Nenhum login foi adicionado ainda.");
            return;
        }

        let lista = "*---------------*\n";
        for (let login of listaUsuarios) {
            lista += `*Usuário: ${login['Usuário']}*\nEmail: ${login['Email']}\nSenha: ${login['Senha']}\n*---------------*\n`;
        }

        // Remover os últimos 25 caracteres (linhas de separação e um caractere extra)
        lista = lista.slice(0, -18);
        copyToClipboard(lista);
    }

    function copyToClipboard(text, iconElement) {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    
        // Mudar ícone para "check"
        iconElement.textContent = "check";
        iconElement.classList.add("check-icon");
    
        // Voltar ao ícone original após 2 segundos
        setTimeout(() => {
            iconElement.textContent = "content_copy";
            iconElement.classList.remove("check-icon");
        }, 2000);
    }

    // Adicione as variáveis para o modal e seus elementos
    const modal = document.getElementById("editModal");
    const span = document.getElementsByClassName("close")[0];
    const saveEditButton = document.getElementById("saveEdit");
    let editIndex = -1;

    // Função para abrir o modal e preencher os campos com os dados existentes
    function editarLogin(index) {
        editIndex = index;
        const login = listaUsuarios[index];

        document.getElementById("editUsuario").value = login['Usuário'];
        document.getElementById("editEmail").value = login['Email'];
        document.getElementById("editSenha").value = login['Senha'];

        modal.style.display = "block";
    }

    // Quando o usuário clicar em (x), fecha o modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Quando o usuário clicar fora do modal, fecha o modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Salvar alterações e atualizar a lista
    saveEditButton.addEventListener("click", function() {
        if (editIndex !== -1) {
            const usuario = document.getElementById("editUsuario").value.trim();
            const email = document.getElementById("editEmail").value.trim();
            const senha = document.getElementById("editSenha").value.trim();

            listaUsuarios[editIndex]['Usuário'] = usuario;
            listaUsuarios[editIndex]['Email'] = email;
            listaUsuarios[editIndex]['Senha'] = senha;

            atualizarListaLogins();
            modal.style.display = "none";
        }
    });

    document.addEventListener("click", function(event) {
        const modal = document.getElementById("editModal");
        const modalContent = document.getElementById("modalContent");

        // Verifica se o clique foi fora do modal e não foi dentro do modalContent
        if (event.target !== modal && !modalContent.contains(event.target)) {
            modal.style.display = "none";
        }
    });

    // Quando o usuário clicar fora do modal, fecha o modal
    window.onclick = function(event) {
        const modal = document.getElementById("editModal");
        if (event.target === modal) {
            // Verifica se há seleção de texto ativa
            const selection = window.getSelection().toString().trim();
            if (!selection) {
                modal.style.display = "none";
            }
        }
    }

// Função para atualizar a lista visual de logins
function atualizarListaLogins() {
    const listaLogins = document.getElementById("listaLogins");
    listaLogins.innerHTML = "";

    if (listaUsuarios.length > 0) {
        const unidadeInfo = unidadesEmails.find(item => item.unidade === unidadeSelecionada);
        if (unidadeInfo && unidadeInfo.servidor) {
            let servidorInfo = document.createElement("div");
            servidorInfo.classList.add("servidor-info"); 
            servidorInfo.textContent = "Servidor " + unidadeInfo.servidor;
            servidorInfo.style.textAlign = "center";
            servidorInfo.style.color = "black";
            servidorInfo.style.fontSize = "11px";
            servidorInfo.style.paddingTop = "0px";
            servidorInfo.style.paddingBottom = "0px";
            listaLogins.appendChild(servidorInfo);
        }
    }

    for (let i = 0; i < listaUsuarios.length; i++) {
        let login = listaUsuarios[i];
        let loginItem = document.createElement("div");
        loginItem.classList.add("login-item");

        let usuarioInfo = document.createElement("div");
        usuarioInfo.textContent = `Usuário: ${login['Usuário']}`;

        let copyUsuarioIcon = document.createElement("span");
        copyUsuarioIcon.classList.add("material-icons");
        copyUsuarioIcon.classList.add("copy-icon");
        copyUsuarioIcon.textContent = "content_copy";
        copyUsuarioIcon.addEventListener("click", function() {
            copyToClipboard(login['Usuário'], copyUsuarioIcon);
        });

        let emailInfo = document.createElement("div");
        emailInfo.textContent = `Email: ${login['Email']}`;

        let copyEmailIcon = document.createElement("span");
        copyEmailIcon.classList.add("material-icons");
        copyEmailIcon.classList.add("copy-icon");
        copyEmailIcon.textContent = "content_copy";
        copyEmailIcon.addEventListener("click", function() {
            copyToClipboard(login['Email'], copyEmailIcon);
        });

        let senhaInfo = document.createElement("div");
        senhaInfo.textContent = `Senha: ${login['Senha']}`;

        let copySenhaIcon = document.createElement("span");
        copySenhaIcon.classList.add("material-icons");
        copySenhaIcon.classList.add("copy-icon");
        copySenhaIcon.textContent = "content_copy";
        copySenhaIcon.addEventListener("click", function() {
            const userInfo = `*---------------*\n*Usuário: ${login['Usuário']}*\nEmail: ${login['Email']}\nSenha: ${login['Senha']}`;
            copyToClipboard(userInfo, copySenhaIcon);
        });

        let actionsContainer = document.createElement("div");
        actionsContainer.classList.add("actions-container");

        let reloadIcon = document.createElement("span");
        reloadIcon.classList.add("material-icons");
        reloadIcon.classList.add("reload-icon");
        reloadIcon.textContent = "refresh";
        reloadIcon.addEventListener("click", function() {
            randomizeFirstLetterOfSurname(i);
        });

        let deleteButton = document.createElement("span");
        deleteButton.classList.add("material-icons");
        deleteButton.classList.add("delete-icon");
        deleteButton.textContent = "delete";
        deleteButton.style.color = "red";
        deleteButton.style.fontSize = "16px";
        deleteButton.addEventListener("click", function() {
            excluirLogin(i);
        });

        let editButton = document.createElement("span");
        editButton.classList.add("material-icons");
        editButton.classList.add("edit-icon");
        editButton.textContent = "edit";
        editButton.style.color = "blue";
        editButton.style.fontSize = "16px";
        editButton.addEventListener("click", function() {
            editarLogin(i);
        });

        actionsContainer.appendChild(editButton);
        actionsContainer.appendChild(deleteButton);
        actionsContainer.appendChild(reloadIcon);
        actionsContainer.appendChild(copySenhaIcon);  // Mover o ícone de copiar senha aqui

        let userInfoContainer = document.createElement("div");
        userInfoContainer.classList.add("user-info-container");
        userInfoContainer.appendChild(usuarioInfo);
        userInfoContainer.appendChild(copyUsuarioIcon);

        let emailInfoContainer = document.createElement("div");
        emailInfoContainer.classList.add("user-info-container");
        emailInfoContainer.appendChild(emailInfo);
        emailInfoContainer.appendChild(copyEmailIcon);

        let senhaInfoContainer = document.createElement("div");
        senhaInfoContainer.classList.add("user-info-container");
        senhaInfoContainer.appendChild(senhaInfo);

        loginItem.appendChild(userInfoContainer);

        // Verificar se há especialização antes de adicioná-la
        if (login['Especialização']) {
            let especializacaoInfo = document.createElement("div");
            let especializacao = login['Especialização'];
            // Capitalize the first letter of the especializacao
            especializacaoInfo.textContent = `Especialização: ${especializacao.charAt(0).toUpperCase() + especializacao.slice(1)}`;

            let copyEspecializacaoIcon = document.createElement("span");
            copyEspecializacaoIcon.classList.add("material-icons");
            copyEspecializacaoIcon.classList.add("copy-icon");
            copyEspecializacaoIcon.textContent = "content_copy";
            copyEspecializacaoIcon.addEventListener("click", function() {
                copyToClipboard(login['Especialização'], copyEspecializacaoIcon);
            });

            let especializacaoContainer = document.createElement("div");
            especializacaoContainer.classList.add("user-info-container");
            especializacaoContainer.appendChild(especializacaoInfo);
            especializacaoContainer.appendChild(copyEspecializacaoIcon);
            loginItem.appendChild(especializacaoContainer);
        }

        loginItem.appendChild(emailInfoContainer);
        loginItem.appendChild(senhaInfoContainer);
        loginItem.appendChild(actionsContainer);

        let linhaSeparacao = document.createElement("hr");
        listaLogins.appendChild(linhaSeparacao);

        listaLogins.appendChild(loginItem);
    }
}

    
    function randomizeFirstLetterOfSurname(index) {
        let login = listaUsuarios[index];
        let email = login['Email'];
        let senha = login['Senha'];

        function randomizeChar(char) {
            const alphabet = "abcdefghijklmnopqrstuvwxyz";
            let randomChar;
            do {
                randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
            } while (randomChar === char);
            return randomChar;
        }

        function replaceFirstLetterOfSurname(email, senha) {
            let emailParts = email.split('@');
            let emailLocalPart = emailParts[0];
            let domain = emailParts[1];

            let randomChar = randomizeChar(emailLocalPart.slice(-1));
            
            let emailNew = emailLocalPart.slice(0, -1) + randomChar + '@' + domain;
            let senhaNew = senha.slice(0, -1) + randomChar;

            return { emailNew, senhaNew };
        }

        let newCredentials = replaceFirstLetterOfSurname(email, senha);

        login['Email'] = newCredentials.emailNew;
        login['Senha'] = newCredentials.senhaNew;

        atualizarListaLogins();
    }



    function excluirLogin(index) {
        listaUsuarios.splice(index, 1);
        atualizarListaLogins();
    }



    function excluirLogin(index) {
        listaUsuarios.splice(index, 1);
        atualizarListaLogins();
    }

    function formatarNomePrimeiraLetraMaiuscula(nome) {
        return nome.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    function removerAcentos(texto) {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function limparUnidade() {
        if (unidadeSelecionada === "") {
            return;
        }
    
        listaUsuarios.length = 0;
        atualizarListaLogins();
        unidadeSelecionada = "";
        document.getElementById("unidadeInput").value = "";
        document.getElementById("email").value = "";


    }
    



    // Função para alternar entre modo noturno e diurno
    function toggleNightMode() {
        document.body.classList.toggle('night-mode');
        const icon = document.getElementById('toggleMode');
        if (document.body.classList.contains('night-mode')) {
            icon.textContent = 'light_mode';
        } else {
            icon.textContent = 'dark_mode';
        }
    }

// Função para exportar os logins para CSV e ajustar o tamanho das colunas
function exportLoginsToCSV() {
    const logins = listaUsuarios; 
    let csvContent = [["Usuário", "Email", "Senha", "Especialização"]];

    logins.forEach(login => {
        csvContent.push([login.Usuário, login.Email, login.Senha, login.Especialização]);
    });

    // Criar uma nova planilha
    const ws = XLSX.utils.aoa_to_sheet(csvContent);
    const wsCols = [
        { wch: Math.max(...csvContent.map(row => row[0].length)) }, // Usuário
        { wch: Math.max(...csvContent.map(row => row[1].length)) }, // Email
        { wch: Math.max(...csvContent.map(row => row[2].length)) },  // Senha
        { wch: Math.max(...csvContent.map(row => row[3].length)) }  // Especialização
    ];
    ws['!cols'] = wsCols;

    // Criar um novo livro de trabalho
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Logins");

    // Gerar o arquivo Excel e acionar o download
    XLSX.writeFile(wb, "logins.xlsx");
}

// Evento de teclado para exportar os logins para CSV
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === '.') {
        event.preventDefault();
        exportLoginsToCSV();
    }
});


// Atualize a função para adicionar múltiplos logins
function adicionarMultiplosLogins() {
    const input = document.getElementById('multiLoginInput').value.trim();
    const prefixo = document.getElementById('multiLoginPrefixo').value;
    const unidadeSelecionada = document.getElementById("unidadeInput").value;

    if (input) {
        const logins = input.split('\n').map(login => login.trim()).filter(login => login);
        logins.forEach(login => {
            adicionarLoginEspecifico(login, prefixo, unidadeSelecionada);
        });
    }

    // Limpa o campo de entrada de múltiplos logins
    document.getElementById('multiLoginInput').value = '';

    // Atualiza a lista visual de logins após adicionar múltiplos logins
    atualizarListaLogins();
}
// Atualize o evento de clique do botão "Salvar" do modal de múltiplos logins
document.getElementById('saveMultiLogin').onclick = function() {
    adicionarMultiplosLogins();
};

// Função auxiliar para adicionar um login específico (com formatação da especialização)
function adicionarLoginEspecifico(usuario, prefixo, unidadeSelecionada) {
    const unidadeInput = document.getElementById("unidadeInput").value.trim();

    if (!usuario || (!prefixo && prefixo !== "Nenhum") || !unidadeSelecionada) {
        return;
    }

    // Remover o prefixo do input se ele coincidir com o prefixo selecionado
    if (prefixo === "Dr.") {
        usuario = usuario.replace(/^dr\.?\s+/i, '').trim();
    } else if (prefixo === "Dra.") {
        usuario = usuario.replace(/^dra\.?\s+/i, '').trim();
    }

    // Extraindo o nome e a especialização
    const [nomeUsuario, especializacao = ""] = usuario.split(' - ');

    const usuarioFormatado = nomeUsuario.trim();
    const especializacaoFormatada = especializacao.trim().charAt(0).toUpperCase() + especializacao.trim().slice(1).toLowerCase();

    let nomeFormatado = "";

    if (prefixo !== "Nenhum") {
        nomeFormatado = `${formatarNomePrimeiraLetraMaiuscula(prefixo)} ${formatarNomePrimeiraLetraMaiuscula(usuarioFormatado)}`;
    } else {
        nomeFormatado = `${formatarNomePrimeiraLetraMaiuscula(usuarioFormatado)}`;
    }

    let partesNome = usuarioFormatado.split(' ');
    let primeiroNome = partesNome[0].toLowerCase();
    let ultimaLetraUltimoNome = partesNome.length > 1 ? partesNome[partesNome.length - 1].toLowerCase().charAt(0) : '';

    let emailDominio = obterDominioEmail(unidadeSelecionada);

    // Construção do email e senha não deve incluir a especialização
    let emailFinal = "";

    if (prefixo !== "Nenhum") {
        emailFinal = `${prefixo.toLowerCase().replace('.', '')}${removerAcentos(primeiroNome)}${removerAcentos(ultimaLetraUltimoNome)}@${removerAcentos(emailDominio)}`;
    } else {
        emailFinal = `${removerAcentos(primeiroNome)}${removerAcentos(ultimaLetraUltimoNome)}@${removerAcentos(emailDominio)}`;
    }

    let senha = `${prefixo !== "Nenhum" ? prefixo.toLowerCase().replace('.', '') : ""}${removerAcentos(primeiroNome)}${removerAcentos(ultimaLetraUltimoNome)}`.toLowerCase();

    // Adiciona o login ao array listaUsuarios
    listaUsuarios.push({"Usuário": nomeFormatado, "Especialização": especializacaoFormatada, "Senha": senha, "Email": emailFinal});

    // Adiciona a operação ao histórico de adições
    historicoAdicoes.push(listaUsuarios.length - 1);
}



// Função para abrir o modal de múltiplos logins
function abrirModalMultiplosLogins() {
    document.getElementById('multiLoginModal').style.display = 'block';
}

// Função para fechar o modal de múltiplos logins
document.querySelector('#multiLoginModal .close').addEventListener('click', function() {
    document.getElementById('multiLoginModal').style.display = 'none';
});

// Adiciona eventos aos botões do modal de múltiplos logins
document.getElementById('saveMultiLogin').addEventListener('click', adicionarMultiplosLogins);

// Adiciona evento para abrir o modal com "Ctrl + ,"
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === '\\') {
        event.preventDefault();
        abrirModalMultiplosLogins();
    }
});


    // Quando o usuário clicar fora do modal, fecha o modal
    window.onclick = function(event) {
        const modal = document.getElementById("multiLoginModal");
        if (event.target === modal) {
            // Verifica se há seleção de texto ativa
            const selection = window.getSelection().toString().trim();
            if (!selection) {
                modal.style.display = "none";
            }
        }
    }

// Adiciona evento ao botão de fechar
document.querySelector('#multiLoginModal .close').addEventListener('click', fecharModalMultiplosLogins);