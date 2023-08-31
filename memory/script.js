const container = document.querySelector('.game')
const box = container.querySelectorAll('.box')
const timer = document.querySelector('.stats .timer')
const tries = document.querySelector('.container .stats .try p')
const restartButton = document.querySelector('.stats .restart')
const card = document.querySelectorAll('.card')

// randomize the boxes order
const shuffleArray = (array) => {
  let i = array.length
  let tmp, j

  while (i !== 0) {
    j = Math.floor(Math.random() * i)
    i--

    tmp = array[i]
    array[i] = array[j]
    array[j] = tmp
  }
  return array
}
const shuffledBox = shuffleArray(Array.from(box))
shuffledBox.forEach((box) => {
  container.appendChild(box)
})

// verify cards
let correct = 0
const verifyCard = () => {
  const showed = document.querySelectorAll('.card.show:not(.correct)')
  if (showed[0].getAttribute('delta-num') === showed[1].getAttribute('delta-num')) {
    showed.forEach((e) => {
      e.classList.add('correct')
      // console.log("correct")
    })
    correct++
    if (correct === box.length / 2) {
      // console.log("stop timer")
      stopTimer()
      setLocalStorage()
      // reset() // reset the game automatically
    }
  }
  showed.forEach((e) => {
    if (!e.classList.contains('correct')) e.classList.remove('show')
    // console.log("remove class show if correct")
  })
}

const showCard = (element) => {
  const child = element.querySelector('.card')
  child.classList.toggle('show')
}

const setTries = (tries) => {
  tries.textContent = triesCount
}

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
  stopTimer()
  triesCount = 0
  correct = 0
  i = 0
  seconds = 0
  minutes = 0
  tries.textContent = 0
  timer.textContent = '0:00'
  timerStarted = false
  card.forEach((e) => {
    e.classList.remove('correct')
    e.classList.remove('show')
  })
  const shuffledBox = shuffleArray(Array.from(box))

  shuffledBox.forEach((box) => {
    container.appendChild(box)
  })
}
restartButton.addEventListener('click', () => {
  reset()
})

let i = 0
let triesCount = 0
let timerStarted = false
let timeout = false // prevent the player from clicking before the timeout is over
box.forEach((e) => {
  e.addEventListener('click', () => {
    if (!timerStarted) {
      // start the timer here
      timerStarted = true
      setTimer()
    }
    const childCard = e.querySelector('.card')
    if (!(childCard.classList.contains('show') || childCard.classList.contains('correct'))) {
      if (!(i === 2)) {
        i++
        showCard(e)
      }
      if (i === 2 && !timeout) {
        timeout = true
        setTimeout(() => {
          verifyCard()
          triesCount++
          i = 0
          timeout = false
          setTries(tries)
        }, 500)
      }
    }
  })
})
