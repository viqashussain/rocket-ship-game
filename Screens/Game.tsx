import Matter from "matter-js"
import React, { createRef, useEffect, useRef, useState } from "react"
import { View, TouchableOpacity, StatusBar, Text, StyleSheet, ImageBackground, Modal, Pressable, Alert, Image } from "react-native"
import { GameEngine } from "react-native-game-engine"
import { useDispatch, useSelector } from "react-redux"
import Rocket from "../matter-objects/Rocket"
import Constants from "../Constants"
import Wall from "../matter-objects/Wall"
import { Audio } from 'expo-av';
import { DECREASE_HEALTH, INCREASE_HEALTH, INCREMENT_LEVEL, RESET_GAME, UPDATE_SCORE } from "../redux/Actions"
import Asteroid from "../matter-objects/Asteroid"
import Fuel from "../matter-objects/Fuel"
import * as Haptics from 'expo-haptics';
import { saveHighScoreLocally } from "../Storage";
import { HighScore } from "../types/HighScore";
import { saveGlobalHighScore } from "../Firebase"
import BronzeCoin from "../matter-objects/BronzeCoin"
import SilverCoin from "../matter-objects/SilverCoin"
import GoldCoin from "../matter-objects/GoldCoin"
import LottieView from 'lottie-react-native'; // if you have "esModuleInterop": true
import { numberWithCommas } from "./Helpers"
import { coinVerticies, rocketVerticies, fuelVerticies } from "../verticies"

