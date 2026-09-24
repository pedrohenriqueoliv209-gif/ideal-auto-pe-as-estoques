const SUPABASE_URL =
"https://hemrhufvtksfptqlbzlt.supabase.co";

const SUPABASE_KEY =
"sb_publishable_Z4-C5WOORsJ7IMh_jRP1ug_b_JXvjdh";

const form =
document.getElementById("formProduto");

const listaProdutos =
document.getElementById("listaProdutos");

const mensagemProdutos =
document.getElementById("mensagemProdutos");

const modeloProduto =
document.querySelector(".produto");

// ==========================================
// COMUNICAÇÃO COM SUPABASE
// ==========================================

async function supabaseFetch(tabela, opcoes = {}) {

const resposta = await fetch(
    `${SUPABASE_URL}/rest/v1/${tabela}`,
    {
        ...opcoes,

        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=representation",

            ...(opcoes.headers || {})
        }
    }
);

return resposta;

}

// ==========================================
// CARREGAR PRODUTOS
// ==========================================

async function carregarProdutos() {

try {

    const resposta = await supabaseFetch(
        "produtos?select=*&order=id.desc"
    );

    const dados = await resposta.json();

    console.log("Produtos:", dados);

    if (!resposta.ok) {

        console.error("Erro Supabase:", dados);

        mensagemProdutos.textContent =
            "Erro ao carregar produtos.";

        mensagemProdutos.hidden = false;

        return;
    }


    // Remove produtos antigos

    const produtosAntigos =
        listaProdutos.querySelectorAll(
            ".produto:not([hidden])"
        );

    produtosAntigos.forEach(function(produto) {
        produto.remove();
    });


    // Nenhum produto

    if (dados.length === 0) {

        mensagemProdutos.textContent =
            "Nenhuma peça cadastrada.";

        mensagemProdutos.hidden = false;

        return;
    }


    mensagemProdutos.hidden = true;


    // Mostrar produtos

    dados.forEach(function(produto) {

        const novoProduto =
            modeloProduto.cloneNode(true);

        novoProduto.hidden = false;


        novoProduto.querySelector(
            ".produto-nome"
        ).textContent = produto.nome;


        novoProduto.querySelector(
            ".produto-codigo"
        ).textContent = produto.codigo_peca;


        novoProduto.querySelector(
            ".produto-marca"
        ).textContent = produto.marca;


        novoProduto.querySelector(
            ".produto-modelo"
        ).textContent = produto.modelo_veiculo;


        novoProduto.querySelector(
            ".produto-categoria"
        ).textContent = produto.categoria;


        novoProduto.querySelector(
            ".produto-preco"
        ).textContent =
            Number(produto.preco).toFixed(2);


        novoProduto.querySelector(
            ".produto-estoque"
        ).textContent = produto.estoque;


        // ID do produto

        novoProduto.dataset.id =
            produto.id;


        // Botão apagar

        novoProduto.querySelector(
            ".btn-apagar"
        ).dataset.id =
            produto.id;


        // Campo de estoque

        novoProduto.querySelector(
            ".input-estoque"
        ).value =
            produto.estoque;


        listaProdutos.appendChild(
            novoProduto
        );

    });

}

catch (erro) {

    console.error(
        "Erro ao carregar produtos:",
        erro
    );

    mensagemProdutos.textContent =
        "Erro ao conectar com o Supabase.";

    mensagemProdutos.hidden = false;
}

}

// ==========================================
// CADASTRAR PRODUTO
// ==========================================

form.addEventListener(
"submit",
async function(event) {

    event.preventDefault();


    const produto = {

        nome:
            document.getElementById(
                "nome"
            ).value.trim(),

        codigo_peca:
            document.getElementById(
                "codigo"
            ).value.trim(),

        marca:
            document.getElementById(
                "marca"
            ).value.trim(),

        modelo_veiculo:
            document.getElementById(
                "modelo"
            ).value.trim(),

        categoria:
            document.getElementById(
                "categoria"
            ).value,

        preco:
            Number(
                document.getElementById(
                    "preco"
                ).value
            ),

        estoque:
            Number(
                document.getElementById(
                    "estoque"
                ).value
            )
    };


    try {

        const resposta =
            await supabaseFetch(
                "produtos",
                {
                    method: "POST",

                    body:
                        JSON.stringify(produto)
                }
            );


        const dados =
            await resposta.json();


        console.log(
            "Resposta cadastro:",
            dados
        );


        if (!resposta.ok) {

            console.error(
                "Erro Supabase:",
                dados
            );

            alert(
                dados.message ||
                dados.mensagem ||
                "Erro ao cadastrar produto."
            );

            return;
        }


        alert(
            "Autopeça cadastrada com sucesso!"
        );


        form.reset();

        await carregarProdutos();

    }

    catch (erro) {

        console.error(erro);

        alert(
            "Erro ao conectar com o Supabase."
        );
    }

}

);

