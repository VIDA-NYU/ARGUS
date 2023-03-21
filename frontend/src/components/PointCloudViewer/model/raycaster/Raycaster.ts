import * as THREE from 'three';
import { Scene, Vector3 } from 'three';
import { MousePosition } from '../../types/types';
import { PointCloud } from '../renderables/PointCloud';

export class Raycaster {

    private rayCaster!: THREE.Raycaster;
    private projectionRaycaster!: THREE.Raycaster;

    // Mouse pointer
    public pointer: THREE.Vector2 = new THREE.Vector2();
    public pointerEvent!: MouseEvent;

    constructor( public scene: Scene ){

        // initializing ray caster
        this.rayCaster = new THREE.Raycaster();
        this.rayCaster.params.Points.threshold = 0.01;

        this.projectionRaycaster = new THREE.Raycaster();
        this.projectionRaycaster.params.Points.threshold = 0.03;

    }

    public calculate_point_cloud_intersection(origin: THREE.Vector3, direction: THREE.Vector3, pointCloud: PointCloud ): THREE.Vector3[] {

        this.projectionRaycaster.set( origin, direction );

        let intersections: any [] = []
        do{
            intersections = this.projectionRaycaster.intersectObject(this.scene.getObjectByName(pointCloud.name))
            this.projectionRaycaster.params.Points.threshold += 0.005;
        } while( intersections.length === 0 );
        
        // turning back to original threshold
        this.projectionRaycaster.params.Points.threshold = 0.03;

        return intersections.map( intersection => intersection.point );

    }

    public get_mouse_intersected_point( camera: THREE.PerspectiveCamera, activeLayers: string[] ):  { mousePosition: MousePosition, layerName: string, intersect: any[] } {

        // update the picking ray with the camera and pointer position
        this.rayCaster.setFromCamera( this.pointer, camera );

        for( let layerIndex = 0; layerIndex < activeLayers.length; layerIndex++ ){

            const layerName: string = activeLayers[layerIndex];
            const sceneObject = this.scene.getObjectByName(layerName);

            if( !sceneObject || !sceneObject.visible ) continue;

            const intersects = sceneObject ? this.rayCaster.intersectObjects( [sceneObject], false ) : [];
            if( intersects.length > 0 && this.pointerEvent ){

                return {
                    mousePosition: {top: this.pointerEvent.offsetY, left: this.pointerEvent.offsetX},
                    layerName: layerName,
                    intersect: intersects
                }

            }                    
        };

        // returning positions
        return {mousePosition: {top: 0, left: 0}, layerName: null, intersect: []};
        
    }

    public on_pointer_move( event: MouseEvent, canvasContainer: HTMLElement ): void {

        // saving event pointer
        this.pointerEvent = event;
        
        // Ref: https://discourse.threejs.org/t/custom-canvas-size-with-orbitcontrols-and-raycaster/18742
        const rect = canvasContainer.getBoundingClientRect();
        this.pointer.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
        this.pointer.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

    }

    public set_scene_events( canvasContainer: HTMLElement ): void {
        canvasContainer.addEventListener('pointermove', (event) => { this.on_pointer_move( event, canvasContainer)} );
    }
    

}