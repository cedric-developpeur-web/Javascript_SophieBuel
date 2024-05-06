// emplacement variable imput email et mot de passe et bouton de connexion
const buttonLogin = document.querySelector('#connect');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
// evenement clique sur le bouton connexion
function connexion() {
  buttonLogin.addEventListener('click', (event) => {
    event.preventDefault();

    // recuperation de la valeur des input email et password
    const email = emailInput.value;
    const password = passwordInput.value;

    // appel de la requete post
    request(email, password);
  });
}
connexion();

// envoie de la requete post
async function request(email, password) {
  const reponse = await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!reponse.ok) {
    const messageError = document.querySelector('#login .error');
    messageError.style.display = 'block';
    return;
  }
  // une fois les donnees en json son recuperre me permet de recuperer l'information du token
  // et de les stocker en local sur le navigateur grace a la cle accessToken
  const data = await reponse.json();
  localStorage.setItem('accessToken', data.token);
  console.log('token recupere', data.token);
  console.log('connexion reussie');
  // me redirige vers la page d'acceuil du site
  window.location.href = 'index.html';
}
