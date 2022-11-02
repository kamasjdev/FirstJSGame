import { CollisionAnimation } from "./collissionAnimation.js";
import { FloatingMessage } from "./floatingMessages.js";
import { keys } from "./keys.js";
import { Diving, Falling, Hit, Jumping, Rolling, Running, Sitting, states } from "./playerStates.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        // js automatically creates references to all elements with IDs into the global namespace using its ID as a variable
        this.image = player; //document.getElementById('player')
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 1;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.states = [new Sitting(this.game), 
                       new Running(this.game), 
                       new Jumping(this.game), 
                       new Falling(this.game), 
                       new Rolling(this.game), 
                       new Diving(this.game),
                       new Hit(this.game)];
        this.currentState = null;
    }

    update(input, deltaTime) {
        this.checkCollision();
        this.currentState.handleInput(input);
        // horizontal movment
        this.x += this.speed;
        if (input.includes(keys.ArrowRight) && this.currentState !== this.states[states.HIT]) {
            this.speed = this.maxSpeed;
        } else if (input.includes(keys.ArrowLeft) && this.currentState !== this.states[states.HIT]) {
            this.speed = -this.maxSpeed;
        } else {
            this.speed = 0;
        }

        // horizontal boundaries
        if (this.x < 0) {
            this.x = 0;
        }

        const positionEndX = this.game.width - this.width;
        if (this.x > positionEndX) {
            this.x = positionEndX;
        }

        // vertival movement
        this.y += this.vy;

        if(!this.onGround()) {
            this.vy += this.weight;
        } else {
            this.vy = 0;
        }

        // vertical boundaries
        if (this.y > this.game.height - this.height - this.game.groundMargin) {
            this.y = this.game.height - this.height - this.game.groundMargin;
        }

        // animation
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;

            if (this.frameX < this.maxFrame) {
                this.frameX ++;
            } else {
                this.frameX = 0;
            }
        } else {
            this.frameTimer +=  deltaTime;
        }
    }

    draw(context) {
        if (this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height);
        }

        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

    checkCollision() {
        this.game.enemies.forEach(enemy => {
            if (enemy.x < this.x + this.width && 
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y) {
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                    if (this.currentState === this.states[states.ROLLING] || this.currentState === this.states[states.DIVING]) {
                        this.game.score++;
                        this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 150, 50));
                    } else {
                        this.setState(states.HIT, 0);
                        this.game.lives--;
                        this.game.score -= 5;

                        if (this.game.lives <= 0) {
                            this.game.gameOver = true;
                        }
                    }
            }
        });
    }
}