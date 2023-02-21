import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper';
import { VoxelCube } from '../types/types';

export class Scene {

    // container ref
    public container!: HTMLElement;

    // scene elements
    public camera!: THREE.PerspectiveCamera;
    public scene!: THREE.Scene;
    public renderer!: THREE.WebGLRenderer;

    // controls
    public  orbitControls!: OrbitControls;
    public rayCaster!: THREE.Raycaster;

    // sphere test
    // TODO: remove it from here
    public sphere!: THREE.Mesh;
    public pointer: THREE.Vector2 = new THREE.Vector2();

    constructor(){}

    public init( containerRef: HTMLElement, cameraPosition: number[], near: number = 0.1, far: number = 10  ): void {

        // saving container ref
        this.container = containerRef;
        const [containerWidth, containerHeight] = [this.container.offsetWidth, this.container.offsetHeight];

        // initializing camera
        this.initialize_camera( containerWidth, containerHeight, cameraPosition );

        // initializing scene
        this.initialize_scene();

        // initialize renderer
        this.initialize_renderer( containerWidth, containerHeight );
        
        // setting scene events
        this.set_scene_events();

        // initializing controls
        this.initialize_orbit_controls();
        this.initialize_raycaster();


        // testing
        const sphereGeometry = new THREE.SphereGeometry( 0.025, 15, 15 );
        const sphereMaterial = new THREE.MeshBasicMaterial( { color: 'blue' } );
        this.sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );

        this.scene.add( this.sphere );


    }

    public on_pointer_move( event ): void {

        // Ref: https://discourse.threejs.org/t/custom-canvas-size-with-orbitcontrols-and-raycaster/18742

        const rect = this.renderer.domElement.getBoundingClientRect();
        this.pointer.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
        this.pointer.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
    }


    public set_scene_events(): void {

        this.container.addEventListener('pointermove', (event) => this.on_pointer_move(event) )

    }

    public clear_scene(): void {

        while (this.scene.children.length){
            this.scene.remove(this.scene.children[0]);
        }  
    }

    public render() {

        requestAnimationFrame( () => this.render() );
        
        this.orbitControls.update();

        // update the picking ray with the camera and pointer position
        this.rayCaster.setFromCamera( this.pointer, this.camera );

        if( this.scene.getObjectByName('gazepointcloud') ){

            const intersects = this.rayCaster.intersectObjects( [this.scene.getObjectByName('gazepointcloud')], false );
            if(intersects.length > 0){
                this.sphere.position.copy(intersects[0].point);
                this.sphere.scale.set(1,1,1);
                // intersects[0].object.scale.set( 10,10,10 );
            } else {
                this.sphere.scale.set(0,0,0);
            }
        }

        
        this.renderer.render( this.scene, this.camera );

    }

    private initialize_orbit_controls(): void {

        const controls: OrbitControls = new OrbitControls( this.camera, this.renderer.domElement );
        this.orbitControls = controls;

    }

    private initialize_scene(): void {

        const scene: THREE.Scene = new THREE.Scene();
        scene.background = new THREE.Color( 'white' );
        scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

        // saving scene ref
        this.scene = scene;

    }

    private initialize_camera( width: number, height: number, position: number[], near: number = 0.1, far: number = 100 ): void {

        // calculating camera params
        const aspectRatio: number = width/height;
        
        const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera( 75, aspectRatio, near, far );
        
        // camera position grows towards outside the screen
        camera.position.set( position[0], position[1], position[2] );

        // saving ref
        this.camera = camera;

    }

    private initialize_renderer( width: number, height: number ): void {

        const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( width, height );

        // appending renderer
        this.container.appendChild( renderer.domElement );

        // saving ref
        this.renderer = renderer;

    }

    public add_point_cloud( name: string, positions: number[], colors: number[] = [], normals: number[] = []  ): THREE.Points {

        // loading positions
        const pointgeometry = new THREE.BufferGeometry();
        pointgeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );

        if(colors.length > 0) pointgeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        
        // pointgeometry.name = name;
        pointgeometry.computeBoundingSphere();

        // defining material
        let pointmaterial: THREE.PointsMaterial = new THREE.PointsMaterial( { size: 0.025, color: 'red' } );;
        if(colors.length > 0) pointmaterial = new THREE.PointsMaterial( { size: 0.025, vertexColors: true } );
        const points = new THREE.Points( pointgeometry, pointmaterial );

        // adding to scene
        points.name = name
        this.scene.add( points );

        // returning points
        return points;

    }

    private initialize_raycaster() {
        this.rayCaster = new THREE.Raycaster();
        this.rayCaster.params.Points.threshold = 0.01;
    }

}
