import { Object3D } from "three";
import { Dataset } from "./Dataset";
import { Raycaster } from "./raycaster/Raycaster";
import { PointCloud } from "./renderables/PointCloud";

export class SceneHighlight {

    // current layer highlight
    public currentlyHighlightedLayer!: PointCloud;
    public currentlyHighlightedTimestamp: number = -1;

    constructor( public rayCaster: Raycaster, public dataset: Dataset ){}

    public get_layer_highlights(): Object3D[] {

        // initializing point cloud highlights
        const pointClouds: PointCloud[] = this.dataset.get_point_clouds();

        let highlightObjects: Object3D[] = [];
        pointClouds.forEach( (pointCloud: PointCloud) => {
            
            // creating highlight objects
            pointCloud.initialize_highlights();
            
            // all objects start invisible
            pointCloud.offlight();

            // adding to list of all highlights
            const highlightObject: Object3D[] = pointCloud.get_highlight_objects();
            highlightObjects = highlightObjects.concat( highlightObject );
        });

        return highlightObjects;

    }

    public on_point_cloud_offlight(): void {

        if( this.currentlyHighlightedLayer ) this.currentlyHighlightedLayer.offlight();

    }

    public on_point_cloud_highlight( layerName: string, intersects: any[] ): number {

        const pointCloud: PointCloud = this.dataset.get_point_clouds([layerName])[0];
        const timestamp: number = pointCloud.highlight( this.rayCaster, this.dataset, intersects );

        // saving pointcloud ref
        this.currentlyHighlightedLayer = pointCloud;

        if( timestamp !== this.currentlyHighlightedTimestamp  ){
            this.currentlyHighlightedTimestamp = timestamp;
            return timestamp;
        } 

        return -1;

    }








}