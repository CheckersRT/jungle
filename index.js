import * as THREE from "three"
import { RGBELoader } from 'three/examples/jsm/Addons.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'



const width = window.innerWidth, height = window.innerHeight;
const canvas = document.querySelector("canvas.webgl")

export default class Sketch {
    constructor(options) {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 10 );
        this.camera.position.z = 4;

        this.controls = new OrbitControls(this.camera, options.canvas)
        this.controls.enableDamping = true

        this.rgbeLoader = new RGBELoader()
        this.rgbeLoader.load("static/2k.hdr", (environmentMap) => {
            environmentMap.mapping = THREE.EquirectangularReflectionMapping
            this.scene.background = environmentMap
            this.scene.environment = environmentMap
        })

        this.textureLoader = new THREE.TextureLoader()
        this.matcapTexture = this.textureLoader.load("/static/cloud.jpg")
        this.matcapTexture.colorSpace = THREE.SRGBColorSpace

        this.matcapTexture.minFilter = THREE.NearestFilter
        this.matcapTexture.magFilter = THREE.NearestFilter

        this.renderer = new THREE.WebGLRenderer( {canvas: options.canvas } );
        this.renderer.setSize( width, height );
        this.renderer.setAnimationLoop(this.animate.bind(this));

        this.geometry = new THREE.SphereGeometry( 1, 16, 16 );
        this.material = new THREE.MeshMatcapMaterial();
        this.material.matcap = this.matcapTexture

        this.mesh = new THREE.Mesh( this.geometry, this.material );

        this.scene.add( this.mesh );


    }

    animate(time) {
        this.mesh.rotation.x = time / 2000;
        this.mesh.rotation.y = time / 1000;
    
        this.renderer.render( this.scene, this.camera );
    }

}

new Sketch({canvas})

