import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {Calendar, DateObject, CustomMarking} from 'react-native-calendars';
import { format, parseISO } from 'date-fns';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import { 
  Container, 
  Header, 
  BackButton, 
  HeaderTitle, 
  UserAvatar, 
  ProviderListContainer, 
  ProviderList, 
  ProviderContainer, 
  ProviderAvatar, 
  ProviderName, 
  CalendarContainer, 
  CalendarTitle, 
  ScheduleContainer,
  ScheduleTitle,
  ScheduleButton,
  ScheduleButtonText,
  ScheduleButtonContainer,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  Content,
} from './styles';
import { Alert } from 'react-native';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface MarkedDatesInterface {
  [date: string]: CustomMarking;
};

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {  
  const { goBack, reset } = useNavigation();
  const { user } = useAuth();
  const { params } = useRoute();
  const { providerId } = params as RouteParams;

  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(providerId);
  const [daySelected, setDaySelected] = useState<MarkedDatesInterface>(() => {
    let data: MarkedDatesInterface = {
      ['2020-12-10']: {
        customStyles: {
          container: {
            backgroundColor: '#FF9000',
            borderRadius: 10,
          },
          text: {
            color: '#232129'
          }
        }
      }
    };
    return data;
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    });
    setSelectedProvider(providerId);
  }, []);

  useEffect(() => {
    api.get(`providers/${selectedProvider}/day-availability`, {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate()
      }
    }).then(response => {
      setAvailability(response.data);
    });
  }, [selectedDate, selectedProvider])
  

  const navigateToBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((id: string) => {
    setSelectedProvider(id);
  }, []);

  const morningAvailibility = useMemo(() => {
    return availability
      .filter(({hour}) => hour < 12)
      .map(({available, hour}) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00')
        }
      })
  }, [availability]);

  const afternoonAvailibility = useMemo(() => {
    return availability
      .filter(({hour}) => hour >= 12)
      .map(({available, hour}) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00')
        }
      })
  }, [availability]);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post(`appointments`, {
        provider_id: selectedProvider,
        date
      });

      reset({
        routes: [
          { 
            name: 'AppointmentCreated',  
            params: { date: date.getTime() }
          }
        ],
        index: 0
      })
    } catch (err) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar o agendamento, tente novamente'
      )
    }
  }, [reset, selectedDate, selectedHour, selectedProvider]);

  const selectDay = useCallback((day: DateObject) => {
    let data: MarkedDatesInterface = {
      [day.dateString]: {
        customStyles: {
          container: {
            backgroundColor: '#FF9000',
            borderRadius: 10,
          },
          text: {
            color: '#232129'
          }
        }
      }
    };
    setDaySelected(data);
    setSelectedDate(parseISO(day.dateString));
  }, []);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateToBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content>
        <ProviderListContainer>
          <ProviderList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={(provider) => provider.id}
            renderItem={({ item }) => (
              <ProviderContainer
                onPress={() => handleSelectProvider(item.id)}
                selected={item.id === selectedProvider}
              >
                <ProviderAvatar source={{ uri: item.avatar_url }} />
                <ProviderName selected={item.id === selectedProvider}>{item.name}</ProviderName>
              </ProviderContainer>
            )}
          />
        </ProviderListContainer>
        
        <CalendarContainer>
          <CalendarTitle>Escolha a data</CalendarTitle>
          <Calendar
            onDayPress={(day) => selectDay(day)}
            markingType="custom"
            markedDates={daySelected}
            theme={{
              calendarBackground: '#312e38',
              backgroundColor: '#28262E',
              textSectionTitleColor: '#b6c1cd',
              dayTextColor: '#666360',
              arrowColor: 'orange',
              monthTextColor: '#fff',
              indicatorColor: '#999591',
              textDayFontFamily: 'RobotoSlab-Medium',
              textMonthFontFamily: 'RobotoSlab-Medium',
              textDayHeaderFontFamily: 'RobotoSlab-Medium',
              selectedDotColor: "#fff",
              todayTextColor: '#FFF',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
              'stylesheet.calendar.header': {
                header: {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginTop: 6,
                  alignItems: 'center',
                  backgroundColor: '#3E3B47',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  height: 50
                },
              }
            }}
          />
        </CalendarContainer>

        <ScheduleContainer>
          <ScheduleTitle>Escolha o horário</ScheduleTitle>


          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailibility.map(({hourFormatted, available, hour}) => (
                <Hour 
                  enabled={available}
                  selected={selectedHour === hour}
                  key={hourFormatted} 
                  available={available} 
                  onPress={() => handleSelectHour(hour)}
                  >
                  <HourText selected={selectedHour === hour}>{hourFormatted}</HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {afternoonAvailibility.map(({hourFormatted, available, hour}) => (
                <Hour 
                  enabled={available}
                  selected={selectedHour === hour}
                  key={hourFormatted} 
                  available={available} 
                  onPress={() => 
                  handleSelectHour(hour)}
                  >
                  <HourText selected={selectedHour === hour}>{hourFormatted}</HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

        </ScheduleContainer>

        <ScheduleButtonContainer>
          <ScheduleButton onPress={handleCreateAppointment}>
            <ScheduleButtonText>Agendar</ScheduleButtonText>
          </ScheduleButton>
        </ScheduleButtonContainer>
      </Content>

    </Container>
  )
}

export default CreateAppointment;