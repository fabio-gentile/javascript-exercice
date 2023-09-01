const container = document.querySelector('.container')
const preview = document.querySelector('#image')
const inputImage = document.querySelector('#image-input')
const buttonDownload = document.querySelector('#image-download')

let initialImageWidth, initialImageHeight, originalFormat, fileName
let angle = 0

const previewFile = () => {
  const file = inputImage.files[0]

  if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
    const reader = new FileReader()

    reader.addEventListener(
      'load',
      () => {
        const image = new Image()

        image.src = reader.result

        image.addEventListener('load', () => {
          fileName = file.name
          initialImageWidth = image.width
          initialImageHeight = image.height
          container.style.width = `${initialImageWidth}px`
          container.style.height = `${initialImageHeight}px`
          container.style.transform = 'rotate(0deg)'
          document.querySelector('.tool').style.display = 'flex'
          angle = 0
          preview.src = reader.result

          const fileTypeMatch = file.type.match(/image\/(jpeg|png|jpg)/i)
          if (fileTypeMatch) {
            originalFormat = `image/${fileTypeMatch[1]}`
            // console.log('originalFormat ', originalFormat)
          }
        })
      },
      false,
    )

    if (file) {
      reader.readAsDataURL(file)
    }
  }
}

const downloadImage = () => {
  const image = document.querySelector('#image')
  const scaledImageWidth = (initialImageWidth * container.offsetWidth) / initialImageWidth
  const scaledImageHeight = (initialImageHeight * container.offsetHeight) / initialImageHeight

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = container.offsetWidth
  canvas.height = container.offsetHeight

  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((angle * Math.PI) / 180)
  ctx.drawImage(image, -scaledImageWidth / 2, -scaledImageHeight / 2, scaledImageWidth, scaledImageHeight)

  const modifiedImageDataUrl = canvas.toDataURL(originalFormat)
  localStorage.setItem('image', modifiedImageDataUrl)

  const downloadLink = document.createElement('a')
  downloadLink.classList = 'download-image-link'
  downloadLink.href = modifiedImageDataUrl
  downloadLink.download = fileName
  downloadLink.addEventListener('click', (event) => {
    event.stopPropagation()
  })

  buttonDownload.appendChild(downloadLink)
  downloadLink.click()

  canvas.remove()
}

const onMouseDrag = (e) => {
  const containerStyle = getComputedStyle(container)
  const leftValue = parseInt(containerStyle.left)
  const topValue = parseInt(containerStyle.top)
  container.style.left = `${leftValue + e.movementX}px`
  container.style.top = `${topValue + e.movementY}px`
}

const sizeChange = (factor) => {
  const currentWidth = container.offsetWidth
  const currentHeight = container.offsetHeight
  const newWidth = currentWidth * factor
  const newHeight = currentHeight * factor
  container.style.width = `${newWidth}px`
  container.style.height = `${newHeight}px`
}

const rotateChange = (angleChange) => {
  angle += angleChange
  container.style.transform = `rotate(${angle}deg)`
}

inputImage.addEventListener('change', () => {
  previewFile()
  preview.style.display = 'block'
  container.style.display = 'flex'
  container.style.position = 'absolute'
  const input = document.querySelector('.input')
  input.style.position = 'absolute'
  input.style.left = '50%'
  input.style.bottom = '3%'
  input.style.transform = 'translateX(-50%)'
  buttonDownload.style.display = 'flex'
})

// random effect
function randomNumber(min, max) {
  return Math.random() * (max - min) + min
}
const buttonRandomize = document.querySelector('.tool .randomize')
buttonRandomize.addEventListener('click', () => {
  container.style.width = `${initialImageWidth}px`
  container.style.height = `${initialImageHeight}px`
  container.style.rotate = '0deg'
  const randomAngle = Math.round(randomNumber(0, 360))
  const randomSize = Math.round(randomNumber(0.5, 1.5) * 10) / 10
  sizeChange(randomSize)
  rotateChange(randomAngle)
})
container.addEventListener('mousedown', () => {
  container.addEventListener('mousemove', onMouseDrag)
})

document.addEventListener('mouseup', () => {
  container.removeEventListener('mousemove', onMouseDrag)
})

buttonDownload.addEventListener('click', downloadImage)
document.querySelector('.tool .size .plus').addEventListener('click', () => sizeChange(1.1))
document.querySelector('.tool .size .minus').addEventListener('click', () => sizeChange(0.9))
document.querySelector('.tool .rotate .plus').addEventListener('click', () => rotateChange(30))
document.querySelector('.tool .rotate .minus').addEventListener('click', () => rotateChange(-30))
