import { Script } from 'playcanvas';

export class ClamourPersistenceManager extends Script {
    static scriptName = 'clamourPersistenceManager';

    /** @attribute */
    networkManager = null;

    /** @attribute */
    autosaveSeconds = 10;

    initialize() {
        this._timer = 0;
        this._lastState = null;
    }

    setState(state) {
        this._lastState = state;
    }

    update(dt) {
        if (!this.networkManager || !this.networkManager.online) return;
        this._timer += dt;
        if (this._timer < this.autosaveSeconds || !this._lastState) return;
        this._timer = 0;
        const playerId = localStorage.getItem('clamour_player_id');
        if (!playerId) return;
        void this.networkManager.request(`/api/game/auth/player-state/${encodeURIComponent(playerId)}`, {
            method: 'PUT',
            body: JSON.stringify(this._lastState),
        }).catch((error) => console.warn('[Clamour] autosave failed:', error));
    }
}
