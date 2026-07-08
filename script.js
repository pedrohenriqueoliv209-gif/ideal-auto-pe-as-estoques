import { db } from "./firebase.js";

import {
    doc,
    setDoc,
    getDocs,
    collection
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


document.getElementById("salvar").onclick = async ()=>{

    let id = document.getElementById("idProduto").value;
    let nome = document.getElementById("nome").value;
    let estoque = document.getElementById("estoque").value;


    await setDoc(doc(db,"produtos",id),{

        nome: nome,
        estoque: estoque

    });


    alert("Produto cadastrado!");

};