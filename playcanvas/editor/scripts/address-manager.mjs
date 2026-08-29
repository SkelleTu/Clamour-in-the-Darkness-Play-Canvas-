import { Script } from 'playcanvas';

export class ClamourAddressManager extends Script {
    static scriptName = 'clamourAddressManager';

    /** @attribute */
    networkManager = null;

    /** @attribute */
    ararasOnly = true;

    /** @attribute */
    minCharacters = 3;

    initialize() {
        this.sessionToken = crypto.randomUUID();
        this.selected = null;
    }

    _network() {
        if (!this.networkManager) throw new Error('AddressManager: networkManager reference is missing.');
        return this.networkManager;
    }

    async autocomplete(input) {
        const value = String(input ?? '').trim();
        if (value.length < this.minCharacters) return [];
        const query = this.ararasOnly ? `${value}, Araras, SP, Brasil` : value;
        const params = new URLSearchParams({ input: query, sessionToken: this.sessionToken });
        const payload = await this._network().request(`/api/game/google/autocomplete?${params}`);
        const predictions = Array.isArray(payload?.predictions) ? payload.predictions : [];
        return predictions.map((p) => ({
            placeId: String(p.placeId ?? p.place_id ?? ''),
            displayName: String(p.displayName ?? p.description ?? ''),
            mainText: String(p.mainText ?? p.structured_formatting?.main_text ?? ''),
            secondaryText: String(p.secondaryText ?? p.structured_formatting?.secondary_text ?? ''),
        }));
    }

    async select(placeId) {
        if (!placeId) throw new Error('Endereço sem placeId.');
        const params = new URLSearchParams({ placeId: String(placeId), sessionToken: this.sessionToken });
        const payload = await this._network().request(`/api/game/google/place-details?${params}`);
        const lat = Number(payload?.lat ?? payload?.location?.lat);
        const lon = Number(payload?.lon ?? payload?.location?.lng ?? payload?.location?.lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error('Google não retornou coordenadas válidas.');
        this.selected = {
            placeId: String(payload?.placeId ?? placeId),
            displayName: String(payload?.displayName ?? payload?.formattedAddress ?? ''),
            lat,
            lon,
        };
        this.app.fire('address:selected', this.selected);
        return this.selected;
    }
}
