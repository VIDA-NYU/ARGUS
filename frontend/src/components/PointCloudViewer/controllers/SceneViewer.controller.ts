import { Dataset } from "../model/Dataset";
import { Scene } from "../model/Scene";
import { WorldPointCloudRaw } from "../types/types";

export class SceneViewerController {

    // refs
    public scene!: Scene;
    public dataset!: Dataset;
    
    constructor(){}

    public async initialize_controller( containerRef: HTMLElement ): Promise<void> {

        // initializing dataset
        const dataset: Dataset = await this.initialize_dataset();
        this.dataset = dataset;

        // initializing scene
        const scene: Scene = this.initialize_scene( containerRef );
        this.scene = scene;

        this.scene.render();

    }

    public async initialize_dataset(): Promise<Dataset> {

        // creating dataset
        const dataset: Dataset = new Dataset();

        // saving dataset ref
        return dataset;

    }


    public initialize_scene( containerRef: HTMLElement ): Scene {

        // creating scene
        const scene: Scene = new Scene();
        scene.init( containerRef, [0,0,10] );

        return scene;

    }
}