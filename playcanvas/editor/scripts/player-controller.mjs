import { Entity, Script, Vec3, KEY_A, KEY_D, KEY_S, KEY_SHIFT, KEY_W, KEY_SPACE } from 'playcanvas';

export class ClamourPlayerController extends Script {
    static scriptName = 'clamourPlayerController';

    /** @attribute */
    walkSpeed = 2.8;

    /** @attribute */
    sprintSpeed = 5.2;

    /** @attribute */
    jumpSpeed = 4.95;

    /** @attribute */
    staminaDrain = 30;

    /** @attribute */
    staminaRecovery = 18;

    /** @attribute */
    lookSensitivity = 0.08;

    /** @attribute */
    groundRayLength = 0.35;

    /**
     * @attribute
     * @type {Entity}
     */
    cameraEntity;

    initialize() {
        this.velocity = new Vec3();
        this._move = new Vec3();
        this._from = new Vec3();
        this._to = new Vec3();
        this.yaw = this.entity.getEulerAngles().y;
        this.pitch = 0;
        this.stamina = 100;
        this.health = 100;
        this.onGround = false;

        if (!this.entity.collision) console.error('[Clamour] Player requires a Collision component.');
        if (!this.entity.rigidbody || this.entity.rigidbody.type !== 'dynamic') {
            console.error('[Clamour] Player requires a DYNAMIC Rigid Body component.');
        }

        this.app.keyboard?.on('keydown', this._onKeyDown, this);
        this.app.mouse?.on('mousemove', this._onMouseMove, this);
        this.app.mouse?.on('mousedown', this._onMouseDown, this);
        this.app.on('player:spawn', this.onSpawn, this);
    }

    _onKeyDown(event) {
        if (event.key === 'Escape' && this.app.mouse?.isPointerLocked()) this.app.mouse.disablePointerLock();
    }

    _onMouseDown() {
        if (this.app.mouse && !this.app.mouse.isPointerLocked()) this.app.mouse.enablePointerLock();
    }

    _onMouseMove(event) {
        if (!this.app.mouse?.isPointerLocked()) return;
        this.yaw -= event.dx * this.lookSensitivity;
        this.pitch = Math.max(-85, Math.min(85, this.pitch - event.dy * this.lookSensitivity));
    }

    onSpawn(data) {
        if (!data) return;
        this.app.fire('player:ready', data);
    }

    _checkGrounded() {
        if (!this.app.systems?.rigidbody || !this.entity.collision) return false;
        const position = this.entity.getPosition();
        this._from.set(position.x, position.y + 0.08, position.z);
        this._to.set(position.x, position.y - this.groundRayLength, position.z);
        const hit = this.app.systems.rigidbody.raycastFirst(this._from, this._to);
        return !!hit && hit.entity !== this.entity;
    }

    update(dt) {
        const rigidbody = this.entity.rigidbody;
        const keyboard = this.app.keyboard;
        if (!rigidbody || rigidbody.type !== 'dynamic' || !keyboard) return;

        this.onGround = this._checkGrounded();
        this._move.set(0, 0, 0);
        if (keyboard.isPressed(KEY_W)) this._move.z -= 1;
        if (keyboard.isPressed(KEY_S)) this._move.z += 1;
        if (keyboard.isPressed(KEY_A)) this._move.x -= 1;
        if (keyboard.isPressed(KEY_D)) this._move.x += 1;

        const moving = this._move.lengthSq() > 0;
        if (moving) this._move.normalize();

        const sprinting = keyboard.isPressed(KEY_SHIFT) && moving && this.stamina > 0;
        const speed = sprinting ? this.sprintSpeed : this.walkSpeed;
        if (sprinting) this.stamina = Math.max(0, this.stamina - this.staminaDrain * dt);
        else this.stamina = Math.min(100, this.stamina + this.staminaRecovery * dt);

        const yaw = this.yaw * Math.PI / 180;
        const sin = Math.sin(yaw);
        const cos = Math.cos(yaw);
        const worldX = this._move.x * cos - this._move.z * sin;
        const worldZ = this._move.x * sin + this._move.z * cos;

        const current = rigidbody.linearVelocity;
        this.velocity.set(worldX * speed, current.y, worldZ * speed);
        rigidbody.linearVelocity = this.velocity;

        if (keyboard.wasPressed(KEY_SPACE) && this.onGround) {
            this.velocity.y = this.jumpSpeed;
            rigidbody.linearVelocity = this.velocity;
            this.onGround = false;
        }

        // Dynamic body transforms are owned by the physics engine. Apply yaw
        // to the camera locally so look control does not fight physics.
        if (this.cameraEntity) {
            this.cameraEntity.setLocalPosition(0, 1.65, 0);
            this.cameraEntity.setLocalEulerAngles(this.pitch, this.yaw, 0);
        }

        this.app.fire('player:vitals', { health: this.health, stamina: this.stamina });
    }

    destroy() {
        this.app.keyboard?.off('keydown', this._onKeyDown, this);
        this.app.mouse?.off('mousemove', this._onMouseMove, this);
        this.app.mouse?.off('mousedown', this._onMouseDown, this);
        this.app.off('player:spawn', this.onSpawn, this);
    }
}
