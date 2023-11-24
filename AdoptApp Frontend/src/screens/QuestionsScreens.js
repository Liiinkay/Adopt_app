import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useQuestions } from '../contexts/QuestionProvider'; // Asumiendo que este contexto existe y es correcto
import { useAuth } from '../contexts/AuthProvider';
import { useUsers } from '../contexts/UserProvider';
import { Ionicons } from '@expo/vector-icons';
import config from '../../config';


const API_URL = config.API_URL;
const QUESTIONS_PER_PAGE = 8; // Ajusta esto según tus necesidades

const QuestionItem = ({ question, isAuthor }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { findOne } = useUsers();
    const [hasAnswered, setHasAnswered] = useState(question.answer ? true : false);
    const [answer, setAnswer] = useState(question.answer || '');
    
    const { answerQuestion } = useQuestions(); // Asegúrate de que este método esté definido y disponible en tu contexto

    const submitAnswer = async () => {
      if (answer.trim() === '') {
        console.log('No se puede enviar una respuesta vacía');
        return;
      }
      if (!isAuthor) {
        console.log('Solo el autor del post puede responder');
        return;
      }
  
      try {
        // Llama a answerQuestion en lugar de createAnswer
        const newAnswerResponse = await answerQuestion(question.id, answer);
        console.log('Respuesta creada:', newAnswerResponse);
        setHasAnswered(true);
        setAnswer(answer); // Aquí guardamos la respuesta en el estado
      } catch (error) {
        console.error('Error al crear la respuesta:', error);
      }
    };

    useEffect(() => {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const userDetails = await findOne(question.author);
          setUser(userDetails);
        } catch (error) {
          console.error('Error al obtener detalles del usuario:', error);
          setError(true);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUser();
    }, [question.authorId, findOne]);
  
    if (loading) {
      return <Text>Cargando usuario...</Text>;
    }
  
    if (error) {
      return <Text>No se pudo cargar el usuario de la pregunta</Text>;
    }
  
    return (
        <View style={styles.questionContainer}>
        {/* Detalles del usuario que hizo la pregunta */}
        {user && (
          <Image source={{ uri: `${API_URL}/api/${user.profile_img}` }} style={styles.profileImage} />
        )}
        <View style={styles.questionContent}>
          <Text style={styles.nickname}>{user ? user.nickname : 'Usuario desconocido'}</Text>
          <Text style={styles.questionText}>{question.text}</Text>
        </View>

        {/* Muestra la respuesta si existe */}
        {hasAnswered && (
            <Text style={styles.answerText}>R: {answer}</Text>
        )} 

        {/* Campo para escribir la respuesta, ahora siempre visible */}
        {!hasAnswered && isAuthor && (
            <View style={styles.answerSection}>
            <TextInput
                style={styles.answerInput}
                onChangeText={setAnswer}
                value={answer}
                placeholder="Escribe tu respuesta aquí..."
                multiline={true} // Importante para que el TextInput crezca verticalmente
                maxLength={200}
            />
            <TouchableOpacity onPress={submitAnswer} style={styles.sendAnswerButton}>
                <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
            </View>
        )}
      </View>
    );
  };

