document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginButton').addEventListener('click', loginUser);
    document.getElementById('registerButton').addEventListener('click', registerUser);
    document.getElementById('ajouterButton').addEventListener('click', ajouterHeure);
    document.getElementById('totalButton').addEventListener('click', afficherTotal);
    afficherHistorique();
});

let currentUser = null;

function registerUser() {
    const pseudo = document.getElementById('registerPseudo').value;
    const password = document.getElementById('registerPassword').value;
    if (!pseudo || !password) {
        alert('Veuillez entrer un pseudo et un mot de passe.');
        return;
    }
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(user => user.pseudo === pseudo)) {
        alert('Ce pseudo est déjà pris.');
        return;
    }
    users.push({ pseudo, password, heuresSupplementaires: [] });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Inscription réussie!');
}

function loginUser() {
    const pseudo = document.getElementById('loginPseudo').value;
    const password = document.getElementById('loginPassword').value;
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(user => user.pseudo === pseudo && user.password === password);
    if (user) {
        currentUser = user;
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('appSection').style.display = 'block';
        afficherHistorique();
    } else {
        alert('Pseudo ou mot de passe incorrect.');
    }
}

function ajouterHeure() {
    if (!currentUser) {
        alert('Veuillez vous connecter.');
        return;
    }
    const date = document.getElementById('date').value;
    const heures = parseInt(document.getElementById('heures').value, 10);
    if (!date || heures <= 0) {
        alert('Veuillez entrer une date valide et des heures supérieures à 0.');
        return;
    }
    const index = currentUser.heuresSupplementaires.findIndex(hs => hs.date === date);
    if (index > -1) {
        currentUser.heuresSupplementaires[index].heures += heures; // Mettre à jour les heures si la date existe déjà
    } else {
        currentUser.heuresSupplementaires.push({ date, heures }); // Ajouter une nouvelle entrée
    }
    updateUserData();
    alert('Heure ajoutée avec succès!');
    afficherHistorique();
}

function afficherTotal() {
    if (!currentUser) {
        alert('Veuillez vous connecter.');
        return;
    }
    const moisSelectionne = parseInt(document.getElementById('moisSelectionne').value, 10);
    let total = 0;
    currentUser.heuresSupplementaires.forEach((hs) => {
        const mois = new Date(hs.date).getMonth() + 1;
        if (mois === moisSelectionne) {
            total += hs.heures;
        }
    });
    document.getElementById('totalHeures').innerText = 'Total Heures: ' + total;
}

function afficherHistorique() {
    if (!currentUser) {
        return;
    }
    let historiqueHTML = currentUser.heuresSupplementaires.map((hs, index) => `
        <p>
            ${hs.date}: ${hs.heures} heures
            <button onclick="modifierHeure(${index})">Modifier</button>
            <button onclick="supprimerHeure(${index})">Supprimer</button>
        </p>
    `).join('');
    document.getElementById('historiqueHeures').innerHTML = historiqueHTML;
}

function modifierHeure(index) {
    const nouvelleHeure = prompt('Entrez le nouveau nombre d\'heures:', currentUser.heuresSupplementaires[index].heures);
    if (nouvelleHeure !== null && !isNaN(nouvelleHeure) && nouvelleHeure > 0) {
        currentUser.heuresSupplementaires[index].heures = parseInt(nouvelleHeure, 10);
        updateUserData();
        afficherHistorique();
    } else {
        alert('Veuillez entrer un nombre valide d\'heures.');
    }
}

function supprimerHeure(index) {
    currentUser.heuresSupplementaires.splice(index, 1);
    updateUserData();
    afficherHistorique();
}

function updateUserData() {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(user => user.pseudo === currentUser.pseudo);
    if (userIndex > -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
}
