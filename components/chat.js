import { StyleSheet, View, Text } from 'react-native';
import { useEffect } from 'react';

const Chat = ({ route, navigation }) => {
    const { name, color } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: color }]}>
            <Text>Hello {name}!</Text>
        </View>
    );
};

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
