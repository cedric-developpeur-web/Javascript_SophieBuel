// variable et constante globale
const divGallery = document.querySelector('.gallery');
let refGallery;

// ****************************************PARTI AFFICHAGE GALERIE**********************************

// recuperation des images de la galerie avec la creation des balise html dynamique
async function donneeGallery() {
  const apiGallery = 'http://localhost:5678/api/works';
  const reponse = await fetch(apiGallery);
  const data = await reponse.json();
  refGallery = data;
  divGallery.innerHTML = '';
  miniPicture();
  data.forEach((imageGallery) => {
    // creation des balises html
    const baliseFigure = document.createElement('figure');
    const baliseImg = document.createElement('img');
    const baliseLegend = document.createElement('figcaption');

    // recuperation informations utile via api works (swagger)
    baliseImg.src = imageGallery.imageUrl;
    baliseImg.alt = imageGallery.title;
    baliseLegend.innerHTML = imageGallery.title;

    // balise parent + positionnement des balises enfants
    divGallery.appendChild(baliseFigure);
    baliseFigure.appendChild(baliseImg);
    baliseFigure.appendChild(baliseLegend);
  });
}
donneeGallery();

// ***************************************PARTI BOUTONS DYNAMIQUE************************************

// ***************creation balise html parent + placement de la balise avec childNodes[2]
const divParentBouton = document.getElementById('portfolio');
const divBouton = document.createElement('div');
divBouton.classList.add('posi_btn');
divParentBouton.appendChild(divBouton);
divParentBouton.insertBefore(divBouton, divParentBouton.childNodes[2]);

// **********************************creation du boutons tous de facon dynamique********************************
const baliseBoutonTous = document.createElement('button');
baliseBoutonTous.textContent = 'Tous';
// ajout d'une classe css
baliseBoutonTous.classList.add('btn');
// balise parent de l'enfant bouton tous
divBouton.appendChild(baliseBoutonTous);

// fonction pour afficher toutes la gallery quand je clique sur le bouton tous
function initialiserGallery() {
  baliseBoutonTous.addEventListener('click', () => {
    divGallery.innerHTML = '';
    donneeGallery();
  });
}
initialiserGallery();

// **************************creation de 3 boutons dynamique par categories*********************

// recuperation des categories pour les attribuers les nom et id des images part categories
const boutonDyna = document.querySelector('.posi_btn');
// creation fonction asynchrone + fonction fetch
async function donneeBoutonDyna() {
  const apiCategorie = 'http://localhost:5678/api/categories';
  const reponse = await fetch(apiCategorie);
  const categories = await reponse.json();
  categories.forEach((category) => {
    // creation des balises html
    const boutons = document.createElement('button');
    // définit le texte à afficher sur le bouton
    boutons.innerText = category.name;
    boutons.classList.add(`btn${category.id}`);
    boutonDyna.appendChild(boutons);
    boutons.addEventListener('click', () => {
      divGallery.innerHTML = '';
      FilterCategorys(category.id);
    });
  });
}
// fonction pour trier chaque categorie part bouton
function FilterCategorys(id) {
  const filterResult = refGallery.filter((image) => image.categoryId == id);
  filterResult.forEach((imageGallery) => {
    // creation des balises html
    const baliseFigure = document.createElement('figure');
    const baliseImg = document.createElement('img');
    const baliseLegend = document.createElement('figcaption');

    // recuperation informations utile via api works (swagger)
    baliseImg.src = imageGallery.imageUrl;
    baliseImg.alt = imageGallery.title;
    baliseLegend.innerHTML = imageGallery.title;

    // balise parent + positionnement des balises enfants
    divGallery.appendChild(baliseFigure);
    baliseFigure.appendChild(baliseImg);
    baliseFigure.appendChild(baliseLegend);
  });
}
donneeBoutonDyna();

// **********************************PARTI CONNECTION INTERFACE CLIENT************************
function executConnect() {
  const token = localStorage.getItem('accessToken');
  const toChange = document.getElementById('log');
  if (token) {
    // ajout element sur la page quand le client et connecter
    const banner = document.querySelector('.banner');
    banner.style.display = 'flex';
    const modifI = document.querySelector('.modification i');
    modifI.style.display = 'flex';
    const modifP = document.querySelector('.modification p');
    modifP.style.display = 'flex';
    // supprimer les boutons quand le client et connecter
    const remov = document.querySelector('.posi_btn');
    remov.style.display = 'none';
    // modification de login en logout
    toChange.textContent = 'logout';
    // cliquer sur logout pour ce deconnecter + redirectionne page d'acceuil de base
    toChange.addEventListener('click', () => {
      localStorage.removeItem('accessToken');
      toChange.textContent = 'login';
      window.location.href = 'index.html';
    });
  }
}
executConnect();

