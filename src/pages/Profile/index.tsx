/* eslint-disable camelcase */
import React, { useCallback, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Icon from 'react-native-vector-icons/Feather';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Button from '../../components/Button';
import Input from '../../components/Input';

import {
  Container,
  BackButton,
  Title,
  UserAvatar,
  UserAvatarButton,
} from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}
const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const formRef = useRef<FormHandles>(null);
  const inputEmailRef = useRef<TextInput>(null);
  const inputPasswordRef = useRef<TextInput>(null);
  const inputOldPasswordRef = useRef<TextInput>(null);
  const inputConfirmPasswordRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const handleUpdateProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatórtio'),
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Informe um email válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val: string) => !!val.length,
            then: Yup.string()
              .required('Campo obrigatório')
              .min(6, 'A senha deve conter no minimo 6 caractéres'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val: string) => !!val.length,
              then: Yup.string()
                .required('Campo obrigatório')
                .min(6, 'A senha deve conter no minimo 6 caractéres'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
        });
        await schema.validate(data, { abortEarly: false });
        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;
        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };
        const response = await api.put('/profiles', formData);
        updateUser(response.data);
        Alert.alert(
          'Perfil atualizado com sucesso!',
          'Seu perfil foi atualizado com sucesso.',
        );
        navigation.goBack();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }
        Alert.alert(
          'Erro ao atualizar o perfil',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente.',
        );
      }
    },
    [navigation, updateUser],
  );
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleUpdateAvatar = useCallback(() => {
    // TODO Fazer um modal personalizado
    Alert.alert(
      'Atualizar foto do perfil',
      'Selecione a origem da foto',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('btn cancel'),
        },
        {
          text: 'Galeria',
          onPress: () =>
            launchImageLibrary(
              {
                mediaType: 'photo',
              },
              (response) => {
                if (response.didCancel) {
                  Alert.alert('Operação cancelada');
                }
                if (response.errorMessage) {
                  Alert.alert('Erro ao selecionar foto');
                }

                const data = new FormData();
                data.append('avatar', {
                  type: 'image/jpeg',
                  name: response.fileName,
                  uri: response.uri,
                });

                api
                  .patch('users/avatar', data)
                  .then((apiResponse) => {
                    updateUser(apiResponse.data);
                  })
                  .catch(() => {
                    Alert.alert('Erro ao atualizar foto');
                  });
              },
            ),
        },
        {
          text: 'Camera',
          onPress: () =>
            launchCamera(
              {
                mediaType: 'photo',
              },
              (response) => {
                if (response.didCancel) {
                  Alert.alert('Operação cancelada');
                }
                if (response.errorMessage) {
                  Alert.alert('Erro ao selecionar foto');
                }

                const data = new FormData();
                data.append('avatar', {
                  type: 'image/jpeg',
                  name: response.fileName,
                  uri: response.uri,
                });

                api
                  .patch('users/avatar', data)
                  .then((apiResponse) => {
                    updateUser(apiResponse.data);
                  })
                  .catch(() => {
                    Alert.alert('Erro ao atualizar foto');
                  });
              },
            ),
        },
      ],
      {
        cancelable: true,
      },
    );
  }, [updateUser]);
  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>
            <View>
              <Title>Meu Perfil</Title>
            </View>
            <Form
              ref={formRef}
              initialData={user}
              onSubmit={handleUpdateProfile}
            >
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  inputEmailRef.current?.focus();
                }}
              />
              <Input
                ref={inputEmailRef}
                keyboardType="email-address"
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  inputOldPasswordRef.current?.focus();
                }}
              />
              <Input
                ref={inputOldPasswordRef}
                name="old_password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="next"
                textContentType="newPassword"
                containerStyle={{ marginTop: 16 }}
                onSubmitEditing={() => {
                  inputPasswordRef.current?.focus();
                }}
              />
              <Input
                ref={inputPasswordRef}
                name="password"
                icon="lock"
                placeholder="Nova Senha"
                secureTextEntry
                returnKeyType="next"
                textContentType="newPassword"
                onSubmitEditing={() => {
                  inputConfirmPasswordRef.current?.focus();
                }}
              />
              <Input
                ref={inputConfirmPasswordRef}
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmar Senha"
                secureTextEntry
                returnKeyType="send"
                textContentType="newPassword"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />
            </Form>
            <Button onPress={() => formRef.current?.submitForm()}>
              Confirmar mudanças
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
