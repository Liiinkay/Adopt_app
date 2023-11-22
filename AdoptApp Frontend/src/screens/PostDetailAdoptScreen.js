import React, { useState, useEffect} from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar, FlatList, TextInput, Button } from "react-native";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from 'react-native-swiper';
import { Ionicons } from "@expo/vector-icons";
import LikeButton from "../components/LikeButton";
import config from '../../config';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthProvider';
import { useQuestions } from '../contexts/QuestionProvider';

const ITEMS_PER_PAGE = 5;
const apiUrl = config.API_URL;


const QuestionItem = ({ item, isPostOwner, onAddAnswer }) => {
    const [answer, setAnswer] = useState('');
    const [isAnswering, setIsAnswering] = useState(false);

    const handlePressAnswer = () => {
        if (answer.trim()) {
            onAddAnswer(item.id, answer);
            setAnswer('');
            setIsAnswering(false);
        }
    };

    return (
        <View style={styles.questionItem}>
            <Text style={styles.questionText}>{item.question}</Text>
            {item.answer && <Text style={styles.answerText}>{item.answer}</Text>}
            {isPostOwner && !item.answer && isAnswering && (
                <View style={styles.answerContainer}>
                    <TextInput
                        style={styles.input}
                        value={answer}
                        onChangeText={setAnswer}
                        placeholder="Escribe tu respuesta aquí"
                    />
                    <TouchableOpacity onPress={handlePressAnswer} style={styles.sendButton}>
                        <Ionicons name="send" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            )}
            {isPostOwner && !item.answer && !isAnswering && (
                <Button title="Responder" onPress={() => setIsAnswering(true)} color="#F348A4" />
            )}
        </View>
    );
};




