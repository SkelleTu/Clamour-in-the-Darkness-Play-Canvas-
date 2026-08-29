import { Asset, Entity, Script } from 'playcanvas';

export class ClamourStreetViewManager extends Script {
    static scriptName = 'clamourStreetViewManager';

    /**
     * @attribute
     * @type {Entity}
     */
    networkManager;

    /**
     * @attribute
     * @type {Entity}
     */
    panoramaEntity;

    /**
     * @attribute
     * @type {Asset}
     */
    sphereAsset;

    initialize() {
        this.metadata = null;
        this.app.on('address:selected', this.loadForLocation, this);
    }

    _network() {
        const network = this.networkManager?.script?.clamourNetworkManager;
        if (!network) throw new Error('StreetViewManager: NetworkManager entity has no clamourNetworkManager script.');
        return network;
    }

    async loadForLocation(location) {
        if (!location) return;
        try {
            const network = this._network();
            const metadata = await network.request(`/api/game/streetview/metadata?lat=${encodeURIComponent(location.lat)}&lng=${encodeURIComponent(location.lon)}&radius=100`);
            const data = metadata?.data ?? metadata;
            if (!data?.pano || !data?.location) throw new Error('Panorama do Google não encontrado para este ponto.');

            this.metadata = data;
            this.app.fire('streetview:ready', data);
        } catch (error) {
            console.error('[Clamour] Street View failed:', error);
            this.app.fire('streetview:error', error);
        }
    }

    imageUrl(heading = 0, pitch = 0, fov = 90, width = 1024, height = 1024) {
        if (!this.metadata) return null;
        const p = new URLSearchParams({
            pano: this.metadata.pano,
            lat: String(this.metadata.location.lat),
            lng: String(this.metadata.location.lng),
            heading: String(heading),
            pitch: String(pitch),
            fov: String(fov),
            width: String(width),
            height: String(height),
        });
        const base = String(this.networkManager?.script?.clamourNetworkManager?.serverUrl || '/us').replace(/\/$/, '');
        return `${base}/api/game/streetview/image?${p}`;
    }

    destroy() {
        this.app.off('address:selected', this.loadForLocation, this);
    }
}
