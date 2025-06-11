<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const hearts = ref<Array<{
  id: number
  left: string
  animationDelay: string
  size: string
}>>([])

let heartId = 0

const createHeart = () => {
  const heart = {
    id: heartId++,
    left: Math.random() * 100 + '%',
    animationDelay: Math.random() * 3 + 's',
    size: (Math.random() * 1.5 + 0.8) + 'rem'
  }
  
  hearts.value.push(heart)
  
  // Remove o coração após a animação
  setTimeout(() => {
    const index = hearts.value.findIndex(h => h.id === heart.id)
    if (index > -1) {
      hearts.value.splice(index, 1)
    }
  }, 6000)
}

let interval: number

onMounted(() => {
  // Criar corações iniciais
  for (let i = 0; i < 8; i++) {
    setTimeout(createHeart, i * 500)
  }
  
  // Continuar criando corações
  interval = setInterval(createHeart, 2000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>

<template>
  <div class="fixed inset-0 pointer-events-none overflow-hidden">
    <div
      v-for="heart in hearts"
      :key="heart.id"
      class="heart-float absolute"
      :style="{
        left: heart.left,
        bottom: '-2rem',
        fontSize: heart.size,
        animationDelay: heart.animationDelay,
        animation: `float-up 6s linear forwards`
      }"
    >
      {{ ['💕', '💖', '💝', '💗', '💓', '💘'][Math.floor(Math.random() * 6)] }}
    </div>
  </div>
</template>

<style scoped>
@keyframes float-up {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

.heart-float {
  animation: float-up 6s linear forwards;
}
</style>