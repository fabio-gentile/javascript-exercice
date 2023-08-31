const game = document.querySelector('.game')
let pieces = document.querySelectorAll('.game .piece')
const timer = document.querySelector('.stats .time p')
const restartButton = document.querySelectorAll('button')
const piecesArray = Array.from(document.querySelectorAll('.game .piece:not(.empty)'))
const winMessage = document.querySelector('.win')

// shuffle function
const shuffleArray = (array) => {
  const lastChild = document.querySelector('.piece.empty')
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  while (game.firstChild) {
    game.removeChild(game.firstChild)
  }
  piecesArray.forEach((e) => {
    game.appendChild(e)
  })
  game.appendChild(lastChild)
  pieces = document.querySelectorAll('.game .piece')
  pieces.forEach((e, i) => {
    e.style.order = i
  })
}
shuffleArray(piecesArray)

// empty case position
const getEmptyCase = () => {
  let i = 0
  pieces.forEach((e) => {
    if (e.classList.contains('empty')) {
      i = parseInt(e.style.order)
    }
  })
  return i
}

// restart
restartButton.forEach((e, i) => {
  e.addEventListener('click', () => {
    if (i === 1) {
      winMessage.classList.remove('active')
    }
    reset()
  })
})

// verify win
const verifyWin = () => {
  let success = 0
  pieces.forEach((e, i) => {
    // console.log(e.getAttribute('delta-num'))
    if (parseInt(e.getAttribute('delta-num')) === parseInt(e.style.order) + 1) {
      success++
    }
    if (success === pieces.length) {
      // console.log("victoire")
      stopTimer()
      setLocalStorage()
      winMessage.classList.add('active')
    }
  })
}

// timer
let seconds = 0
let minutes = 0
let timerInterval = null
const setTimer = () => {
  timerInterval = setInterval(() => {
    seconds++
    if (seconds === 60) {
      seconds = 0
      minutes++
    }
    timer.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }, 1000)
}

const stopTimer = () => {
  clearInterval(timerInterval)
}

// local storage
const setLocalStorage = () => {
  const time = parseFloat(minutes * 60 + seconds)
  const tmp = JSON.parse(localStorage.getItem('temps'))
  if (time < tmp || tmp === null) {
    localStorage.setItem('temps', time)
  }
}

// reset
const reset = () => {
  location.reload()
}
const empty = document.querySelector('.piece.empty')
let timerStarted = false
pieces.forEach((piece) => {
  piece.addEventListener('click', () => {
    if (!timerStarted) {
      // start the timer here
      timerStarted = true
      setTimer()
    }
    const emptyCase = getEmptyCase()
    let bool = false
    // console.log("empty case " + emptyCase)
    // console.log("piece " + piece.style.order)
    if (parseInt(piece.style.order) === emptyCase - 1) {
      bool = true
    }
    if (parseInt(piece.style.order) === emptyCase + 1) {
      bool = true
    }
    if (parseInt(piece.style.order) === emptyCase - 4) {
      bool = true
    }
    if (parseInt(piece.style.order) === emptyCase + 4) {
      bool = true
    }

    if (bool) {
      const tmp = piece.style.order
      piece.style.order = empty.style.order
      empty.style.order = tmp
      verifyWin()
    }
  })
})
