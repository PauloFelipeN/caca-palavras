<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import WordSearchGrid from './WordSearchGrid.vue'
import PhaseComplete from './PhaseComplete.vue'

const emit = defineEmits<{
  goHome: []
}>()

// Estado do jogo
const currentPhase = ref(1)
const showPhaseComplete = ref(false)
const gameComplete = ref(false)

// Dados das fases
const phases = [
  {
    title: "Algumas coisas sobre nós",
    subtitle: "O início de tudo 💕",
    words: ['TINDER', 'DEZEMBRO', 'ANOS', 'AMOR', 'PRIMEIRAVEZ', 'ENCONTROS', 'MEXICANO', 'TACOS', 'BURRITOS', 'CERVEJA'],
    message: "Foi assim que tudo começou... Um match que mudou nossas vidas para sempre! 💖"
  },
  {
    title: "Sobre ela",
    subtitle: "A mulher incrível que você é 🌹",
    words: ['PSICOLOGA', 'CAIPIRINHA', 'CAFE', 'MAE', 'BENTO', 'BORDERCOLLIE', 'EMOCIONAL', 'CARINHO', 'DOCURA', 'CORACAO'],
    message: "Cada palavra aqui representa a pessoa maravilhosa que você é. Obrigado por ser você! 💝"
  },
  {
    title: "Sobre ele",
    subtitle: "O homem que se apaixonou por você 💙",
    words: ['PROGRAMADOR', 'AGOSTO', 'ANIVERSARIO', 'CODIGO', 'COMPANHEIRO', 'NAMORADO', 'ABRACO', 'PRESENTE', 'FELICIDADE', 'CONEXAO'],
    message: "Estas palavras contam sobre quem eu sou e como você me faz feliz todos os dias! 🥰"
  },
  {
    title: "Nosso relacionamento",
    subtitle: "O que construímos juntos 💞",
    words: ['NAMORO', 'CUMPLICIDADE', 'ALMAGEMEA', 'SURPRESA', 'BEIJO', 'PAIXAO', 'PARCERIA', 'SAUDADE', 'CAMINHADA', 'COMPROMISSO'],
    message: "Esta é nossa história de amor... E este é apenas o começo! Para sempre e sempre! 💕✨"
  }
]

const currentPhaseData = computed(() => phases[currentPhase.value - 1])

// Carregar progresso salvo
onMounted(() => {
  const savedProgress = localStorage.getItem('palavras-do-amor-progress')
  if (savedProgress) {
    const progress = JSON.parse(savedProgress)
    currentPhase.value = progress.currentPhase || 1
    if (progress.gameComplete) {
      gameComplete.value = true
    }
  }
})

// Salvar progresso
const saveProgress = () => {
  const progress = {
    currentPhase: currentPhase.value,
    gameComplete: gameComplete.value,
    timestamp: new Date().toISOString()
  }
  localStorage.setItem('palavras-do-amor-progress', JSON.stringify(progress))
}

// Quando uma fase é completada
const onPhaseComplete = () => {
  showPhaseComplete.value = true
  
  if (currentPhase.value === 4) {
    gameComplete.value = true
  }
  
  saveProgress()
}

// Próxima fase
const nextPhase = () => {
  showPhaseComplete.value = false
  
  if (currentPhase.value < 4) {
    currentPhase.value++
    saveProgress()
  }
}

// Voltar ao início
const goHome = () => {
  emit('goHome')
}

// Watch para salvar progresso quando a fase muda
watch(currentPhase, saveProgress)
</script>

<template>
  <div class="min-h-screen p-4">
    <!-- Header -->
    <div class="max-w-6xl mx-auto mb-6">
      <div class="flex justify-between items-center mb-4">
        <button 
          @click="goHome"
          class="bg-white/80 backdrop-blur-sm text-love-dark px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-romantic text-lg"
        >
          🏠 Início
        </button>
        
        <div class="text-center">
          <h2 class="font-romantic text-3xl md:text-4xl text-love-dark mb-1">
            Fase {{ currentPhase }} de 4
          </h2>
          <div class="flex space-x-2">
            <div 
              v-for="i in 4" 
              :key="i"
              class="w-3 h-3 rounded-full transition-all duration-300"
              :class="i <= currentPhase ? 'bg-love-red' : 'bg-white/50'"
            ></div>
          </div>
        </div>
        
        <div class="w-20"></div> <!-- Spacer para centralizar -->
      </div>
      
      <!-- Título da Fase -->
      <div class="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-love-pink/30">
        <h1 class="font-romantic text-4xl md:text-5xl text-love-dark mb-2">
          {{ currentPhaseData.title }}
        </h1>
        <p class="font-elegant text-xl text-love-red">
          {{ currentPhaseData.subtitle }}
        </p>
      </div>
    </div>

    <!-- Jogo -->
    <div class="max-w-6xl mx-auto">
      <WordSearchGrid 
        :words="currentPhaseData.words"
        :key="currentPhase"
        @phase-complete="onPhaseComplete"
      />
    </div>

    <!-- Modal de Fase Completa -->
    <PhaseComplete 
      v-if="showPhaseComplete"
      :phase="currentPhase"
      :message="currentPhaseData.message"
      :is-final-phase="currentPhase === 4"
      @next-phase="nextPhase"
      @go-home="goHome"
    />
  </div>
</template>