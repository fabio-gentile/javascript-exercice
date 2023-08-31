const url = 'https://blockchain.info/ticker'

async function fetchCurrency(url) {
   const response = await fetch(url, {
      method: 'GET',
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
      },
   })
   if (response.ok) return response.json()
   throw new Error('Impossible de se connecter au serveur')
}

const moneyList = document.querySelectorAll('.moneyList')

fetchCurrency(url).then((data) => {
   const currencies = data
   const currencyCodes = Object.keys(currencies)

   moneyList.forEach((e) => {
      const select = e.querySelector('select')
      currencyCodes.forEach((code) => {
         const option = document.createElement('option')
         option.textContent = code
         option.setAttribute('data-code', code)
         select.appendChild(option)
      })
   })

   const convert = () => {
      const startMoney = document.querySelector('#moneyStart')
      const finalMoney = document.querySelector('#moneyEnd')
      const original = document.querySelectorAll('#initial option')
      const final = document.querySelectorAll('#final option')
      let currencyOriginal, currencyFinal

      original.forEach((e) => {
         if (e.selected) {
            currencyOriginal = e.getAttribute('data-code')
         }
      })

      final.forEach((e) => {
         if (e.selected) {
            currencyFinal = e.getAttribute('data-code')
         }
      })
      const money = startMoney.value
      if (money > 0) {
         finalMoney.value =
            Math.round(((money * currencies[currencyFinal].buy) / currencies[currencyOriginal].buy) * 100) / 100
      }
   }

   const input = document.querySelector('.moneyInput')

   let decimalCount = 0
   input.addEventListener('input', (e) => {
      // prevent the user from writing more than 2 decimals
      const inputValue = e.currentTarget.value
      const decimalIndex = inputValue.indexOf('.')

      if (decimalIndex !== -1) {
         decimalCount = inputValue.length - decimalIndex - 1
      } else {
         decimalCount = 0
      }

      if (decimalCount > 2) {
         e.currentTarget.value = parseFloat(inputValue).toFixed(2)
      }
      convert()
   })
   input.addEventListener('change', (e) => {
      // if user remove number set it to 1
      if (e.currentTarget.value.length === 0) e.currentTarget.value = 1
   })
   moneyList.forEach((e) => e.addEventListener('change', convert))
   convert()
})
