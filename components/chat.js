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
import MapView, { Marker } from "react-native-maps";
import CustomActions from "./CustomActions";

const Chat = ({ route, navigation, db, isConnected, storage }) => {
     // extracting name, userId, and color from route.params and initializing messages state
    const { name, userId, color } = route.params;
    const [messages, setMessages] = useState([]);

    // function to add new messages to Firestore
    const onSend = (newMessages) => {
        addDoc(collection(db, 'messages'), newMessages[0]);
    };

    useEffect(() => {
        navigation.setOptions({ title: name });

        if (isConnected) {
            // retrieving messages from Firestore and updating the state accordingly
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
            // if offline, retrieving cached messages from AsyncStorage
            const loadCachedMessages = async () => {
                const cachedMessages = await AsyncStorage.getItem('messages');
                if (cachedMessages) {
                    setMessages(JSON.parse(cachedMessages));
                }
            };
            loadCachedMessages();
        }
    }, [isConnected]);

    // styling for message bubbles
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

    // hiding the input toolbar when offline
    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    };

    // rendering custom action buttons
    const renderCustomActions = (props) => {
        return <CustomActions {...props} storage={storage} userId={userId} />;
    };

    // rendering custom view for messages with a location attachment
    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
          return (
            <MapView
              style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
              region={{
                latitude: currentMessage.location.latitude,
                longitude: currentMessage.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: currentMessage.location.latitude,
                  longitude: currentMessage.location.longitude,
                }}
              />
            </MapView>
          );
        }
        return null;
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
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
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

