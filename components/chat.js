import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
} from 'firebase/firestore';

// destructured props from app.js and start.js
const Chat = ({ route, navigation, db }) => {
    const { name, userId, color } = route.params;
    const [messages, setMessages] = useState([]);

    // function that writes messages to firestore database
    const onSend = (newMessages) => {
        addDoc(collection(db, 'messages'), newMessages[0]);
    };

    // fetches message from db in real time
    useEffect(() => {
        navigation.setOptions({ title: name });
        const q = query(
            collection(db, 'messages'),
            orderBy('createdAt', 'desc')
        );
        const unsubMessages = onSnapshot(q, (docs) => {
            let newMessages = [];
            docs.forEach((doc) => {
                newMessages.push({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: new Date(doc.data().createdAt.toMillis()),
                });
            });
            setMessages(newMessages);
        });
        return () => {
            if (unsubMessages) unsubMessages();
        };
    }, []);

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