// ***************************************PARTI MODAL********************************************

// *****************************affichage galerie dans la modal*************************
async function miniPicture() {
  const divGall = document.querySelector('.select_picture');
  divGall.innerHTML = '';
  refGallery.forEach((miniPicture) => {
    const Figure = document.createElement('figure');
    const picture = document.createElement('img');
    const trash = document.createElement('i');
    trash.classList.add('fa-solid', 'fa-trash-can');

    picture.src = miniPicture.imageUrl;
    trash.id = miniPicture.id;
    trash.addEventListener('click', () => {
      basket(miniPicture.id);
    });

    divGall.appendChild(Figure);
    Figure.appendChild(picture);
    Figure.appendChild(trash);
  });
}

// ************************supprimer image avec l'icone de la poubelle**********************
async function basket(id) {
  const token = localStorage.getItem('accessToken');
  const reponse = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (reponse.ok) {
    donneeGallery();
    miniPicture();
  }
}

// ******************************affichage de la modal ajout photo******************************
function addPicture() {
  const targetButton = document.querySelector('.btn_modal');
  targetButton.addEventListener('click', () => {
    const modalNext = document.getElementById('modal_next');
    modalNext.style.display = 'block';
    const arrowReturn = document.querySelector('.modal .fa-arrow-left');
    arrowReturn.style.display = 'block';
    const changeTitle = document.querySelector('.modal h1');
    changeTitle.textContent = 'Ajout photo';
    const removPicture = document.querySelector('.select_picture');
    removPicture.style.display = 'none';
    const changeButton = document.querySelector('.btn_modal');
    changeButton.style.display = 'none';
    const buttonSubmit = document.querySelector('.btn_submit');
    buttonSubmit.style.display = 'block';
    // condition pour effectuer un retour sur la modal precedente au clic de la fleche
    if (arrowReturn) {
      arrowReturn.addEventListener('click', () => {
        modalNext.style.display = '';
        arrowReturn.style.display = '';
        changeTitle.textContent = 'Gallerie photo';
        removPicture.style.display = '';
        changeButton.style.display = 'block';
        buttonSubmit.style.display = '';
      });
    }
  });
}
addPicture();

// *********************************PARTI PREVISUALISATION FICHIER****************************