const PostDetailAdoptScreen = ({ navigation }) => {
    const { getUserId } = useAuth();
    const userId = getUserId();
    const { createQuestion } = useQuestions();
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedQuestions, setPaginatedQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const route = useRoute(); 
    const { post, userInfo } = route.params;
    const images = post.images.map(img => `${apiUrl}/api/${img}`);
    const Questions = [];
    const isPostOwner = userId === post?.authorID;
    
    const onAddAnswer = (questionId, answerText) => {
        // Lógica para añadir la respuesta
    };

    const handleAddQuestion = async () => {
/*         if (newQuestion.trim()) {
            setIsLoading(true);
            try {
                const createQuestionDto = { question: newQuestion };
                await createQuestion(post.id, createQuestionDto); // Envía la pregunta
                console.log('Pregunta enviada:', newQuestion);
                setNewQuestion(''); // Limpia el campo de entrada
            } catch (error) {
                console.error('Error al enviar la pregunta:', error);
                // Manejar el error (por ejemplo, mostrar un mensaje al usuario)
            } finally {
                setIsLoading(false);
            }
        } */
    };

    const renderQuestionInput = () => {
        if (!isPostOwner) {
            return (
                <View style={styles.questionInputContainer}>
                    <TextInput
                        style={styles.input}
                        value={newQuestion}
                        onChangeText={setNewQuestion}
                        placeholder="Haz una pregunta"
                        multiline
                    />
                    <TouchableOpacity onPress={handleAddQuestion} style={styles.sendButton}>
                        <Text style={styles.buttonText}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    const renderQuestionItem = ({ item }) => {
        return (
            <QuestionItem 
                item={item} 
                isPostOwner={isPostOwner} 
                onAddAnswer={onAddAnswer} 
            />
        );
    };

    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setPaginatedQuestions(Questions.slice(startIndex, endIndex));
    }, [currentPage]);
    
    // Funciones para cambiar de página
    const goToNextPage = () => {
        setCurrentPage((prevCurrent) => prevCurrent + 1);
    };
    
    const goToPreviousPage = () => {
        setCurrentPage((prevCurrent) => prevCurrent - 1);
    };

    const renderHeader = () => {
        return (
            <>
                {/* Header */}
                <StatusBar barStyle="light-content" backgroundColor="black" />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Post</Text>
                    <Menu>
                        <MenuTrigger>
                            <Ionicons name="ellipsis-vertical" size={24} color="white" />
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={() => alert('Opción 1')} text='Guardar' />
                            <MenuOption onSelect={() => alert('Opción 2')} text='Reportar' />
                        </MenuOptions>
                    </Menu>
                </View>
                <View style={styles.postView}>

                    <View style={styles.sliderContainer}>
                        <Swiper
                            showsButtons={false}
                            loop={false}
                            onIndexChanged={(index) => console.log('Current image index:', index)}
                        >
                            {images?.map((imageUri, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => navigateToFullScreenImage(imageUri)}
                                >
                                    <Image source={{ uri: imageUri }} style={styles.postImage} />
                                </TouchableOpacity>
                            ))}
                        </Swiper>
                    </View>
                    <View style={styles.userInfoContainer}>
                        <Image source={{ uri: userInfo ? `${apiUrl}/api/${userInfo.profile_img}` : 'url_por_defecto' }} style={styles.userImage} />
                        <View style={styles.userInfoText}>
                            <Text style={styles.userName}>{userInfo.name}</Text>
                            <Text style={styles.userDescription}>{userInfo.nickname}</Text>
                        </View>
                        <LikeButton />
                    </View>
                    <Text style={styles.postTitle}>{post?.title}</Text>
                        <Text style={styles.postDescription}>{post?.description}</Text>
                        <View style={styles.petInfoContainer}>
                            {/* tabla de información */}
                            <Text style={styles.petInfoText}>Edad: {post?.age}</Text>
                            <Text style={styles.petInfoText}>Sexo: {post?.gender}</Text>
                            <Text style={styles.petInfoText}>Temperamento: {post?.personality}</Text>
                            <Text style={styles.petInfoText}>Información médica: {post?.medical_information}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.adoptButton}
                            onPress={() => navigation.navigate('AdoptForm', { post, userId })}
                        >
                            <Text style={styles.adoptButtonText}>Postular a adopción</Text>
                        </TouchableOpacity>
                    <Text style={styles.sectionTitle}>Preguntas y Respuestas</Text>
                </View>
            </>
        );
    };

    const renderFooter = () => {
        return (
            <>
                {renderQuestionInput()}
                <View style={styles.paginationContainer}>
                <TouchableOpacity 
                    onPress={goToPreviousPage} 
                    disabled={currentPage === 1}
                    style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
                >
                    <Ionicons name="arrow-back" size={24} color={currentPage === 1 ? 'grey' : '#F348A4'} />
                </TouchableOpacity>
                <Text style={styles.paginationIndicator}>{currentPage}</Text>
                <TouchableOpacity 
                    onPress={goToNextPage} 
                    disabled={currentPage * ITEMS_PER_PAGE >= Questions.length}
                    style={[styles.paginationButton, (currentPage * ITEMS_PER_PAGE >= Questions.length) && styles.disabledButton]}
                >
                    <Ionicons name="arrow-forward" size={24} color={(currentPage * ITEMS_PER_PAGE >= Questions.length) ? 'grey' : '#F348A4'} />
                </TouchableOpacity>
            </View>
            </>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>

                <FlatList
                    data={paginatedQuestions}
                    keyExtractor={(item) => item.id}
                    renderItem={renderQuestionItem}
                    ListHeaderComponent={renderHeader}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={<Text style={styles.noQuestionsText}>No hay preguntas.</Text>}
                />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#F348A4',
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    postView: {
        marginHorizontal: 15,
        marginTop: 10, 
    },
    sliderContainer: {
        height: 250,
        backgroundColor: '#eaeaea',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20, // Aumenta el margen inferior
    },
    postImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20, // Aumenta el margen inferior
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userInfoText: {
        flex: 1,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    userDescription: {
        color: 'gray',
    },
    postTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginVertical: 10,
    },
    postDescription: {
        fontSize: 15,
        color: 'gray',
    },
    petInfoContainer: {
        padding: 15, // Aumenta el padding para más espacio interior
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 20, // Aumenta el margen inferior
    },
    petInfoText: {
        fontSize: 14,
        marginBottom: 5,
    },
    adoptButton: {
        backgroundColor: '#F348A4',
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    adoptButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerRightContainer: {
        marginRight: 10, // Ajusta según sea necesario para tu diseño
    },
    button: {
        backgroundColor: '#F348A4',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        // otros estilos para el botón
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        // otros estilos para el texto del botón
    },
    // Estilos para la sección de preguntas y respuestas
    questionsSection: {
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        margin: 10,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
        backgroundColor: '#F8F8F8',
        marginVertical: 10,
    },
    inputContainer: {
        marginBottom: 10,
    },
    questionInputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        borderRadius: 5,
        margin: 10,
    },
    questionItem: {
        backgroundColor: 'white',
        padding: 15, // Aumenta el padding para más espacio interior
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10, // Aumenta el margen inferior entre preguntas
    },
    questionText: {
        fontWeight: 'normal',
        fontSize: 16,
        color: '#333', 
        marginBottom: 5,
    },
    answerText: {
        fontSize: 14,
        color: '#F348A4',
        marginTop: 5,
        marginBottom: 5,
    },
    answerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        backgroundColor: '#f0f0f0', // Fondo ligeramente diferente para el área de respuesta
        borderRadius: 5,
        padding: 5,
    },
    input: {
        flex: 1,
        padding: 8,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderWidth: 1,
        marginRight: 10,
        borderRadius: 5,
    },
    sendButton: {
        backgroundColor: '#F348A4',
        borderRadius: 5,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    waitingText: {
        fontStyle: 'italic',
        fontSize: 14,
        marginBottom: 5,
    },
    noQuestionsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    answerInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
      },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    
    paginationButton: {
        backgroundColor: 'white', // o el color de fondo que prefieras
        borderRadius: 20, // Esto hará que el botón sea circular
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    disabledButton: {
        opacity: 0.5, // Hace que el botón se vea deshabilitado
    },
    
    paginationIndicator: {
        fontSize: 16,
    },
});

export default PostDetailAdoptScreen;
