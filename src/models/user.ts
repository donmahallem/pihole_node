export class User {

    private _authenticated: boolean = false;


    public get authenticated(): boolean {
        return this._authenticated;
    }
}