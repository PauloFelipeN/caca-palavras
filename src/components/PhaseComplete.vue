<script setup lang="ts">
const props = defineProps<{
  phase: number
  message: string
  isFinalPhase: boolean
}>()

const emit = defineEmits<{
  nextPhase: []
  goHome: []
}>()

const nextPhase = () => {
  emit('nextPhase')
}

const goHome = () => {
  emit('goHome')
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-3xl p-8 max-w-2xl mx-auto text-center shadow-2xl border-4 border-love-pink/50 animate-pulse-slow">
      <!-- Celebração -->
      <div class="text-6xl mb-6 animate-bounce-slow">
        <span v-if="!isFinalPhase">🎉✨💖✨🎉</span>
        <span v-else>🎊💕👑💕🎊</span>
      </div>
      
      <!-- Título -->
      <h2 class="font-romantic text-4xl md:text-5xl text-love-dark mb-4">
        <span v-if="!isFinalPhase">Fase {{ phase }} Completa!</span>
        <span v-else>Jogo Completo!</span>
      </h2>
      
      <!-- Mensagem personalizada -->
      <div class="bg-love-pink/20 rounded-2xl p-6 mb-6 border-2 border-love-pink/30">
        <p class="font-elegant text-lg md:text-xl text-love-dark leading-relaxed">
          {{ message }}
        </p>
      </div>
      
      <!-- Mensagem especial para o final -->
      <div v-if="isFinalPhase" class="mb-6">
        <div class="text-4xl mb-4 animate-float">💑</div>
        <p class="font-romantic text-2xl text-love-red mb-2">
          Parabéns, casal!
        </p>
        <p class="font-elegant text-lg text-love-dark">
          Vocês completaram toda a jornada da história de amor de vocês. 
          Que esta seja apenas uma pequena parte de uma vida inteira de aventuras juntos!
        </p>
      </div>
      
      <!-- Botões -->
      <div class="space-y-4">
        <button 
          v-if="!isFinalPhase"
          @click="nextPhase"
          class="bg-gradient-to-r from-love-red to-love-pink text-white font-romantic text-2xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-white/50"
        >
          💖 Próxima Fase 💖
        </button>
        
        <button 
          @click="goHome"
          class="bg-gradient-to-r from-love-purple to-love-dark text-white font-romantic text-xl px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-white/50"
        >
          <span v-if="isFinalPhase">🏠 Voltar ao Início 🏠</span>
          <span v-else>🏠 Menu Principal 🏠</span>
        </button>
      </div>
      
      <!-- Decoração final -->
      <div v-if="isFinalPhase" class="mt-8 text-3xl space-x-2">
        <span class="inline-block animate-float">💕</span>
        <span class="inline-block animate-float" style="animation-delay: -0.3s">💖</span>
        <span class="inline-block animate-float" style="animation-delay: -0.6s">💝</span>
        <span class="inline-block animate-float" style="animation-delay: -0.9s">💗</span>
        <span class="inline-block animate-float" style="animation-delay: -1.2s">💓</span>
      </div>
    </div>
  </div>
</template>