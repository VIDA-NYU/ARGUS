import * as d3 from 'd3';

export class Tooltip{

    public container!: d3.Selection<any,any,any,any>;

    // video ref
    public videoTag!: HTMLVideoElement;

    constructor( public tooltipContainer: HTMLElement ){

        this.container = d3.select(tooltipContainer);

    }

    public position_tooltip( top: number, left: number ): void {

        if(top === 0){
            this.container
                .style('visibility', 'hidden');
        } else {
            this.container
                .style('visibility', 'visible')
                .style('top', `${top}px` )
                .style('left', `${left}px` );
        }
    }

    

    public add_video_tag( videoPath: string ): void{

        // Create video element
        const videoTag: HTMLVideoElement = document.createElement('video');
        this.videoTag = videoTag;

        // // Use remote file
        videoTag.src = `${videoPath}`;

        videoTag.controls = false;
        videoTag.muted = true;
        videoTag.preload = 'auto';

        videoTag.width = this.container.node().getBoundingClientRect().width; // in px
        videoTag.height = this.container.node().getBoundingClientRect().height; // in px

        // Include in HTML as child of #box
        this.tooltipContainer.appendChild(videoTag);

    }

    public set_video_timestamp( timestamp: number ): void {

        if( this.videoTag && this.videoTag.duration ){
            this.videoTag.currentTime = timestamp;
        }

    } 


}