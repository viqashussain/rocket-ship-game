import Matter from "matter-js"
import { createRef, useEffect, useRef, useState } from "react"
import { View, TouchableOpacity, StatusBar, Text, StyleSheet } from "react-native"
import { GameEngine } from "react-native-game-engine"
import { useDispatch, useSelector } from "react-redux"
import Rocket from "../matter-objects/Rocket"
import Constants from "../Constants"
import Wall from "../matter-objects/Wall"
import { Audio } from 'expo-av';
import { DECREASE_HEALTH, INCREASE_HEALTH, INCREMENT_LEVEL, UPDATE_SCORE } from "../redux/Actions"
import Asteroid from "../matter-objects/Asteroid"
import Coin from "../matter-objects/Coin"
import Fuel from "../matter-objects/Fuel"

export default function Game(props: any) {

    const [gameEngine, setGameEngine]: any = useState();
    const [running, setRunning] = useState<boolean>(false);
    const [entities, setEntities]: any = useState(null);
    const [fuelHasBeenAdded, setFuelHasBeenAdded] = useState<boolean>(false);
    const [countdownValue, setCountdownValue] = useState<number | null>(3);

    const dispatch = useDispatch();

    const { score, level, health } = useSelector(state => (state as any).gameReducer);

    const scoreRef = useRef(score);
    const levelRef = useRef(level);
    const healthRef = useRef(level);
    const entitiesRef = useRef(entities);

    // setup world on load
    useEffect(() => {
        setEntities(setupWorld());
    }, []);

    useEffect(() => scoreRef.current = score, [score]);
    useEffect(() => levelRef.current = level, [level]);
    useEffect(() => healthRef.current = health, [health]);
    useEffect(() => entitiesRef.current = entities, [entities]);

    const setupWorld = (): any => {
        let engine = Matter.Engine.create({ enableSleeping: false, gravity: { scale: 0.0005 } });
        let world = engine.world;

        let rocket = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 4, Constants.MAX_HEIGHT / 2, 50, 50, { label: 'rocket' });
        rocket.collisionFilter = {
            group: 1,
            category: 3,
            mask: 1
        }
        let ceiling = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, 25, Constants.MAX_WIDTH, 50, { isStatic: true, label: 'ceiling' });
        ceiling.collisionFilter = {
            group: 1,
            category: 2,
            mask: 0
        }

        let leftWall = Matter.Bodies.rectangle(0, 500, 5, Constants.MAX_HEIGHT, { isStatic: true, label: 'leftWall' });
        let rightWall = Matter.Bodies.rectangle(Constants.MAX_WIDTH, 500, 5, Constants.MAX_HEIGHT, { isStatic: true, label: 'rightWall' });

        Matter.Composite.add(world, [rocket, ceiling, leftWall, rightWall]);

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

                await playSound('health');
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

                // await playSound('fuel');
            }

            // asteroid has been hit - take a damage hit
            if ((bodyA.label === 'rocket' && bodyB.label.startsWith('bigRock') || (bodyB.label === 'rocket' && bodyA.label.startsWith('bigRock')))) {
                dispatch({ type: DECREASE_HEALTH })

                await playSound('explosion');
            }
            // (gameEngine as any).dispatch({ type: "game-over" });
        });

        return {
            physics: { engine: engine, world: world },
            rocket: { body: rocket, size: [50, 50], color: 'red', renderer: Rocket },
            ceiling: { body: ceiling, size: [Constants.MAX_WIDTH, 50], color: "green", renderer: Wall },
            leftWall: { body: leftWall, size: [5, Constants.MAX_HEIGHT * 2], color: "green", renderer: Wall },
            rightWall: { body: rightWall, size: [5, Constants.MAX_HEIGHT * 2], color: "green", renderer: Wall },
        }
    }

    const playSound = async (soundFileName: string) => {
        let sound;
        if (soundFileName == 'health') {
            sound = await Audio.Sound.createAsync(
                require(`../assets/sounds/health.mp3`)
            );
        }
        else if (soundFileName == 'explosion') {
            sound = await Audio.Sound.createAsync(
                require(`../assets/sounds/explosion.mp3`)
            );
        }


        await sound?.sound.playAsync();
    }

    const onEvent = (e: any) => {
        // if (e.type === "game-over") {
        //   // Alert.alert("Game Over");
        //   this.setState({
        //     running: false
        //   });
        // }
    }

    const startGame = () => {
        let interval = setInterval(() => {
            setCountdownValue(prev => {
                if (prev === 1) {
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

    const pauseGame = () => {
        setCountdownValue(3);
        setRunning(false);
    }

    const ScoreCounter = (entities: any, { touches, time }: any) => {

        if (scoreRef.current > 3000 && levelRef.current === 1) {
            dispatch({ type: INCREMENT_LEVEL })
        }
        else if (scoreRef.current > 6000 && levelRef.current === 2) {
            dispatch({ type: INCREMENT_LEVEL })
        }

        dispatch({ type: UPDATE_SCORE, payload: scoreRef.current + 1 })
        return entities;
    }

    const Physics = (entities: any, { touches, time }: any) => {
        let engine: Matter.Engine = entities.physics.engine;
        let rocket = entities.rocket.body;
        const world: Matter.World = entities.physics.world;

        touches.filter((t: any) => t.type === "press").forEach((t: any) => {
            const locationX = t.event.locationX;
            const isLeftTouch = locationX < (Constants.MAX_WIDTH / 2);
            Matter.Body.rotate(rocket, Math.PI / 6);
            if (isLeftTouch) {
                const amountLeft = 1 - (locationX / (Constants.MAX_WIDTH / 2));
                // the further left you press, the further you fly right
                const force = 0.075 * amountLeft;
                Matter.Body.applyForce(rocket, rocket.position, { x: -force, y: -0.05 });
            }
            else {
                const amountRight = (locationX - 200) / (Constants.MAX_WIDTH / 2);
                // the further right you press, the further you fly left
                const force = 0.075 * amountRight;
                Matter.Body.applyForce(rocket, rocket.position, { x: force, y: -0.05 });
            }
        });

        let objectSizes = Constants.OBJECT_SIZES.find(x => x.level === levelRef.current)!;

        const bigRock1 = Matter.Bodies.rectangle(getXCoOrdForObjectInsertion(objectSizes.asteroid), -200, objectSizes.asteroid, objectSizes.asteroid, { restitution: 2, label: 'bigRock1' });
        const bigRock2 = Matter.Bodies.rectangle(getXCoOrdForObjectInsertion(objectSizes.asteroid), -200, objectSizes.asteroid, objectSizes.asteroid, { restitution: 2, label: 'bigRock2' });
        const bigRock3 = Matter.Bodies.rectangle(getXCoOrdForObjectInsertion(objectSizes.asteroid), -200, objectSizes.asteroid, objectSizes.asteroid, { restitution: 2, label: 'bigRock3' });

        reRenderRock('bigRock1', entities, world, bigRock1);
        if (levelRef.current === 2) {
            reRenderRock('bigRock2', entities, world, bigRock2);
        }
        if (levelRef.current === 3) {
            reRenderRock('bigRock3', entities, world, bigRock3);
        }


        const coin1 = Matter.Bodies.rectangle(getXCoOrdForObjectInsertion(objectSizes.coin), -200, objectSizes.coin, objectSizes.coin, { label: 'coin1' });
        const coin2 = Matter.Bodies.rectangle(getXCoOrdForObjectInsertion(objectSizes.coin), -200, objectSizes.coin, objectSizes.coin, { label: 'coin2' });
        const coin3 = Matter.Bodies.rectangle(getXCoOrdForObjectInsertion(objectSizes.coin), -200, objectSizes.coin, objectSizes.coin, { label: 'coin3' });

        reRenderCoin('coin1', entities, world, coin1);
        reRenderCoin('coin2', entities, world, coin2);
        reRenderCoin('coin3', entities, world, coin3);

        //add a fuel item every 10 seconds
        const timeSeconds = new Date(time.current).getSeconds();

        if (timeSeconds % Constants.ADD_FUEL_SECOND_INTERVAL === 0 && !fuelHasBeenAdded) {
            const fuel = Matter.Bodies.rectangle(getXCoOrdForObjectInsertion(objectSizes.fuel), -200, objectSizes.fuel, objectSizes.fuel, { label: 'fuel' });
            Matter.World.add(world, fuel);
            entities.fuel = { body: fuel, size: [20, 20], renderer: Fuel };
            setFuelHasBeenAdded(true);
        }
        else if (timeSeconds % Constants.ADD_FUEL_SECOND_INTERVAL !== 0) {
            setFuelHasBeenAdded(false);
        }

        Matter.Engine.update(engine, time.delta);

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

    function reRenderCoin(rockName: string, entities: any, world: any, rock: Matter.Body) {
        const width = rock.bounds.max.x - rock.bounds.min.x;
        const height = rock.bounds.max.y - rock.bounds.min.y;
        // if the rock already exists
        if (entities[rockName]) {
            // if the rock has fallen out of the bottom of the screen
            if (entities[rockName].body.position.y > Constants.MAX_HEIGHT) {
                Matter.World.remove(world, entities[rockName].body);
                delete entities[rockName];

                Matter.World.add(world, rock);
                entities[rockName] = { body: rock, size: [width, height], color: "blue", renderer: Coin };
            } else {
                // Matter.Body.translate(entities["pipe" + i].body, { x: -1, y: 0 });
            }
        }
        else {
            Matter.World.add(world, rock);
            entities[rockName] = { body: rock, size: [width, height], color: "blue", renderer: Coin };
        }
    }

    return (
        <View style={styles.container}>
            {
                running &&
                <TouchableOpacity
                    onPress={() => pauseGame()}
                    style={styles.pauseGameButton}
                >
                    <Text>Pause</Text>
                </TouchableOpacity>
            }
            <View style={styles.scoreHealthContainer}>
                <Text style={styles.level}>{level}</Text>
                <Text style={styles.health}>{health}</Text>
                <Text style={styles.score}>{score}</Text>
            </View>
            {
                !running &&
                <TouchableOpacity
                    onPress={() => startGame()}
                    style={styles.startGameButton}
                ></TouchableOpacity>
            }

            <View style={styles.countdownContainer}>
                <Text style={styles.countdownText}>{countdownValue}</Text>
            </View>
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
                        onEvent={onEvent}
                        systems={[Physics, ScoreCounter]}
                        entities={entities}>
                        <StatusBar hidden={true} />
                    </GameEngine>
                    : <Text>Loading...</Text>
            }



        </View>
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'row'
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
    health: {
        paddingTop: 50,
        zIndex: 9999,
        flexBasis: '33%',
        textAlign: 'center'
    },
    level: {
        paddingTop: 50,
        zIndex: 9999,
        flexBasis: '33%'
    },
    score: {
        paddingTop: 50,
        zIndex: 9999,
        textAlign: 'right',
        flexBasis: '33%'
    },
    scoreHealthContainer: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    startGameButton: {
        zIndex: 9999,
        fontSize: 50,
        height: Constants.MAX_HEIGHT,
        width: Constants.MAX_WIDTH,
    },
    pauseGameButton: {
        zIndex: 9999,
        fontSize: 50,
        height: 50,
        width: 50,
        backgroundColor: 'yellow',
    }
});