const URL__BASE = '/db.json'


const api = {
    async conectarAPI () {
        try{
            const response = await fetch(URL__BASE);
            const data = await response.json();
            return data.books
        }catch(error){
            console.error(error);
            alert('Aconteceu alguma coisa de errado no conectaAPI, consulte o console');
        }
    },

    async buscarLivroAPI(livro){
        const livros = await this.conectarAPI();
        const livrosMiudos = livro.toLowerCase();

        const livrosFiltrados = livros.filter(livro => {
            return livro.title.toLowerCase().includes(livrosMiudos) ||
            livro.author.toLowerCase().includes(livrosMiudos);
        })
        return livrosFiltrados;
    },


    async colocarLivro(dados){
        const response = await fetch(`${URL__BASE}books`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(dados)
        })
        return response.json()
    },

    salvarHistorico(livro) {
        let historico = JSON.parse(localStorage.getItem("historicoRevistas")) || [];
        const jaExiste = historico.find(item => item === livro.id);
    
        if (!jaExiste) {
            historico.unshift(livro);
            historico = historico.slice(0, 2);
            localStorage.setItem("historicoRevistas", JSON.stringify(historico));
        }
    },

    pegaURL(){
        const urlParams = new URLSearchParams(window.location.search);
        const pdfUrl = urlParams.get("pdf");
        if (pdfUrl) {
            document.getElementById("pdfViewer").src = pdfUrl;
        } else {
            document.body.innerHTML = "<h2>Nenhum PDF foi selecionado.</h2>";
        }
    }
    
}


export default api;