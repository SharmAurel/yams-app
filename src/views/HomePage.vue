<template>
  <ion-page>
    <ion-header>
  <ion-toolbar class="retro-toolbar">
    <ion-title class="retro-title">Yamsssss</ion-title>
  </ion-toolbar>
</ion-header>

    <ion-content class="retro-background">
      <div class="container">
        <h1 class="title">Joueurs</h1>

        <!-- CHAMP D'AJOUT DE JOUEUR -->
        <div class="input-group">
          <ion-input
            ref="newPlayerInput"
            v-model="newPlayer"
            placeholder="Joueur"
            class="pixel-input"
            @keyup.enter="addPlayer"
          ></ion-input>
          <ion-button :disabled="buttonDisabled" class="pixel-button" @click="addPlayer">
            {{ buttonDisabled ? "Ajouté !" : "Ajouter" }}
          </ion-button>
        </div>

        <!-- MESSAGE SI LISTE VIDE -->
        <ion-text v-if="players.length === 0" color="medium">
          <p class="empty-message">Aucun joueur ajouté. Tape un nom et appuie sur Entrée !</p>
        </ion-text>

        <!-- LISTE DES JOUEURS AVEC ANIMATION -->
        <transition-group name="fade" tag="ion-list">
  <ion-item v-for="(player, index) in players" :key="index" class="pixel-item">
    <ion-input
      v-if="editingIndex === index"
      v-model="players[index]"
      class="pixel-input edit-input"
      @keyup.enter="saveEdit(index)"
      @blur="saveEdit(index)"
      ref="editInputs"
    ></ion-input>
    <ion-label
      v-else
      class="pixel-item"
      @click="editPlayer(index)"
    >
      {{ player }}
    </ion-label>
    <ion-button class="pixel-button" @click="removePlayer(index)">
      <ion-icon :icon="trash"></ion-icon>
    </ion-button>
  </ion-item>
</transition-group>

        <!-- BOUTON POUR DÉMARRER LA PARTIE -->
        <ion-button expand="full" class="pixel-button start-button" :disabled="players.length < 2" @click="startGame">
          Démarrer la partie
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>


<script setup>
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import backgroundImage from '@/assets/background-home.png';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonLabel,
  IonText
} from '@ionic/vue';
import { trash } from 'ionicons/icons';

const players = ref([]);
const newPlayer = ref('');
const newPlayerInput = ref(null);
const buttonDisabled = ref(false);
const router = useRouter();

const refreshPage = () => {
  window.location.reload();
};

const addPlayer = () => {
  const trimmedName = newPlayer.value.trim();
  if (trimmedName !== '' && !players.value.includes(trimmedName)) {
    players.value.push(trimmedName);
    newPlayer.value = '';

    nextTick(() => {
      newPlayerInput.value?.$el?.setFocus();
    });

    buttonDisabled.value = true;
    setTimeout(() => {
      buttonDisabled.value = false;
    }, 500);
  }
};

const removePlayer = (index) => {
  players.value.splice(index, 1);
};

const startGame = async () => {
  document.activeElement.blur();
  localStorage.setItem('players', JSON.stringify(players.value));
  console.log('Navigation vers /game');
  await nextTick();
  router.replace('/game');
  setTimeout(() => {
    refreshPage();
  }, 100);
};

const editingIndex = ref(null);
const editInputs = ref([]);

const editPlayer = (index) => {
  editingIndex.value = index;
  nextTick(() => {
    editInputs.value[index]?.$el?.setFocus();
  });
};

const saveEdit = (index) => {
  editingIndex.value = null;
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

/* Background retro de la page */
.retro-background {
  background: url('/assets/background-home.png') no-repeat center center fixed !important;
  background-size: cover !important;
  background-position: center !important;
  background-attachment: fixed !important;
  min-height: 100vh !important;
  width: 100%;
  display: flex; /* Assure que le conteneur prend toute la place */
}



.retro-toolbar {
  background-color: #222; /* Fond sombre rétro */
  border-bottom: 5px solid #ff5733; /* Bordure colorée pour un effet rétro */
}

.retro-title {
  font-family: 'Press Start 2P', cursive;
  font-size: 24px;
  text-align: center;
  color: #ff5733; /* Couleur orange/rouge rétro */
  text-shadow: 2px 2px #000; /* Ombre pour ajouter un effet 3D rétro */
  letter-spacing: 2px; /* Espacement des lettres pour un effet plus marqué */
  text-transform: uppercase; /* Capitalisation pour plus de style */
  display: flex;
}

.container {
  text-align: center;
  font-family: 'Press Start 2P', cursive;
  color: #333;
  background-color: #f4f1de;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  margin: auto;
  display : flex,
}

.title {
  font-size: 18px;
  margin-bottom: 20px;
  text-shadow: 2px 2px #888;
}

.input-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.pixel-input {
  font-family: 'Press Start 2P', cursive;
  border: 3px solid #222;
  padding: 5px;
  background-color: white;
  width: 200px;
  text-align: center;
}

.pixel-button {
  font-family: 'Press Start 2P', cursive;
  border: 3px solid #222;
  padding: 10px;
  background: transparent;
  background-color: transparent;
  color: #fff;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
  box-shadow: 0 0 0 3px #222 inset;
}

/* Enlève le fond bleu sur les boutons */
.pixel-button:focus,
.pixel-button:active {
  outline: none;
  background-color: transparent;
  box-shadow: none;
}

.pixel-button:active {
  transform: scale(0.9);
}

.pixel-item {
  font-family: 'Press Start 2P', cursive;
  font-size: 14px;
  background-color: white;
  border: 2px solid #000;
  padding: 10px;
  margin-top: 5px;
}

.start-button {
  margin-top: 20px;
  background-color: #ff5733;
  color: white;
}

.empty-message {
  font-size: 12px;
  color: #666;
}

.fade-enter-active, .fade-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

/* Remove blue focus outline for buttons */
.pixel-button:focus {
  outline: none;
}

.pixel-button[disabled] {
  background-color: #ddd;
  color: #999;
  box-shadow: none;
  cursor: not-allowed;
}
.edit-input {
  font-size: 14px;
  padding: 5px;
  width: 100%;
  text-align: center;
}
</style>
