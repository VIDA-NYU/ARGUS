import * as THREE from 'three';
import { Scene, Vector3 } from 'three';
import { MousePosition } from '../../types/types';

export class Raycaster {

    private rayCaster!: THREE.Raycaster;
    private worldRaycaster!: THREE.Raycaster;

    // Mouse pointer
    public pointer: THREE.Vector2 = new THREE.Vector2();
    public pointerEvent!: MouseEvent;

    // ray intersection highlight
    public gazeIntersectSphere!: THREE.Mesh;
    public worldIntersectSphere!: THREE.Mesh;
    public gazeLine!: THREE.Line;

    public projectedGazeIntersectSphere!: THREE.Mesh;
    public projectedGazeOriginSphere!: THREE.Mesh;
    public projectedGazeLine!: THREE.Line;

    constructor( public scene: Scene ){

        // initializing ray caster
        this.rayCaster = new THREE.Raycaster();
        this.rayCaster.params.Points.threshold = 0.005;

        // initializing world ray caster
        this.worldRaycaster = new THREE.Raycaster();
        this.worldRaycaster.params.Points.threshold = 0.01;

        // creating highlight sphere
        const sphereGeometry = new THREE.SphereGeometry( 0.025, 15, 15 );
        const sphereMaterial = new THREE.MeshBasicMaterial( { color: 'blue' } );
        this.gazeIntersectSphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
        this.worldIntersectSphere = new THREE.Mesh( sphereGeometry, sphereMaterial );

        // creating gaze line        
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 5 });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints( [new THREE.Vector3( 0,0,0 ), new THREE.Vector3( 0,0,0 )] );
        this.gazeLine = new THREE.Line( lineGeometry, lineMaterial )
        

        // adding highlight to scene
        this.scene.add( this.gazeIntersectSphere );
        this.scene.add(this.worldIntersectSphere);
        this.scene.add( this.gazeLine ); 

    }

    public get_intersected_world_point( origin: Vector3, direction: Vector3, line: boolean = false ): THREE.Vector3 {

        this.worldRaycaster.set( origin, direction.normalize() );

        const worldPoints = this.scene.getObjectByName('worldpointcloud');
        const intersects = worldPoints ? this.worldRaycaster.intersectObjects( [worldPoints], false ): [];

        if( intersects && intersects.length > 0){

            // plotting highlight sphere
            this.worldIntersectSphere.position.copy(intersects[0].point);
            this.worldIntersectSphere.scale.set(1,1,1);

            if( line ){
                this.gazeLine.geometry = new THREE.BufferGeometry().setFromPoints( [origin, intersects[0].point] );
            }
            
            return intersects[0].point;

        }

        return new THREE.Vector3(0,0,0);

    }

    public get_mouse_intersected_point( camera: THREE.PerspectiveCamera, activeLayers: string[], layers: { [layerName: string]: any }  ):  { mousePosition: MousePosition, layerName: string, intersect: any[] } {

        // update the picking ray with the camera and pointer position
        this.rayCaster.setFromCamera( this.pointer, camera );

        for( let layerIndex = 0; layerIndex < activeLayers.length; layerIndex++ ){

            const layerName: string = activeLayers[layerIndex];
            const sceneObject = this.scene.getObjectByName(layerName);

            if( !sceneObject || !sceneObject.visible ) continue;

            const intersects = sceneObject ? this.rayCaster.intersectObjects( [sceneObject], false ) : [];
            if( intersects.length > 0 ){

                // highlighting selection
                this.highlight_handler( layerName, intersects, layers[layerName] );

                return {
                    mousePosition: {top: this.pointerEvent.offsetY, left: this.pointerEvent.offsetX},
                    layerName: layerName,
                    intersect: intersects
                }
            }                    
        };

        // setting visibility
        this.clear_highlight();

        // returning positions
        return {mousePosition: {top: 0, left: 0}, layerName: 'none', intersect: []};

        // If nothing selected....clearing highlight
        // return {
        //     mousePosition: {top: this.pointerEvent.offsetY, left: this.pointerEvent.offsetX},
        //     layerName: null,
        //     intersect: null
        // }

        

        // checking visible layers

        // // getting scene objects
        // const sceneObject = this.scene.getObjectByName('gazepointcloud');
        // const intersects = sceneObject ? this.rayCaster.intersectObjects( [sceneObject], false ) : [];
        // if(intersects && intersects.length > 0 ){

        //     // setting visibility
        //     this.gazeIntersectSphere.visible = true;
        //     this.worldIntersectSphere.visible = true;
        //     this.gazeLine.visible = true;

        //     // plotting highlight sphere
        //     this.gazeIntersectSphere.position.copy(intersects[0].point);
        //     this.gazeIntersectSphere.scale.set(1,1,1);

        //     // plotting normal line
        //     // TODO: Trace raycaster from this line
        //     const rawGazeDirection: number[] = intersects[0].object.userData['normals'][intersects[0].index];
        //     const direction: THREE.Vector3 = new THREE.Vector3(rawGazeDirection[0], rawGazeDirection[1], rawGazeDirection[2] );   

        //     // setting current gaze direction line
        //     const origin: THREE.Vector3 = intersects[0].point;
            
        //     // intersection with world
        //     this.get_intersected_world_point( origin, direction, true );

        //     // returning positions
        //     return {
        //         mousePosition: {top: this.pointerEvent.offsetY, left: this.pointerEvent.offsetX}, 
        //         intersectPosition: intersects[0].point, 
        //         timestamp:  intersects[0].object.userData['timestamps'][intersects[0].index],
        //         gaze: { origin, direction }
        //     }
            
        // } 
        
        // getting scene objects
        // const projectedGaze = this.scene.getObjectByName('projectedgazepointcloud');
        // const projectedGazeIntersection = projectedGaze ? this.rayCaster.intersectObjects( [projectedGaze], false ) : [];
        // if(projectedGazeIntersection && projectedGazeIntersection.length > 0 ){



        //     // returning positions
        //     return {
        //         mousePosition: {top: this.pointerEvent.offsetY, left: this.pointerEvent.offsetX}, 
        //         intersectPosition: intersects[0].point, 
        //         timestamp:  intersects[0].object.userData['timestamps'][intersects[0].index],
        //         gaze: { origin, direction }
        //     }


        // }
        
    }

    public highlight_handler( layerName: string, intersects: any, layer: any ): void {

        if( layerName === 'gazepointcloud' ){

            // setting visibility
            this.gazeIntersectSphere.visible = true;
            this.worldIntersectSphere.visible = true;
            this.gazeLine.visible = true;

            // plotting highlight sphere
            this.gazeIntersectSphere.position.copy(intersects[0].point);
            this.gazeIntersectSphere.scale.set(1,1,1);

            // console.log('Layer test: ', layer);

            // plotting normal line
            // TODO: Trace raycaster from this line
            const objectIndex: number = intersects[0].index;
            const objectInfo: { point: number[], normal: number[], timestamp: number } = layer.get_object_by_index(objectIndex);

            // const 
            const origin: THREE.Vector3 = intersects[0].point;

            // const rawGazeDirection: number[] = intersects[0].object.userData['normals'][intersects[0].index];
            // const direction: THREE.Vector3 = new THREE.Vector3(rawGazeDirection[0], rawGazeDirection[1], rawGazeDirection[2] );   

            // setting current gaze direction line
            // const origin: THREE.Vector3 = intersects[0].point;
            
            // intersection with world
            // this.get_intersected_world_point( origin, direction, true );



        }

        if( layerName === 'projectedgazepointcloud' ){

            // setting visibility
            this.gazeIntersectSphere.visible = true;
            this.worldIntersectSphere.visible = true;
            this.gazeLine.visible = true;

            // plotting highlight sphere
            this.gazeIntersectSphere.position.copy(intersects[0].point);
            this.gazeIntersectSphere.scale.set(1,1,1);

        }


    }

    public clear_highlight(): void {

        // setting visibility
        this.gazeIntersectSphere.visible = false;
        this.worldIntersectSphere.visible = false;
        this.gazeLine.visible = false;

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
        canvasContainer.addEventListener('pointermove', (event) => {this.on_pointer_move( event, canvasContainer)})
    }
    

}