/*
 * Author:
 
 */

var Game = {};
var textoTabla = null;
Game.init = function () {
    game.stage.disableVisibilityChange = true;
};

//Cargamos los recursos del juego.
Game.preload = function () {
	game.load.tilemap('map', 'assets/map/mapa.csv', null, Phaser.Tilemap.TILED_CSV);
	game.load.image('tile', 'assets/map/tiles.png');
	game.load.image('sprite', 'assets/sprites/sprite.png');

	game.load.spritesheet('curador', 'assets/sprites/curador-corre.png',53,46);
	game.load.spritesheet('mago', 'assets/sprites/mago.png',40,40);
	game.load.spritesheet('arquero', 'assets/sprites/arquero-corre.png',31.3,42);
	game.load.spritesheet('caballero', 'assets/sprites/caballero-corre.png',53.6,53);
    //IMG para los disparos.
	game.load.image('bono', 'assets/sprites/esfera.png');

//***cargamos botones
	game.load.spritesheet('btn_diagonal','assets/botones/button-diagonal.png',64,64);
	game.load.spritesheet('btn_horizontal','assets/botones/button-horizontal.png',96,64);
	game.load.spritesheet('btn_vertical','assets/botones/button-horizontal.png',64,64);
	game.load.spritesheet('btn_atacar','assets/botones/boton_atacar.png',64,64);
};

Game.create = function () {
   //Redimensionamos el tamaño actal del juego para que se pueda adaptar a las distintas pantallas de forma proporcional
     game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
     game.scale.pageAlignHorizontally = true;
     game.scale.pageAlignVertically = true;
    // game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    //Escalado utilizado cuando está en pantalla completa.

     game.physics.startSystem(Phaser.Physics.ARCADE);

    //Objeto json para guardar los jugadores que se conectan al servidor.
    Game.playerMap = {};
    //var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    //testKey.onDown.add(Client.sendTest, this);

    //Capturamos las teclas que pulsa el usuario.
    var q = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    //Si el usuario presiona la tecla Q, llamamos a la funcion mover.
    q.onDown.add(Client.mover, this);

    var w = game.input.keyboard.addKey(Phaser.Keyboard.W);
    w.onDown.add(Client.mover, this);

    var e = game.input.keyboard.addKey(Phaser.Keyboard.E);
    e.onDown.add(Client.mover, this);

    var d = game.input.keyboard.addKey(Phaser.Keyboard.D);
    d.onDown.add(Client.mover, this);

    var c = game.input.keyboard.addKey(Phaser.Keyboard.C);
    c.onDown.add(Client.mover, this);

    var x = game.input.keyboard.addKey(Phaser.Keyboard.X);
    x.onDown.add(Client.mover, this);

    var z = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    z.onDown.add(Client.mover, this);

    var a = game.input.keyboard.addKey(Phaser.Keyboard.A);
    a.onDown.add(Client.mover, this);

    //Creamos un grupo para emitir disparos.
    /*esferas=game.add.group();
     esferas.enableBody=true;
     esferas.physicsBodyType=Phaser.Physics.ARCADE;
     esferas.createMultiple(20, 'bono');*/
    //Si presionamos la tecla S, obtenemos un disparo y lo enviamos al servidor.
    var s = game.input.keyboard.addKey(Phaser.Keyboard.S);
    s.onDown.add(Client.atacar);

    //Incluimos el tilemap del juego.
    var map = game.add.tilemap('map', 53, 53);
    map.addTilesetImage('tile'); // tilesheet is the key of the tileset in map's JSON file
    var layer;
    for (var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }
    layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    //layer.events.onInputUp.add(Game.getCoordinates, this);

    var style = {font: "32px Courier", fill: "#fff", tabs: [164, 120]};
    var headings = ['Equipo', 'Puntos'];
    var text = Game.add.text(32, 32, '', style);
    textoTabla = Game.add.text(32, 60, '', style);
    text.parseList(headings);
    //Client.askNewPlayer();
    Client.getAllPlayers();
 
//***botones para movil
  
//Cargamos los métodos de los botones a utilizar con:
    //game.add.button(x,y,key, función a llamar cuando se presiona el botón,
    //contexto en el que se llama(this), overFrame (sobre el botón), outframe(fuera del botón),
    //down frame(activo), up frame(inactivo));

//    idMov=0;
    btnIzqArb = game.add.button(30,1870,'btn_diagonal', null,this,2,0,2,0); // ver si falta actionOnClick(Client)
    inicializar_boton(btnIzqArb,0);

  //  idMov = 1;
    btnArriba = game.add.button(110,1870,'btn_vertical', null,this,0,2,0,2);
    inicializar_boton(btnArriba,1);
    
    //idMov=2;
    btnDerArb = game.add.button(190,1870,'btn_diagonal', null,this,3,1,3,1);
    inicializar_boton(btnDerArb,2);
    
    //idMov=7;
    btnIzq = game.add.button(15,1950,'btn_horizontal', null,this,0,1,0,1);
    inicializar_boton_horiz(btnIzq,7);
    
    //idMov=3;
    btnDer = game.add.button(190,1950,'btn_horizontal', null,this,0,1,0,1);
    inicializar_boton_horiz(btnDer,3);

    idMov=6;
    btnIzqAbj = game.add.button(30,2020,'btn_diagonal', null,this,6,4,6,4);
    inicializar_boton(btnIzqAbj,6);

    idMov=4;
    btnDerAbj = game.add.button(190,2020,'btn_diagonal', null,this,7,5,7,5);
    inicializar_boton(btnDerAbj,4);

    idMov=5;
    btnAbajo = game.add.button(110,2020,'btn_vertical', null,this,0,2,0,2);
    inicializar_boton(btnAbajo,5);

    btnAtacar = game.add.button(2300,1870,'btn_atacar', Client.atacar(),this,0,1,0,1);
    //inicializar_boton_atacar(btnAtacar,atacar);
    btnAtacar.fixedToCamera = true;	//el botón se debería mover junto con la pantalla
    btnAtacar.scale.setTo(2.2,2.2);
    btnAtacar.onInputOver.add(function(){Client.atacar();});
    //btnAtacar.onInputOut.add(function(){direc=false;});
    btnAtacar.onInputDown.add(function(){Client.atacar();});
    //btnAtacar.onInputUp.add(function(){direc=false;});
};

