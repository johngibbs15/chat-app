import React, { useState } from 'react';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
    View,
    Text,
    TextInput,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';

// bg color options for UI
const backgroundColors = {
    black: '#000000',
    grey: '#8a95a5',
    purple: '#474056',
    green: '#94ae89',
};

const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState(backgroundColors.green);

    // logs user in anonymously
    // if user is logged in while passing in necessary parameters
    const handleStart = () => {
        const auth = getAuth();
        signInAnonymously(auth)
            .then(() => {
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        const uid = user.uid;
                        navigation.navigate('Chat', {
                            userId: uid,
                            name,
                            color,
                        });
                    }
                });
            })
            .catch((error) => {
                console.error(error.message);
            });
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/background_image.png')}
                style={styles.image}
            >
                <Text style={styles.title}>Chatty</Text>
                <View style={styles.box}>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={name}
                        onChangeText={setName}
                    />
                    <View>
                        <Text>Choose your color:</Text>
                        <View style={styles.colorWrapper}>
                            <TouchableOpacity
                                style={[
                                    styles.color,
                                    { backgroundColor: backgroundColors.black },
                                    color === backgroundColors.black &&
                                        styles.colorUnderline,
                                ]}
                                onPress={() => {
                                    setColor(backgroundColors.black);
                                }}
                            />
                            <TouchableOpacity
                                style={[
                                    styles.color,
                                    { backgroundColor: backgroundColors.grey },
                                    color === backgroundColors.grey &&
                                        styles.colorUnderline,
                                ]}
                                onPress={() => {
                                    setColor(backgroundColors.grey);
                                }}
                            />
                            <TouchableOpacity
                                style={[
                                    styles.color,
                                    {
                                        backgroundColor:
                                            backgroundColors.purple,
                                    },
                                    color === backgroundColors.purple &&
                                        styles.colorUnderline,
                                ]}
                                onPress={() => {
                                    setColor(backgroundColors.purple);
                                }}
                            />
                            <TouchableOpacity
                                style={[
                                    styles.color,
                                    { backgroundColor: backgroundColors.green },
                                    color === backgroundColors.green &&
                                        styles.colorUnderline,
                                ]}
                                onPress={() => {
                                    setColor(backgroundColors.green);
                                }}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: color }]}
                        onPress={handleStart}
                    >
                        <Text style={styles.buttonText}>Start Chatting</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

export default Start;

const styles = {
    container: {
        flex: 1,
    },
    title: {
        fontSize: 50,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#fff',
        marginTop: 100,
    },
    colorUnderline: {
        borderWidth: 4,
        borderColor: 'grey',
        borderRadius: 20,
        padding: 12,
    },
    box: {
        width: '90%',
        backgroundColor: '#fff',
        alignItems: 'center',
        height: '44%',
        justifyContent: 'space-evenly',
        marginBottom: 25,
    },
    image: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        resizeMode: 'cover',
    },
    colorWrapper: {
        flexDirection: 'row',
    },
    color: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 10,
    },
    input: {
        width: '80%',
        height: 50,
        padding: 10,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#4f84c4',
        width: '80%',
        height: 50,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
    },
};
