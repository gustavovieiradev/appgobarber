import React, { useCallback, useRef } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';
import api from '../../services/api';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const handleSingIn = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('Email obrigatório').email('Digite um email válido'),
        password: Yup.string().required().min(6, 'No mínimo 6 dígitos'),
      });

      await schema.validate(data, {
        abortEarly: false
      });

      await api.post('/users', data);

      Alert.alert(
        'Cadastro realizado com sucesso',
        'Você já pode fazer login na aplicação',
      )

      navigation.navigate('SignIn');

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }

      Alert.alert(
        'Erro na cadastro',
        'Ocorreu um erro ao fazer o cadastro, tente novamente.'
      );
    }
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{flex: 1}}>
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Crie sua conta</Title>
            </View>

            <Form onSubmit={handleSingIn} ref={formRef}>  
              <Input 
                name="name" 
                icon="user" 
                placeholder="Nome"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />
              <Input 
                ref={emailInputRef}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                name="email" 
                icon="mail" 
                placeholder="E-mail"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />
              <Input 
                ref={passwordInputRef}
                name="password" 
                icon="lock" 
                placeholder="Senha" 
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm()
                }}
                textContentType="newPassword"
              />

              <Button onPress={() => {
                formRef.current?.submitForm()
              }}>Entrar</Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => navigation.navigate('SignIn')}>
        <Icon name="arrow-left" size={20} color="#fff"/>
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>
    </>
  )
}

export default SignUp;