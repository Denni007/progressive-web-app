const apiKey  = 'd486450732f74975b10415a4704fda06';
const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');
const defaultSource = "the-times-of-india";


window.addEventListener('load', async e=>{
    updateNews();
    sourceSelector.value = defaultSource;
    await updateSources();
    
    sourceSelector.addEventListener('change', e =>{
        updateNews(e.target.value);
    });

    if('serviceWorker' in navigator){
        try{
            navigator.serviceWorker.register('sw.js');

        }
        catch(error){
console.log("sw failed");
        }

    }
});
async function updateSources(){
    const res = await fetch('https://newsapi.org/v2/sources?country=us&apiKey=d486450732f74975b10415a4704fda06');
    const json = await res.json();

    sourceSelector.innerHTML = json.sources.map(src => `<option value="${src.id}">${src.name}</option>`).join('\n');

}
async function updateNews(source = defaultSource){

    const res = await fetch(`http://newsapi.org/v2/top-headlines?sources=${source}&apiKey=d486450732f74975b10415a4704fda06`);
    const json = await res.json();
    main.innerHTML = json.articles.map(createArticle).join('\n');
}
function createArticle(article){
    return `
    <style>
    h2 {
     font-family: Georgia, 'Times New Roman', Times, serif;
   }
    a,
    a:visited {
     text-decoration: none;
     color: inherit;
   }
   
    img {
     width: 100%;
   }
   </style>
        <div class = "article">
        <a href="${article.url}">
        <h2>${article.title}</h2>
        <img src="${article.urlToImage ? article.urlToImage : ''}">
        <p>${article.description}</p>
        </a>
        
        </div>
`;
}