export class EventsManager {

    public static subscribe( eventName: string, handler: any ) {

        document.addEventListener( eventName, (event: CustomEvent) => handler(event.detail) );
    
    }

    public static emit( eventName: string, data: any ): void {

        const event: CustomEvent = new CustomEvent( eventName, {detail: data} );
        document.dispatchEvent( event );

    }
}