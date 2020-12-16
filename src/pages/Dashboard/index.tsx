import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import { Container, Header, HeaderTitle, UserName, ProfileButton, UserAvatar, ProviderList, ProviderContainer, ProviderAvatar, ProviderInfo, ProviderName, ProviderMeta, ProviderMetaText, ProviderListTitle } from './styles';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const { user } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    api.get('providers').then(response => {
      console.log(response.data);
      setProviders(response.data);
    })
  }, []);

  const navigationToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate])

  const navigateToCreateAppointmente = useCallback((providerId: string) => {
    navigate('CreateAppointment', {providerId});
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo, {"\n"}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigationToProfile}>
          <UserAvatar source={{ uri: user.avatar_url }} />
        </ProfileButton>

      </Header>

      <ProviderList 
        data={providers}
        keyExtractor={(provider) => provider.id}
        ListHeaderComponent={
          <ProviderListTitle>Cabeleireiros</ProviderListTitle>
        }
        renderItem={({ item }) => (
          <ProviderContainer onPress={() => {navigateToCreateAppointmente(item.id)}}>
            <ProviderAvatar source={{ uri: user.avatar_url }} />
            <ProviderInfo>
              <ProviderName>{item.name}</ProviderName>
              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000"/>
                <ProviderMetaText>Segunda à sexta</ProviderMetaText>
              </ProviderMeta>
              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000"/>
                <ProviderMetaText>8h às 18h</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      >

      </ProviderList>

    </Container>
  )
}

export default Dashboard;