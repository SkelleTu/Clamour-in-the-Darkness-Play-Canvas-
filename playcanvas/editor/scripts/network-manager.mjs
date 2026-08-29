import { Script } from 'playcanvas';

export class ClamourNetworkManager extends Script {
    static scriptName = 'clamourNetworkManager';

    /** @attribute */
    serverUrl = '/us';

    /** @attribute */
    apiKey = '';

    /** @attribute */
    healthPath = '/api/game/status';

    /** @attribute */
    heartbeatSeconds = 10;

    initialize() {
        this.online = false;
        this._timer = 0;
        this.check();
    }

    _headers() {
        const headers = { Accept: 'application/json' };
        const token = localStorage.getItem('clamour_auth_token');
        if (token) headers.Authorization = `Bearer ${token}`;
        if (this.apiKey) headers['x-api-key'] = this.apiKey;
        return headers;
    }

    _base() {
        return String(this.serverUrl || '/us').replace(/\/$/, '');
    }

    async check() {
        try {
            const response = await fetch(`${this._base()}${this.healthPath}`, { headers: this._headers() });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(`Universal Server HTTP ${response.status}`);
            this.online = !payload?.expired;
            if (this.online) this.app.fire('network:online', payload);
            else this.app.fire('network:error', new Error('Universal Server expirado.'));
            return payload;
        } catch (error) {
            this.online = false;
            this.app.fire('network:error', error);
            return null;
        }
    }

    async request(path, init = {}) {
        const headers = new Headers(init.headers);
        for (const [key, value] of Object.entries(this._headers())) headers.set(key, value);
        if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
        const response = await fetch(`${this._base()}${path}`, { ...init, headers });
        const type = response.headers.get('content-type') || '';
        const payload = type.includes('application/json') ? await response.json() : await response.text();
        if (!response.ok) throw new Error(typeof payload === 'object' && payload?.error ? payload.error : `HTTP ${response.status}`);
        return payload;
    }

    update(dt) {
        this._timer += dt;
        if (this._timer >= this.heartbeatSeconds) {
            this._timer = 0;
            void this.check();
        }
    }
}
