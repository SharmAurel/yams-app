<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="retro-toolbar">
        <ion-title class="retro-title">Partie en cours</ion-title>
      </ion-toolbar>
  </ion-header>
    
    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col class="header-cell">Liste</ion-col>
          <ion-col v-for="(player, pIndex) in players" :key="pIndex" class="header-cell">
            {{ player }}
          </ion-col>
        </ion-row>
        
        <ion-row v-for="(category, cIndex) in categories" :key="cIndex">
          <ion-col class="category-cell">{{ category.name }}</ion-col>
          <ion-col 
            v-for="(player, pIndex) in players" 
            :key="pIndex"
            class="score-cell"
            @click="openScorePopup(cIndex, pIndex)">
            {{ scores[pIndex][cIndex] !== null ? scores[pIndex][cIndex] : '-' }}
          </ion-col>
        </ion-row>
        
        <!-- Ligne Bonus -->
        <ion-row>
          <ion-col class="category-cell">Bonus</ion-col>
          <ion-col v-for="(player, pIndex) in players" :key="pIndex" class="score-cell">
            {{ calculateBonus(pIndex) }}
          </ion-col>
        </ion-row>
        
        <!-- Ligne Total -->
        <ion-row>
          <ion-col class="category-cell">Total</ion-col>
          <ion-col v-for="(player, pIndex) in players" :key="pIndex" class="score-cell">
            {{ calculateTotal(pIndex) }}
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Bouton Retour -->
      <ion-button expand="full" color="danger" @click="confirmQuitGame">Retour</ion-button>
    </ion-content>

  

  <!-- Pop-up pour sélectionner le score -->
  <ion-modal :is-open="scorePopupOpen" @didDismiss="scorePopupOpen = false">
  <ion-content class="modal-content">
    <h2>{{ popupHeader }}</h2>
    <div class="score-buttons">
      <button v-for="value in categories[selectedCategory]?.values" 
              :key="value" 
              @click="setScore(value)"
              class="score-button">
        {{ value }}
      </button>
    </div>
    <ion-button @click="scorePopupOpen = false" color="danger">Annuler</ion-button>
  </ion-content>
</ion-modal>

  


  <!-- Pop-up de confirmation de fin de partie -->
  <ion-alert
    :is-open="gameCompletePopupOpen"
    header="Terminer la partie"
    message="Voulez-vous vraiment terminer la partie ?"
    :buttons="gameCompleteButtons">
  </ion-alert>

  <!-- Pop-up de confirmation de quitter la partie -->
  <ion-alert
    :is-open="quitGamePopupOpen"
    header="Quitter la partie"
    message="Voulez-vous vraiment quitter la partie ?"
    :buttons="quitGameButtons">
  </ion-alert>
</ion-page>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonAlert, IonButton, IonModal } from '@ionic/vue';
import { onUnmounted } from 'vue';

onMounted(() => {
  // Recharger la page quand on entre
  router.replace('/game');
});
onUnmounted(() => {
  resetGame();
});

const players = ref(JSON.parse(localStorage.getItem('players')) || []);
const categories = ref([
  { name: "Un", values: [0, 1, 2, 3, 4, 5] },
  { name: "Deux", values: [0, 2, 4, 6, 8, 10] },
  { name: "Trois", values: [0, 3, 6, 9, 12, 15] },
  { name: "Quatre", values: [0, 4, 8, 12, 16, 20] },
  { name: "Cinq", values: [0, 5, 10, 15, 20, 25] },
  { name: "Six", values: [0, 6, 12, 18, 24, 30] },
  { name: "Brelan", values: [0, 10, 15, 18, 21, 24, 30] },
  { name: "Carré", values: [0, 15, 20, 24, 28, 32] },
  { name: "Full House", values: [0, 25] },
  { name: "Petite Suite", values: [0, 30] },
  { name: "Grande Suite", values: [0, 40] },
  { name: "Yams", values: [0, 50] },
  { name: "Chance", values: Array.from({ length: 30 }, (_, i) => i + 1) }

]);

const scores = ref(players.value.map(() => Array(categories.value.length).fill(null)));
const scorePopupOpen = ref(false);
const gameCompletePopupOpen = ref(false); // popup pour terminer la partie
const selectedPlayer = ref(null);
const selectedCategory = ref(null);
const popupHeader = ref("");
const popupButtons = ref([]);
const router = useRouter();


watch(() => router.path, (newPath) => {
  if (newPath === '/game') {
    resetGame();
  }
});