export default function Game(props: any) {

    const health100Image = require('../assets/img/100health.png');
    const health75Image = require('../assets/img/75health.png');
    const health50Image = require('../assets/img/50health.png');
    const health25Image = require('../assets/img/25health.png');

    // randmomize the first time the coins fall
    const coinsFallTime = [
        Math.random(),
        Math.random(),
        Math.random()
    ];

    const [gameEngine, setGameEngine]: any = useState<Matter.Engine>();
    const [running, setRunning] = useState<boolean>(false);
    const [entities, setEntities]: any = useState(null);
    const [fuelHasBeenAdded, setFuelHasBeenAdded] = useState<boolean>(false);
    const [showContinueButtonOnModal, setShowContinueButtonOnModal] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [countdownValue, setCountdownValue] = useState<number | null>(3);
    const [showCountdownTimer, setShowCountdownTimer] = useState<boolean>(false);
    const [allThreeCoinsHaveBeenIntroduced, setAllThreeCoinsHaveBeenIntroduced] = useState<boolean>(false);
    const [healthImageToUse, setHealthImageToUse] = useState<any>(health100Image);

    const dispatch = useDispatch();

    const { score, level, health } = useSelector(state => (state as any).gameReducer);

    const scoreRef = useRef(score);
    const gameEngineRef = useRef(gameEngine);
    const levelRef = useRef(level);
    const healthRef = useRef(level);
    const entitiesRef = useRef(entities);

    // setup world on load
    useEffect(() => {
        dispatch({ type: RESET_GAME });
        setEntities(setupWorld());
    }, []);

    useEffect(() => {
        if (health === 100) {
            setHealthImageToUse(health100Image);
        }
        else if (health === 75) {
            setHealthImageToUse(health75Image);
        }
        else if (health === 50) {
            setHealthImageToUse(health50Image);
        }
        else if (health === 25) {
            setHealthImageToUse(health25Image);
        }
    }, [health]);

    useEffect(() => {
        if (gameEngine && health === 0) {
            (gameEngine as any).dispatch({ type: "game-over" });
        }
    }, [health]);

    useEffect(() => scoreRef.current = score, [score]);
    useEffect(() => levelRef.current = level, [level]);
    useEffect(() => gameEngineRef.current = gameEngine, [gameEngine]);
    useEffect(() => healthRef.current = health, [health]);
    useEffect(() => entitiesRef.current = entities, [entities]);

    const goToHome = () => {
        setModalVisible(false);
        props.navigation.navigate('Home');
    }

    const restartGame = () => {
        dispatch({ type: RESET_GAME });
        setModalVisible(false);
        setRunning(false);
        setCountdownValue(3);
        const newEntities = setupWorld();
        setEntities(newEntities);
        gameEngine.swap(newEntities);
    }

    const continueGame = () => {
        setShowContinueButtonOnModal(false);
        setModalVisible(false);
        setCountdownValue(3);
        startGame();
    };

    const pauseGame = () => {
        setShowContinueButtonOnModal(true);
        setModalVisible(true);
        setCountdownValue(3);
        setRunning(false);
    }

    const setupWorld = (): any => {
        let engine = Matter.Engine.create({ enableSleeping: false, gravity: { scale: 0.0005 } });
        let world: Matter.World = engine.world;

        Matter.Events.on(engine, 'collisionStart', async (event: Matter.IEventCollision<Matter.Engine>) => {

            const bodyA = event.pairs[0].bodyA;
            const bodyB = event.pairs[0].bodyB;

            // coin item has been hit/collected
            // add to the score
            if ((bodyA.label === 'rocket' && bodyB.label.startsWith('coin') || (bodyB.label === 'rocket' && bodyA.label.startsWith('coin')))) {
                dispatch({ type: UPDATE_SCORE, payload: scoreRef.current + (100 * levelRef.current) })

                let bodyToRemove = bodyA;
                if (bodyB.label.startsWith('coin')) {
                    bodyToRemove = bodyB;
                }

                // remove the coin item now it has been collected
                delete entitiesRef.current[bodyToRemove.label];
                Matter.Composite.remove(world, bodyToRemove, true);

                setEntities(entitiesRef.current);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                await playSound('coin');
            }

            // fuel item has been hit/collected
            // add to the health
            if ((bodyA.label === 'rocket' && bodyB.label.startsWith('fuel') || (bodyB.label === 'rocket' && bodyA.label.startsWith('fuel')))) {
                dispatch({ type: INCREASE_HEALTH })

                let bodyToRemove = bodyA;
                if (bodyB.label.startsWith('fuel')) {
                    bodyToRemove = bodyB;
                }

                // remove the health item now it has been collected
                delete entitiesRef.current[bodyToRemove.label];
                Matter.Composite.remove(world, bodyToRemove, true);

                setEntities(entitiesRef.current);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                await playSound('fuel');
            }

            // asteroid has been hit - take a damage hit
            if ((bodyA.label === 'rocket' && bodyB.label.startsWith('bigRock') || (bodyB.label === 'rocket' && bodyA.label.startsWith('bigRock')))) {
                dispatch({ type: DECREASE_HEALTH })

                await playSound('explosion');
            }

        });

        const rocket = Matter.Bodies.fromVertices(
            Constants.MAX_WIDTH / 2, ((Constants.MAX_HEIGHT / 3) * 2), rocketVerticies as any, {
                label: 'rocket',
                collisionFilter: {
                    group: 1,
                    category: 3,
                    mask: 1
                },
            }, true
        );
        Matter.Body.scale(rocket, 0.04, 0.04);
        Matter.Body.rotate(rocket, Math.PI)

        const rocketWidth = rocket.bounds.max.x - rocket.bounds.min.x;
        const rocketHeight = rocket.bounds.max.y - rocket.bounds.min.y;

        let ceiling = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, 25, Constants.MAX_WIDTH, 50, { isStatic: true, label: 'ceiling' });
        ceiling.collisionFilter = {
            group: 1,
            category: 2,
            mask: 0
        }

        let leftWall = Matter.Bodies.rectangle(0, 500, 5, Constants.MAX_HEIGHT, { isStatic: true, label: 'leftWall' });
        let rightWall = Matter.Bodies.rectangle(Constants.MAX_WIDTH, 500, 5, Constants.MAX_HEIGHT, { isStatic: true, label: 'rightWall' });

        Matter.Composite.add(world, [rocket, ceiling, leftWall, rightWall]);

        return {
            physics: { engine: engine, world: world },
            rocket: { body: rocket, size: [rocketWidth, rocketHeight], color: 'red', renderer: Rocket },
            ceiling: { body: ceiling, size: [Constants.MAX_WIDTH, 10], color: "transparent", renderer: Wall },
            leftWall: { body: leftWall, size: [5, Constants.MAX_HEIGHT * 2], color: "transparent", renderer: Wall },
            rightWall: { body: rightWall, size: [5, Constants.MAX_HEIGHT * 2], color: "transparent", renderer: Wall },
        }
    }

    const playSound = async (soundFileName: string) => {
        let sound;
        if (soundFileName == 'coin') {
            sound = await Audio.Sound.createAsync(
                require(`../assets/sounds/coin.mp3`)
            );
        }
        else if (soundFileName == 'explosion') {
            sound = await Audio.Sound.createAsync(
                require(`../assets/sounds/explosion.mp3`)
            );
        }

        else if (soundFileName == 'game-over') {
            sound = await Audio.Sound.createAsync(
                require(`../assets/sounds/game-over.mp3`)
            );
        }

        else if (soundFileName == 'fuel') {
            sound = await Audio.Sound.createAsync(
                require(`../assets/sounds/fuel.mp3`)
            );
        }


        await sound?.sound.playAsync();
    }

    const onEvent = async (e: any) => {
        if (e.type === "game-over") {
            setRunning(false);
            setModalVisible(true);
            const highScore: HighScore = { id: makeid(), score: score, rank: null };
            await saveHighScoreLocally(highScore);
            await saveGlobalHighScore(highScore);

            await playSound('game-over');
        }
    }

    const startGame = () => {
        setShowCountdownTimer(true);
        let interval = setInterval(() => {
            setCountdownValue(prev => {
                if (prev === 1) {
                    setShowCountdownTimer(false);
                    setCountdownValue(null);
                    setRunning(true);
                    clearInterval(interval);
                }
                return prev === null ? null : prev - 1;
            })
        }, 1000)
        // interval cleanup on component unmount
        return () => clearInterval(interval)
    }

    const ScoreCounter = (entities: any, { touches, time }: any) => {
        if (scoreRef.current > 3000 && levelRef.current === 1) {
            dispatch({ type: INCREMENT_LEVEL })
        }
        else if (scoreRef.current > 6000 && levelRef.current === 2) {
            dispatch({ type: INCREMENT_LEVEL })
        }

        dispatch({ type: UPDATE_SCORE, payload: scoreRef.current + ((levelRef.current / 10) * time.delta) })
        return entities;
    }

    let objectSizes = Constants.OBJECT_SIZES.find(x => x.level === levelRef.current)!;

    const rockCollisionFilter = {
        group: -2,
    }

    const coinCollisionFilter = {
        group: -2,
    }

    const fuelCollisionFilter = {
        group: -2,
    }

    const bigRock1 = Matter.Bodies.rectangle(getXCoOrdForObjectInsertion(objectSizes.asteroid), -200, objectSizes.asteroid, objectSizes.asteroid, { restitution: objectSizes.asteroidRestitution, label: 'bigRock1', collisionFilter: rockCollisionFilter });
    const bigRock2 = Matter.Bodies.rectangle(getXCoOrdForObjectInsertion(objectSizes.asteroid), -200, objectSizes.asteroid, objectSizes.asteroid, { restitution: objectSizes.asteroidRestitution, label: 'bigRock2', collisionFilter: rockCollisionFilter });
    const bigRock3 = Matter.Bodies.rectangle(getXCoOrdForObjectInsertion(objectSizes.asteroid), -200, objectSizes.asteroid, objectSizes.asteroid, { restitution: objectSizes.asteroidRestitution, label: 'bigRock3', collisionFilter: rockCollisionFilter });

    const coin1 = Matter.Bodies.rectangle(getXCoOrdForObjectInsertion(objectSizes.coin), -200, objectSizes.coin, objectSizes.coin, { label: 'coin1', collisionFilter: coinCollisionFilter });
    const coin2 = Matter.Bodies.rectangle(getXCoOrdForObjectInsertion(objectSizes.coin), -200, objectSizes.coin, objectSizes.coin, { label: 'coin2', collisionFilter: coinCollisionFilter });
    const coin3 = Matter.Bodies.rectangle(getXCoOrdForObjectInsertion(objectSizes.coin), -200, objectSizes.coin, objectSizes.coin, { label: 'coin3', collisionFilter: coinCollisionFilter });

    const fuel = Matter.Bodies.rectangle(getXCoOrdForObjectInsertion(objectSizes.fuel), -200, objectSizes.fuel, objectSizes.fuel, { label: 'fuel', collisionFilter: fuelCollisionFilter });


    const Physics = (entities: any, { touches, time }: any) => {
        let engine: Matter.Engine = entities.physics.engine;
        let rocket: Matter.Body = entities.rocket.body;
        const world: Matter.World = entities.physics.world;

        touches.filter((t: any) => t.type === "press").forEach((t: any) => {
            const forceScale = 0.075;
            const locationX = t.event.locationX;
            const isLeftTouch = locationX < (Constants.MAX_WIDTH / 2);
            Matter.Body.rotate(rocket, Math.PI / 6);
            if (isLeftTouch) {
                const amountLeft = 1 - (locationX / (Constants.MAX_WIDTH / 2));
                // the further left you press, the further you fly right
                const force = forceScale * amountLeft;
                Matter.Body.applyForce(rocket, rocket.position, { x: -force, y: -forceScale });
            }
            else {
                const amountRight = (locationX - 200) / (Constants.MAX_WIDTH / 2);
                // the further right you press, the further you fly left
                const force = forceScale * amountRight;
                Matter.Body.applyForce(rocket, rocket.position, { x: force, y: -forceScale });
            }
        });

        reRenderRock('bigRock1', entities, world, bigRock1);
        if (levelRef.current === 2) {
            reRenderRock('bigRock2', entities, world, bigRock2);
        }
        if (levelRef.current === 3) {
            reRenderRock('bigRock3', entities, world, bigRock3);
        }


        reRenderCoin('coin1', entities, world, coin1);
        reRenderCoin('coin2', entities, world, coin2);
        reRenderCoin('coin3', entities, world, coin3);

        const fuelWidth = fuel.bounds.max.x - fuel.bounds.min.x;
        const fuelHeight = fuel.bounds.max.y - fuel.bounds.min.y;

        //add a fuel item every 10 seconds
        const timeSeconds = new Date(time.current).getSeconds();

        if (timeSeconds % Constants.ADD_FUEL_SECOND_INTERVAL === 0 && !fuelHasBeenAdded) {
            Matter.World.add(world, fuel);
            entities.fuel = { body: fuel, size: [fuelWidth, fuelHeight], renderer: Fuel };
            setFuelHasBeenAdded(true);
        }
        else if (timeSeconds % Constants.ADD_FUEL_SECOND_INTERVAL !== 0) {
            setFuelHasBeenAdded(false);
        }

        Matter.Engine.update(engine, time.delta);

        // if the rocket has gone off the screen, gameover
        if (rocket.position.y - + 200 > Constants.MAX_HEIGHT) {
            //Matter.World.remove(world, entities[rockName].body);
            //delete entities[rockName];
            (gameEngineRef.current as any).dispatch({ type: "game-over" });
        }

        return entities;
    };

    function reRenderRock(rockName: string, entities: any, world: any, rock: Matter.Body) {
        const width = rock.bounds.max.x - rock.bounds.min.x;
        const height = rock.bounds.max.y - rock.bounds.min.y;
        // if the rock already exists
        if (entities[rockName]) {
            // if the rock has fallen out of the bottom of the screen
            if (entities[rockName].body.position.y > Constants.MAX_HEIGHT) {
                Matter.World.remove(world, entities[rockName].body);
                delete entities[rockName];

                Matter.World.add(world, rock);
                entities[rockName] = { body: rock, size: [width, height], color: "blue", renderer: Asteroid };
            }
        }
        else {
            Matter.World.add(world, rock);
            entities[rockName] = { body: rock, size: [width, height], color: "blue", renderer: Asteroid };
        }
    }

    function reRenderCoin(coinName: string, entities: any, world: any, rock: Matter.Body) {
        let coinRenderer = BronzeCoin;
        if (levelRef.current === 2) {
            coinRenderer = SilverCoin;
        }
        else if (levelRef.current === 3) {
            coinRenderer = GoldCoin;
        }
        const width = rock.bounds.max.x - rock.bounds.min.x;
        const height = rock.bounds.max.y - rock.bounds.min.y;
        // if the rock already exists
        if (entities[coinName]) {
            // if the rock has fallen out of the bottom of the screen
            if (entities[coinName].body.position.y > Constants.MAX_HEIGHT) {
                Matter.World.remove(world, entities[coinName].body);
                delete entities[coinName];

                Matter.World.add(world, rock);
                entities[coinName] = { body: rock, size: [width, height], color: "blue", renderer: coinRenderer };
            } else {
                // Matter.Body.translate(entities["pipe" + i].body, { x: -1, y: 0 });
            }
        }
        else {
            if (!allThreeCoinsHaveBeenIntroduced) {
                const coinNumberIndex = parseInt(coinName.substring(4, 5)) - 1;
                if ((score / 100) > coinsFallTime[coinNumberIndex]) {
                    Matter.World.add(world, rock);
                    entities[coinName] = { body: rock, size: [width, height], color: "blue", renderer: coinRenderer };
                    
                    if (entities['coin1'] && entities['coin2'] && entities['coin3'])
                    {
                        setAllThreeCoinsHaveBeenIntroduced(true);
                    }
                }
            }
            else {
                Matter.World.add(world, rock);
                entities[coinName] = { body: rock, size: [width, height], color: "blue", renderer: coinRenderer };
            }
        }
    }

    const imageBackground = require('../assets/img/background.png');
    const pausePanel = require('../assets/img/pause-panel.png');
    const gameoverPanel = require('../assets/img/game_over-panel.png');
    const quitButton = require('../assets/img/quit.png');
    const restartButton = require('../assets/img/restart.png');
    const resumeButton = require('../assets/img/resume.png');
    const scoreboard = require('../assets/img/scoreboard.png');
    const pauseButton = require('../assets/img/pause.png');

    return (
        <View style={styles.container}>
            <ImageBackground source={imageBackground} resizeMode="cover" style={styles.backgroundImage}>

                {
                    showCountdownTimer &&
                    <LottieView style={styles.countdownTimer} source={require('../assets/CountDown.json')} autoPlay />
                }

                {
                    (!showCountdownTimer && !running) &&
                    <Text style={styles.tapToPlayText}>Tap to Play!</Text>
                }

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible(!modalVisible);
                    }}

                >
                    <View style={styles.centeredView}>
                        <ImageBackground source={showContinueButtonOnModal ? pausePanel : gameoverPanel} style={styles.pausePanelImage}>

                            <Text style={styles.modalText}>Score: {numberWithCommas(score)}</Text>

                            {
                                showContinueButtonOnModal &&
                                <TouchableOpacity style={styles.modalButton} onPress={() => continueGame()}>
                                    <Image source={resumeButton} style={styles.modalButtonImage}></Image>
                                </TouchableOpacity>
                            }

                            <TouchableOpacity style={styles.modalButton} onPress={() => restartGame()}>
                                <Image source={restartButton} style={styles.modalButtonImage}></Image>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalButton} onPress={() => goToHome()}>
                                <Image source={quitButton} style={styles.modalButtonImage}></Image>
                            </TouchableOpacity>


                        </ImageBackground>
                    </View>
                </Modal>
                {
                    <TouchableOpacity
                        onPress={() => pauseGame()}
                        style={styles.pauseGameButton}
                    >
                        <Image style={styles.pauseGameButton} source={pauseButton}></Image>
                    </TouchableOpacity>
                }
                <View style={styles.scoreHealthContainer}>
                    <Image style={styles.health} source={healthImageToUse}></Image>
                    <View style={styles.emptySpace}></View>
                    <ImageBackground style={styles.score} source={scoreboard}>
                        <Text style={styles.scoreText}>{numberWithCommas(score)}</Text>
                    </ImageBackground>
                </View>
                {
                    !running &&
                    <TouchableOpacity
                        onPress={() => startGame()}
                        style={styles.startGameButton}
                    ></TouchableOpacity>
                }

                {
                    entities != null ?
                        <GameEngine
                            ref={(ref) => {
                                if (ref) {
                                    setGameEngine(ref)
                                }
                            }}
                            style={styles.gameContainer}
                            running={running}
                            onEvent={async (e: any) => onEvent(e)}
                            systems={[Physics, ScoreCounter]}
                            entities={entities}>
                            <StatusBar hidden={true} />
                        </GameEngine>
                        : <Text>Loading...</Text>
                }


            </ImageBackground>
        </View >
    )
}

