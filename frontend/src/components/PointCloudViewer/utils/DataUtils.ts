export class DataUtils {


    public static calculate_extents( points: number[][] ): number[][] {

        const xExtent: number[] = [Infinity, -Infinity];
        const yExtent: number[] = [Infinity, -Infinity];
        const zExtent: number[] = [Infinity, -Infinity];

        points.forEach( (point: number[] ) => {

            xExtent[0] = Math.min(point[0], xExtent[0]);
            xExtent[1] = Math.max(point[0], xExtent[1]);

            yExtent[0] = Math.min(point[1], yExtent[0]);
            yExtent[1] = Math.max(point[1], yExtent[1]);

            zExtent[0] = Math.min(point[2], zExtent[0]);
            zExtent[1] = Math.max(point[2], zExtent[1]);

        });

        return [xExtent, yExtent, zExtent];

    }

    // Hololens timestamp comes in a weird format with a '-0' in the end;
    public static hololens_timestamp_parser( timestamp: string ): number {

        return parseInt(timestamp.split('-')[0])

    }


    public static extract_perception_labels( rawPerceptionFile: any ): string[] {

        const perceptionData: any [] = rawPerceptionFile.map( (timestamp: any) => timestamp.values || timestamp.data );
        const perceptionLabels: string[][] = perceptionData.map( ( labelInfo: any ) => labelInfo.map( (info: any) => info.label ) );
        
        const labelSet: Set<string> = new Set<string>();
        perceptionLabels.forEach( (labels: string[]) => { 
            labels.forEach( (label:string) => {
                labelSet.add( label );
            })
        });

        return Array.from(labelSet.values());
    }
}