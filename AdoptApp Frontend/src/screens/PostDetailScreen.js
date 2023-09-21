import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, StatusBar } from "react-native";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SliderBox } from "react-native-image-slider-box";
import Table from "../components/Table";
import Comentarios from "../components/Coments";
import PreguntasRespuestasComponent from "../components/Coments";

const PostDetailScreen = ({ navigation }) => {
    const {
        params: { post },
      } = useRoute();
/* 
    if(post.type === 'search'){
        return(

        )
    }
     */
    return(
        <SafeAreaView>
            <StatusBar color={'black'}/>
            <ScrollView>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back-outline" size={30} color={'#1E1E1E'} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Adopción</Text>
                    <View style={{ flex: 1 }}></View>
                </View>
                <View style={styles.imageContainer}>
                    <SliderBox
                        images={post.multimedia}
                        dotColor= {'#e8e8e8'}
                        inactiveDotColor= {'grey'}
                        ImageComponentStyle= {{ width: '95%', borderRadius: 10}}
                    />
                </View>
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image src={post.user.image} style={styles.userImage} />
                        <Text style={styles.name}>{post.user.name}</Text>
                        <Text style={styles.username}>{post.user.username} · 2h</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <Text style={styles.titleText}>{post.content}</Text>
                </View>
                <View style={styles.lineContainer}>
                    <View style={styles.line}></View>
                </View>
                <View style={styles.container}>
                    <Text style={styles.titleText}>Descripción</Text>
                    <Text style={styles.contentText}>{post.description}</Text>
                </View>
                <View style={styles.lineContainer}>
                    <View style={styles.line}></View>
                </View>
                <View style={styles.container}>
                    <Text style={styles.titleText}>Información adicional</Text>
                    <Table></Table>
                </View>
                <View style={styles.lineContainer}>
                    <View style={styles.line}></View>
                </View>
                <View style={styles.container}>
                    <Text style={styles.titleText}>Formulario de Adopción</Text>
                    <View style={styles.adviseContainter}>
                        <Ionicons name="alert-circle-outline" size={30} color={'white'}/>
                        <View style={styles.adviseTextContainer}>
                            <Text style={styles.adviseText}>Revisar ley de Tenencia Responsable de Mascotas y Animales de Compañía</Text>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity>
                            <View style={[styles.adoptFormButton, styles.adoptFormButtonShadow]}>
                                <Text style={styles.buttonText}>Postular a Adopción</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.lineContainer}>
                    <View style={styles.line}></View>
                </View>
                <View style={styles.container}>
                    <Text style={styles.titleText}>Preguntas y respuestas</Text>
                    <PreguntasRespuestasComponent/>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    image: {
        aspectRatio: 1,
        resizeMode: "cover"
    },
    imageContainer: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    header:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#AEFAFF',
        paddingTop: 8,
        paddingBottom: 8,
    },
    backButton: {
        marginLeft: 5,
        marginRight: 112
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E1E1E', 
    },
    line: {
        width: '100%',
        height: 2,
        backgroundColor: '#B1B1B1'
    },
    lineContainer: {
        paddingHorizontal: 10,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3F3F3F',
        paddingBottom: 10,
    },
    contentText: {
        color: '#3F3F3F',
    },
    container: {
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    userImage: {
        width: 45,
        height: 45,
        borderRadius: 50,
    },
    mainContainer: {
        marginLeft: 10,
        flex: 1,
    },
    name: {
        fontWeight: '600',
    },
    adviseContainter: {
        flexDirection: 'row',
        backgroundColor: '#25272E',
        borderRadius: 15,
        padding:10,
        margin: 5,
        opacity: 0.84
    },
    adviseTextContainer: {
        paddingHorizontal:20
    },  
    adviseText: {
        fontWeight: "bold",
        color: 'white',
    },
    buttonText: {
        fontWeight: "bold",
        color: 'white',
        fontSize: 17
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 15,
    },
    adoptFormButton: {
        backgroundColor: '#F348A4',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 5,
        paddingVertical: 15,
    },
    adoptFormButtonShadow: {
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
})

export default PostDetailScreen;
