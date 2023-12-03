var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 1000,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
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

//variables globales
var gameOver = 0;
var score = 0;
var scoreText;
var powerCat = 0;
var catgirl = null;
var lastPlatformY = 600;

//Start Game
var game = new Phaser.Game(config);

//cargar objetos
function preload() {
    this.load.image("sky", "assets/Background_2.png");
    this.load.image("sky2", "assets/sky.png");
    this.load.image("girlPicture", "assets/portrait_female.png"); //girl piture
    this.load.image("catGirlPicture", "assets/portrait only_cat_kigurumi.png"); //cat piture
    this.load.image("ground", "assets/platform.png"); //plataforma
    this.load.image("backgroundInfo", "assets/backgroundinfo.png"); //plataforma
    this.load.image("star", "assets/star.png"); //estrellas
    this.load.spritesheet("controls", "assets/tilemap_packed.png", {
        //items
        frameWidth: 544 / 34,
        frameHeight: 384 / 24,
    });
    this.load.spritesheet("objects", "assets/objects.png", {
        //items
        frameWidth: 96 / 6,
        frameHeight: 64 / 4,
    });
    this.load.spritesheet("girl", "assets/girl.png", {
        //personaje
        frameWidth: 192 / 8,
        frameHeight: 72 / 3,
    });
    this.load.spritesheet("catgirl", "assets/catgirl.png", {
        //traje de gato
        frameWidth: 192 / 8,
        frameHeight: 72 / 3,
    });
}
//crear objetos y funciones del juego
function create() {
    //BACKGROUND
    background = this.add.image(400, 300, "sky");
    background.setDisplaySize(496 * 4, 272 * 4).setScrollFactor(0);
    this.tweens.add({
        targets: background,
        x: 496,
        y: 272,
        duration: 15000,
        ease: "Linear",
        yoyo: true,
        repeat: -1,
    });
    background2 = this.add.image(400, 1000, "sky2").setTint(0xdddddd).setDisplaySize(800, 400).setScrollFactor(0);

    //PLATAFORMAS
    platforms = this.physics.add.staticGroup();
    platforms.create(0, 568, "ground");
    platforms.create(800, 568, "ground");
    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");
    platforms.create(400, 50, "ground");

    

    //POWER UP GATO
    var catPowerupSprite = this.physics.add.sprite(750, 50, "objects", 0);
    catPowerupSprite.setScale(3);
    this.physics.add.collider(catPowerupSprite, platforms);

    //CONTENEDOR PERSONAJE
    playerContainer = this.add.container(700, 50);
    // Crear a la chica (girl)
    girl = this.physics.add.sprite(0, 0, "girl");
    girl.setSize(24, 20);
    girl.setOffset(3, 3);
    girl.setScale(3);
    this.physics.add.collider(girl, platforms);
    this.physics.add.overlap(girl, catPowerupSprite, collectCat, 0, 1);

    //camera
    this.cameras.main.setBounds(0, 0, 800, Infinity); 
    this.cameras.main.startFollow(girl, false, 0.5, 2);
    this.cameras.main.setZoom(1);

    //powerup de gato traje
    catgirl = this.physics.add.sprite(900, 0, "catgirl");
    catgirl.setSize(24, 20);
    catgirl.setOffset(3, 3);
    catgirl.setScale(3);
    this.physics.add.collider(catgirl, platforms);
    // Agregar personaje (girl) al contenedor
    playerContainer.add([girl]);

    //ANIMACIONES
    //girl
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
    //catgirl
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

    //LLAMAR CONTROLES
    cursors = this.input.keyboard.createCursorKeys();
    //controles telefono
    upButton = this.add
        .sprite(650, 900, "controls", 757)
        .setScale(8)
        .setInteractive()
        .setScrollFactor(0);
    upButton.setInteractive();
    upButton.on("pointerdown", function (pointer) {
        cursors.up.isDown = true;
    });
    upButton.on("pointerup", function (pointer) {
        cursors.up.isDown = false;
    });
    leftButton = this.add
        .sprite(100, 900, "controls", 760)
        .setScale(8)
        .setInteractive()
        .setScrollFactor(0);
    leftButton.setInteractive();
    leftButton.on("pointerdown", function (pointer) {
        cursors.left.isDown = true;
    });
    leftButton.on("pointerup", function (pointer) {
        cursors.left.isDown = false;
    });
    rightButton = this.add
        .sprite(300, 900, "controls", 758)
        .setScale(8)
        .setInteractive()
        .setScrollFactor(0);
    rightButton.setInteractive();
    leftButton.on("pointerdown", () => {});
    rightButton.on("pointerdown", function (pointer) {
        cursors.right.isDown = true;
    });
    rightButton.on("pointerup", function (pointer) {
        cursors.right.isDown = false;
    });
    //ESTRELLAS
    stars = this.physics.add.group({
        key: "star",
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
    });
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(stars, girl, collectStar, 0, 1);
    //spawn estrellas
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    //BOMBAS
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(bombs, girl, hitBomb, null, this);

    //PERSONAJE DESC
backgroundInfo = this.add.image(600, 800, "backgroundInfo");
backgroundInfo.setDisplaySize(170 * 2, 60* 2).setScrollFactor(0).setDepth(1);  // Ajusta la profundidad según sea necesario

girlPicture = this.physics.add.staticGroup();
girlPicture.create(480, 776, "girlPicture").setScale(1.7).setScrollFactor(0).setDepth(2);  // Ajusta la profundidad según sea necesario

//PUNTUACION
scoreText = this.add
    .text(560, 780, "Score: 0", {
        fontSize: "32px",
        fill: "black",
    })
    .setScrollFactor(0).setDepth(3);  // Ajusta la profundidad según sea necesario

//cat character
catGirlPicture = this.physics.add.staticGroup();

}

//ACTUALIZAR EVENTOS
function update() {
    if (girl.y - lastPlatformY >= 200) {
        console.log("test1");
        createRandomPlatform(this, girl.x);
    }
    //controles para la chica (girl)
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

    if (cursors.up.isDown && girl.body.touching.down) {
        girl.setVelocityY(-330);
    }
    if (catgirl != null) {
        //controles para la catgirl
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
//FUNCTIONS INGAME
//powerup cat
function collectCat(girl, catPowerupSprite) {
    catPowerupSprite.disableBody(1, 1);
    playerContainer.add([catgirl]);
    catgirl.x = girl.x;
    catgirl.y = girl.y - 10;
    catGirlPicture
        .create(480, 776, "catGirlPicture")
        .setScale(1.7)
        .setScrollFactor(0)
        .setDepth(10);
}
//estrellas y puntos
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
//bombas
function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    girlPicture.setTint(0xff0000);
    player.anims.play("turn");
    gameOver = 1;
}
function evento() {
    var eventoTeclado = new KeyboardEvent("keydown", {
        key: "ArrowRight",
    });
    document.dispatchEvent(eventoTeclado);
}
function createPlatform(scene, x, y) {
    lastPlatformY = y;
    console.log("test3 " + lastPlatformY);
    platforms.create(x, y, "ground");
}
function createRandomPlatform(scene, playerX) {
    console.log("test2");
    var randomX = Phaser.Math.Between(playerX + 700, playerX + 900);
    createPlatform(scene, randomX, lastPlatformY + 600);
}