function getXCoOrdForObjectInsertion(bodyWidth: number): number {
    let x = Math.random() * Constants.MAX_WIDTH;

    // move it more to the middle so it does not touch the walls
    if (x < 5) {
        x += 5;
    }
    else if ((x + bodyWidth) > Constants.MAX_WIDTH - 5) {
        // keep moving it left by 5 until it is in the correct position
        while ((x + bodyWidth) > Constants.MAX_WIDTH - 5) {
            x -= 5;
        }
    }

    return x;
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        flexDirection: 'column'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    modalButton: {
        width: 100,
        alignItems: 'center'
    },
    modalButtonImage: {
        height: 50,
        width: 150,
        resizeMode: 'contain'
    },
    textStyle: {
        color: "white",
        textAlign: "center",
        fontFamily: 'SpaceCadetNF'
    },
    tapToPlayText: {
        textAlign: "center",
        fontFamily: 'SpaceCadetNF',
        color: '#c3c4c6',
        fontSize: 40,
        position: 'absolute',
        flex: 1,
        top: Constants.MAX_HEIGHT / 2, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontFamily: 'SpaceCadetNF'
    },
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row'
    },
    backgroundImage: {
        width: Constants.MAX_WIDTH,
        flex: 1,
        justifyContent: "center"
    },
    pausePanelImage: {
        width: Constants.MAX_WIDTH / 2,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
        position: 'absolute'
    },
    gameContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    countdownContainer: {
        position: 'absolute',
        width: Constants.MAX_WIDTH,
        paddingTop: Constants.MAX_HEIGHT / 2,
        textAlign: 'center'
    },
    countdownText: {
        textAlign: 'center'
    },
    emptySpace: {
        flexBasis: '25%',
    },
    health: {
        paddingTop: 50,
        zIndex: 9999,
        height: 75,
        width: 75,
        resizeMode: 'contain',
        flexBasis: '25%',
        justifyContent: 'flex-start',
        alignContent: 'flex-start'
    },
    score: {
        paddingTop: 50,
        zIndex: 9999,
        height: 60,
        resizeMode: 'contain',
        flexBasis: '50%',
        justifyContent: 'flex-start',
        alignContent: 'flex-start'
    },
    scoreText: {
        color: 'white',
        fontSize: 20,
        paddingTop: 30,
        paddingLeft: 10,
        position: 'absolute',
        fontFamily: 'SpaceCadetNF',
    },
    scoreHealthContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 30,
        position: 'absolute',
        top: 0
    },
    startGameButton: {
        zIndex: 9999,
        fontSize: 50,
        height: Constants.MAX_HEIGHT,
        width: Constants.MAX_WIDTH,
    },
    pauseGameButton: {
        zIndex: 999999999,
        height: 50,
        width: 50,
        justifyContent: 'flex-end',
        position: 'absolute',
        top: 0,
        right: 0
    },
    countdownTimer: {
        top: 0
    }
});

function makeid() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}