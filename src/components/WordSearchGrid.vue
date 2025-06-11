<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

const props = defineProps<{
  words: string[]
}>()

const emit = defineEmits<{
  phaseComplete: []
}>()

// Estado do grid
const gridSize = 12
const grid = ref<string[][]>([])
const foundWords = ref<Set<string>>(new Set())
const selectedCells = ref<Set<string>>(new Set())
const isSelecting = ref(false)
const startCell = ref<{row: number, col: number} | null>(null)
const currentSelection = ref<{row: number, col: number}[]>([])

// Palavras encontradas
const wordsFound = computed(() => {
  return props.words.filter(word => foundWords.value.has(word))
})

const allWordsFound = computed(() => {
  return wordsFound.value.length === props.words.length
})

// Direções possíveis para colocar palavras
const directions = [
  [0, 1],   // horizontal direita
  [0, -1],  // horizontal esquerda
  [1, 0],   // vertical baixo
  [-1, 0],  // vertical cima
  [1, 1],   // diagonal baixo-direita
  [-1, -1], // diagonal cima-esquerda
  [1, -1],  // diagonal baixo-esquerda
  [-1, 1]   // diagonal cima-direita
]

// Gerar grid vazio
const generateEmptyGrid = () => {
  const newGrid = []
  for (let i = 0; i < gridSize; i++) {
    newGrid.push(new Array(gridSize).fill(''))
  }
  return newGrid
}

// Verificar se uma palavra pode ser colocada em uma posição
const canPlaceWord = (grid: string[][], word: string, row: number, col: number, direction: number[]) => {
  const [dRow, dCol] = direction
  
  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * dRow
    const newCol = col + i * dCol
    
    if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
      return false
    }
    
    if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) {
      return false
    }
  }
  
  return true
}

// Colocar palavra no grid
const placeWord = (grid: string[][], word: string, row: number, col: number, direction: number[]) => {
  const [dRow, dCol] = direction
  
  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * dRow
    const newCol = col + i * dCol
    grid[newRow][newCol] = word[i]
  }
}

// Preencher células vazias com letras aleatórias
const fillEmptyCells = (grid: string[][]) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = letters[Math.floor(Math.random() * letters.length)]
      }
    }
  }
}

// Gerar grid com palavras
const generateGrid = () => {
  let attempts = 0
  const maxAttempts = 100
  
  while (attempts < maxAttempts) {
    const newGrid = generateEmptyGrid()
    const shuffledWords = [...props.words].sort(() => Math.random() - 0.5)
    let placedWords = 0
    
    for (const word of shuffledWords) {
      let placed = false
      let wordAttempts = 0
      
      while (!placed && wordAttempts < 50) {
        const row = Math.floor(Math.random() * gridSize)
        const col = Math.floor(Math.random() * gridSize)
        const direction = directions[Math.floor(Math.random() * directions.length)]
        
        if (canPlaceWord(newGrid, word, row, col, direction)) {
          placeWord(newGrid, word, row, col, direction)
          placed = true
          placedWords++
        }
        
        wordAttempts++
      }
    }
    
    if (placedWords === props.words.length) {
      fillEmptyCells(newGrid)
      return newGrid
    }
    
    attempts++
  }
  
  // Fallback: grid simples se não conseguir gerar
  const fallbackGrid = generateEmptyGrid()
  fillEmptyCells(fallbackGrid)
  return fallbackGrid
}

// Obter células entre dois pontos
const getCellsBetween = (start: {row: number, col: number}, end: {row: number, col: number}) => {
  const cells: {row: number, col: number}[] = []
  
  const rowDiff = end.row - start.row
  const colDiff = end.col - start.col
  
  // Verificar se é uma linha válida (horizontal, vertical ou diagonal)
  if (rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff)) {
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff))
    const rowStep = steps === 0 ? 0 : rowDiff / steps
    const colStep = steps === 0 ? 0 : colDiff / steps
    
    for (let i = 0; i <= steps; i++) {
      cells.push({
        row: start.row + Math.round(i * rowStep),
        col: start.col + Math.round(i * colStep)
      })
    }
  }
  
  return cells
}

// Obter palavra das células selecionadas
const getWordFromCells = (cells: {row: number, col: number}[]) => {
  return cells.map(cell => grid.value[cell.row][cell.col]).join('')
}

// Verificar se uma palavra foi encontrada
const checkWord = (word: string) => {
  return props.words.includes(word) || props.words.includes(word.split('').reverse().join(''))
}

// Eventos de mouse/touch
const handleCellMouseDown = (row: number, col: number) => {
  isSelecting.value = true
  startCell.value = { row, col }
  currentSelection.value = [{ row, col }]
  //selectedCells.value.clear()
  selectedCells.value.add(`${row}-${col}`)
}

