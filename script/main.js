import api from "./api.js"
import ui from "./ui.js";

// Variaveis
const htmlDataContexto = document.querySelector("html")
const buscadorLivros = document.getElementById("buscador__livro");
const secaoLivros = document.getElementById("secao__livros");

document.addEventListener("DOMContentLoaded", async () => {
    const qualContexto = htmlDataContexto.dataset.context;
    if( qualContexto === "leitura"){
        api.pegaURL()
        return
    }else if(qualContexto === "estante"){
        ui.colocarLivros()
        ui.carregarHistorico()
    }
        
        async function manipularBusca() {
            const buscarValor = buscadorLivros.value
            try{
                const livrosFiltro = await api.buscarLivroAPI(buscarValor);
                if (livrosFiltro.length <= 0) {
                    const listaLivros = document.getElementById("lista__livros");
                
                    listaLivros.innerHTML = "";
                
                    if (!document.getElementById("livroVazio")) {
                        let livroVazio = document.createElement("div");
                        livroVazio.id = "livroVazio";
                        livroVazio.innerHTML = `
                            <img src="./assets/imagens/pagina/sentiment__very__dissatisfied.svg" style="margin-bottom: 23px;">
                            <p>Lamentamos, não temos algum livro com esse nome</p>
                        `;
                        secaoLivros.appendChild(livroVazio);
                    }
                }else{
                    ui.colocarLivros(livrosFiltro);
                }
            }catch(error){
                console.error("O manipularBusca está apresentando error:", error)
            }
        }
        
        buscadorLivros.addEventListener("input", manipularBusca)
        
        
        document.getElementById("botao__publicar").addEventListener("click", () => {
            alert("A função de publicar está desativado por enquanto!")
            // document.getElementById("container__publicacao").classList.remove("hidden");
        })
        
        document.getElementById("botao__fechar").addEventListener("click", () => {
            document.getElementById("container__publicacao").classList.add("hidden")
            document.getElementById("formulario__publi").reset();
            document.getElementById("upload__livro").value = '';
        })
        
        if(!sessionStorage.getItem("avisoMostrado")){
            sessionStorage.setItem("avisoMostrado", "true")
            
            const AvisoSection = document.getElementById("aviso");
            
            document.getElementById("botao__aviso").addEventListener("click", () => {
                AvisoSection.classList.add("hidden");
                AvisoSection.classList.remove("desfoque")
            })
        }else{
            document.getElementById("aviso").classList.add("hidden");
        }
        
        const enviarLivroBtn = document.getElementById("enviar__livro");
        enviarLivroBtn.addEventListener("click", async (e) => {
            e.preventDefault();
                const arquivo = document.getElementById("upload__livro");
                const livroSelecionado = arquivo.files[0];
                
                console.log(livroSelecionado)
                
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
            }
        );
})







