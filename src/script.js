import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader()
const colorTexture = textureLoader.load('/models/Textures/FabricPattern1/FabricUpholsteryBrightAnglePattern001_COL_VAR1_3K.jpg')
const couchNormalTexture = textureLoader.load('/models/Textures/FabricPattern1/FabricUpholsteryBrightAnglePattern001_NRM_3K.jpg')
const couchDispTexture = textureLoader.load('/models/Textures/FabricPattern1/FabricUpholsteryBrightAnglePattern001_DISP_3K.jpg')


// Floor Texture
const floorColorTexture = textureLoader.load('/models/Textures/Floor/WoodFlooringMahoganyAfricanSanded001_COL_3K.jpg')
floorColorTexture.repeat.set(3, 3);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;
const floorAmbientOcclusionTexture = textureLoader.load('/models/Textures/Floor/WoodFlooringMahoganyAfricanSanded001_AO_3K.jpg')
const floorDisplacementTexture =  textureLoader.load('/models/Textures/Floor/WoodFlooringMahoganyAfricanSanded001_DISP_3K.jpg')
const floorNormalTexture = textureLoader.load('/models/Textures/Floor/WoodFlooringMahoganyAfricanSanded001_NRM_3K.jpg')

// Leather Texture
const leatherColorTexture = textureLoader.load('/models/Textures/Leather/FabricLeatherBuffaloRustic001_COL_VAR1_3K.jpg')
const leatherNormalTexture = textureLoader.load('/models/Textures/Leather/FabricLeatherBuffaloRustic001_NRM_3K.jpg')
const leatherGlossTexture = textureLoader.load('/models/Textures/Leather/FabricLeatherBuffaloRustic001_GLOSS_3K.jpg')
const leatherAOTexture = textureLoader.load('/models/Textures/Leather/FabricLeatherBuffaloRustic001_AO_3K.jpg')
const leatherBumpTexture = textureLoader.load('/models/Textures/Leather/FabricLeatherBuffaloRustic001_BUMP_3K.jpg')
const leatherDispTexture = textureLoader.load('/models/Textures/Leather/FabricLeatherBuffaloRustic001_DISP_3K.jpg')


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshStandardMaterial({
        map: floorColorTexture,
        aoMap: floorAmbientOcclusionTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.1,
        normalMap: floorNormalTexture,
        metalness: 0,
        roughness: 0.4
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
floor.position.set(0,-1,0)
scene.add(floor)


/**
 * Walls
 */
 const walls = new THREE.Mesh(
    new THREE.BoxGeometry(80, 70, 80),
    new THREE.MeshStandardMaterial({ color: 0xddebf0 })
  );
  walls.material.side = THREE.DoubleSide;
  walls.position.y = -2.1;
  scene.add(walls);


/**
 * Models
 */
// Couch
let couch = null

const objLoader = new OBJLoader();
const materialLoader = new MTLLoader();
materialLoader.load(
    // Load material and set to objLoader
    '/models/couch1/couch1.mtl',
    (matrialCreator) => {
        objLoader.setMaterials(
            matrialCreator
        )

        // TODO: add loading progress and error handling

        objLoader.load(
        '/models/couch1/couch1.obj',
        (obj) => {
            couch = obj
            obj.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material.map = colorTexture;
                    child.material.normalMap = couchNormalTexture;
                    child.material.displacementMap = couchDispTexture;
                    child.material.displacementScale = 0.05;
                }
            });
            obj.scale.set(7,7,7)
            obj.position.set(-7, -1, 0 )
            obj.rotation.y = Math.PI * 0.3
            scene.add(couch)
            console.log(couch)
        },
        (progress) => {
        console.log('progress')
        },
        (error) => {
            console.log(`error: ${error}`)
        }
        )
    }
)

// Chair
let chair = null
const gltfLoader = new GLTFLoader()
gltfLoader.load(
    '/models/new/chair1.gltf',
    (gltf) => {
        console.log('success')
        console.log(gltf)
        gltf.scene.scale.set(90,90,90)
        gltf.scene.position.set(5,2.5,-2)
        gltf.scene.rotation.x = - Math.PI * 0.5
        gltf.scene.rotation.z = -Math.PI * 0.1

        gltf.scene.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                console.log(child)
                child.material.map = leatherColorTexture;
                child.material.normalMap = leatherNormalTexture;
                child.material.roughnessMap = leatherGlossTexture;
                child.material.aoMap = leatherAOTexture;
                // child.material.bumpMap = leatherBumpTexture;
                child.material.displacementMap = leatherDispTexture;
                child.material.displacementScale = 0.2;
                child.material.roughness = 0.6;
            }
        })

        scene.add(gltf.scene)
    },
    (progress) => {
        console.log('progress')
    },
    (error) => {
        console.log('error')
        console.log(error)
    }
)

/**
 * Coffee table
 */
 gltfLoader.load(
    '/models/coffeetable_5/coffeetable.gltf',
    (gltf) => {
        scene.add(gltf.scene)
        gltf.scene.scale.set(10,5.5,10)
        gltf.scene.position.set(0,-1,6)
        gltf.scene.rotation.y = Math.PI * 0.3
    }
 )


/**
 * Axes Helper
 */
 const axesHelper = new THREE.AxesHelper(2)
 scene.add(axesHelper)


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(0, 5, -5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(8, 6, 8)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()