import { db } from "./firebase.js";

import {
    collection,
    doc,
    setDoc,
    getDocs,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


const lista = document.getElementById("lista");


// MOSTRAR PRODUTOS

async function listarProdutos(){

    if(!lista) return;

    lista.innerHTML = "";


    const produtos = await getDocs(collection(db,"produtos"));


    produtos.forEach((item)=>{

        const produto = item.data();


        const card = document.createElement("div");

        card.className = "card";


        card.innerHTML = `

            <h3>${produto.nome}</h3>

            <p>Estoque: ${produto.estoque}</p>


            ${
                location.pathname.includes("admin")

                ?

                `
                <button onclick="excluir('${item.id}')">
                    Excluir
                </button>
                `

                :

                `
                <a href="https://api.whatsapp.com/send?phone=5511995927265&text=Tenho interesse em ${encodeURIComponent(produto.nome)}" target="_blank">
                    Comprar pelo WhatsApp
                </a>
                `

            }

        `;


        lista.appendChild(card);


    });

}



// CADASTRAR PRODUTO

const botao = document.getElementById("salvar");


if(botao){

    botao.onclick = async()=>{


        const id = document.getElementById("idProduto").value;

        const nome = document.getElementById("nome").value;

        const estoque = document.getElementById("estoque").value;



        if(!id || !nome || !estoque){

            alert("Preencha todos os campos");

            return;

        }



        await setDoc(doc(db,"produtos",id),{

            nome:nome,

            estoque:estoque

        });



        alert("Produto cadastrado!");


        document.getElementById("idProduto").value="";
        document.getElementById("nome").value="";
        document.getElementById("estoque").value="";


        listarProdutos();


    };

}



// EXCLUIR PRODUTO

window.excluir = async function(id){

    await deleteDoc(doc(db,"produtos",id));

    listarProdutos();

};



// INICIAR

listarProdutos();
