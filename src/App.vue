<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HomePage from './components/HomePage.vue'
import GameBoard from './components/GameBoard.vue'
import FloatingHearts from './components/FloatingHearts.vue'

const currentView = ref<'home' | 'game'>('home')

const startGame = () => {
  currentView.value = 'game'
}

const goHome = () => {
  currentView.value = 'home'
}

onMounted(() => {
  // Verificar se há progresso salvo
  const savedProgress = localStorage.getItem('palavras-do-amor-progress')
  if (savedProgress) {
    const progress = JSON.parse(savedProgress)
    if (progress.currentPhase > 1) {
      // Se há progresso, ir direto para o jogo
      currentView.value = 'game'
    }
  }
})
</script>

<template>
  <div class="min-h-screen relative overflow-hidden">
    <FloatingHearts />
    
    <div class="relative z-10">
      <HomePage v-if="currentView === 'home'" @start-game="startGame" />
      <GameBoard v-else @go-home="goHome" />
    </div>
  </div>
</template>