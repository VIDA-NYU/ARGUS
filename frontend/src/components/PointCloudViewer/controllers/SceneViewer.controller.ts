// model
import { Dataset } from "../model/Dataset";
import { PointCloud } from "../model/renderables/PointCloud";
import { Scene } from "../model/Scene";
import { VoxelCloud } from "../model/renderables/VoxelCloud";

// types
import { CameraParams } from "../types/types";

// third-party
import { Object3D } from "three";
import * as THREE from 'three';
import { LineCloud } from "../model/renderables/LineCloud";

export class SceneViewerController {

    // refs
    public scene!: Scene;
    public dataset!: Dataset;
    
    constructor(){}

    public initialize_dataset( sceneData: any ): void {

        // creating dataset
        this.dataset = new Dataset( sceneData );
    }

    public remove_scene_objects( objectNames: string[] ): void {

        objectNames.forEach( ( name: string ) => {

            const currentObject: Object3D = this.scene.scene.getObjectByName( name );
            if( currentObject ) this.scene.scene.remove( currentObject );

        });

    }   

    public update_scene_point_clouds(): void {

        // getting available point clouds
        const pointClouds: PointCloud[] = this.dataset.get_point_clouds();

        // adding point clouds
        pointClouds.forEach( (pointCloud: PointCloud) => {

            if (!(this.scene.scene.getObjectByName(pointCloud.name))){

                // adding point cloud
                const pointCloudObject: THREE.Points = this.scene.sceneManager.add_point_cloud( pointCloud );
                pointCloud.threeObject = pointCloudObject;

            }
            
        });

        this.scene.update_scene_highlight();

    }

    public update_scene_voxel_clouds(): void {

        // getting available voxel clouds
        const voxelClouds: VoxelCloud[] = this.dataset.get_voxel_clouds();

        voxelClouds.forEach( ( voxelCloud: VoxelCloud ) => {

            if(!(this.scene.scene.getObjectByName(voxelCloud.name))){
                const voxelCloudGroup: THREE.Group = this.scene.sceneManager.add_voxel_cloud( voxelCloud  );
                voxelCloud.threeObject = voxelCloudGroup;
            }

        });
        
    }

    public update_scene_line_clouds(): void {

        // getting available voxel clouds
        const lineClouds: LineCloud[] = this.dataset.get_line_clouds();

        lineClouds.forEach( ( lineCloud: LineCloud ) => {

            if(!(this.scene.scene.getObjectByName(lineCloud.name))){

                const lineCloudGroup: THREE.Group = this.scene.sceneManager.add_line_cloud( lineCloud  );
                lineCloud.threeObject = lineCloudGroup;
            }

        });

    }

    public change_cloud_visibility( cloudName: string, visibility: boolean ): void {

        if( cloudName in this.dataset.pointClouds ){

            const pointCloud: PointCloud = this.dataset.pointClouds[cloudName];
            pointCloud.threeObject.visible = visibility;
            return
        }

        if( cloudName in this.dataset.voxelClouds ){

            const voxelCloud: VoxelCloud = this.dataset.voxelClouds[cloudName];
            voxelCloud.threeObject.visible = visibility;
            return
        }

        if( cloudName in this.dataset.lineClouds ){

            const lineCloud: LineCloud = this.dataset.lineClouds[cloudName];
            lineCloud.threeObject.visible = visibility;
            return

        }

    } 

    public change_point_cloud_style( cloudName: string, style: string, value: number ): void {

        if( cloudName in this.dataset.pointClouds ){

            const pointCloud: PointCloud = this.dataset.pointClouds[cloudName];
            pointCloud.threeObject.material[style] = value;
            return;

        }

    }

    public change_voxel_cloud_style( cloudName: string, style: string, value: number ): void {

        if( cloudName in this.dataset.voxelClouds ){

            const voxelCloud: VoxelCloud = this.dataset.voxelClouds[cloudName];

            voxelCloud.threeObject.children.forEach( (cube: THREE.Mesh) => {
                cube.material[style] = value;
            })
        }

    }

    public create_projections( ): void {

        this.dataset.create_projection( 'gazeprojection-pointcloud', this.dataset.pointClouds['gazeorigin-pointcloud'], this.dataset.pointClouds['world-pointcloud'], this.scene.rayCaster );

    }

    public initialize_scene( containerRef: HTMLElement, tooltipContainerRef: HTMLElement ): void {

        const cameraParams: CameraParams = {
            position: [0,0,10],
            near: 0.1,
            far: 10
        }

        // creating scene
        this.scene = new Scene();
        this.scene.init( containerRef, tooltipContainerRef,  cameraParams, this.dataset );

    }

    public initialize_tooltip( videoPath: string ){

        this.scene.tooltip.add_video_tag(videoPath);

    }

    public filter_points_by_timestamp( timestamps: number[] ): void {

        const pointClouds: PointCloud[] = this.dataset.get_point_clouds();
        pointClouds.forEach( (pointCloud: PointCloud) => {
            pointCloud.filter_points_by_timestamp( timestamps );
        });

        const lineClouds: LineCloud[] = this.dataset.get_line_clouds();
        lineClouds.forEach( (lineCloud: LineCloud) => {
            lineCloud.filter_lines_by_timestamp( timestamps );
        });

    }
    
}