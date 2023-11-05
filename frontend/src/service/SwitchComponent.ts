class switchComponents {
    private currentComponent: string = 'dashboard';

    public setComponent(component: string) {
        this.currentComponent = component;
    }

    public getComponent() {
        return this.currentComponent;
    }
}

export default new switchComponents();
