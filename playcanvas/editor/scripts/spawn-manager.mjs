import { Script } from 'playcanvas';

export class ClamourSpawnManager extends Script {
    static scriptName = 'clamourSpawnManager';

    /** @attribute */
    player = null;

    /** @attribute */
    startHeight = 0.2;

    initialize() {
        this.app.on('address:selected', this.onAddressSelected, this);
    }

    onAddressSelected(address) {
        if (!address || !this.player) return;
        this.player.enabled = true;
        this.player.setPosition(0, this.startHeight, 0);
        this.app.fire('player:spawn', address);
    }

    destroy() {
        this.app.off('address:selected', this.onAddressSelected, this);
    }
}
