import { RenderParameters, RenderStyle } from "../types/types";

export class SceneConfiguration {

    /*
    *   
    * This class will handle the visibility of different elements
    * and style of point clouds (e.g. opacity, point size, etc)
    * 
    */ 

    constructor( public scene: THREE.Scene ){}

    public set_render_visibility( renderParameters: RenderParameters ): void {

        for (const [key, value] of Object.entries(renderParameters) ){

            const currentObject: THREE.Object3D = this.scene.getObjectByName( key );
            if( currentObject ) currentObject.visible = value;

        }

    }

    public set_render_style( renderParameters: RenderStyle ): void {

        const currentObject: any = this.scene.getObjectByName(renderParameters.pointCloudName);
        if( currentObject ) currentObject.material[renderParameters.attribute] = renderParameters.value;

    }






}