// previsualiser un fichier
function visualPicture() {
  const picturePrevEmpla = document.querySelector('.add_picture');
  const prevPic = document.createElement('img');
  picturePrevEmpla.insertBefore(prevPic, picturePrevEmpla.childNodes[2]);
  const buttonAddPicture = document.querySelector('.btn_picture');
  const inputVisual = document.getElementById('visual');
  if (buttonAddPicture) {
    buttonAddPicture.addEventListener('click', () => {
      inputVisual.click();
    });
  }
  // affichage du fichier choisi pour le visualiser en ajoutant un evennement sur le input
  inputVisual.addEventListener('change', () => {
    prevPic.style.display = 'block';
    const file = inputVisual.files[0];
    if (file) {
      // FileReader permet de lire le contenu d'un fichier
      const reader = new FileReader();
      reader.onload = function (e) {
        prevPic.src = e.target.result;
      };
      // converti le fichier en url ça evite de telecharger le fichier
      reader.readAsDataURL(file);

      // ajustement pour l'affichage du fichier a previsualiser
      const actIcone = document.querySelector('.fa-image');
      actIcone.style.display = 'none';
      const actButton = document.querySelector('.posi_addpic');
      actButton.style.display = 'none';
      const arrowPrev = document.querySelector('.fa-arrow-left');
      arrowPrev.addEventListener('click', () => {
        prevPic.src = '';
        prevPic.style.display = 'none';
        actIcone.style.removeProperty('display');
        actButton.style.removeProperty('display');
      });
      const crossPrev = document.querySelector('.cross_modal');
      crossPrev.addEventListener('click', () => {
        prevPic.src = '';
        prevPic.style.display = 'none';
        actIcone.style.removeProperty('display');
        actButton.style.removeProperty('display');
      });
      const overlayPrev = document.querySelector('.overlay');
      overlayPrev.addEventListener('click', () => {
        prevPic.src = '';
        prevPic.style.display = 'none';
        actIcone.style.removeProperty('display');
        actButton.style.removeProperty('display');
      });
      // verifier la taille du fichier qui ne doit pas etre superieur a 4 MO
      const sizeMaxFile = 4 * 1024 * 1024;
      if (file.size > sizeMaxFile) {
        const errorSizeFile = document.querySelector('.posi_addpic p');
        errorSizeFile.style.color = 'red';
        errorSizeFile.textContent = 'fichier trop volumineux';
        prevPic.src = '';
        prevPic.style.display = 'none';
        actIcone.style.removeProperty('display');
        actButton.style.removeProperty('display');
        const errorFilePrev = document.querySelectorAll(
          '.fa-arrow-left, .cross_modal, .overlay'
        );
        errorFilePrev.forEach((errorFilePrev) => {
          errorFilePrev.addEventListener('click', () => {
            errorSizeFile.style.color = '';
            errorSizeFile.textContent = 'jpg,png : 4mo max';
          });
        });
      }
      // verifie le type de format demande pour le fichier
      const formatFile = ['image/jepg', 'image/png'];
      if (!formatFile.includes(file.type)) {
        const errorFormatFile = document.querySelector('.posi_addpic p');
        errorFormatFile.style.color = 'red';
        errorFormatFile.textContent = 'fichier jpeg et png requis';
        prevPic.src = '';
        prevPic.style.display = 'none';
        actIcone.style.removeProperty('display');
        actButton.style.removeProperty('display');
        const errorFormatPrev = document.querySelectorAll(
          '.fa-arrow-left, .cross_modal, .overlay'
        );
        errorFormatPrev.forEach((errorFormatPrev) => {
          errorFormatPrev.addEventListener('click', () => {
            errorFormatFile.style.color = '';
            errorFormatFile.textContent = 'jpg,png : 4mo max';
          });
        });
      }
    } else {
      errorMessageForm();
    }
  });
}
visualPicture();

// *************************************PARTI CHAMPS FORMULAIRE********************************

// structure du formulaire de facon dynamique
async function createForm() {
  const emplaParentForm = document.querySelector('#modal_next form');

  // champs titre
  const labelTitle = document.createElement('label');
  labelTitle.setAttribute('for', 'title');
  labelTitle.textContent = 'Titre';
  const inputTitle = document.createElement('input');
  inputTitle.setAttribute('type', 'text');
  inputTitle.setAttribute('id', 'title');
  inputTitle.setAttribute('name', 'title');
  const br = document.createElement('br');

  // champs categorie
  const labelCat = document.createElement('label');
  labelCat.setAttribute('for', 'category');
  labelCat.textContent = 'Categorie';
  const selectCat = document.createElement('select');
  selectCat.setAttribute('id', 'category');
  selectCat.setAttribute('name', 'category');

  // disposition des balises
  emplaParentForm.appendChild(labelTitle);
  emplaParentForm.appendChild(inputTitle);
  emplaParentForm.appendChild(br);
  emplaParentForm.appendChild(labelCat);
  emplaParentForm.appendChild(selectCat);

  // recupere les categories via l'api et qui les injecte dans la balise select
  await displayOption(selectCat);
}
createForm();

// cette fonction genere les categories de balise select
async function displayOption(selectCat) {
  // creation option vide part defaut
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '';
  selectCat.appendChild(defaultOption);

  // recupere les categories pour les options
  const apiGetCategorie = 'http://localhost:5678/api/categories';
  const reponse = await fetch(apiGetCategorie);
  const categorys = await reponse.json();
  categorys.forEach((catego) => {
    const option = document.createElement('option');
    option.value = catego.id;
    option.textContent = catego.name;
    selectCat.appendChild(option);
  });
}

