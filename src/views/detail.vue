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
    import * as Three from 'three'
    import {GUI} from 'three/examples/jsm/libs/dat.gui.module.js';
    import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
    import {ColladaExporter} from 'three/examples/jsm/exporters/ColladaExporter.js';
    import {TeapotBufferGeometry} from 'three/examples/jsm/geometries/TeapotBufferGeometry.js';

    export default {
        name: 'HelloWorld',
        props: {
            msg: String
        },
        data () {
            return {
                s1: 0,
                s2: 0,
                activeNames: ['1'],
                show: false,
                camera: null,
                scene: null,
                renderer: null,
                mesh: null,
                cameraControls: null,
                effectController: {
                    shininess: 40.0,
                    ka: 0.17,
                    kd: 0.51,
                    ks: 0.2,
                    metallic: true,
                    hue: 0.121,
                    saturation: 0.73,
                    lightness: 0.66,
                    lhue: 0.04,
                    lsaturation: 0.01,	// non-zero so that fractions will be shown
                    llightness: 1.0,
                    // bizarrely, if you initialize these with negative numbers, the sliders
                    // will not show any decimal places.
                    lx: 0.32,
                    ly: 0.39,
                    lz: 0.7,
                    newTess: 15,
                    bottom: true,
                    lid: true,
                    body: true,
                    fitLid: false,
                    nonblinn: false,
                    newShading: "glossy"
                },
                teapotSize: 400,
                ambientLight: null,
                light: new Three.DirectionalLight(0xFFFFFF, 1.0),
                tess: -1,	// force initialization
                bBottom: null,
                bLid: null,
                bBody: null,
                bFitLid: null,
                bNonBlinn: null,
                shading: null,
                wireMaterial: null,
                flatMaterial: null,
                gouraudMaterial: null,
                phongMaterial: null,
                texturedMaterial: null,
                reflectiveMaterial: null,
                teapot: null,
                textureCube: null,
                // allocate these just once
                diffuseColor: new Three.Color(),
                specularColor: new Three.Color(),
                exporter: null,
                teapotGeometry: null,
                gui: null,
            };
        },
        created: function () {
            this.$nextTick(function () {
                // this.setupGui();
                this.exporter = new ColladaExporter();
                // this.render();
            })
        },
        activated: function(){
            console.log('ppppppppppppppppp');
        },
        destroyed: function(){
            if (this.gui){
                this.gui.destroy()
            }
        },
        methods: {
            onClickLeft: function () {
                this.$router.go(-1);
            },
            init: function () {
                var container = document.getElementById('container');
                // body.appendChild(container);
                var canvasWidth = window.innerWidth;
                var canvasHeight = window.innerHeight;
                // CAMERA
                this.camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 80000);
                this.camera.position.set(-600, 550, 2500);
                // LIGHTS
                this.ambientLight = new Three.AmbientLight(0x333333);	// 0.2
                this.light = new Three.DirectionalLight(0xFFFFFF, 1.0);

                // direction is set in GUI
                // RENDERER
                this.renderer = new Three.WebGLRenderer({antialias: true});
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderer.setSize(canvasWidth, canvasHeight);
                this.renderer.gammaInput = true;
                this.renderer.gammaOutput = true;
                container.appendChild(this.renderer.domElement);
                // EVENTS
                window.addEventListener('resize', this.onWindowResize, false);
                // CONTROLS
                this.cameraControls = new OrbitControls(this.camera, this.renderer.domElement);
                this.cameraControls.addEventListener('change', this.render);
                // TEXTURE MAP
                var textureMap = new Three.TextureLoader().load(require('../assets/textures/uv_grid_opengl.jpg'));
                // console.log(require('../assets/textures/uv_grid_opengl.jpg'));
                textureMap.wrapS = textureMap.wrapT = Three.RepeatWrapping;
                textureMap.anisotropy = 16;
                // REFLECTION MAP
                // var path = '../assets/textures/cube/skybox/'; // "./assets/textures/cube/skybox/";
                var urls = [
                    require("../assets/textures/cube/skybox/px.jpg"),
                    require("../assets/textures/cube/skybox/nx.jpg"),
                    require("../assets/textures/cube/skybox/py.jpg"),
                    require("../assets/textures/cube/skybox/pz.jpg"),
                    require("../assets/textures/cube/skybox/ny.jpg"),
                    require("../assets/textures/cube/skybox/nz.jpg"),
                ];
                this.textureCube = new Three.CubeTextureLoader().load(urls);
                // MATERIALS
                var materialColor = new Three.Color();
                materialColor.setRGB(1.0, 1.0, 1.0);
                this.wireMaterial = new Three.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true});
                this.flatMaterial = new Three.MeshPhongMaterial({
                    color: materialColor,
                    specular: 0x000000,
                    flatShading: true,
                    side: Three.DoubleSide
                });
                this.gouraudMaterial = new Three.MeshLambertMaterial({color: materialColor, side: Three.DoubleSide});
                this.phongMaterial = new Three.MeshPhongMaterial({color: materialColor, side: Three.DoubleSide});
                this.texturedMaterial = new Three.MeshPhongMaterial({
                    color: materialColor,
                    map: textureMap,
                    side: Three.DoubleSide
                });
                this.reflectiveMaterial = new Three.MeshPhongMaterial({
                    color: materialColor,
                    envMap: this.textureCube,
                    side: Three.DoubleSide
                });
                // scene itself
                this.scene = new Three.Scene();
                this.scene.background = new Three.Color(0xAAAAAA);
                this.scene.add(this.ambientLight);
                this.scene.add(this.light);
                // GUI
                if (this.gui === null) {
                    this.setupGui();
                }


                // container.appendChild(this.renderer.domElement)
            },
            animate: function () {
                requestAnimationFrame(this.animate)
                // this.teapot.rotation.x += 0.01
                this.teapot.rotation.y += 0.02
                this.renderer.render(this.scene, this.camera)
                // this.render()
                console.log('dddd');
            },
            onWindowResize: function () {
                var canvasWidth = window.innerWidth;
                var canvasHeight = window.innerHeight;
                this.renderer.setSize(canvasWidth, canvasHeight);
                this.camera.aspect = canvasWidth / canvasHeight;
                this.camera.updateProjectionMatrix();
                this.render();
                // console.log(canvasWidth);
            },
            setupGui: function () {
                this.effectController = {
                    shininess: 40.0,
                    ka: 0.17,
                    kd: 0.51,
                    ks: 0.2,
                    metallic: true,
                    hue: 0.121,
                    saturation: 0.73,
                    lightness: 0.66,
                    lhue: 0.04,
                    lsaturation: 0.01,	// non-zero so that fractions will be shown
                    llightness: 1.0,
                    // bizarrely, if you initialize these with negative numbers, the sliders
                    // will not show any decimal places.
                    lx: 0.32,
                    ly: 0.39,
                    lz: 0.7,
                    newTess: 15,
                    bottom: true,
                    lid: true,
                    body: true,
                    fitLid: false,
                    nonblinn: false,
                    newShading: "glossy"
                };
                var h;
                let dd = document.getElementsByClassName('dg ac');
                dd.innerHTML = '';
                this.gui = new GUI();
                //  this.gui.__closeButton.innerHTML = '关闭'
                // console.log(this.gui);
                // material (attributes)
                // this.gui.addClass({marginTop: '50px'});
                h = this.gui.addFolder("材质");
                h.add(this.effectController, "shininess", 1.0, 400.0, 1.0).name("亮度").onChange(this.render);
                h.add(this.effectController, "kd", 0.0, 1.0, 0.025).name("散光").onChange(this.render);
                h.add(this.effectController, "ks", 0.0, 1.0, 0.025).name("反射").onChange(this.render);
                h.add(this.effectController, "metallic").name("是否镀金").onChange(this.render);
                // material (color)
                h = this.gui.addFolder("颜色");
                h.add(this.effectController, "hue", 0.0, 1.0, 0.025).name("色度").onChange(this.render);
                h.add(this.effectController, "saturation", 0.0, 1.0, 0.025).name("饱和度").onChange(this.render);
                h.add(this.effectController, "lightness", 0.0, 1.0, 0.025).name("尖锐").onChange(this.render);
                // light (point)
                h = this.gui.addFolder("亮度");
                h.add(this.effectController, "lhue", 0.0, 1.0, 0.025).name("色差").onChange(this.render);
                h.add(this.effectController, "lsaturation", 0.0, 1.0, 0.025).name("饱和度").onChange(this.render);
                h.add(this.effectController, "llightness", 0.0, 1.0, 0.025).name("尖锐").onChange(this.render);
                h.add(this.effectController, "ka", 0.0, 1.0, 0.025).name("光线").onChange(this.render);
                // light (directional)
                h = this.gui.addFolder("灯光");
                h.add(this.effectController, "lx", -1.0, 1.0, 0.025).name("x").onChange(this.render);
                h.add(this.effectController, "ly", -1.0, 1.0, 0.025).name("y").onChange(this.render);
                h.add(this.effectController, "lz", -1.0, 1.0, 0.025).name("z").onChange(this.render);
                h = this.gui.addFolder("布置");
                h.add(this.effectController, "newTess", [2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50]).name("圆弧").onChange(this.render);
                h.add(this.effectController, "lid").name("盖子").onChange(this.render);
                h.add(this.effectController, "body").name("壶体").onChange(this.render);
                h.add(this.effectController, "bottom").name("底座").onChange(this.render);
                h.add(this.effectController, "fitLid").name("贴边").onChange(this.render);
                h.add(this.effectController, "nonblinn").name("瘦身").onChange(this.render);
                // shading
                this.gui.add(this.effectController, "newShading", ["wireframe", "flat", "smooth", "glossy", "textured", "reflective"]).name("阴影").onChange(this.render);

                this.render();
            },

            //
            render: function () {
                if (this.effectController.newTess !== this.tess ||
                    this.effectController.bottom !== this.bBottom ||
                    this.effectController.lid !== this.bLid ||
                    this.effectController.body !== this.bBody ||
                    this.effectController.fitLid !== this.bFitLid ||
                    this.effectController.nonblinn !== this.bNonBlinn ||
                    this.effectController.newShading !== this.shading) {
                    this.tess = this.effectController.newTess;
                    this.bBottom = this.effectController.bottom;
                    this.bLid = this.effectController.lid;
                    this.bBody = this.effectController.body;
                    this.bFitLid = this.effectController.fitLid;
                    this.bNonBlinn = this.effectController.nonblinn;
                    this.shading = this.effectController.newShading;
                    this.createNewTeapot();
                }
                // console.log('kkkkkkk');
                // We're a bit lazy here. We could check to see if any material attributes changed and update
                // only if they have. But, these calls are cheap enough and this is just a demo.
                this.phongMaterial.shininess = this.effectController.shininess;
                this.texturedMaterial.shininess = this.effectController.shininess;
                this.diffuseColor.setHSL(this.effectController.hue, this.effectController.saturation, this.effectController.lightness);
                if (this.effectController.metallic) {
                    // make colors match to give a more metallic look
                    this.specularColor.copy(this.diffuseColor);
                } else {
                    // more of a plastic look
                    this.specularColor.setRGB(1, 1, 1);
                }
                this.diffuseColor.multiplyScalar(this.effectController.kd);
                this.flatMaterial.color.copy(this.diffuseColor);
                this.gouraudMaterial.color.copy(this.diffuseColor);
                this.phongMaterial.color.copy(this.diffuseColor);
                this.texturedMaterial.color.copy(this.diffuseColor);
                this.specularColor.multiplyScalar(this.effectController.ks);
                this.phongMaterial.specular.copy(this.specularColor);
                this.texturedMaterial.specular.copy(this.specularColor);
                // Ambient's actually controlled by the light for this demo
                this.ambientLight.color.setHSL(this.effectController.hue, this.effectController.saturation, this.effectController.lightness * this.effectController.ka);
                this.light.position.set(this.effectController.lx, this.effectController.ly, this.effectController.lz);
                this.light.color.setHSL(this.effectController.lhue, this.effectController.lsaturation, this.effectController.llightness);
                // skybox is rendered separately, so that it is always behind the teapot.
                if (this.shading === "reflective") {
                    this.scene.background = this.textureCube;
                } else {
                    this.scene.background = null;
                }
                this.renderer.render(this.scene, this.camera);
            },

            // Whenever the teapot changes, the this.scene is rebuilt from scratch (not much to it).
            createNewTeapot: function () {
                if (this.teapot !== null) {
                    this.teapot.geometry.dispose();
                    this.scene.remove(this.teapot);
                }
                this.teapotGeometry = new TeapotBufferGeometry(this.teapotSize,
                    this.tess,
                    this.effectController.bottom,
                    this.effectController.lid,
                    this.effectController.body,
                    this.effectController.fitLid,
                    !this.effectController.nonblinn);
                this.teapot = new Three.Mesh(
                    this.teapotGeometry,
                    this.shading === "wireframe" ? this.wireMaterial : (
                        this.shading === "flat" ? this.flatMaterial : (
                            this.shading === "smooth" ? this.gouraudMaterial : (
                                this.shading === "glossy" ? this.phongMaterial : (
                                    this.shading === "textured" ? this.texturedMaterial : this.reflectiveMaterial)))));	// if no match, pick Phong
                this.scene.add(this.teapot);
            },
            exportCollada: function () {
                var result = this.exporter.parse(this.teapot);
                var material_type = "Phong";
                if (this.shading === "wireframe") {
                    material_type = "Constant";
                }
                if (this.shading === "smooth") {
                    material_type = "Lambert";
                }
                this.saveString(result.data, 'teapot_' + this.shading + "_" + material_type + '.dae');
                result.textures.forEach(tex => {
                    this.saveArrayBuffer(tex.data, `${ tex.name }.${ tex.ext }`);
                });
            },

            save: function (blob, filename) {
                this.link.href = URL.createObjectURL(blob);
                this.link.download = filename;
                this.link.click();
            },

            saveString: function (text, filename) {
                this.save(new Blob([text], {type: 'text/plain'}), filename);
            },

            saveArrayBuffer: function (buffer, filename) {
                this.save(new Blob([buffer], {type: 'application/octet-stream'}), filename);
            }
        },
        mounted () {
            this.init()
            // this.setupGui();
            this.animate()
        }
    };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .dg.ac {
        position: fixed;
        top: 50px !important;
        left: 0;
        right: 0;
        height: 0;
        z-index: 0;
    }
</style>