/***
  Agregamos los métodos necesarios para usar botones
*/
function inicializar_boton_horiz(btn,direc){
    inicializar_boton(btn,direc);
    btn.scale.setTo(1,1);
}

function inicializar_boton(btn,direc){
    btn.fixedToCamera = true;	//el botón se debería mover junto con la pantalla
    btn.scale.setTo(1.2,1.2);
    btn.visible=true;
    btn.onInputOver.add(function(){Client.mover2(direc);});
    btn.onInputDown.add(function(){Client.mover2(direc);});
    //btn.onInputOut.add(function(){direc=false;});
    //btn.onInputDown.add(function(){direc=true;});
    //btn.onInputUp.add(function(){direc=false;});
}
/** Finalizan los métodos de botones   */

Game.getCoordinates = function (layer, pointer) {
    Client.sendClick(pointer.worldX, pointer.worldY);
};

Game.addNewPlayer = function (id, x, y, rol) {

    //Agregamos el sprite correspondiente al nuevo jugador.
    switch (rol) {
        case "Caballero" :
            console.log('Este es el rol seleccionado en game.js');
            console.log(Client.rol);
            Game.playerMap[id] = game.add.sprite(x, y, 'caballero');
            game.physics.arcade.enable(Game.playerMap[id]);
            
            Game.playerMap[id].animations.add('derecha',[0,1,2,3,4,5,6,7],8,true);
            Game.playerMap[id].animations.add('izquierda',[8,9,10,11,12,13,14,15],8,true);
            Game.playerMap[id].animations.play('izquierda');
            break;
        case "Arquero"   :
            Game.playerMap[id] = game.add.sprite(x, y, 'arquero');
            game.physics.arcade.enable(Game.playerMap[id]);
            
            Game.playerMap[id].animations.add('derecha',[2,3,4,5,6,7,8],8,true);       
            Game.playerMap[id].animations.add('izquierda',[14,15,16,17,18,19,20],8,true);
            Game.playerMap[id].animations.play('derecha');
            break;
        case "Mago"  :
            Game.playerMap[id] = game.add.sprite(x, y, 'mago');
            game.physics.arcade.enable(Game.playerMap[id]);
            
            Game.playerMap[id].animations.add('correr',[0,1,2],6,true);
            Game.playerMap[id].animations.add('atacar',[2,7,6,11,12,13,14,13,14,13,14,13],6,true);
            Game.playerMap[id].animations.play('atacar');
            
            break;
        case "Curador"   :
            Game.playerMap[id] = game.add.sprite(x, y, 'curador');
            game.physics.arcade.enable(Game.playerMap[id]);
            
            Game.playerMap[id].animations.add('derecha',[0,1,2,3,4,5,6,7,8,9,10,11],8,true);
            Game.playerMap[id].animations.add('izquierda',[12,13,14,15,16,17,18,19,20,21,22,23],8,true);
            Game.playerMap[id].animations.play('derecha');
            break;
        case "Bono"   :
            Game.playerMap[id] = game.add.sprite(x, y, 'bono');
            //game.physics.arcade.enable(Game.playerMap[id]);
            break;
        default :
            Game.playerMap[id] = game.add.sprite(x, y, 'sprite');
            game.physics.arcade.enable(Game.playerMap[id]);

    }
    var dy;
    if(rol=="Bono") dy=10;
    else dy=40;
    var t = Game.add.text(0, dy, id);
    Game.playerMap[id].addChild(t);

};


//Movemos un jugador en el ambiente del juego.
Game.movePlayer = function (id, x, y) {
    if (typeof Game.playerMap != "undefined" && typeof Game.playerMap[id] != "undefined") {
        var player = Game.playerMap[id];
        var distance = Phaser.Math.distance(player.x, player.y, x, y);
        var tween = game.add.tween(player);
        var duration = 0;//distance*10;
        tween.to({x: x, y: y}, duration);
        //tween.animations.playanimations.play('moverizquierda');
        tween.start();

        if (id === Client.id) {
            console.log(id + " x: " + x + " y: " + y);
        }
    }
};

//Eliminamos un jugador del grupo.
Game.removePlayer = function (id) {
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};
Game.updateTabla = function (data) {
    data.sort(function (a, b) {
        return (a[1] < b[1] ? 1 : (a[1] > b[1] ? -1 : 0));
    });
    textoTabla.parseList(data);
};

