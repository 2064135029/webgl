<template>
    <div>
        <van-nav-bar
                title="三维物体展示"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
        />
        <div id="container"></div>
    </div>
</template>

<script>
    import * as THREE from 'three'
    import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
    import {DDSLoader} from 'three/examples/jsm/loaders/DDSLoader.js';
    import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';
    import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
    // import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader';
    export default {
        name: "model",
        data () {
            return {
                camera: null,
                scene: null,
                renderer: null,
                windowHalfX: 500,
                windowHalfY: 600,
                mouseX: 40,
                mouseY: 50,
                obj: null,
                delta: 1,
                timer: null,
            };
        },
        created: function () {

        },
        destroyed: function () {
            cancelAnimationFrame(this.timer)
        },
        methods: {
            onClickLeft: function () {
                this.$router.go(-1);
            },
            init: function () {
                var container = document.getElementById('container');
                // document.body.appendChild(container);
                this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 8000);
                this.camera.position.z = 250;

                // scene
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color(0xa0a0a0);
                var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
                this.scene.add(ambientLight);
                var pointLight = new THREE.PointLight(0xffffff, 0.8);
                this.camera.add(pointLight);
                this.scene.add(this.camera);
                // model
                var onProgress = function (xhr) {
                    if (xhr.lengthComputable) {
                        var percentComplete = xhr.loaded / xhr.total * 100;
                        console.log(Math.round(percentComplete, 2) + '% downloaded');
                    }
                };
                var onError = function () {
                };
                THREE.Loader.Handlers.add(/\.dds$/i, new DDSLoader());
                new MTLLoader()
                // .setPath('/static/models/girl/')
                    .load('/static/models/male02/male02.mtl', (materials) => {
                        materials.preload();
                        new OBJLoader()
                            .setMaterials(materials)
                            // .setPath('/static/models/girl/')
                            .load('/static/models/male02/male02.obj', (object) => {
                                object.position.y = -95;
                                // console.log(object);
                                this.obj = object;
                                this.scene.add(this.obj);
                            }, onProgress, onError);
                    });
                //
                this.renderer = new THREE.WebGLRenderer();
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                container.appendChild(this.renderer.domElement);
                window.addEventListener('mousemove', this.onDocumentMouseMove, false);
                //
                window.addEventListener('resize', this.onWindowResize, false);
                // CONTROLS
                this.cameraControls = new OrbitControls(this.camera, this.renderer.domElement);
                this.cameraControls.addEventListener('change', this.render);
            },
            onDocumentMouseMove: function (event) {
                this.mouseX = (event.clientX - this.windowHalfX) / 2;
                this.mouseY = (event.clientY - this.windowHalfY) / 2;
            },
            onWindowResize: function () {
                this.windowHalfX = window.innerWidth / 2;
                this.windowHalfY = window.innerHeight / 2;
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                // var canvasWidth = window.innerWidth;
                // var canvasHeight = window.innerHeight;
                // this.renderer.setSize(canvasWidth, canvasHeight);
                // this.camera.aspect = canvasWidth / canvasHeight;
                // this.camera.updateProjectionMatrix();
                this.render()
            },
            animate: function () {
                this.timer = requestAnimationFrame(this.animate);
                if (this.obj){
                    this.obj.rotation.y += 0.05; // += 1
                }
                this.render();
                console.log('ddddd');
            },
            render: function () {
                this.camera.lookAt(this.scene.position);
                this.renderer.render(this.scene, this.camera);
            }
        },
        mounted: function () {
            this.init()
            this.animate()
        }
    }
</script>

<style scoped>

</style>
