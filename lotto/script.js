document.querySelector('.form-euromillion').addEventListener('submit', (e) => e.preventDefault())

function randomNumber(min, max) {
    return Math.random() * (max - min) + min
}

const poolSharing = [
    {number: 5, star: 2, share: 50, chance: 139838160},
    {number: 5, star: 1, share: 2.61, chance: 62261460},
    {number: 5, star: 0, share: 0.61, chance: 3394620},
    {number: 4, star: 2, share: 0.19, chance: 2118760},
    {number: 4, star: 1, share: 0.35, chance: 46860},
    {number: 4, star: 0, share: 1.30, chance: 20720},
    {number: 3, star: 2, share: 0.37, chance: 10360},
    {number: 3, star: 1, share: 1.45, chance: 1280},
    {number: 3, star: 0, share: 2.70, chance: 320},
    {number: 2, star: 1, share: 10.30, chance: 49},
    {number: 2, star: 0, share: 16.59, chance: 50},
    {number: 1, star: 2, share: 0, chance: 18},
    {number: 1, star: 1, share: 0, chance: 9},
    {number: 1, star: 0, share: 0, chance: 4},
    {number: 0, star: 2, share: 0, chance: 7},
    {number: 0, star: 1, share: 0, chance: 4},
    {number: 0, star: 0, share: 0, chance: 3}
]

const numberBlock = document.querySelector('.form-euromillion .number')
for (let i = 1; i < 51; i++) {
    const div = document.createElement('div')
    div.className = 'cell'
    div.innerHTML = i
    numberBlock.appendChild(div)
}

