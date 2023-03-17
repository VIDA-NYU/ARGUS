import { Dataset } from "../model/Dataset";
import { PointCloud } from "../model/renderables/PointCloud";
import { Scene } from "../model/Scene";
import { CameraParams } from "../types/types";
import * as THREE from 'three';
import { VoxelCloud } from "../model/renderables/VoxelCloud";

export class SceneViewerController {

    // refs
    public scene!: Scene;
    public dataset!: Dataset;
    
    constructor(){}

    public initialize_dataset( sceneData: any ): void {

        // creating dataset
        this.dataset = new Dataset( sceneData );
    }

    public add_point_clouds_to_scene(): void {

        // getting available point clouds
        const pointClouds: PointCloud[] = this.dataset.get_point_clouds();

        // adding point clouds
        pointClouds.forEach( (pointCloud: PointCloud) => {
            
            const pointCloudObject: THREE.Points = this.scene.sceneManager.add_point_cloud( pointCloud );
            pointCloud.threeObject = pointCloudObject;

        });

    }

    public add_voxel_clouds_to_scene(): void {

        // getting available voxel clouds
        const voxelClouds: VoxelCloud[] = this.dataset.get_voxel_clouds();

        voxelClouds.forEach( ( voxelCloud: VoxelCloud ) => {

            const voxelCloudGroup: THREE.Group = this.scene.sceneManager.add_voxel_cloud( voxelCloud  );
            voxelCloud.threeObject = voxelCloudGroup;

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

    } 

    public change_cloud_style( cloudName: string, style: string, value: number ): void {

        if( cloudName in this.dataset.pointClouds ){

            const pointCloud: PointCloud = this.dataset.pointClouds[cloudName];
            pointCloud.threeObject.material[style] = value;
            return;

        }

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
    
}