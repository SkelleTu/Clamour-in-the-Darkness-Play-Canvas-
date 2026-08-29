import { Entity, Script } from 'playcanvas';

export class ClamourGameRoot extends Script {
    static scriptName = 'clamourGameRoot';

    /**
     * @attribute
     * @type {Entity}
     */
    networkManager;

    initialize() {
        if (!this.networkManager) {
            console.error('[Clamour] GameRoot requires Systems/NetworkManager in the Inspector.');
        }

        this.app.on('network:online', this.onNetworkOnline, this);
        this.app.on('network:error', this.onNetworkError, this);

        // Wait until all enabled scripts have completed initialize() before
        // announcing boot, so UI and system listeners cannot miss the event.
        this.app.once('update', this.onFirstUpdate, this);
    }

    onFirstUpdate() {
        this.app.fire('clamour:boot');
    }

    onNetworkOnline(status) {
        this.app.fire('clamour:server-online', status ?? null);
    }

    onNetworkError(error) {
        console.error('[Clamour] Universal Server unavailable:', error);
        this.app.fire('clamour:server-error', error);
    }

    destroy() {
        this.app.off('network:online', this.onNetworkOnline, this);
        this.app.off('network:error', this.onNetworkError, this);
        this.app.off('update', this.onFirstUpdate, this);
    }
}
