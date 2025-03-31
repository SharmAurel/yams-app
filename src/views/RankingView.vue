<template> 
  <ion-page>
    <ion-header>
      <ion-toolbar class="retro-toolbar">
        <ion-title class="retro-title">Classement</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding retro-background">
      <ion-grid class="ranking-grid">
        <ion-row class="header-row">
          <ion-col class="header-cell">Position</ion-col>
          <ion-col class="header-cell">Joueur</ion-col>
          <ion-col class="header-cell">Score Total</ion-col>
        </ion-row>
        
        <ion-row v-for="(player, index) in sortedPlayers" :key="index" class="ranking-row">
          <ion-col class="ranking-cell">{{ index + 1 }}</ion-col>
          <ion-col class="ranking-cell">{{ player.name }}</ion-col>
          <ion-col class="ranking-cell">{{ player.totalScore }}</ion-col>
        </ion-row>
      </ion-grid>

      <div class="button-container">
        <ion-button expand="full" @click="replayGame" class="retro-button">Rejouer</ion-button>
        <ion-button expand="full" color="danger" @click="startNewGame" class="retro-button">Nouvelle Partie</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonAlert, IonButton, IonModal } from '@ionic/vue';


const players = ref(JSON.parse(localStorage.getItem('players')) || []);
const scores = ref(JSON.parse(localStorage.getItem('scores')) || []);
const router = useRouter();

const calculateTotal = (playerIndex) => {
  const totalScore = scores.value[playerIndex].flat().reduce((acc, val) => acc + (val || 0), 0);
  return totalScore + (calculateBonus(playerIndex) === 35 ? 35 : 0);
};

const calculateBonus = (playerIndex) => {
  const upperSectionTotal = [0, 1, 2, 3, 4, 5]
    .map(i => scores.value[playerIndex][i] || 0)
    .reduce((acc, val) => acc + val, 0);

  return upperSectionTotal >= 63 ? 35 : 0;
};

const sortedPlayers = computed(() => {
  return players.value
    .map((player, index) => ({
      name: player,
      totalScore: calculateTotal(index)
    }))
    .sort((a, b) => b.totalScore - a.totalScore);
});

const replayGame = () => {
  router.push('/game'); 
};

const startNewGame = () => {
  localStorage.removeItem('scores');
  router.push('/home');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.retro-toolbar {
  background-color: #dba3ca;
  border-bottom: 5px solid #ff5733;
}

.retro-title {
  font-family: 'Press Start 2P', cursive;
  font-size: 18px;
  color: #ff5733;
  text-align: center;
  text-shadow: 2px 2px #c191b0;
  letter-spacing: 2px;
}

.retro-background {
  background-color: hsla(300, 79%, 81%, 0.632); /* Fond pastel */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ranking-grid {
  width: 100%;
  max-width: 400px;
  border: 3px solid #444;
  background-color: #fff;
  padding: 10px;
  box-shadow: 5px 5px 0px #888;
}

.header-row {
  background-color: #fbfbfb;
  color: #ff5733;
}

.header-cell {
  font-family: 'Press Start 2P', cursive;
  text-align: center;
  padding: 8px;
  font-size: 12px;
  border-bottom: 2px solid #444;
}

.ranking-row:nth-child(odd) {
  background-color: #eee;
}

.ranking-cell {
  text-align: center;
  padding: 10px;
  font-size: 14px;
  font-family: 'Press Start 2P', cursive;
}

.button-container {
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
}

.retro-button {
  font-family: 'Press Start 2P', cursive;
  font-size: 14px;
  border-radius: 10px;
  box-shadow: 3px 3px 0px #444;
}

</style>
