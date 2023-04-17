import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, Alert } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
} from 'firebase/firestore';

// destructured props from app.js and start.js
const Chat = ({ route, navigation, db, isConnected }) => {
    const { name, userId, color } = route.params;
    const [messages, setMessages] = useState([]);

    // function that writes messages to firestore database
    const onSend = (newMessages) => {
        addDoc(collection(db, 'messages'), newMessages[0]);
    };

    // fetches message from db in real time
    useEffect(() => {
        navigation.setOptions({ title: name });

        if (isConnected) {
            const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
            const unsubMessages = onSnapshot(q, async (docs) => {
                let newMessages = [];
                docs.forEach((doc) => {
                    newMessages.push({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis()),
                    });
                });
                await AsyncStorage.setItem('messages', JSON.stringify(newMessages));
                setMessages(newMessages);
            });
            return () => {
                if (unsubMessages) unsubMessages();
            };
        } else {
            const loadCachedMessages = async () => {
                const cachedMessages = await AsyncStorage.getItem('messages');
                if (cachedMessages) {
                    setMessages(JSON.parse(cachedMessages));
                }
            };
            loadCachedMessages();
        }
    }, [isConnected]);

    // Chat bubble bg colors
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#007aff',
                    },
                    left: {
                        backgroundColor: '#E5E5EA',
                    },
                }}
                textStyle={{
                    right: {
                        color: '#ffffff',
                    },
                    left: {
                        color: '#000000',
                    },
                }}
            />
        );
    };

    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    };

    return (
        <View style={[styles.container, { backgroundColor: color }]}>
            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: userId,
                    name: name,
                }}
                keyboardAvoidingViewProps={{
                    behavior: Platform.OS === 'ios' ? 'padding' : undefined,
                }}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Chat;
