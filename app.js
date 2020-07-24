const apiKey = 'd486450732f74975b10415a4704fda06';
const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');
let defaultSource= "the-times-of-india";


window.addEventListener('load', async e => {
  navigator.serviceWorker.register('sw.js')
      .then(reg => {
        console.log('Service Worker Registered!', reg);
      })
      .catch(err => {
        console.log('Service Worker registration failed: ', err);
      });

    // Request notification permission
    Notification.requestPermission(function(status) {
      console.log('Notification permission status:', status);
    });
 
  updateNews();
  // const params = new URLSearchParams(document.location.search);
  // const s = params.get("s")
  await updateSources();
  // setSelectedIndex(document.getElementById("sourceSelector"), s);
 //
 //  if (s == null) {
 //    defaultSource = "the-times-of-india";
 //    await updateSources();
 //   updateNews(defaultSource);
 //
 // }
 //  else {
 //    console.log('me');
 //    defaultSource = s;
 //  }
  sourceSelector.value = defaultSource;


  sourceSelector.addEventListener('change', e => {
    ga('send', 'event', 'Good News', 'click', `${e.target.value}`);
    updateNews(e.target.value);
    // location.href = `detail.html?s=${e.target.value}`;
    // setSelectedIndex(document.getElementById("sourceSelector"), s);
  });
  if ('serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.register('sw.js');
      console.log('sw register');
    }
    catch (error) {
      console.log("sw failed");
    }

  }
});
async function updateSources() {
  const res = await fetch('https://newsapi.org/v2/sources?country=us&apiKey=d486450732f74975b10415a4704fda06');
  const json = await res.json();

  sourceSelector.innerHTML = json.sources.map(src => `<option value="${src.id}">${src.name}</option>`).join('\n');

}
async function updateNews(source = defaultSource) {

  const res = await fetch(`http://newsapi.org/v2/top-headlines?sources=${source}&apiKey=d486450732f74975b10415a4704fda06`);
  const json = await res.json();
  main.innerHTML = json.articles.map(createArticle).join('\n');
}
function createArticle(article) {
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
        <p>${article.description}</p>
        </a>

        </div>
`;
}



let deferredPrompt;
const addBtn = document.querySelector('.add-button');
addBtn.style.display = 'none';
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    addBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
});


function setSelectedIndex(s, valsearch) {

  // Loop through all the items in drop down list

  for (let i = 0; i < s.options.length; i++) {
    if (s.options[i].value == valsearch) {
      s.options[i].selected = true;
      break;
    }
  }
  return;
}