// ==========================================
// CLIQUES NOS PRODUTOS
// ==========================================

listaProdutos.addEventListener(
"click",
async function(event) {

    // ==================================
    // ABRIR ATUALIZAÇÃO DO ESTOQUE
    // ==================================

    const botaoEstoque =
        event.target.closest(
            ".btn-estoque"
        );


    if (botaoEstoque) {

        const produto =
            botaoEstoque.closest(
                ".produto"
            );


        const areaEdicao =
            produto.querySelector(
                ".editar-estoque"
            );


        const input =
            produto.querySelector(
                ".input-estoque"
            );


        areaEdicao.hidden = false;

        botaoEstoque.hidden = true;

        input.focus();

        input.select();

        return;
    }


    // ==================================
    // CANCELAR
    // ==================================

    const botaoCancelar =
        event.target.closest(
            ".btn-cancelar-estoque"
        );


    if (botaoCancelar) {

        const produto =
            botaoCancelar.closest(
                ".produto"
            );


        const areaEdicao =
            produto.querySelector(
                ".editar-estoque"
            );


        const botaoAtualizar =
            produto.querySelector(
                ".btn-estoque"
            );


        const input =
            produto.querySelector(
                ".input-estoque"
            );


        const estoqueAtual =
            produto.querySelector(
                ".produto-estoque"
            ).textContent;


        input.value = estoqueAtual;

        areaEdicao.hidden = true;

        botaoAtualizar.hidden = false;

        return;
    }


    // ==================================
    // SALVAR NOVO ESTOQUE
    // ==================================

    const botaoSalvar =
        event.target.closest(
            ".btn-salvar-estoque"
        );


    if (botaoSalvar) {

        const produto =
            botaoSalvar.closest(
                ".produto"
            );


        const id =
            produto.dataset.id;


        const input =
            produto.querySelector(
                ".input-estoque"
            );


        const novoEstoque =
            Number(input.value);


        if (
            !Number.isInteger(novoEstoque) ||
            novoEstoque < 0
        ) {

            alert(
                "Digite uma quantidade válida."
            );

            return;
        }


        if (!id) {

            alert(
                "Erro: ID do produto não encontrado."
            );

            return;
        }


        console.log(
            "Atualizando produto:",
            id
        );

        console.log(
            "Novo estoque:",
            novoEstoque
        );


        try {

            botaoSalvar.disabled = true;


            const resposta =
                await supabaseFetch(
                    `produtos?id=eq.${encodeURIComponent(id)}`,
                    {
                        method: "PATCH",

                        body: JSON.stringify({
                            estoque:
                                novoEstoque
                        })
                    }
                );


            const texto =
                await resposta.text();


            console.log(
                "Resposta PATCH:",
                resposta.status,
                texto
            );


            if (!resposta.ok) {

                console.error(
                    "Erro Supabase:",
                    texto
                );

                alert(
                    "Erro ao atualizar estoque:\n\n" +
                    texto
                );

                botaoSalvar.disabled = false;

                return;
            }


            alert(
                "Estoque atualizado com sucesso!"
            );


            await carregarProdutos();

        }

        catch (erro) {

            console.error(
                "Erro no PATCH:",
                erro
            );

            alert(
                "Erro ao conectar com o Supabase."
            );

            botaoSalvar.disabled = false;
        }


        return;
    }


    // ==================================
    // APAGAR PRODUTO
    // ==================================

    const botaoApagar =
        event.target.closest(
            ".btn-apagar"
        );


    if (!botaoApagar) {
        return;
    }


    const id =
        botaoApagar.dataset.id;


    if (!id) {

        alert(
            "Erro: ID do produto não encontrado."
        );

        return;
    }


    const confirmar =
        confirm(
            "Deseja realmente apagar esta autopeça?"
        );


    if (!confirmar) {
        return;
    }


    try {

        const resposta =
            await supabaseFetch(
                `produtos?id=eq.${encodeURIComponent(id)}`,
                {
                    method: "DELETE"
                }
            );


        const texto =
            await resposta.text();


        console.log(
            "Resposta DELETE:",
            resposta.status,
            texto
        );


        if (!resposta.ok) {

            console.error(
                "Erro Supabase:",
                texto
            );

            alert(
                "Erro ao apagar produto:\n\n" +
                texto
            );

            return;
        }


        alert(
            "Autopeça apagada com sucesso!"
        );


        await carregarProdutos();

    }

    catch (erro) {

        console.error(erro);

        alert(
            "Erro ao conectar com o Supabase."
        );
    }

}

);

// ==========================================
// INICIAR
// ==========================================

carregarProdutos();
