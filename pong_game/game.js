var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', 
			{ 
				preload: preload, 
				create: create, 
				update: update
			});

var paddle1, paddle2, ball_launched, ball_velocity, score1_text, score2_text, score1, score2;

function preload() {
	game.load.image("paddle", "assets/paddle.png");
	game.load.image("ball", "assets/ball.png");
	game.load.audio("hit_1", ["assets/hit_1.wav", "assets/hit_1.ogg"]);
	game.load.audio("hit_2", ["assets/hit_2.wav", "assets/hit_2.ogg"]);
}

function create() {
	paddle1 = create_paddle(0, game.world.centerY);
	paddle2 = create_paddle(game.world.width - 5, game.world.centerY);

	ball_launched = false;
	ball_velocity = 400;
	ball = create_ball(game.world.centerX,game.world.centerY);

	game.input.onDown.add(launch_ball, this);

	score1_text=game.add.text(128,128,'0',{
		font: "64px Arial",
		fill: "#ffffff",
		align: "center"
	});
	score2_text=game.add.text(game.world.width - 128,128,'0',{
		font: "64px Arial",
		fill: "#ffffff",
		align: "center"
	});

	score1=0;
	score2=0;
}

function update() {

	score1_text.setText(score1);
	score2_text.setText(score2);

	control_paddle(paddle1,game.input.y);

	//collision
	game.physics.arcade.collide(paddle1,ball,function(){
		var music1 = game.add.audio("hit_1");
		music1.play();
	});
	game.physics.arcade.collide(paddle2,ball,function(){
		var music2 = game.add.audio("hit_2");
		music2.play();
	});

	if(ball.body.blocked.left) {
		//console.log("player 2 scores");
		score2++;
	} else if(ball.body.blocked.right) {
		//console.log("player 1 scores");
		score1++;
	}

	//ai

	//set player 2's velocity to ball's velocity
	paddle2.body.velocity.x = ball.body.velocity.y;
	paddle2.body.velocity.y = ball.body.velocity.y;
	paddle2.body.velocity.x = 0;

	//cap
	paddle2.body.maxVelocity.y = 250;

}

function create_paddle(x,y) {
	//create sprites
	var paddle = game.add.sprite(x, y, "paddle");
	paddle.anchor.x = 0.5;
	paddle.anchor.y = 0.5;
	//set physics
	game.physics.arcade.enable(paddle);
	paddle.body.collideWorldBounds = true;
	paddle.body.immovable = true;
	paddle.scale.x = 0.5;
	paddle.scale.y = 0.5;


	return paddle;
}

function control_paddle(paddle,y) {
	//take mouse pos...
	paddle.y=y;

	//set paddle pos...
	if(paddle.y < paddle.height / 2) {
		paddle.y = paddle.height / 2;
	} else if(paddle.y > game.world.height - paddle.height / 2){
		paddle.y = game.world.height - paddle.height / 2;
	}
}

function create_ball(x,y) {
	//create sprite
	var ball = game.add.sprite(x,y,"ball");
	ball.anchor.x=0.5;
	ball.anchor.y=0.5;
	//set physics
	game.physics.arcade.enable(ball);
	ball.body.collideWorldBounds=true;
	ball.body.bounce.x=1;
	ball.body.bounce.y=1;
	return ball;
}

function launch_ball(x,y) {
	//check if ball is launched...
	if(ball_launched) {
		ball.x=game.world.centerX;
		ball.y=game.world.centerY;
		ball.body.velocity.x=0;
		ball.body.velocity.y=0;
		ball_launched=false;
	//launch the ball...
	}else{
		ball.body.velocity.x=-ball_velocity;
		ball.body.velocity.y=ball_velocity;
		ball_launched=true;
	}
}

//text objects
//bitmap