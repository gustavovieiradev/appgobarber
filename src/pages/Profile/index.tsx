import React, { useCallback, useRef } from 'react';
import { Alert, KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';
import api from '../../services/api';
import Icon from 'react-native-vector-icons/Feather';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, BackButton, Title, UserAvatarButton, UserAvatar } from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const { user } = useAuth();

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
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

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{flex: 1}}>
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>

            <View>
              <Title>Meu perfil</Title>
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
                  oldPasswordInputRef.current?.focus();
                }}
              />
              <Input 
                ref={oldPasswordInputRef}
                name="old_password" 
                icon="lock" 
                placeholder="Senha Atual" 
                containerStyle={{ marginTop: 16 }}
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
                textContentType="newPassword"
              />
              <Input 
                ref={passwordInputRef}
                name="password" 
                icon="lock" 
                placeholder="Nova senha" 
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current?.focus();
                }}
                textContentType="newPassword"
              />
              <Input 
                ref={confirmPasswordInputRef}
                name="password_confirmation" 
                icon="lock" 
                placeholder="Confirmar senha" 
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm()
                }}
                textContentType="newPassword"
              />

              <Button onPress={() => {
                formRef.current?.submitForm()
              }}>Confirmar mudanças</Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export default SignUp;