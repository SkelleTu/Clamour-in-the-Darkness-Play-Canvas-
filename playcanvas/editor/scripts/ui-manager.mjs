import { Entity, Script } from 'playcanvas';

export class ClamourUIManager extends Script {
    static scriptName = 'clamourUIManager';

    /**
     * @attribute
     * @type {Entity}
     */
    loginEntity;

    /**
     * @attribute
     * @type {Entity}
     */
    addressEntity;

    /**
     * @attribute
     * @type {Entity}
     */
    hudEntity;

    /**
     * @attribute
     * @type {Entity}
     */
    loadingEntity;

    initialize() {
        this._setEnabled(this.loginEntity, false);
        this._setEnabled(this.addressEntity, false);
        this._setEnabled(this.hudEntity, false);
        this._setEnabled(this.loadingEntity, false);

        this.app.on('clamour:boot', this.onBoot, this);
        this.app.on('network:online', this.onOnline, this);
        this.app.on('network:error', this.onNetworkError, this);
        this.app.on('auth:success', this.onAuthSuccess, this);
        this.app.on('auth:logged-out', this.onLogout, this);
        this.app.on('address:selected', this.onAddressSelected, this);
        this.app.on('player:spawn', this.onPlayerSpawn, this);
    }

    _setEnabled(entity, enabled) {
        if (entity instanceof Entity) entity.enabled = enabled;
    }

    onBoot() {
        this._setEnabled(this.loadingEntity, true);
    }

    onOnline() {
        this._setEnabled(this.loadingEntity, false);
        const token = localStorage.getItem('clamour_auth_token');
        if (token) this.app.fire('auth:validate');
        else this._setEnabled(this.loginEntity, true);
    }

    onNetworkError(error) {
        this._setEnabled(this.loadingEntity, false);
        console.error('[Clamour] Network error:', error);
        this.app.fire('ui:error', error);
    }

    onAuthSuccess() {
        this._setEnabled(this.loginEntity, false);
        this._setEnabled(this.addressEntity, true);
    }

    onAddressSelected() {
        this._setEnabled(this.addressEntity, false);
        this._setEnabled(this.loadingEntity, true);
    }

    onPlayerSpawn() {
        this._setEnabled(this.loadingEntity, false);
        this._setEnabled(this.hudEntity, true);
    }

    onLogout() {
        this._setEnabled(this.hudEntity, false);
        this._setEnabled(this.addressEntity, false);
        this._setEnabled(this.loginEntity, true);
    }

    destroy() {
        this.app.off('clamour:boot', this.onBoot, this);
        this.app.off('network:online', this.onOnline, this);
        this.app.off('network:error', this.onNetworkError, this);
        this.app.off('auth:success', this.onAuthSuccess, this);
        this.app.off('auth:logged-out', this.onLogout, this);
        this.app.off('address:selected', this.onAddressSelected, this);
        this.app.off('player:spawn', this.onPlayerSpawn, this);
    }
}
