//const Phaser = require("phaser");

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: 0,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};
var gameOver = 0;
var score = 0;
var scoreText;
var powerCat = 0;
catgirl = null

var game = new Phaser.Game(config);

function preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.spritesheet("objects", "assets/objects.png", {
        frameWidth: 96 / 6,
        frameHeight: 64 / 4,
    });
    this.load.spritesheet("girl", "assets/girl.png", {
        frameWidth: 192 / 8,
        frameHeight: 72 / 3,
    });
    this.load.spritesheet("catgirl", "assets/catgirl.png", {
        frameWidth: 192 / 8,
        frameHeight: 72 / 3,
    });
}
function collectCat(player, cat) {
    cat.disableBody(1, 1);
    // Crear a la catgirl
    console.log("asd")
    console.log(playerContainer)
    playerContainer.add([catgirl]);
    catgirl.x = girl.x;
    catgirl.y = girl.y - 10;
    
}
function create() {
    this.add.image(400, 300, "sky");
    var powerupSprite = this.physics.add.sprite(750, 50, "objects", 0);
    powerupSprite.setScale(3);
    powerupSprite.setGravity(0);
    powerupSprite.setVelocity(0);

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, "ground").setScale(2).refreshBody();
    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");

    // Crear el contenedor para los personajes
    playerContainer = this.add.container(100, 450);
    this.physics.add.collider(powerupSprite, platforms);
    // Crear a la chica (girl)
    girl = this.physics.add.sprite(0, 0, "girl");
    girl.setSize(24, 20);
    girl.setOffset(3, 3);
    girl.setScale(3);
    this.physics.add.collider(girl, platforms);
    catgirl = this.physics.add.sprite(900, 0, "catgirl");
    catgirl.setSize(24, 20);
    catgirl.setOffset(3, 3);
    catgirl.setScale(3);
    this.physics.add.collider(catgirl, platforms);
    
    // Agregar ambos personajes al contenedor
    playerContainer.add([girl]);

    // Configuración de animaciones (puedes personalizar según tus necesidades)
    this.anims.create({
        key: "girl_left",
        frames: this.anims.generateFrameNumbers("girl", { start: 8, end: 15 }),
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: "girl_turn",
        frames: [{ key: "girl", frame: 0 }],
        frameRate: 1,
    });

    this.anims.create({
        key: "girl_right",
        frames: this.anims.generateFrameNumbers("girl", { start: 8, end: 15 }),
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: "catgirl_left",
        frames: this.anims.generateFrameNumbers("catgirl", {
            start: 8,
            end: 15,
        }),
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: "catgirl_turn",
        frames: [{ key: "catgirl", frame: 0 }],
        frameRate: 1,
    });

    this.anims.create({
        key: "catgirl_right",
        frames: this.anims.generateFrameNumbers("catgirl", {
            start: 8,
            end: 15,
        }),
        frameRate: 10,
        repeat: -1,
    });
    //controles
    cursors = this.input.keyboard.createCursorKeys();
    //definir estrellas
    stars = this.physics.add.group({
        key: "star",
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
    });
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(girl, powerupSprite, collectCat, 0, 1);
    this.physics.add.overlap(girl, stars, collectStar, 0, 1);
    this.physics.add.overlap(catgirl, stars, collectStar, 0, 1);

    
    //puntuacion
    scoreText = this.add.text(16, 16, "Score: 0", {
        fontSize: "32px",
        fill: "white",
    });
    //BOMBAS
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(girl, bombs, hitBomb, null, this);
}

function update() {
    // Lógica de actualización

    // Ejemplo de controles para la chica (girl)
    if (cursors.left.isDown) {
        girl.setVelocityX(-160);
        girl.anims.play("girl_left", true);
        girl.flipX = 0;
        girl.setOffset(6, 3);
    } else if (cursors.right.isDown) {
        girl.setVelocityX(160);
        girl.anims.play("girl_right", true);
        girl.flipX = 1;
        girl.setOffset(-6, 3);
    } else {
        girl.setVelocityX(0);
        girl.anims.play("girl_turn", true);
    }

    // Ejemplo de controles para la catgirl
    if (cursors.up.isDown && girl.body.touching.down) {
        girl.setVelocityY(-330);
    }
    if(catgirl != null){
    // Ejemplo de controles para la catgirl
    if (cursors.left.isDown) {
        catgirl.setVelocityX(-160);
        catgirl.anims.play("catgirl_left", true);
        catgirl.flipX = 0;
        catgirl.setOffset(6, 3);
    } else if (cursors.right.isDown) {
        catgirl.setVelocityX(160);
        catgirl.anims.play("catgirl_right", true);
        catgirl.flipX = 1;
        catgirl.setOffset(-6, 3);
    } else {
        catgirl.setVelocityX(0);
        catgirl.anims.play("catgirl_turn", true);
    }
    if (cursors.up.isDown && girl.body.touching.down) {
        catgirl.setVelocityY(-330);
    }
  }
}

function collectStar(player, star) {
    star.disableBody(1, 1);
    score += 10;
    scoreText.setText("Score: " + score);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(1, child.x, 0, 1, 1);
        });
        var x =
            player.x < 400
                ? Phaser.Math.Between(400, 800)
                : Phaser.Math.Between(0, 400);
        var bomb = bombs.create(x, 16, "star");
        bomb.setTint(0xff0000);
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(1);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}
function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");
    gameOver = 1;
}
