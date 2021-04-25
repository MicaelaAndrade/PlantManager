
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button } from '../components/Button'

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function UserIdentification() {
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const [name, setName] = useState<string>()

  // Navegação entre as paginas.
  const navigation = useNavigation()

  // Aparecer o botão quando o usuário estiver digitando no campo
  function handleInputBlur() {
    setIsFocused(false);
    setIsFilled(!!name)
  }

  function handleInputFocus() {
    setIsFocused(true);
  }

  // Manter a cor da barra, quando o usuário escreve o texto
  function handleInputChange(value: string) {
    setIsFocused(!!value);
    setName(value)
  }

  // Navegação entre as paginas. | // Identificar usuário digitou nome no campo 
  async function handleSubmit() {
    if (!name)
      return Alert.alert('Me diz como chamar você 🥲')

    try {
      // Refatorando paginas de salvamento
      await AsyncStorage.setItem('@plantmanager:user', name);
      navigation.navigate('Confirmation', {
        title: 'Prontinho',
        subtitle: 'Agora vamos começar a cuidar das suas plantinhas com muito cuidado.',
        buttonTitle: 'Começar',
        emoji: 'smile',
        nextScreen: 'PlantSelect',
      })
    } catch {
      Alert.alert('Não foi possivel salvar o seu nome.🥲')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.form}>
            <View style={styles.header}>
              <Text style={styles.emoji}>
                {isFilled ? '😄' : '😀' //Quando o campo estiver preenchido, fará a troca de imojis na tela
                }
              </Text>

              <Text style={styles.title}>
                Como podemos {'\n'}
              chamar você?
          </Text>
            </View>
            <TextInput
              style={[
                styles.input,
                (isFocused || isFilled) && // Quando estiver preenchido o campo, ficará verde, quando náo estiver o campo ficará cinza.
                { borderColor: colors.green }
              ]}
              placeholder="Digite um nome"
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              onChangeText={handleInputChange}
            />
            <View
              style={styles.footer}>
              <Button
                title="Confirmar"
                onPress={handleSubmit}
              />
            </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',

  },
  content: {
    flex: 1,
    width: '100%'
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 54,
    alignItems: 'center',
    width: '100%'
  },
  header: {
    alignItems: 'center'
  },
  emoji: {
    fontSize: 44
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.gray,
    color: colors.heading,
    width: '100%',
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: 'center'

  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    color: colors.heading,
    fontFamily: fonts.heading,
    marginTop: 20

  },
  footer: {
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 20
  },

})