// cette fonction me permet de soumettre le formulaire
async function postForm() {
  // recuperation des valeurs des champs du formulaire
  const inputVisual = document.getElementById('visual');
  const file = inputVisual.files[0];
  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;

  // regroupe les informations a envoyer pour la requete post
  let formData = new FormData();
  formData.append('image', file);
  formData.append('title', title);
  formData.append('category', parseInt(category));

  // la requete post du formulaire
  const token = localStorage.getItem('accessToken');
  const reponseForm = await fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (reponseForm.ok) {
    console.log('requete bien envoyer');
    donneeGallery();
    miniPicture();
  } else {
    errorMessageForm();
  }
}
// execution de la requete au click du bouton valider
const submitForm = document.querySelector('.btn_submit');
submitForm.addEventListener('click', postForm);

// messages erreur si les champs sont pas rempli
function errorMessageForm() {
  const fileImg = document.querySelector('.add_picture img');
  const img = fileImg.src;
  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;

  // si aucun fichier n'est selectionner
  if (img === '') {
    const errorFile = document.querySelector('.posi_addpic p');
    errorFile.style.color = 'red';
    errorFile.textContent = 'Veuillez ajouter une photo';
    const returnArrowP = document.querySelectorAll(
      '.fa-arrow-left, .cross_modal, .overlay'
    );
    returnArrowP.forEach((returnArrowP) => {
      returnArrowP.addEventListener('click', () => {
        errorFile.style.color = '';
        errorFile.textContent = 'jpg,png : 4mo max';
      });
    });
  }
  // si aucune categorie n'est selectionner
  if (category === '') {
    const emptyOption = document.getElementById('category');
    emptyOption.style.border = '3px solid red';
    emptyOption.addEventListener('change', () => {
      emptyOption.style.border = '';
    });
    const removEmpty = document.querySelectorAll(
      '.fa-arrow-left, .cross_modal, .overlay'
    );
    removEmpty.forEach((removEmpty) => {
      removEmpty.addEventListener('click', () => {
        emptyOption.style.border = '';
      });
    });
  }
  // verifier si le champs titre est vide
  if (!title.trim()) {
    const champsTitle = document.getElementById('title');
    champsTitle.style.border = '3px solid red';
    // quand je clic sur le champs titre pour le remplir j'enlever border red
    const removError = document.getElementById('title');
    removError.addEventListener('input', () => {
      removError.style.border = '';
    });
    const removReturnArrow = document.querySelectorAll(
      '.fa-arrow-left,.cross_modal,.overlay'
    );
    removReturnArrow.forEach((removReturnArrow) => {
      removReturnArrow.addEventListener('click', () => {
        champsTitle.style.border = '';
      });
    });
  }
}

// bouton valide change de couleur quand le formulaire et bien rempli
function validedForm() {
  const fileImg = document.querySelector('.add_picture img');
  const img = fileImg.src;
  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  const changeButton = document.querySelector('.btn_submit');

  if (img !== '' && title.trim() !== '' && category !== '') {
    changeButton.style.backgroundColor = '#1d6154';
    changeButton.style.opacity = '1';
    changeButton.style.cursor = 'pointer';
  } else {
    changeButton.style.backgroundColor = '';
    changeButton.style.opacity = '1';
    changeButton.style.cursor = '';
  }
}
document.addEventListener('input', validedForm);

// *********************************ouverture est fermeture au clic******************************
function modalIteraction() {
  const baliseP = document.querySelector('#portfolio p');
  if (baliseP) {
    baliseP.addEventListener('click', () => {
      const baliseModalContainer = document.querySelector('.modal_container');
      baliseModalContainer.style.display = 'block';
    });
  }
  const baliseArrow = document.querySelector('.modal .fa-arrow-left');
  if (baliseArrow) {
    baliseArrow.addEventListener('click', () => {
      document.getElementById('title').value = '';
      document.getElementById('category').value = '';
      validedForm();
    });
  }
  const baliseCross = document.querySelector('.modal_container .cross_modal');
  if (baliseCross) {
    baliseCross.addEventListener('click', () => {
      const baliseModalContainer = document.querySelector('.modal_container');
      baliseModalContainer.style.display = 'none';
      document.getElementById('title').value = '';
      document.getElementById('category').value = '';
      validedForm();
    });
  }
  const exitOverlay = document.querySelector('.modal_container .overlay');
  if (exitOverlay) {
    exitOverlay.addEventListener('click', () => {
      const baliseModalContainer = document.querySelector('.modal_container');
      baliseModalContainer.style.display = 'none';
      document.getElementById('title').value = '';
      document.getElementById('category').value = '';
      validedForm();
    });
  }
}
modalIteraction();