const handleCellMouseEnter = (row: number, col: number) => {
  if (isSelecting.value && startCell.value) {
    const cells = getCellsBetween(startCell.value, { row, col })
    currentSelection.value = cells
    //selectedCells.value.clear()
    cells.forEach(cell => selectedCells.value.add(`${cell.row}-${cell.col}`))
  }
}

const handleCellMouseUp = () => {
  if (isSelecting.value && currentSelection.value.length > 1) {
    const word = getWordFromCells(currentSelection.value)
    const reversedWord = word.split('').reverse().join('')
    
    if (checkWord(word)) {
      foundWords.value.add(props.words.find(w => w === word || w === reversedWord) || word)
      
      // Marcar células como encontradas
      currentSelection.value.forEach(cell => {
        selectedCells.value.add(`found-${cell.row}-${cell.col}`)
      })
      
      // Efeito visual
      createSparkleEffect()
    }
  }
  
  // Reset seleção
  isSelecting.value = false
  startCell.value = null
  currentSelection.value = []
  
  // Limpar seleção temporária
  setTimeout(() => {
    const tempSelected = new Set<string>()
    selectedCells.value.forEach(key => {
      if (key.startsWith('found-')) {
        tempSelected.add(key)
      }
    })
    selectedCells.value = tempSelected
  }, 100)
}

// Efeito visual de sparkle
const createSparkleEffect = () => {
  // Adicionar classe sparkle temporariamente
  nextTick(() => {
    const gridElement = document.querySelector('.word-grid')
    if (gridElement) {
      gridElement.classList.add('sparkle')
      setTimeout(() => {
        gridElement.classList.remove('sparkle')
      }, 600)
    }
  })
}

// Verificar se o jogo foi completado
const checkGameComplete = () => {
  if (allWordsFound.value) {
    setTimeout(() => {
      emit('phaseComplete')
    }, 1000)
  }
}

// Verificar se uma célula está selecionada
const isCellSelected = (row: number, col: number) => {
  return selectedCells.value.has(`${row}-${col}`)
}

// Verificar se uma célula foi encontrada
const isCellFound = (row: number, col: number) => {
  return selectedCells.value.has(`found-${row}-${col}`)
}

// Inicializar
onMounted(() => {
  grid.value = generateGrid()
  foundWords.value.clear()
  selectedCells.value.clear()
})

// Watch para verificar se o jogo foi completado
import { watch } from 'vue'
watch(allWordsFound, (newValue) => {
  if (newValue) {
    checkGameComplete()
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Lista de palavras -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-love-pink/30">
      <h3 class="font-romantic text-2xl text-love-dark mb-4 text-center">
        Encontre estas palavras especiais:
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
        <div 
          v-for="word in words" 
          :key="word"
          class="word-item text-center py-2 px-3 rounded-lg font-elegant text-sm transition-all duration-300"
          :class="foundWords.has(word) ? 'found bg-green-100 text-green-700' : 'bg-love-pink/20 text-love-dark'"
        >
          {{ word }}
        </div>
      </div>
      
      <!-- Progresso -->
      <div class="mt-4 text-center">
        <div class="text-love-dark font-romantic text-lg">
          {{ wordsFound.length }} de {{ words.length }} palavras encontradas
        </div>
        <div class="w-full bg-love-pink/30 rounded-full h-3 mt-2">
          <div 
            class="bg-gradient-to-r from-love-red to-love-pink h-3 rounded-full transition-all duration-500"
            :style="{ width: `${(wordsFound.length / words.length) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Grid do caça-palavras -->
    <div class="flex justify-center">
      <div 
        class="word-grid bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-love-pink/30"
        @mouseup="handleCellMouseUp"
        @mouseleave="handleCellMouseUp"
      >
        <div class="grid gap-1" :style="{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }">
          <template v-for="(row, rowIndex) in grid" :key="rowIndex">
            <div
              v-for="(cell, colIndex) in row"
              :key="`${rowIndex}-${colIndex}`"
              class="grid-cell w-8 h-8 md:w-10 md:h-10 bg-love-white border border-love-pink/50 rounded-lg flex items-center justify-center font-bold text-love-dark cursor-pointer select-none"
              :class="{
                'selected': isCellSelected(rowIndex, colIndex),
                'found': isCellFound(rowIndex, colIndex)
              }"
              @mousedown="handleCellMouseDown(rowIndex, colIndex)"
              @mouseenter="handleCellMouseEnter(rowIndex, colIndex)"
            >
              {{ cell }}
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Mensagem de encorajamento -->
    <div v-if="!allWordsFound" class="text-center">
      <p class="font-romantic text-xl text-love-dark">
        💕 Arraste o mouse sobre as letras para formar as palavras! 💕
      </p>
    </div>
  </div>
</template>