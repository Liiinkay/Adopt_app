import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';

const windowHeight = Dimensions.get('window').height;

const CreatePostsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#E91E63', flexDirection: 'row' }]}
                onPress={() => navigation.navigate('CreateAdoptPost')}>
                <Text style={styles.textLeft}>Adopción</Text>
                <Image source={require('../../assets/images/welcome-image.png')} style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#FFC107', flexDirection: 'row-reverse' }]}
                onPress={() => navigation.navigate('CreateSearchPost')}>
                <Text style={styles.textRight}>Búsqueda</Text>
                <Image source={require('../../assets/images/Search.png')} style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#9C27B0', flexDirection: 'row' }]}
                onPress={() => navigation.navigate('CreateInformativePost')}>
                <Text style={styles.textLeft}>Informativa</Text>
                <Image source={require('../../assets/images/News.png')} style={styles.icon} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    header: {
        backgroundColor: '#E91E63',
        padding: 10,
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    button: {
        flex: 1,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
    },
    textLeft: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'left',
        marginLeft: 20,
        flex: 1,
    },
    textRight: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'right',
        marginRight: 20,
        flex: 1,
    },
    icon: {
        width: 110, // Ajusta según tus necesidades
        height: 110, // Ajusta según tus necesidades
    },
});

export default CreatePostsScreen;
