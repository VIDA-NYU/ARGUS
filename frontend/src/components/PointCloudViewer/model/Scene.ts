import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Raycaster } from './Raycaster';

export class Scene {

    // container ref
    public container!: HTMLElement;
    public tooltipContainer!: HTMLElement;

    // scene elements
    public camera!: THREE.PerspectiveCamera;
    public scene!: THREE.Scene;
    public renderer!: THREE.WebGLRenderer;

    // controls
    public orbitControls!: OrbitControls;
    public rayCaster!: Raycaster;

    constructor(){}

    public init( containerRef: HTMLElement, tooltipContainerRef: HTMLElement, cameraPosition: number[], near: number = 0.1, far: number = 10  ): void {

        // saving container ref
        this.container = containerRef;
        const [containerWidth, containerHeight] = [this.container.offsetWidth, this.container.offsetHeight];

        // initializing camera
        this.initialize_camera( containerWidth, containerHeight, cameraPosition );

        // initializing scene
        this.initialize_scene();

        // initialize renderer
        this.initialize_renderer( containerWidth, containerHeight );
        
        // initializing controls
        this.initialize_orbit_controls();
        this.initialize_raycaster();

    }


    public clear_scene(): void {

        while (this.scene.children.length){
            this.scene.remove(this.scene.children[0]);
        }  
    }

    public render() {

        requestAnimationFrame( () => this.render() );
        
        // orbit controls
        this.orbitControls.update();

        // picking
        this.rayCaster.get_intersected_point( this.camera );
        
        // rendering
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

        this.rayCaster = new Raycaster( this.scene );
        this.rayCaster.set_scene_events( this.container );
        
    }

}
