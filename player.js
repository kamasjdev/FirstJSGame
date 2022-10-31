export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height;
         // js automatically creates references to all elements with IDs into the global namespace using its ID as a variable
        this.image = player; //document.getElementById('player')
    }

    update() {
        this.x++;
    }

    draw(context) {
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}