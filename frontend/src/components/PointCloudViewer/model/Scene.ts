import * as THREE from 'three';
import { Object3D } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EventsManager } from '../../../tabs/HistoricalDataView/services/EventsManager';
import TimestampManager from '../../../tabs/HistoricalDataView/services/TimestampManager';
import { CameraParams, MousePosition } from '../types/types';
import { Dataset } from './Dataset';

import { Raycaster } from './raycaster/Raycaster';
import { SceneHighlight } from './SceneHighlight';
import { SceneManager } from './SceneManager';
import { Tooltip } from './Tooltip';

export class Scene {

    // container ref
    public container!: HTMLElement;

    // scene elements
    public camera!: THREE.PerspectiveCamera;
    public scene!: THREE.Scene;
    public renderer!: THREE.WebGLRenderer;

    // controls
    public orbitControls!: OrbitControls;
    public rayCaster!: Raycaster;
    public tooltip!: Tooltip;
    public sceneHighlight!: SceneHighlight; 
    
    public dataset!: Dataset;
    public sceneManager!: SceneManager;

    // TODO: remove it from here
    public lastSelectedTimestamp: number = 0;

    constructor(){}

    public init( containerRef: HTMLElement, tooltipContainerRef: HTMLElement, cameraParams: CameraParams, dataset: Dataset  ): void {

        // saving container ref
        this.container = containerRef;
        const [containerWidth, containerHeight] = [this.container.offsetWidth, this.container.offsetHeight];

        // saving dataset
        this.dataset = dataset;

        // initializing camera
        this.initialize_camera( containerWidth, containerHeight, cameraParams.position );

        // initializing scene
        this.initialize_scene();

        // initialize renderer
        this.initialize_renderer( containerWidth, containerHeight );
        
        // initializing controls
        this.initialize_orbit_controls();
        this.initialize_raycaster();
        this.initialize_scene_highlight();

        // creating scene manager
        this.initialize_scene_manager();

        // creating tooltip
        this.initialize_tooltip( tooltipContainerRef );

    }

    public render() {

        requestAnimationFrame( () => this.render() );

        // orbit controls
        this.orbitControls.update();

        // picking
        const intersection: { mousePosition: MousePosition, layerName: string, intersect: any[] } = this.rayCaster.get_mouse_intersected_point( this.camera, this.dataset.get_interactive_point_cloud_names() );
        
        if( intersection.intersect.length > 0 ){

            // highlighting selected point cloud
            const timestamp: number = this.sceneHighlight.on_point_cloud_highlight( intersection.layerName, intersection.intersect );

            if( timestamp === -1 ) return;

            // updating tooltip
            this.tooltip.position_tooltip(intersection.mousePosition.top, intersection.mousePosition.left);
            this.tooltip.set_video_timestamp(TimestampManager.get_elapsed_time(timestamp));

            // firing event
            EventsManager.emit('onTimestampSelected',  {timestamp} );

        } else {

            this.sceneHighlight.on_point_cloud_offlight();
            this.tooltip.position_tooltip(0,0);
        }

        // rendering
        this.renderer.render( this.scene, this.camera );

    }

    public clear_scene(): void {

        while (this.scene.children.length){
            this.scene.remove(this.scene.children[0]);
        }  
    }

    // *********************** PRIVATE METHODS *********************** //

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

    private initialize_tooltip( tooltipContainer: HTMLElement ): void {

        this.tooltip = new Tooltip( tooltipContainer )
    
    }

    private initialize_scene_manager(): void {

        this.sceneManager = new SceneManager( this.scene );
    
    }

    private initialize_raycaster() {

        this.rayCaster = new Raycaster( this.scene );
        this.rayCaster.set_scene_events( this.container );
        
    }

    private initialize_scene_highlight(): void {

        this.sceneHighlight = new SceneHighlight( this.rayCaster, this.dataset );
        const highlightObjects: Object3D[] = this.sceneHighlight.get_layer_highlights();

        highlightObjects.forEach( (object: Object3D) => {
            this.scene.add( object );
        });

    }
}
