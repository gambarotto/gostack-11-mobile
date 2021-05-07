import { Platform } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 150 : 40}px;
  position: relative;
`;
export const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 24px;
  left: 30px;
  margin-top: 32px;
  z-index: 5;
`;
export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
  text-align: left;
`;
export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: 128px;
`;
export const UserAvatar = styled.Image`
  height: 186px;
  width: 186px;
  border-radius: 98px;
  align-self: center;
`;
