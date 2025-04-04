import api from "./api.js";
// Variaveis

const livrosContainer = document.getElementById("lista__livros");



const ui = {

    async colocarLivros(livrosRender = null){
        livrosContainer.innerHTML = "";
        let livrosFiltro;
        try{
        if(livrosRender){
            livrosFiltro = livrosRender;
        }else{
            livrosFiltro = await api.conectarAPI();
        }
            livrosFiltro.forEach(this.renderizarLivros);
        }catch(error){
            alert("Aconteceu algum problema no colocarLivros, consulte o console");
            console.error(error);
        }
    },

    async buscadorLivros(){
        const enviarLivroBtn = document.getElementById("enviar__livro");
        
        enviarLivroBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const arquivo = document.getElementById("image-upload");
            const livroSelecionado = arquivo.files[0];
            
            const fotoCapa = document.getElementById("capa__nome")
            const fotoURL = fotoCapa.files[0];
            
            const cover_image = `./assets/imagens/capas-de-livros/${fotoURL.name}`
            const book_url = `./assets/livros/${livroSelecionado.name}`
            const title = document.getElementById("titulo__nome").value;
            const author = document.getElementById("autor__nome").value;
            const publisher = document.getElementById("publisher__nome").value;
            try{
                await api.colocarLivro({title, author, publisher, cover_image, book_url})
                ui.renderizarLivros();
            }catch(error){
                console.error(error)
            }
        });   
    },

    criarElemento(tag, conteudo, classe) {
        const elemento = document.createElement(tag);
        elemento.classList.add(classe);
        elemento.innerText = conteudo;
        return elemento;
    },

    renderizarLivros(livro){
        const listaLivros = document.getElementById("lista__livros");

        
        const capaLivro = document.createElement("img");
        capaLivro.src = livro.cover_image;
        
        capaLivro.addEventListener("click", () => {
            api.salvarHistorico(livro);
            window.location.href = `./viewer.html?pdf=${encodeURIComponent(livro.book_url)}`;
        })
        

        const itemLivro = ui.criarElemento("li", null, "item-livro");
        const livroTitulo = ui.criarElemento("h3", livro.title,"container__livro");
        const livroAutor = ui.criarElemento("cite", livro.author, "container__livro");
        const livroEditora = ui.criarElemento("small", livro.publisher, "container__livro");
        
        listaLivros.appendChild(itemLivro)
        itemLivro.append(capaLivro, livroTitulo, livroAutor, livroEditora);
    },

    carregarHistorico() {
        const historico = JSON.parse(localStorage.getItem("historicoRevistas")) || [];
        const containerHistorico = document.getElementById("historico__container");
        const listaHistorico = document.getElementById("lista__historico"); 
    
    
        if(historico.length <= 0){
            const historicoVazio = ui.criarElemento("p", "Clique em um livro para ter historico", "historico__vazio");
            containerHistorico.appendChild(historicoVazio);
        }else{   
            listaHistorico.innerHTML = "";
            historico.forEach(livro => {
                const item = document.createElement("li");
                item.classList.add("historico-item");
                item.innerHTML = `
                <li class="historico__item">
                <a href="./viewer.html?pdf=${encodeURIComponent(livro.book_url)}" class="historico__ancora">
                <h4 class="historico__texto">${livro.title}</h4>
                <cite class="historico__texto">${livro.author}</cite>
                </a>
                </li>
                `;
                listaHistorico.appendChild(item);
            });
        }
    },

};




export default ui;
            
            
            








