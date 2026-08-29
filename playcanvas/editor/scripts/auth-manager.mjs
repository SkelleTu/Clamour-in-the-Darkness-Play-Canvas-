import { Script } from 'playcanvas';

export class ClamourAuthManager extends Script {
    static scriptName = 'clamourAuthManager';

    /** @attribute */
    networkManager = null;

    initialize() {
        this.app.on('auth:login', this.login, this);
        this.app.on('auth:register', this.register, this);
        this.app.on('auth:logout', this.logout, this);
        this.app.on('auth:validate', this.validate, this);
        this._emitStoredSession();
    }

    _network() {
        if (!this.networkManager) throw new Error('AuthManager: networkManager reference is missing.');
        return this.networkManager;
    }

    async login({ username, password }) {
        try {
            const result = await this._network().request('/api/game/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            this._store(result);
            this.app.fire('auth:success', result);
            return result;
        } catch (error) {
            this.app.fire('auth:error', error);
            return null;
        }
    }

    async register({ username, password, confirmPassword }) {
        if (password !== confirmPassword) {
            const error = new Error('As senhas não coincidem.');
            this.app.fire('auth:error', error);
            return null;
        }
        try {
            const result = await this._network().request('/api/game/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            this._store(result);
            this.app.fire('auth:success', result);
            return result;
        } catch (error) {
            this.app.fire('auth:error', error);
            return null;
        }
    }

    async validate() {
        const stored = this._stored();
        if (!stored) return null;
        try {
            const result = await this._network().request('/api/game/auth/session');
            const session = { token: stored.token, playerId: result.playerId, username: result.username };
            this._store(session);
            this.app.fire('auth:success', session);
            return session;
        } catch {
            this._clear();
            this.app.fire('auth:logged-out');
            return null;
        }
    }

    logout() {
        this._clear();
        this.app.fire('auth:logged-out');
    }

    _store(session) {
        if (!session?.token || !session?.playerId || !session?.username) throw new Error('Sessão inválida retornada pelo servidor.');
        localStorage.setItem('clamour_auth_token', session.token);
        localStorage.setItem('clamour_player_id', session.playerId);
        localStorage.setItem('clamour_username', session.username);
    }

    _stored() {
        const token = localStorage.getItem('clamour_auth_token');
        const playerId = localStorage.getItem('clamour_player_id');
        const username = localStorage.getItem('clamour_username');
        return token && playerId && username ? { token, playerId, username } : null;
    }

    _clear() {
        localStorage.removeItem('clamour_auth_token');
        localStorage.removeItem('clamour_player_id');
        localStorage.removeItem('clamour_username');
    }

    _emitStoredSession() {
        if (this._stored()) void this.validate();
    }

    destroy() {
        this.app.off('auth:login', this.login, this);
        this.app.off('auth:register', this.register, this);
        this.app.off('auth:logout', this.logout, this);
        this.app.off('auth:validate', this.validate, this);
    }
}
