import { Script } from 'playcanvas';

export class ClamourGameRoot extends Script {
    static scriptName = 'clamourGameRoot';

    /** @attribute */
    networkManager = null;

    initialize() {
        this.app.fire('clamour:boot');
        this.app.on('network:online', this.onNetworkOnline, this);
        this.app.on('network:error', this.onNetworkError, this);
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
    }
}
