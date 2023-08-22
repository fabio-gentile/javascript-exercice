const alice = document.querySelector('.player.alice .text')
const bob = document.querySelector('.player.bob .text')
const cells = document.querySelectorAll('.game .box')
const winCountAlice = document.querySelector('#aliceScore')
const winCountBob = document.querySelector('#bobScore')
let currentPlayer = 'A'
let stop = false
const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
]
let currentGame = ['','','','','','','','','']

const click = (index) => {
    if (currentGame[index] !== '' || stop) {
        return
    }
    currentGame[index] = currentPlayer
    cells[index].textContent = currentGame[index]
    verif()
    switchPlayer()
}

cells.forEach((e, i) => e.addEventListener('click', () => click(i)))

const switchPlayer = () => {
    let lastPlayer = currentPlayer
    lastPlayer = lastPlayer === 'B' ? bob : alice
    lastPlayer.classList.remove('actual-turn')

    currentPlayer = currentPlayer === 'B' ? 'A' : 'B'
    if (currentPlayer === 'B') bob.classList.add('actual-turn')
    if (currentPlayer === 'A') alice.classList.add('actual-turn')
}

const verif = () => {
    for (let i = 0; i < winCombinations.length; i++) {
        const combinations = winCombinations[i]
        let a = currentGame[combinations[0]]
        let b = currentGame[combinations[1]]
        let c = currentGame[combinations[2]]
        // if (a !== '') console.log('a ', a)
        // if (b !== '') console.log('b ', b)
        // if (c !== '') console.log('c ', c)

        if (!(a === '' || b === '' || c === '')) {
            if (a === b && b === c) {
                stop = true
                setTimeout(restart, 2000)
                winCount(currentPlayer)
            }
        }

        if (!currentGame.includes('')) {
            stop = true
            setTimeout(restart, 2000)
        }
    }
}

const restart = () => {
    currentPlayer = currentPlayer === 'B' ? 'A' : 'B'
    switchPlayer()
    cells.forEach(e => e.textContent = '')
    currentGame = ['','','','','','','','','']
    stop = false
}

const winCount = (currentPlayer) => {
    if (currentPlayer === 'B') winCountBob.textContent = parseInt(winCountBob.textContent) + 1
    if (currentPlayer === 'A') winCountAlice.textContent = parseInt(winCountAlice.textContent) + 1
}