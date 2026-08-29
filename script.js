    const formulario = document.getElementById('formulario');
    const dadosEndereco = document.getElementById('dados-endereco');
    const tabelaEnderecos = document.getElementById('tabela-enderecos');
    const campoCep = document.getElementById('cep');
    const campoNumero = document.getElementById('numero');
    const botaoEnviar = document.getElementById('enviar');
    const novoEndereco = document.getElementById('novo-endereco');

    novoEndereco.addEventListener('click', function () {
        formulario.classList.remove('oculto');
        campoCep.focus();
    });

    function criarBotaoExcluir(linha) {
        const botaoExcluir = document.createElement('button');
        botaoExcluir.type = 'button';
        botaoExcluir.textContent = 'X';
        botaoExcluir.className = 'btn-excluir';
        botaoExcluir.setAttribute('aria-label', 'Excluir endereço');
        botaoExcluir.addEventListener('click', function () {
            linha.remove();
        });
        return botaoExcluir;
    }

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        if (dadosEndereco.classList.contains('oculto')) {
            pesquisacep(campoCep.value);
            return;
        }

        if (campoNumero.value.trim() === '') {
            alert('Preencha o número do endereço.');
            campoNumero.focus();
            return;
        }

        const novaLinha = tabelaEnderecos.insertRow();
        [campoCep, rua, bairro, cidade, uf, campoNumero, complemento].forEach((campo) => {
            novaLinha.insertCell().textContent = campo.value;
        });

        const celulaAcao = novaLinha.insertCell();
        celulaAcao.appendChild(criarBotaoExcluir(novaLinha));

        formulario.reset();
        formulario.classList.add('oculto');
    });

    formulario.addEventListener('reset', function () {
        dadosEndereco.classList.add('oculto');
        botaoEnviar.value = 'Enviar';
    });

    function limpa_formulario_cep() {
        document.getElementById('rua').value = '';
        document.getElementById('bairro').value = '';
        document.getElementById('cidade').value = '';
        document.getElementById('uf').value = '';
    }

    function meu_callback(conteudo) {
        if (!("erro" in conteudo)) {
            //Atualiza os campos com os valores.
            document.getElementById('rua').value=(conteudo.logradouro);
            document.getElementById('bairro').value=(conteudo.bairro);
            document.getElementById('cidade').value=(conteudo.localidade);
            document.getElementById('uf').value=(conteudo.uf);
            dadosEndereco.classList.remove('oculto');
            botaoEnviar.value = 'Adicionar endereço';
            
        } //end if.
        else {
            //CEP não Encontrado.
            limpa_formulario_cep();
            alert("CEP não encontrado.");
        }
    }
        
    function pesquisacep(valor) {

        //Nova variável "cep" somente com dígitos.
        var cep = valor.replace(/\D/g, '');

        //Verifica se campo cep possui valor informado.
        if (cep != "") {

            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if(validacep.test(cep)) {

                //Preenche os campos com "..." enquanto consulta webservice.
                document.getElementById('rua').value="...";
                document.getElementById('bairro').value="...";
                document.getElementById('cidade').value="...";
                document.getElementById('uf').value="...";

                //Cria um elemento javascript.
                var script = document.createElement('script');

                //Sincroniza com o callback.
                script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';

                //Insere script no documento e carrega o conteúdo.
                document.body.appendChild(script);

            } //end if.
            else {
                //cep é inválido.
                limpa_formulario_cep();
                alert("Formato de CEP inválido.");
            }
        } //end if.
        else {
            //cep sem valor, limpa formulário.
            limpa_formulario_cep();
        }
    };

