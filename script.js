const SUPABASE_URL = "https://hemrhufvtksfptqlbzlt.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z4-C5WOORsJ7IMh_jRP1ug_b_JXvjdh";

const form = document.getElementById("formProduto");
const listaProdutos = document.getElementById("listaProdutos");
const mensagemProdutos = document.getElementById("mensagemProdutos");
const modeloProduto = document.querySelector(".produto");

// ==========================================
// FUNÇÃO PARA FALAR COM O SUPABASE
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

        console.error(dados);

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


    // Criar os produtos usando o modelo HTML
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


        // Guarda o ID no botão
        const botaoApagar =
            novoProduto.querySelector(".btn-apagar");

        botaoApagar.dataset.id =
            produto.id;


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
            ).value,

        codigo_peca:
            document.getElementById(
                "codigo"
            ).value,

        marca:
            document.getElementById(
                "marca"
            ).value,

        modelo_veiculo:
            document.getElementById(
                "modelo"
            ).value,

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
                        JSON.stringify(
                            produto
                        )
                }
            );


        const dados =
            await resposta.json();


        console.log(
            "Resposta cadastro:",
            dados
        );


        if (!resposta.ok) {

            console.error(dados);

            alert(
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
// APAGAR PRODUTO
// ==========================================

listaProdutos.addEventListener(
"click",
async function(event) {

    const botao =
        event.target.closest(
            ".btn-apagar"
        );


    if (!botao) {
        return;
    }


    const id =
        botao.dataset.id;


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


        const dados =
            await resposta.json();


        console.log(
            "Resposta exclusão:",
            dados
        );


        if (!resposta.ok) {

            console.error(dados);

            alert(
                "Erro ao apagar produto."
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