const QuestionsScreen = ({ navigation }) => {
  const route = useRoute();
  const { post } = route.params;
  const { createQuestion, getQuestionsByPostId } = useQuestions();
  const { getUserId } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const isAuthor = getUserId() === post.authorID;

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const loadedQuestions = await getQuestionsByPostId(post.id);
        setQuestions(loadedQuestions);
      } catch (error) {
        console.error('Error al cargar las preguntas:', error);
      }
    };

    loadQuestions();
  }, [post.id, getQuestionsByPostId]);

  const addQuestion = async () => {
    if (newQuestion.trim() === '') {
      console.log('No se puede agregar una pregunta vacía');
      return;
    }
    try {
      const questionData = {
        text: newQuestion,
        authorId: getUserId(),
      };
      const newQuestionResponse = await createQuestion(post.id, questionData);
      console.log('Pregunta creada:', newQuestionResponse);
      setQuestions(prevQuestions => [...prevQuestions, newQuestionResponse]);
      setNewQuestion('');
    } catch (error) {
      console.error('Error al crear la pregunta:', error);
    }
  };

  // Obtener las preguntas para la página actual
  const indexOfLastQuestion = currentPage * QUESTIONS_PER_PAGE; // Cambiado de indexOfLastComment a indexOfLastQuestion
  const indexOfFirstQuestion = indexOfLastQuestion - QUESTIONS_PER_PAGE; // Cambiado de indexOfFirstComment a indexOfFirstQuestion
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion); // Cambiado de currentComments a currentQuestions

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE); // Cambiado de comments.length a questions.length

  return (
    <View style={styles.container}>
      <FlatList
        data={currentQuestions} // Cambiado de currentComments a currentQuestions
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <QuestionItem question={item} isAuthor={isAuthor}/>} // Cambiado de CommentItem a QuestionItem
        ListHeaderComponent={(
          <View>
            <View>
              <TextInput
                style={styles.input}
                onChangeText={setNewQuestion} // Cambiado de setNewComment a setNewQuestion
                value={newQuestion} // Cambiado de newComment a newQuestion
                placeholder="Escribe tu pregunta aquí..." // Cambiado de comentario a pregunta
                maxLength={200}
              />
              <TouchableOpacity style={styles.sendButton} onPress={addQuestion}>
                <Text style={styles.sendButtonText}>Agregar Pregunta</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
            disabled={currentPage === 1}
            onPress={() => setCurrentPage(currentPage - 1)}
          >
            <Text style={styles.pageButtonText}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.pageNumberText}>Página {currentPage} de {totalPages}</Text>
          <TouchableOpacity 
            style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
            disabled={currentPage === totalPages}
            onPress={() => setCurrentPage(currentPage + 1)}
          >
            <Text style={styles.pageButtonText}>{">"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#f5f5f5', // Color de fondo similar al ManageUsersScreen
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      borderRadius: 10, // Bordes redondeados para el input
      padding: 10,
      backgroundColor: '#fff', // Fondo blanco para el input
    },
    questionContainer: {
      flexDirection: 'col',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      backgroundColor: 'white',
      borderRadius: 5,
      marginBottom: 5,
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    questionContent: {
      flex: 1,
    },
    nickname: {
      fontWeight: 'bold',
      color: '#333', // Color de texto para el nickname
    },
    questionText: {
      fontSize: 16,
      color: '#424242', // Color de texto para el comentario
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      backgroundColor: '#fff', // Fondo blanco para el contenedor de paginación
      borderRadius: 10, // Bordes redondeados
      padding: 10,
    },
    pageButton: {
      backgroundColor: '#F348A4', // Botones de paginación color rosa
      padding: 8,
      borderRadius: 4,
      marginHorizontal: 10,
    },
    disabledButton: {
      backgroundColor: '#ccc', // Botón deshabilitado en gris
    },
    pageButtonText: {
      color: '#fff', // Texto de los botones en blanco
    },
    pageNumberText: {
      color: '#000', // Número de página en negro
    },
    sendButton: {
      backgroundColor: '#F348A4', // Color del botón
      padding: 10,
      borderRadius: 10, // Bordes redondeados
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10, // Margen superior
    },
    sendButtonText: {
      color: '#fff', // Texto blanco
      fontWeight: 'bold', // Texto en negrita
    },
    replyButton: {
        backgroundColor: '#F348A4', // Utiliza los colores y estilos que ya tienes
        padding: 8,
        borderRadius: 4,
        marginTop: 5,
    },
    replyButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    // Estilos para la respuesta
    answerContainer: {
        marginTop: 10,
    },
    answerSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 5,
    },
    answerText: {
        fontSize: 14,
        color: '#4a4a4a',
        backgroundColor: '#e8e8e8', // Un fondo ligeramente diferente para la respuesta
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#dedede',
        marginTop: 5, // Espacio por encima de la respuesta
        marginBottom: 5, // Espacio por debajo de la respuesta
  },
    answerInput: {
        flex: 1,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        marginRight: 5,
        maxHeight: 200,  // Asegúrate de dejar espacio para el botón de enviar
    },
    sendAnswerButton: {
        padding: 6,
        backgroundColor: '#F348A4', // Tu color de la app
        borderRadius: 5, // Hace que sea circular
        justifyContent: 'center',
        alignItems: 'center',
    },
});
  
export default QuestionsScreen;