const openScorePopup = (cIndex, pIndex) => {
  selectedPlayer.value = pIndex;
  selectedCategory.value = cIndex;
  popupHeader.value = `Score pour ${categories.value[cIndex].name}`;

  popupButtons.value = [
    ...categories.value[cIndex].values.map(value => ({ text: value.toString(), handler: () => setScore(value) })),
    { text: "Ne pas remplir", role: "cancel", handler: () => clearScore() }
  ];

  scorePopupOpen.value = true;
};

const setScore = (value) => {
  if (selectedPlayer.value !== null && selectedCategory.value !== null) {
    scores.value[selectedPlayer.value][selectedCategory.value] = value;
    checkIfGameComplete(); // Vérifie si la partie est terminée
    saveScores(); // Sauvegarde les scores dans le localStorage
  }
  scorePopupOpen.value = false; // Ferme le modal après la sélection
};

const clearScore = () => {
  scores.value[selectedPlayer.value][selectedCategory.value] = null;
  checkIfGameComplete(); // Vérifier si la partie est terminée
};

const checkIfGameComplete = () => {
  // Vérifier si tous les scores sont remplis
  const allFilled = scores.value.every(playerScores => playerScores.every(score => score !== null));
  if (allFilled) {
    gameCompletePopupOpen.value = true; // Afficher la popup de fin de partie
  }
};

const gameCompleteButtons = [
  {
    text: 'Non',
    role: 'cancel',
    handler: () => { 
      gameCompletePopupOpen.value = false; 
    }
  },
  {
    text: 'Oui',
    handler: () => {
      saveScores(); // Sauvegarder les scores avant de rediriger
      router.push('/ranking'); // Rediriger vers la page classement
    }
  }
];

const calculateBonus = (playerIndex) => {
  const upperSectionTotal = [0, 1, 2, 3, 4, 5]
    .map(i => scores.value[playerIndex][i] || 0)
    .reduce((acc, val) => acc + val, 0);
  
  return upperSectionTotal >= 63 ? 35 : `Manque ${63 - upperSectionTotal}`;
};

const calculateTotal = (playerIndex) => {
  const totalScore = scores.value[playerIndex].flat().reduce((acc, val) => acc + (val || 0), 0);
  return totalScore + (calculateBonus(playerIndex) === 35 ? 35 : 0);
};

const saveScores = () => {
  localStorage.setItem('scores', JSON.stringify(scores.value));
};
const quitGamePopupOpen = ref(false); // variable pour ouvrir la popup
const quitGameButtons = [
  {
    text: 'Non',
    role: 'cancel',
    handler: () => { quitGamePopupOpen.value = false; }
  },
  {
    text: 'Oui',
    handler: () => {
      router.push('/'); // Rediriger vers la page d'accueil ou une autre page
    }
  }
];

const confirmQuitGame = () => {
  quitGamePopupOpen.value = true; // Ouvrir la popup de confirmation
};
const resetGame = () => {
  players.value = []; // Réinitialiser les joueurs
  scores.value = {}; // Réinitialiser les scores
  currentPlayerIndex.value = 0; // Revenir au premier joueur
  gameStarted.value = false; // Marquer le jeu comme non démarré
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

* {
  font-family: 'Press Start 2P', cursive;
}

.retro-toolbar {
  background-color: #222; /* Fond sombre rétro */
  border-bottom: 5px solid #ff5733; /* Bordure colorée pour un effet rétro */
}

.retro-title {
  font-size: 24px;
  text-align: center;
  color: #ff5733; /* Couleur orange/rouge rétro */
  text-shadow: 2px 2px #000; /* Ombre pour ajouter un effet 3D rétro */
  letter-spacing: 2px; /* Espacement des lettres pour un effet plus marqué */
  text-transform: uppercase; /* Capitalisation pour plus de style */
}

.modal-content {
  text-align: center;
  padding: 20px;
  display: flex;
}

.score-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px; /* Espacement entre les boutons */
}

.score-button {
  background-color: #4CAF50; /* Couleur verte */
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
}

.score-button:hover {
  background-color: #45a049;
}

/* Ajouter ici les ajustements pour le défilement horizontal */
ion-content {
  overflow-x: auto; /* Permet le défilement horizontal */
}

ion-grid {
  display: block; /* Retirer le comportement flex de ion-grid pour mieux gérer le défilement */
}

ion-row {
  display: flex; /* Utiliser flex pour aligner les colonnes sur la même ligne */
  min-width: 150px; /* Assurer une largeur minimale pour les éléments de la ligne */
  padding: 10px;
  box-sizing: border-box;
}

ion-col {
  padding: 5px 10px; /* Ajouter un peu de marge interne */
  min-width: 120px; /* Largeur minimale pour chaque colonne */
  text-align: center;
}



</style>
