// apparently importing sets faceapi as a property of the window object
import * as _ from '/deps/face-api.js/dist/face-api.js'
const faceapi = window.faceapi

const MODELS_URL = './models'

async function main() {
    await faceapi.loadSsdMobilenetv1Model(MODELS_URL)
    await faceapi.loadFaceLandmarkModel(MODELS_URL)
    await faceapi.loadFaceRecognitionModel(MODELS_URL)
    await faceapi.loadFaceExpressionModel(MODELS_URL)

    const canvasForFaceFeatures = document.getElementById('face-feature-canvas')

    const ctx = canvasForFaceFeatures.getContext('2d')

    canvasForFaceFeatures.addEventListener('click', () => {
        imgTagForDisplayingUserPhoto.style.opacity === '1'
            ? (imgTagForDisplayingUserPhoto.style.opacity = 0)
            : (imgTagForDisplayingUserPhoto.style.opacity = 1)
        console.log(imgTagForDisplayingUserPhoto.style.opacity)
    })

    const imgTagForDisplayingUserPhoto =
        document.getElementById('display-user-photo')

    imgTagForDisplayingUserPhoto.onload = function () {
        const imgDimensions = {
            width: this.width,
            height: this.height,
        }
        // Give the browser time to resize the image before we grab its
        // height and width
        setTimeout(() => {
            canvasForFaceFeatures.setAttribute('width', this.width)
            canvasForFaceFeatures.setAttribute('height', this.height)
        }, 0)

        const canvasDimensions = {
            width: canvasForFaceFeatures.width,
            height: canvasForFaceFeatures.height,
        }
        this.style.display = ''
    }

    const imgTagForDisplayingUserSketch = document.getElementById(
        'display-user-sketch'
    )
    imgTagForDisplayingUserSketch.onload = function () {
        const imgDimensions = {
            width: this.width,
            height: this.height,
        }
   
        const canvasDimensions = {
            width: canvasForFaceFeatures.width,
            height: canvasForFaceFeatures.height,
        }
        this.style.display = ''
    }

    // imgTagForDisplayingUserSketch.addEventListener('drag', function (e) {
    //     console.log(e)
    //     this.style.top = e.offsetY + 'px'
    //     console.log(this.style.top)
    //     this.style.left = e.offsetX + 'px'
    // })

    let isDragging = false
    let startX, startY

    imgTagForDisplayingUserSketch.addEventListener('mousedown', function (e) {
        isDragging = true
        startX = e.clientX - this.offsetLeft
        startY = e.clientY - this.offsetTop
    })

    document.addEventListener('mouseup', function () {
        isDragging = false
    })

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            imgTagForDisplayingUserSketch.style.left = e.clientX - startX + 'px'
            imgTagForDisplayingUserSketch.style.top = e.clientY - startY + 'px'
        }
    })

    document
        .getElementById('user-photo-input')
        .addEventListener('change', async function () {
            const userPhoto = this.files[0]

            imgTagForDisplayingUserPhoto.src = URL.createObjectURL(userPhoto)

            let fullFaceDescriptions = await faceapi
                .detectAllFaces(imgTagForDisplayingUserPhoto)
                .withFaceLandmarks()
                .withFaceDescriptors()
                .withFaceExpressions()

            fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions, {
                width: canvasForFaceFeatures.width,
                height: canvasForFaceFeatures.height,
            })
            // faceapi.draw.drawDetections(canvasForFaceFeatures, fullFaceDescriptions)
            faceapi.draw.drawFaceLandmarks(
                canvasForFaceFeatures,
                fullFaceDescriptions
            )
            faceapi.draw.drawFaceExpressions(
                canvasForFaceFeatures,
                fullFaceDescriptions,
                0.51
            )
        })

    document
        .getElementById('user-sketch-input')
        .addEventListener('change', async function () {
            const userSketch = this.files[0]

            imgTagForDisplayingUserSketch.src = URL.createObjectURL(userSketch)
        })

        document.getElementById('sketch-scale-input').addEventListener('input', function (e) {
            console.log(e.target.value)
            imgTagForDisplayingUserSketch.style.width = `${2 * e.target.value}%`
        })

        
        document.getElementById('photo-scale-input').addEventListener('input', function (e) {
            console.log(e.target.value)
            imgTagForDisplayingUserPhoto.style.width = `${2 * e.target.value}%`
            setTimeout(() => {
                canvasForFaceFeatures.setAttribute('width', imgTagForDisplayingUserPhoto.width)
                canvasForFaceFeatures.setAttribute('height', imgTagForDisplayingUserPhoto.height)
            }, 0)
        })
}

main()
