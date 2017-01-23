/**
 * Generated from the Phaser Sandbox
 *
 * //phaser.io/sandbox/whlpUHlO
 *
 * This source requires Phaser 2.6.2
 */

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.baseURL = 'http://examples.phaser.io/assets/';
    game.load.crossOrigin = 'anonymous';

    game.load.image('ship', 'sprites/thrust_ship.png');
    game.load.image('ebullet', 'sprites/shmup-bullet.png');
    game.load.image('bullet', 'sprites/bullet.png');
    game.load.image('background', 'misc/starfield.jpg');
}

var self;

function makeEnemy(x, y, v) {
    console.log(self);
    var enemy = self.add.sprite(x, y, 'ship');
    enemy.anchor.set(0.5);
    game.physics.arcade.enable(enemy);
    enemy.body.drag.set(70);
    enemy.body.maxVelocity.set(v);
    var eweapon = game.add.weapon(30, 'ebullet');

    //  The bullet will be automatically killed when it leaves the world bounds
    eweapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  The speed at which the bullet is fired
    eweapon.bulletSpeed = 600;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    eweapon.fireRate = 100;
    eweapon.trackSprite(enemy, 0, 0, true);
    
    return [enemy, eweapon];
}

function create() {
    self = this;
    
    
    backgroun = game.add.tileSprite(0,0, 800, 600, 'background');
    
 //  Creates 30 bullets, using the 'bullet' graphic
    weapon = game.add.weapon(30, 'bullet');

    //  The bullet will be automatically killed when it leaves the world bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 600;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = 100;

    sprite = this.add.sprite(400, 300, 'ship');
    sprite.scale.set(1.5,1.5);
    sprite.health = 10;

    sprite.anchor.set(0.5);

    game.physics.arcade.enable(sprite);

    sprite.body.drag.set(70);
    sprite.body.maxVelocity.set(200);

    //  Tell the Weapon to track the 'player' Sprite
    //  With no offsets from the position
    //  But the 'true' argument tells the weapon to track sprite rotation
    weapon.trackSprite(sprite, 0, 0, true);

    cursors = this.input.keyboard.createCursorKeys();

    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    
    enemies = [];
    enemies = [1,2,3,4,5,6,7,8,9,0].map(function(i) {
        return makeEnemy(game.world.randomX, game.world.randomY, 200*Math.random()+100);        
    });
    
    score = 0;
    scoreText = game.add.text(16, 34, 'Score: 0', { fontSize: "16px", fill:"#ccc"});
    healthText = game.add.text(16,16, 'Health: '+sprite.health, { fontSize: "16px", fill:"#ccc"});
}



function updateShip(sprite, invert, noise, up, left, right) {
    var deltaAV = invert? -300: 300;
    noise = noise | 1.0;
    
    up = up !== undefined? up: cursors.up.isDown;
    left = left !== undefined? left: cursors.left.isDown;
    right = right !== undefined? right: cursors.right.isDown;
    
    if (up)
    {
        var a = Math.random() < noise? 300: 300*noise;
        game.physics.arcade.accelerationFromRotation(sprite.rotation, a, sprite.body.acceleration);
    } else {
        sprite.body.acceleration.set(0);
    }

    if (cursors.left.isDown) {
        sprite.body.angularVelocity = -deltaAV;
        
    } else if (cursors.right.isDown) {
        sprite.body.angularVelocity = deltaAV;
    }
    else
    {
        sprite.body.angularVelocity = 0;
    }

    game.world.wrap(sprite, 16);
}

function not(activate) {
    return function(input) {
        return activate? !input: input;
    }
}

function updateScore(delta) {
    score += delta;
    scoreText.text = "Score: "+score;
}

function enemyShot(enemy, weapon) {
    console.log("ENEMY HIT", enemy, weapon);
    enemy.kill();
    weapon.kill();
    updateScore(100);
}

function playerShot(player, bullet) {
    player.damage(1);
    bullet.kill();
    healthText.text = 'Health: '+player.health;
}

function update() {
    var self = this;
    updateShip(sprite);
    if (fireButton.isDown) {
        weapon.fire();
        updateScore(-1);
    }
    
    enemies.forEach(function(pair) {
        var [enemy, eweapon] = pair;
        if (!enemy.alive) return;
        var enemySleep = Math.random() < 0.15;
        var fuzz = not(Math.random() < 0.55);
        
        if (!enemySleep) {
            updateShip(enemy, fuzz(true), Math.random()*1.5+0.5, fuzz(cursors.up.isDown), fuzz(cursors.left.isDown), fuzz(cursors.right.isDown));
        }
        if (fireButton.isDown && fuzz(true)) {
            eweapon.fire();
        }
        game.physics.arcade.overlap(enemy, weapon.bullets, enemyShot, null, self);
        game.physics.arcade.overlap(sprite, eweapon.bullets, playerShot, null, self);
    });
    
    
}

function render() {

}