const starBlock = document.querySelector('.form-euromillion .star')
for (let i = 1; i < 13; i++) {
    const div = document.createElement('div')
    div.className = 'cell'
    div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <p>${i}</p>`
    starBlock.appendChild(div)
}

// select number
const number = document.querySelectorAll('.form-euromillion .number .cell')
let numberSelected = 0
number.forEach(e => {
    e.addEventListener('click', () => {
        if (e.classList.contains('active')) {
            e.classList.remove('active')
            numberSelected--
        } else if (numberSelected < 5) {
            e.classList.add('active')
            numberSelected++;
        }
    })
})

// select star
const star = document.querySelectorAll('.form-euromillion .star .cell')
let starSelected = 0
star.forEach(e => {
    e.addEventListener('click', () => {
        if (e.classList.contains('active')) {
            e.classList.remove('active')
            starSelected--
        } else if (starSelected < 2) {
            e.classList.add('active')
            starSelected++;
        }
    })
})

// actual bet
let lastMultiplier = 0
function getMultiplier() {
    const betValue = document.querySelector('.stats .user-bet-value .bet-value')
    const betMultiplier = document.querySelectorAll('.stats .user-bet-value .multiplier')
    betMultiplier[lastMultiplier].classList.add('active')
    let multiplierValue = 1
    betMultiplier.forEach((e, i) => {
        e.addEventListener('click', () => {
            betMultiplier[lastMultiplier].classList.remove('active')
            lastMultiplier = i
            e.classList.add('active')
            multiplierValue = parseInt(e.getAttribute('data-multiplier'))
            betValue.textContent = 2.5 * multiplierValue + '€'
        })
    })
    return multiplierValue
}
getMultiplier()

const setBalance = (n) => {
    const newBalance = getBalance() + n
    const balanceValue = document.querySelector('.stats .balance .balance-value')
    balanceValue.textContent = newBalance.toFixed(2)
    balanceValue.textContent < 0 ? balanceValue.style.color = 'red' : balanceValue.style.color = 'black'
}

function getBalance() {
    return parseFloat(document.querySelector('.stats .balance .balance-value').textContent)
}

let stop = false
const restart = () => {
    number.forEach(e => {
        if (e.classList.contains('active')) {
            e.classList.remove('active')
        }
    })
    star.forEach(e => {
        if (e.classList.contains('active')) {
            e.classList.remove('active')
        }
    })
    numberSelected = 0
    starSelected = 0
    totalPlayers = Math.round(randomNumber(10000000, 30000000))
    pool = totalPlayers * Math.round(randomNumber(2, 4))
    document.querySelector('#total-player').textContent = totalPlayers.toLocaleString('fr-FR')
    document.querySelector('#total-pool').textContent = pool.toLocaleString('fr-FR')
    stop = false
}

let totalPlayers = Math.round(randomNumber(15000000, 30000000))
let pool = totalPlayers * Math.round(randomNumber(2, 4))
document.querySelector('#total-player').textContent = totalPlayers.toLocaleString('fr-FR')
document.querySelector('#total-pool').textContent = pool.toLocaleString('fr-FR')

const formSubmit = document.querySelector('#form-submit')
formSubmit.addEventListener('click', (balance) => {
    if (numberSelected !== 5 || starSelected !== 2 || stop) return

    // user bet
    let userNumber = []
    number.forEach(e => {
        if (e.classList.contains('active')) {
            userNumber.push(parseInt(e.textContent))
        }
    })

    let userStar = []
    star.forEach(e => {
        if (e.classList.contains('active')) {
            userStar.push(parseInt(e.textContent))
        }
    })

    // computer bet
    let computerNumber = []
    do {
        const randTmp = Math.round(randomNumber(1, 50))
        if (!computerNumber.includes(randTmp)) {
            computerNumber.push(randTmp)
        }
    }
    while (computerNumber.length < 5)

    let computerStar = []
    do {
        const randTmp = Math.round(randomNumber(1, 12))
        if (!computerStar.includes(randTmp)) {
            computerStar.push(randTmp)
        }
    }
    while (computerStar.length < 2)

    // verify similar number
    let numberSimilar = 0
    for (let i = 0; i < userNumber.length; i++) {
        for (let j = 0; j < computerNumber.length; j++) {
            if (userNumber[i] === computerNumber[j]) {
                numberSimilar++
            }
        }
    }

    let starSimilar = 0
    for (let i = 0; i < userStar.length; i++) {
        for (let j = 0; j < computerStar.length; j++) {
            if (userStar[i] === computerStar[j]) {
                starSimilar++
            }
        }
    }

    // format the bet
    const userBetFormat = document.querySelector('.stats .user-bet #user-bet')
    const userNumberFormat = userNumber.join(' - ')
    const userStarFormat = userStar.join(' - ')
    userBetFormat.textContent = `${userNumberFormat} | ${userStarFormat}`
    localStorage.setItem('userBet', userBetFormat.textContent)

    const computerBetFormat = document.querySelector('.stats .computer-bet #computer-bet')
    const computerNumberFormat = computerNumber.join(' - ')
    const computerStarFormat = computerStar.join(' - ')
    computerBetFormat.textContent = `${computerNumberFormat} | ${computerStarFormat}`
    localStorage.setItem('computerBet', computerBetFormat.textContent)


    const lastWinValue = document.querySelector('.stats .last-win .last-win-value')
    const actualCombination = poolSharing.find(e => e.number === numberSimilar && e.star === starSimilar)
    if (!actualCombination) {
        return
    }

    if (actualCombination.share === 0) {
        const resultBet = -2.5 * getMultiplier()
        setBalance(resultBet)
        lastWinValue.textContent = resultBet.toFixed(2)
        localStorage.setItem('lastWin', resultBet.toFixed(2))
    } else {
        // calculating % of win per player based on these numbers https://www.loterie-nationale.be/content/dam/opp/draw-games/euromillions/brand-assets/documents/fr/draw-eum-reglement-fevrier-2023-fr.pdf
        let numberOfPlayers = Math.floor(pool / actualCombination.chance)
        let poolShareCombination = pool * (actualCombination.share / 100)
        const winPerCombination = poolShareCombination / numberOfPlayers
        const resultBet = (2.5 + (getMultiplier() * parseFloat(winPerCombination))).toFixed(2)
        setBalance(+resultBet)
        lastWinValue.textContent = resultBet
        localStorage.setItem('lastWin', resultBet)
    }
    localStorage.setItem('balance', getBalance())
    const lastWin = document.querySelector('.stats .last-win')
    if (lastWin.style.display === 'none') lastWin.style.display = 'block'
    stop = true
    setTimeout(restart, 2000)
})

const addBalance = () => {
    setBalance(+100)
    localStorage.setItem('balance', getBalance())
}

const buttonAddBalance = document.querySelector('.balance .balance-reset')
buttonAddBalance.addEventListener('click', addBalance)

window.addEventListener('load', () => {
    if (localStorage.getItem('balance')) {
        document.querySelector('.stats .balance .balance-value').textContent = localStorage.getItem('balance')
    } else {
        document.querySelector('.stats .balance .balance-value').textContent = 100
    }

    const userBetFormat = document.querySelector('.stats .user-bet #user-bet')
    const computerBetFormat = document.querySelector('.stats .computer-bet #computer-bet')
    if (localStorage.getItem('computerBet')) {
        computerBetFormat.textContent = localStorage.getItem('computerBet')
    }

    if (localStorage.getItem('userBet')) {
        userBetFormat.textContent = localStorage.getItem('userBet')
    }

    if (localStorage.getItem('lastWin')) {
        const lastWin = document.querySelector('.stats .last-win')
        lastWin.style.display = 'block'

        const lastWinValue = document.querySelector('.stats .last-win .last-win-value')
        lastWinValue.textContent = localStorage.getItem('lastWin')
    }
})