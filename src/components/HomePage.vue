<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{
  startGame: []
}>()

const showContinue = ref(false)

onMounted(() => {
  const savedProgress = localStorage.getItem('palavras-do-amor-progress')
  if (savedProgress) {
    const progress = JSON.parse(savedProgress)
    showContinue.value = progress.currentPhase > 1
  }
})

const startNewGame = () => {
  localStorage.removeItem('palavras-do-amor-progress')
  emit('startGame')
}

const continueGame = () => {
  emit('startGame')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="text-center max-w-2xl mx-auto">
      <!-- Título Principal -->
      <div class="mb-8 animate-pulse-slow">
        <h1 class="font-romantic text-6xl md:text-8xl text-love-dark mb-4 drop-shadow-lg">
          Palavras do Amor
        </h1>
        <p class="font-elegant text-2xl md:text-3xl text-love-red mb-2">
          Nossa História em Letras
        </p>
        <div class="flex justify-center items-center space-x-2 text-love-pink text-xl">
          <span>💕</span>
          <span class="font-romantic">Feito pelo Paulo com muito amor</span>
          <span>💕</span>
        </div>
      </div>

      <!-- Descrição -->
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-2xl border border-love-pink/30">
        <p class="font-elegant text-lg text-love-dark mb-4 leading-relaxed">
          Embarque nesta jornada através de 4 fases especiais, cada uma contando 
          um capítulo da nossa história. Encontre as palavras escondidas que revelam 
          os momentos mais preciosos do nosso relacionamento.
        </p>
        
        <div class="grid md:grid-cols-2 gap-4 text-sm text-love-dark/80">
          <div class="flex items-center space-x-2">
            <span class="text-love-red">💝</span>
            <span>4 fases românticas</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-love-red">🔍</span>
            <span>Caça-palavras desafiador</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-love-red">📱</span>
            <span>Funciona no celular</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-love-red">💾</span>
            <span>Progresso salvo automaticamente</span>
          </div>
        </div>
      </div>

      <!-- Botões -->
      <div class="space-y-4">
        <button 
          @click="startNewGame"
          class="bg-gradient-to-r from-love-red to-love-pink text-white font-romantic text-2xl px-12 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-white/50"
        >
          ✨ Começar Nova Jornada ✨
        </button>
        
        <button 
          v-if="showContinue"
          @click="continueGame"
          class="block bg-gradient-to-r from-love-purple to-love-dark text-white font-romantic text-xl px-10 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-white/50 mx-auto"
        >
          💖 Continuar História 💖
        </button>
      </div>

      <!-- Decoração -->
      <div class="mt-12 text-4xl space-x-4 animate-bounce-slow">
        <span class="inline-block animate-float">💕</span>
        <span class="inline-block animate-float" style="animation-delay: -0.5s">💖</span>
        <span class="inline-block animate-float" style="animation-delay: -1s">💝</span>
        <span class="inline-block animate-float" style="animation-delay: -1.5s">💗</span>
      </div>
    </div>
  </div>
</template>