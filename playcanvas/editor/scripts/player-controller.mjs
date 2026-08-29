import { Script, Vec3 } from 'playcanvas';

export class ClamourPlayerController extends Script {
    static scriptName = 'clamourPlayerController';

    /** @attribute */
    walkSpeed = 2.8;

    /** @attribute */
    sprintSpeed = 5.2;

    /** @attribute */
    jumpHeight = 1.25;

    /** @attribute */
    gravity = -18;

    /** @attribute */
    cameraEntity = null;

    initialize() {
        this.velocity = new Vec3();
        this._move = new Vec3();
        this._keys = new Set();
        this.yaw = 0;
        this.pitch = 0;
        this.onGround = true;
        this.stamina = 100;
        this.health = 100;
        this._onDown = (e) => this._keys.add(e.code);
        this._onUp = (e) => this._keys.delete(e.code);
        this._onMouse = (e) => {
            if (document.pointerLockElement) {
                this.yaw -= e.movementX * 0.08;
                this.pitch = Math.max(-85, Math.min(85, this.pitch - e.movementY * 0.08));
            }
        };
        window.addEventListener('keydown', this._onDown);
        window.addEventListener('keyup', this._onUp);
        window.addEventListener('mousemove', this._onMouse);
        this.app.on('player:spawn', this.onSpawn, this);
    }

    onSpawn(data) {
        if (!data) return;
        this.app.fire('player:ready', data);
    }

    update(dt) {
        this._move.set(0, 0, 0);
        if (this._keys.has('KeyW')) this._move.z -= 1;
        if (this._keys.has('KeyS')) this._move.z += 1;
        if (this._keys.has('KeyA')) this._move.x -= 1;
        if (this._keys.has('KeyD')) this._move.x += 1;
        const moving = this._move.lengthSq() > 0;
        if (moving) this._move.normalize();

        const sprinting = (this._keys.has('ShiftLeft') || this._keys.has('ShiftRight')) && moving && this.stamina > 1;
        const speed = sprinting ? this.sprintSpeed : this.walkSpeed;
        if (sprinting) this.stamina = Math.max(0, this.stamina - 30 * dt);
        else this.stamina = Math.min(100, this.stamina + 18 * dt);

        const yaw = this.yaw * Math.PI / 180;
        const sin = Math.sin(yaw);
        const cos = Math.cos(yaw);
        const worldX = this._move.x * cos - this._move.z * sin;
        const worldZ = this._move.x * sin + this._move.z * cos;
        this.entity.translate(worldX * speed * dt, 0, worldZ * speed * dt);

        if (this._keys.has('Space') && this.onGround) {
            this.velocity.y = Math.sqrt(-2 * this.gravity * this.jumpHeight);
            this.onGround = false;
            this._keys.delete('Space');
        }
        if (!this.onGround) {
            this.velocity.y += this.gravity * dt;
            this.entity.translate(0, this.velocity.y * dt, 0);
            if (this.entity.getPosition().y <= 0) {
                this.entity.setPosition(this.entity.getPosition().x, 0, this.entity.getPosition().z);
                this.velocity.y = 0;
                this.onGround = true;
            }
        }

        if (this.cameraEntity) {
            this.cameraEntity.setLocalPosition(0, 1.65, 0);
            this.cameraEntity.setLocalEulerAngles(this.pitch, 0, 0);
            this.entity.setEulerAngles(0, this.yaw, 0);
        } else {
            this.entity.setEulerAngles(0, this.yaw, 0);
        }

        this.app.fire('player:vitals', { health: this.health, stamina: this.stamina });
    }

    destroy() {
        window.removeEventListener('keydown', this._onDown);
        window.removeEventListener('keyup', this._onUp);
        window.removeEventListener('mousemove', this._onMouse);
        this.app.off('player:spawn', this.onSpawn, this);
    }
}
