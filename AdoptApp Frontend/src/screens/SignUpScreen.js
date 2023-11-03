import React from "react";
import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const SignUpScreen = () => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>

                <View style={{ flex: 1, marginHorizontal: 22 }}>
                    <View style={{ marginVertical: 22 }}>
                        <Text style={styles.titleText}>
                            Crear Cuenta
                        </Text>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={styles.fieldText}>Nombre de usuario</Text>

                        <View style={styles.userNameField}>
                            <TextInput
                                placeholder='Escribe tu nombre de usuario'
                                placeholderTextColor={'black'}
                                keyboardType='default'
                                style={{
                                    width: "100%"
                                }}
                            />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={styles.fieldText}>Nombre</Text>

                        <View style={styles.userNameField}>
                            <TextInput
                                placeholder='Ingresa tu nombre'
                                placeholderTextColor={'black'}
                                keyboardType='default'
                                style={{
                                    width: "100%"
                                }}
                            />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={styles.fieldText}>Apellido</Text>

                        <View style={styles.userNameField}>
                            <TextInput
                                placeholder='Ingresa tu apellido'
                                placeholderTextColor={'black'}
                                keyboardType='default'
                                style={{
                                    width: "100%"
                                }}
                            />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={styles.fieldText}>Rut</Text>

                        <View style={styles.userNameField}>
                            <TextInput
                                placeholder='Ingresa tu Rut'
                                placeholderTextColor={'black'}
                                keyboardType='default'
                                style={{
                                    width: "100%"
                                }}
                            />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={styles.fieldText}>Correo electrónico</Text>

                        <View style={styles.userNameField}>
                            <TextInput
                                placeholder='Ingresa tu correo'
                                placeholderTextColor={'black'}
                                keyboardType='email-address'
                                style={{
                                    width: "100%"
                                }}
                            />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={styles.fieldText}>Numero de teléfono</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: 'black',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholder='+56'
                                placeholderTextColor={'black'}
                                keyboardType='numeric'
                                style={{
                                    width: "12%",
                                    borderRightWidth: 1,
                                    borderLeftColor: 'grey',
                                    height: "100%"
                                }}
                            />

                            <TextInput
                                placeholder='Ingresa tu número de teléfono'
                                placeholderTextColor={'black'}
                                keyboardType='numeric'
                                style={{
                                    width: "80%"
                                }}
                            />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={styles.fieldText}>Password</Text>

                        <View style={styles.passwordField}>
                            <TextInput
                                placeholder='Ingresa una contraseña'
                                placeholderTextColor={'black'}
                                secureTextEntry={isPasswordShown}
                                style={{
                                    width: "100%"
                                }}
                            />

                            <TouchableOpacity
                                onPress={() => setIsPasswordShown(!isPasswordShown)}
                                style={{
                                    position: "absolute",
                                    right: 12
                                }}
                            >
                                {
                                    isPasswordShown == true ? (
                                        <Ionicons name="eye-off" size={24} color={'black'} />
                                    ) : (
                                        <Ionicons name="eye" size={24} color={'black'} />
                                    )
                                }

                            </TouchableOpacity>
                        </View>
                    </View>



                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                        <View
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: 'grey',
                                marginHorizontal: 10
                            }}
                        />
                        <Text style={{ fontSize: 14 }}>Or Sign up with</Text>
                        <View
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: 'grey',
                                marginHorizontal: 10
                            }}
                        />
                    </View>

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginVertical: 22
                    }}>
                        <Text style={{ fontSize: 16, color: 'black' }}>Already have an account</Text>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>   
    )
}

const styles = StyleSheet.create({
    passwordField: {
        width: "100%",
        height: 48,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 22
    },
    userNameField: {
        width: "100%",
        height: 48,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 22
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 12,
        color: 'black'
    },
    fieldText: {
        fontSize: 16,
        marginVertical: 8
    }
})

export default SignUpScreen;
