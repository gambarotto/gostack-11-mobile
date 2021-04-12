import React, { useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Button from '../../components/Button';
import Input from '../../components/Input';
import logoImg from '../../assets/logo.png';

import { Container, BackToSignIn, BackToSignInText, Title } from './styles';

const SignUp: React.FC = () => {
  const [keybordShow, setKeyboardShow] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => setKeyboardShow(true));
    Keyboard.addListener('keyboardDidHide', () => setKeyboardShow(false));
    return () => {
      Keyboard.removeListener('keyboardDidShow', () => {});
      Keyboard.removeListener('keyboardDidHide', () => {});
    };
  }, []);

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
            <Image source={logoImg} />
            <View>
              <Title>Crie sua conta</Title>
            </View>
            <Input name="name" icon="user" placeholder="Nome" />
            <Input name="email" icon="mail" placeholder="E-mail" />
            <Input name="password" icon="lock" placeholder="Senha" />
            <Button onPress={() => console.log('ola')}>Entrar</Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      {!keybordShow && (
        <BackToSignIn onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" />
          <BackToSignInText>Voltar para logon</BackToSignInText>
        </BackToSignIn>
      )}
    </>
  );
};

export default SignUp;
