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

async function listar(){


    if(!lista) return;


    lista.innerHTML="";


    const produtos = await getDocs(collection(db,"produtos"));



    produtos.forEach((item)=>{


        let produto = item.data();



        let card = document.createElement("div");

        card.className="card";



        card.innerHTML=`

        <h3>${produto.nome}</h3>

        <p>Estoque: ${produto.estoque}</p>


        ${
            location.pathname.includes("admin")

            ?

            `<button onclick="excluir('${item.id}')">
            Excluir
            </button>`

            :

            <a href="https://api.whatsapp.com/send?phone=5511995927265" target="_blank">
Comprar pelo WhatsApp
</a>
        }

        `;


        lista.appendChild(card);


    });


}



// CADASTRAR PRODUTO

const salvar = document.getElementById("salvar");


if(salvar){


salvar.onclick = async()=>{


    let id = document.getElementById("idProduto").value;

    let nome = document.getElementById("nome").value;

    let estoque = document.getElementById("estoque").value;



    await setDoc(doc(db,"produtos",id),{


        nome:nome,

        estoque:estoque


    });



    alert("Produto cadastrado!");



    listar();


};



}



// EXCLUIR

window.excluir = async(id)=>{


    await deleteDoc(doc(db,"produtos",id));


    listar();


};



// INICIAR

listar();
