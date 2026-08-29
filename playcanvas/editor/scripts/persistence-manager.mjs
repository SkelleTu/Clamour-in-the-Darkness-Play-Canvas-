import { Entity, Script } from 'playcanvas';

export class ClamourPersistenceManager extends Script {
    static scriptName = 'clamourPersistenceManager';

    /**
     * @attribute
     * @type {Entity}
     */
    networkManager;

    /** @attribute */
    autosaveSeconds = 10;

    initialize() {
        this._timer = 0;
        this._lastState = null;
    }

    _network() {
        return this.networkManager?.script?.clamourNetworkManager ?? null;
    }

    setState(state) {
        this._lastState = state;
    }

    update(dt) {
        const network = this._network();
        if (!network || !network.online) return;
        this._timer += dt;
        if (this._timer < this.autosaveSeconds || !this._lastState) return;
        this._timer = 0;
        const playerId = localStorage.getItem('clamour_player_id');
        if (!playerId) return;
        void network.request(`/api/game/auth/player-state/${encodeURIComponent(playerId)}`, {
            method: 'PUT',
            body: JSON.stringify(this._lastState),
        }).catch((error) => console.warn('[Clamour] autosave failed:', error));
    }
}
